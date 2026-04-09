"use client";

import { useParams, useRouter } from "next/navigation";
import { useItem, useUpdateItem, useDeleteItem } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import type { UpdateItemDto } from "@/lib/types/catalog.types";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: item, isLoading, error } = useItem(id);
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateItemDto>({});

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-destructive">Error loading item</p>
          <Link href="/catalogs/item">
            <Button className="mt-4">← Back to List</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      code: item.code,
      description: item.description,
      unitOfMeasure: item.unitOfMeasure,
      defaultPrice: item.defaultPrice,
      costPrice: item.costPrice || undefined,
      sku: item.sku || undefined,
      barcode: item.barcode || undefined,
      isInventory: item.isInventory,
      isService: item.isService,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
      router.push("/catalogs/item");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{item.description}</h1>
            <p className="text-muted-foreground">Item Details</p>
          </div>
          <div className="flex gap-2">
            <Link href="/catalogs/item">
              <Button variant="outline">← Back</Button>
            </Link>
            {!isEditing && (
              <>
                <Button onClick={handleEdit}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Item" : "Item Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Code</p>
                    <p className="text-lg">{item.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-lg">{item.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unit of Measure</p>
                    <p className="text-lg">{item.unitOfMeasure}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <div className="flex gap-2 mt-1">
                      {item.isInventory && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Inventory
                        </span>
                      )}
                      {item.isService && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Service
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Default Price</p>
                    <p className="text-lg">${item.defaultPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                    <p className="text-lg">
                      {item.costPrice ? `$${item.costPrice.toFixed(2)}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SKU</p>
                    <p className="text-lg">{item.sku || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Barcode</p>
                    <p className="text-lg">{item.barcode || "—"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Code *</Label>
                    <Input
                      id="code"
                      value={formData.code || ""}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitOfMeasure">Unit of Measure *</Label>
                    <Input
                      id="unitOfMeasure"
                      value={formData.unitOfMeasure || ""}
                      onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultPrice">Default Price *</Label>
                    <Input
                      id="defaultPrice"
                      type="number"
                      step="0.01"
                      value={formData.defaultPrice || ""}
                      onChange={(e) => setFormData({ ...formData, defaultPrice: parseFloat(e.target.value) || 0 })}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku || ""}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode || ""}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Type</Label>
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
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={
                      updateMutation.isPending ||
                      !formData.code ||
                      !formData.description ||
                      !formData.unitOfMeasure
                    }
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
