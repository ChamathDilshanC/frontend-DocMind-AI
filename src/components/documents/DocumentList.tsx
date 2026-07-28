"use client";

import Link from "next/link";
import { Download, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge";
import { useDeleteDocument, useDocuments, useRetryDocument } from "@/hooks/useDocuments";
import { documentsApi } from "@/lib/api/documents";
import type { DocumentDto } from "@/types/api";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function handleDownload(doc: DocumentDto) {
  try {
    const { blob, filename } = await documentsApi.downloadBlob(doc.id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch {
    toast.error("Download failed");
  }
}

export function DocumentList() {
  const { data, isLoading } = useDocuments();
  const deleteDocument = useDeleteDocument();
  const retryDocument = useRetryDocument();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <p className="text-sm text-muted-foreground">No documents yet. Upload one to get started.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Pages</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.items.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                {doc.name}
              </Link>
              {doc.status === "Failed" && doc.processingError && (
                <p className="text-xs text-destructive">{doc.processingError}</p>
              )}
            </TableCell>
            <TableCell>
              <DocumentStatusBadge status={doc.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{formatBytes(doc.fileSizeBytes)}</TableCell>
            <TableCell className="text-muted-foreground">{doc.pageCount ?? "-"}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload(doc)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  {doc.status === "Failed" && (
                    <DropdownMenuItem onClick={() => retryDocument.mutate(doc.id)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry processing
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => deleteDocument.mutate(doc.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
