"use client";

import { useWarehouses } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function WarehouseListPage() {
  const { data: warehouses, isLoading, error } = useWarehouses();

  if (isLoading) return <div className="p-8"><p>Loading warehouses...</p></div>;
  if (error) return <div className="p-8"><p className="text-destructive">Error loading warehouses</p></div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Warehouses</h1>
            <p className="text-muted-foreground">Manage warehouse locations</p>
          </div>
          <div className="flex gap-2">
            <Link href="/"><Button variant="outline">← Back</Button></Link>
            <Link href="/catalogs/warehouse/new"><Button>+ New Warehouse</Button></Link>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>All Warehouses</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses?.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">{warehouse.code}</TableCell>
                    <TableCell>{warehouse.description}</TableCell>
                    <TableCell className="text-muted-foreground">{warehouse.address || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{warehouse.responsiblePerson || "—"}</TableCell>
                    <TableCell>
                      {warehouse.isDefault && <Badge variant="success">Default</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/catalogs/warehouse/${warehouse.id}`}><Button variant="ghost" size="sm">View</Button></Link>
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
