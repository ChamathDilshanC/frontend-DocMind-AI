"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentPagesViewer } from "@/components/documents/DocumentPagesViewer";
import { DocumentStatusBadge } from "@/components/documents/DocumentStatusBadge";
import { TextContentSkeleton } from "@/components/ui/loading-skeletons";
import { useDocument } from "@/hooks/useDocuments";

export default function DocumentDetailPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params);
  const { data: doc, isLoading } = useDocument(documentId);

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        render={
          <Link href="/documents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to documents
          </Link>
        }
      />

      {isLoading || !doc ? (
        <TextContentSkeleton lines={5} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{doc.name}</h1>
            <DocumentStatusBadge status={doc.status} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-muted-foreground">File type</p>
                <p className="font-medium">{doc.fileType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pages</p>
                <p className="font-medium">{doc.pageCount ?? "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">{new Date(doc.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted content</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentPagesViewer documentId={documentId} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
