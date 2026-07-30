"use client";

import { useState } from "react";
import Link from "next/link";
import { Disclosure } from "@heroui/react";
import { ChevronDown, FileText } from "lucide-react";
import type { CitationDto } from "@/types/api";

export function CitationList({ citations }: { citations: CitationDto[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (citations.length === 0) return null;

  return (
    <Disclosure className="mt-3 border-t pt-3" isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
      <Disclosure.Heading>
        <Disclosure.Trigger className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          Sources ({citations.length})
          <Disclosure.Indicator>
            <ChevronDown className="h-3.5 w-3.5" />
          </Disclosure.Indicator>
        </Disclosure.Trigger>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Disclosure.Body className="mt-2 space-y-1.5">
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
        </Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  );
}
