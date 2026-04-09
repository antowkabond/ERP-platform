"use client";

import { useParams, useRouter } from "next/navigation";
import { useCounterparty, useUpdateCounterparty, useDeleteCounterparty } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import type { UpdateCounterpartyDto } from "@/lib/types/catalog.types";

export default function CounterpartyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: counterparty, isLoading, error } = useCounterparty(id);
  const updateMutation = useUpdateCounterparty();
  const deleteMutation = useDeleteCounterparty();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateCounterpartyDto>({});

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !counterparty) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-destructive">Error loading counterparty</p>
          <Link href="/catalogs/counterparty">
            <Button className="mt-4">← Back to List</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      code: counterparty.code,
      description: counterparty.description,
      taxNumber: counterparty.taxNumber || undefined,
      address: counterparty.address || undefined,
      contactPhone: counterparty.contactPhone || undefined,
      contactEmail: counterparty.contactEmail || undefined,
      isCustomer: counterparty.isCustomer,
      isSupplier: counterparty.isSupplier,
      creditLimit: counterparty.creditLimit || undefined,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update counterparty:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this counterparty?")) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
      router.push("/catalogs/counterparty");
    } catch (error) {
      console.error("Failed to delete counterparty:", error);
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
            <h1 className="text-3xl font-bold">{counterparty.description}</h1>
            <p className="text-muted-foreground">Counterparty Details</p>
          </div>
          <div className="flex gap-2">
            <Link href="/catalogs/counterparty">
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
              {isEditing ? "Edit Counterparty" : "Counterparty Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Code</p>
                    <p className="text-lg">{counterparty.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-lg">{counterparty.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tax Number</p>
                    <p className="text-lg">{counterparty.taxNumber || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <div className="flex gap-2 mt-1">
                      {counterparty.isCustomer && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Customer
                        </span>
                      )}
                      {counterparty.isSupplier && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Supplier
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Credit Limit</p>
                    <p className="text-lg">
                      {counterparty.creditLimit 
                        ? `$${counterparty.creditLimit.toFixed(2)}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                    <p className="text-lg">{counterparty.contactPhone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    <p className="text-lg">{counterparty.contactEmail || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-lg">{counterparty.address || "—"}</p>
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
                    <Label htmlFor="taxNumber">Tax Number</Label>
                    <Input
                      id="taxNumber"
                      value={formData.taxNumber || ""}
                      onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone || ""}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail || ""}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
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
                  <div className="col-span-2">
                    <Label>Type</Label>
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
