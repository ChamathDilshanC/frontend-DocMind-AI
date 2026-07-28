import Link from "next/link";
import { FileText } from "lucide-react";
import type { CitationDto } from "@/types/api";

export function CitationList({ citations }: { citations: CitationDto[] }) {
  if (citations.length === 0) return null;

  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      <p className="text-xs font-medium text-muted-foreground">Sources</p>
      <div className="space-y-1.5">
        {citations.map((citation, i) => (
          <Link
            key={`${citation.documentId}-${citation.page}-${i}`}
            href={`/documents/${citation.documentId}`}
            className="flex items-start gap-2 rounded-md border bg-muted/30 p-2 text-xs hover:bg-muted"
          >
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span>
              <span className="font-medium">
                {citation.filename} · page {citation.page}
              </span>
              <br />
              <span className="text-muted-foreground">{citation.chunkExcerpt}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
