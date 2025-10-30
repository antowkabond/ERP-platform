"use client";

import { useRouter } from "next/navigation";
import { useCreateItem } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import type { CreateItemDto } from "@/lib/types/catalog.types";

export default function CreateItemPage() {
  const router = useRouter();
  const createMutation = useCreateItem();
  
  const [formData, setFormData] = useState<CreateItemDto>({
    code: "",
    description: "",
    unitOfMeasure: "pcs",
    defaultPrice: 0,
    isInventory: true,
    isService: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const created = await createMutation.mutateAsync(formData);
      router.push(`/catalogs/item/${created.id}`);
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">New Item</h1>
            <p className="text-muted-foreground">Create a new product or service</p>
          </div>
          <Link href="/catalogs/item">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
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
                    placeholder="e.g., ITEM001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Laptop Dell XPS 15"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unitOfMeasure">Unit of Measure *</Label>
                  <Input
                    id="unitOfMeasure"
                    value={formData.unitOfMeasure}
                    onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                    placeholder="e.g., pcs, kg, hours"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="defaultPrice">Default Price *</Label>
                  <Input
                    id="defaultPrice"
                    type="number"
                    step="0.01"
                    value={formData.defaultPrice}
                    onChange={(e) => setFormData({ ...formData, defaultPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 1299.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice || ""}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="e.g., 999.99"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ""}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., LAP-DELL-XPS15"
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode || ""}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="e.g., 123456789012"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Type *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isInventory || false}
                        onChange={(e) => setFormData({ ...formData, isInventory: e.target.checked })}
                      />
                      <span>Inventory Item</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isService || false}
                        onChange={(e) => setFormData({ ...formData, isService: e.target.checked })}
                      />
                      <span>Service</span>
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select item type (inventory items are tracked in warehouses)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Link href="/catalogs/item">
                  <Button type="button" variant="outline" disabled={createMutation.isPending}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    !formData.code ||
                    !formData.description ||
                    !formData.unitOfMeasure
                  }
                >
                  {createMutation.isPending ? "Creating..." : "Create Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
