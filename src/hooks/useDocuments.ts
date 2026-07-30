"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { documentsApi } from "@/lib/api/documents";

export function useDocuments(pageNumber = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["documents", pageNumber, pageSize],
    queryFn: () => documentsApi.list(pageNumber, pageSize),
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? [];
      const hasInFlight = items.some((d) => d.status === "Uploaded" || d.status === "Queued" || d.status === "Processing");
      return hasInFlight ? 3000 : false;
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => documentsApi.getById(id),
  });
}

export function useDocumentPages(id: string) {
  return useQuery({
    queryKey: ["documents", id, "pages"],
    queryFn: () => documentsApi.getPages(id),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => documentsApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded — processing started");
    },
    onError: (error: Error) => toast.error(error.message || "Upload failed"),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted");
    },
    onError: (error: Error) => toast.error(error.message || "Delete failed"),
  });
}

export function useDeleteAllDocuments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => documentsApi.removeAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("All documents deleted");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to delete documents"),
  });
}

export function useRenameDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) => documentsApi.rename(id, newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useRetryDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.retry(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Reprocessing started");
    },
  });
}
