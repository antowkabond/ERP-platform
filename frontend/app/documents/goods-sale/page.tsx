"use client";

import { useGoodsSales } from "@/lib/hooks/use-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function GoodsSaleListPage() {
  const { data: documents, isLoading, error } = useGoodsSales();

  if (isLoading) return <div className="p-8"><p>Loading documents...</p></div>;
  if (error) return <div className="p-8"><p className="text-destructive">Error loading documents</p></div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Goods Sale Documents</h1>
            <p className="text-muted-foreground">Sales transactions</p>
          </div>
          <div className="flex gap-2">
            <Link href="/"><Button variant="outline">← Back</Button></Link>
            <Link href="/documents/goods-sale/new"><Button>+ New Sale</Button></Link>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>All Documents</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.number}</TableCell>
                    <TableCell>{formatDate(doc.date)}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.counterparty?.description || doc.counterpartyId}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.warehouse?.description || doc.warehouseId}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(doc.totalAmount)}</TableCell>
                    <TableCell><DocumentStatusBadge state={doc.state} /></TableCell>
                    <TableCell className="text-right">
                      <Link href={`/documents/goods-sale/${doc.id}`}><Button variant="ghost" size="sm">View</Button></Link>
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
