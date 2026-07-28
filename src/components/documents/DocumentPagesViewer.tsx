"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentPages } from "@/hooks/useDocuments";

export function DocumentPagesViewer({ documentId }: { documentId: string }) {
  const { data: pages, isLoading } = useDocumentPages(documentId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!pages || pages.length === 0) {
    return <p className="text-sm text-muted-foreground">No extracted content yet. This document may still be processing.</p>;
  }

  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <div key={page.pageNumber} className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Page {page.pageNumber}</h3>
          <div className="space-y-2">
            {page.chunkExcerpts.map((excerpt, i) => (
              <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
                {excerpt}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
