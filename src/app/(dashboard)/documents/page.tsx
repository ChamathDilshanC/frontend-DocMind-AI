"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentUploadDropzone } from "@/components/documents/DocumentUploadDropzone";
import { getHubConnection } from "@/lib/signalr/connection";

export default function DocumentsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const hub = getHubConnection();

    const onStatusChanged = (payload: { documentId: string; status: string; error?: string }) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      if (payload.status === "Completed") {
        toast.success("Document processing completed");
      } else if (payload.status === "Failed") {
        toast.error(payload.error ?? "Document processing failed");
      }
    };

    hub.on("DocumentStatusChanged", onStatusChanged);
    return () => {
      hub.off("DocumentStatusChanged", onStatusChanged);
    };
  }, [queryClient]);

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-2xl font-semibold">Documents</h1>
        <p className="text-muted-foreground">Upload PDF or DOCX files to make them searchable in chat.</p>
      </div>

      <DocumentUploadDropzone />

      <Card>
        <CardHeader>
          <CardTitle>Your documents</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList />
        </CardContent>
      </Card>
    </div>
  );
}
