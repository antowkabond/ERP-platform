"use client";

import { useRouter } from "next/navigation";
import { useCreateCounterparty } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import type { CreateCounterpartyDto } from "@/lib/types/catalog.types";

export default function CreateCounterpartyPage() {
  const router = useRouter();
  const createMutation = useCreateCounterparty();
  
  const [formData, setFormData] = useState<CreateCounterpartyDto>({
    code: "",
    description: "",
    isCustomer: true,
    isSupplier: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const created = await createMutation.mutateAsync(formData);
      router.push(`/catalogs/counterparty/${created.id}`);
    } catch (error) {
      console.error("Failed to create counterparty:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">New Counterparty</h1>
            <p className="text-muted-foreground">Create a new customer or supplier</p>
          </div>
          <Link href="/catalogs/counterparty">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Counterparty Information</CardTitle>
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
                    placeholder="e.g., CUST001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., ABC Corporation"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber || ""}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    placeholder="e.g., 12-3456789"
                  />
                </div>
                <div>
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    step="0.01"
                    value={formData.creditLimit || ""}
                    onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 50000.00"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone || ""}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail || ""}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="e.g., contact@example.com"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g., 123 Main St, City, State ZIP"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Type *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isCustomer || false}
                        onChange={(e) => setFormData({ ...formData, isCustomer: e.target.checked })}
                      />
                      <span>Customer</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isSupplier || false}
                        onChange={(e) => setFormData({ ...formData, isSupplier: e.target.checked })}
                      />
                      <span>Supplier</span>
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select at least one type
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Link href="/catalogs/counterparty">
                  <Button type="button" variant="outline" disabled={createMutation.isPending}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !formData.code || !formData.description}
                >
                  {createMutation.isPending ? "Creating..." : "Create Counterparty"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
