"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateGoodsSale } from "@/lib/hooks/use-document";
import { useCounterparties, useItems, useWarehouses } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GoodsSaleItemInput } from "@/lib/types/document.types";
import Link from "next/link";

export default function NewGoodsSalePage() {
  const router = useRouter();
  const { data: counterparties } = useCounterparties();
  const { data: items } = useItems();
  const { data: warehouses } = useWarehouses();
  const createMutation = useCreateGoodsSale();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [counterpartyId, setCounterpartyId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [lineItems, setLineItems] = useState<GoodsSaleItemInput[]>([]);
  const [newItem, setNewItem] = useState({ itemId: "", quantity: 1, price: 0 });

  const addLine = () => {
    if (!newItem.itemId || newItem.quantity <= 0 || newItem.price <= 0) return;
    setLineItems([...lineItems, newItem]);
    setNewItem({ itemId: "", quantity: 1, price: 0 });
  };

  const removeLine = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterpartyId || !warehouseId || lineItems.length === 0) return;

    try {
      const result = await createMutation.mutateAsync({
        date,
        counterpartyId,
        warehouseId,
        items: lineItems,
      });
      router.push(`/documents/goods-sale/${result.id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  const getItemName = (itemId: string) => items?.find(i => i.id === itemId)?.description || itemId;
  const totalAmount = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">New Goods Sale</h1>
          <Link href="/documents/goods-sale"><Button variant="outline">← Back</Button></Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Document Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="counterparty">Customer</Label>
                  <select id="counterparty" value={counterpartyId} onChange={(e) => setCounterpartyId(e.target.value)} 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    <option value="">Select customer...</option>
                    {counterparties?.filter(c => c.isCustomer).map(c => (
                      <option key={c.id} value={c.id}>{c.description}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <select id="warehouse" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    <option value="">Select warehouse...</option>
                    {warehouses?.map(w => (
                      <option key={w.id} value={w.id}>{w.description}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{getItemName(item.itemId)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                      <TableCell><Button type="button" variant="ghost" size="sm" onClick={() => removeLine(idx)}>Remove</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t pt-4">
                <div className="grid grid-cols-5 gap-2 items-end">
                  <div className="col-span-2">
                    <Label>Item</Label>
                    <select value={newItem.itemId} onChange={(e) => setNewItem({...newItem, itemId: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select item...</option>
                      {items?.map(i => (
                        <option key={i.id} value={i.id}>{i.description}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" min="1" value={newItem.quantity} 
                      onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input type="number" min="0" step="0.01" value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})} />
                  </div>
                  <Button type="button" onClick={addLine}>Add Item</Button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link href="/documents/goods-sale"><Button type="button" variant="outline">Cancel</Button></Link>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Document'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
