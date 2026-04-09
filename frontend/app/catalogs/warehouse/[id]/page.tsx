"use client";

import { useParams, useRouter } from "next/navigation";
import { useWarehouse, useUpdateWarehouse, useDeleteWarehouse } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import type { UpdateWarehouseDto } from "@/lib/types/catalog.types";

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: warehouse, isLoading, error } = useWarehouse(id);
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateWarehouseDto>({});

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-destructive">Error loading warehouse</p>
          <Link href="/catalogs/warehouse">
            <Button className="mt-4">← Back to List</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      code: warehouse.code,
      description: warehouse.description,
      address: warehouse.address || undefined,
      responsiblePerson: warehouse.responsiblePerson || undefined,
      isDefault: warehouse.isDefault,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update warehouse:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this warehouse?")) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
      router.push("/catalogs/warehouse");
    } catch (error) {
      console.error("Failed to delete warehouse:", error);
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
            <h1 className="text-3xl font-bold">{warehouse.description}</h1>
            <p className="text-muted-foreground">Warehouse Details</p>
          </div>
          <div className="flex gap-2">
            <Link href="/catalogs/warehouse">
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
              {isEditing ? "Edit Warehouse" : "Warehouse Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Code</p>
                    <p className="text-lg">{warehouse.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-lg">{warehouse.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-lg">{warehouse.address || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Responsible Person</p>
                    <p className="text-lg">{warehouse.responsiblePerson || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="flex gap-2 mt-1">
                      {warehouse.isDefault && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Default Warehouse
                        </span>
                      )}
                      {!warehouse.isDefault && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Regular Warehouse
                        </span>
                      )}
                    </div>
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
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsiblePerson">Responsible Person</Label>
                    <Input
                      id="responsiblePerson"
                      value={formData.responsiblePerson || ""}
                      onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
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
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending || !formData.code || !formData.description}
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
