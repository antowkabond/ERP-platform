"use client";

import { useRouter } from "next/navigation";
import { useCreateWarehouse } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import type { CreateWarehouseDto } from "@/lib/types/catalog.types";

export default function CreateWarehousePage() {
  const router = useRouter();
  const createMutation = useCreateWarehouse();
  
  const [formData, setFormData] = useState<CreateWarehouseDto>({
    code: "",
    description: "",
    isDefault: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const created = await createMutation.mutateAsync(formData);
      router.push(`/catalogs/warehouse/${created.id}`);
    } catch (error) {
      console.error("Failed to create warehouse:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">New Warehouse</h1>
            <p className="text-muted-foreground">Create a new warehouse location</p>
          </div>
          <Link href="/catalogs/warehouse">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Warehouse Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., WH001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Main Warehouse"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g., 123 Storage St, City, State ZIP"
                  />
                </div>
                <div>
                  <Label htmlFor="responsiblePerson">Responsible Person</Label>
                  <Input
                    id="responsiblePerson"
                    value={formData.responsiblePerson || ""}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isDefault || false}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      />
                      <span>Set as Default Warehouse</span>
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Default warehouse is used for new documents
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Link href="/catalogs/warehouse">
                  <Button type="button" variant="outline" disabled={createMutation.isPending}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !formData.code || !formData.description}
                >
                  {createMutation.isPending ? "Creating..." : "Create Warehouse"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
