"use client";

import { useItems } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function ItemListPage() {
  const { data: items, isLoading, error } = useItems();

  if (isLoading) return <div className="p-8"><p>Loading items...</p></div>;
  if (error) return <div className="p-8"><p className="text-destructive">Error loading items</p></div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Items</h1>
            <p className="text-muted-foreground">Manage products and services</p>
          </div>
          <div className="flex gap-2">
            <Link href="/"><Button variant="outline">← Back</Button></Link>
            <Link href="/catalogs/item/new"><Button>+ New Item</Button></Link>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>All Items</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku || "—"}</TableCell>
                    <TableCell>{item.unitOfMeasure}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.defaultPrice)}</TableCell>
                    <TableCell>
                      {item.isInventory && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-1">Inventory</span>}
                      {item.isService && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Service</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/catalogs/item/${item.id}`}><Button variant="ghost" size="sm">View</Button></Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
