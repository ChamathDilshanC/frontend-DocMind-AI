"use client";

import Link from "next/link";
import { Download, FileText, MessageSquare, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { gooeyToast as toast } from "goey-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListRowsSkeleton } from "@/components/ui/loading-skeletons";
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
    return <ListRowsSkeleton rows={4} />;
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <FileText className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm font-medium">No documents yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Upload a PDF or DOCX above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {data.items.map((doc) => (
        <li
          key={doc.id}
          className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <FileText className="h-4 w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <Link href={`/documents/${doc.id}`} className="block truncate font-medium hover:underline">
              {doc.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatBytes(doc.fileSizeBytes)}
              {doc.pageCount ? ` · ${doc.pageCount} pages` : ""}
              {` · ${new Date(doc.createdAt).toLocaleDateString()}`}
            </p>
            {doc.status === "Failed" && doc.processingError && (
              <p className="mt-1 truncate text-xs text-destructive">{doc.processingError}</p>
            )}
          </div>

          <DocumentStatusBadge status={doc.status} />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {doc.status === "Completed" && (
                  <DropdownMenuItem render={<Link href="/chat" />}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask about this
                  </DropdownMenuItem>
                )}
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
                <DropdownMenuItem variant="destructive" onClick={() => deleteDocument.mutate(doc.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  );
}
