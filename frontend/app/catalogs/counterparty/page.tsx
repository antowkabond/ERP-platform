"use client";

import { useCounterparties } from "@/lib/hooks/use-catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function CounterpartyListPage() {
  const { data: counterparties, isLoading, error } = useCounterparties();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading counterparties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-destructive">Error loading counterparties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Counterparties</h1>
            <p className="text-muted-foreground">
              Manage customers and suppliers
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">← Back</Button>
            </Link>
            <Link href="/catalogs/counterparty/new">
              <Button>+ New Counterparty</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Counterparties</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Tax Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {counterparties?.map((counterparty) => (
                  <TableRow key={counterparty.id}>
                    <TableCell className="font-medium">
                      {counterparty.code}
                    </TableCell>
                    <TableCell>{counterparty.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {counterparty.taxNumber || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {counterparty.isCustomer && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Customer
                          </span>
                        )}
                        {counterparty.isSupplier && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Supplier
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {counterparty.contactEmail || counterparty.contactPhone || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/catalogs/counterparty/${counterparty.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
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
