"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
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
        toast.success("Document ready", { description: "Processing finished — you can ask about it now." });
      } else if (payload.status === "Failed") {
        toast.error("Processing failed", { description: payload.error ?? undefined });
      }
    };

    hub.on("DocumentStatusChanged", onStatusChanged);
    return () => {
      hub.off("DocumentStatusChanged", onStatusChanged);
    };
  }, [queryClient]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b bg-card px-6 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload PDF or DOCX files to make them searchable in chat.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section className="order-2 lg:order-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your documents
          </h2>
          <DocumentList />
        </section>

        <aside className="order-1 rounded-2xl border bg-card p-5 lg:order-2 lg:sticky lg:top-6">
          <DocumentUploadDropzone />
        </aside>
      </div>
    </div>
  );
}
