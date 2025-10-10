"use client";

import { useParams, useRouter } from "next/navigation";
import { useGoodsSale, usePostGoodsSale, useUnpostGoodsSale } from "@/lib/hooks/use-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { PostButton } from "@/components/documents/post-button";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default function GoodsSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  
  const { data: document, isLoading, error } = useGoodsSale(documentId);
  const postMutation = usePostGoodsSale();
  const unpostMutation = useUnpostGoodsSale();

  const handlePost = async () => {
    try {
      await postMutation.mutateAsync(documentId);
    } catch (error: any) {
      alert(`Failed to post: ${error.message}`);
    }
  };

  const handleUnpost = async () => {
    try {
      await unpostMutation.mutateAsync(documentId);
    } catch (error: any) {
      alert(`Failed to unpost: ${error.message}`);
    }
  };

  if (isLoading) return <div className="p-8"><p>Loading document...</p></div>;
  if (error) return <div className="p-8"><p className="text-destructive">Error loading document</p></div>;
  if (!document) return <div className="p-8"><p>Document not found</p></div>;

  const isPosting = postMutation.isPending || unpostMutation.isPending;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Goods Sale {document.number}</h1>
              <DocumentStatusBadge state={document.state} />
            </div>
            <p className="text-muted-foreground">Created: {formatDateTime(document.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/documents/goods-sale"><Button variant="outline">← Back</Button></Link>
            <PostButton 
              state={document.state}
              onPost={handlePost}
              onUnpost={handleUnpost}
              isLoading={isPosting}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Document Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{formatDate(document.date)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Customer</div>
                  <div className="font-medium">{document.counterparty?.description || document.counterpartyId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Warehouse</div>
                  <div className="font-medium">{document.warehouse?.description || document.warehouseId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(document.totalAmount)}</div>
                </div>
                {document.state === 'POSTED' && document.postedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground">Posted At</div>
                    <div className="font-medium">{formatDateTime(document.postedAt)}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Line Items ({document.items.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground">{item.lineNumber}</TableCell>
                      <TableCell>{item.itemId}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold border-t-2">
                    <TableCell colSpan={4} className="text-right">Total:</TableCell>
                    <TableCell className="text-right">{formatCurrency(document.totalAmount)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {document.state === 'POSTED' && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader><CardTitle className="text-green-800">Document Posted</CardTitle></CardHeader>
              <CardContent>
                <p className="text-green-700">
                  This document has been posted. Inventory movements and accounting entries have been generated.
                  To modify this document, you must unpost it first.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
