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
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-2">
        <h1 className="font-semibold text-2xl tracking-tight">Documents</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Upload PDF or DOCX files to make them searchable in chat.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section className="order-2 lg:order-1">
          <h2 className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Your documents
          </h2>
          <DocumentList />
        </section>

        <aside className="order-1 rounded-xl border bg-card p-5 lg:sticky lg:order-2 lg:top-6">
          <DocumentUploadDropzone />
        </aside>
      </div>
    </div>
  );
}
