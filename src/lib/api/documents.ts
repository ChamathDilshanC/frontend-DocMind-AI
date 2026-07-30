import { apiFetch, API_BASE_URL } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import type { DocumentDto, DocumentPageDto, PaginatedList } from "@/types/api";

export const documentsApi = {
  list: (pageNumber = 1, pageSize = 20) =>
    apiFetch<PaginatedList<DocumentDto>>(`/api/documents?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: (id: string) => apiFetch<DocumentDto>(`/api/documents/${id}`),

  getPages: (id: string) => apiFetch<DocumentPageDto[]>(`/api/documents/${id}/pages`),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<DocumentDto>("/api/documents/upload", { method: "POST", body: formData, isFormData: true });
  },

  rename: (id: string, newName: string) =>
    apiFetch<DocumentDto>(`/api/documents/${id}`, { method: "PUT", body: { newName } }),

  remove: (id: string) => apiFetch<void>(`/api/documents/${id}`, { method: "DELETE" }),

  removeAll: () => apiFetch<void>("/api/documents", { method: "DELETE" }),

  downloadUrl: (id: string) => `${API_BASE_URL}/api/documents/${id}/download`,

  retry: (documentId: string) =>
    apiFetch<void>("/api/embeddings/create", { method: "POST", body: { documentId } }),

  async downloadBlob(id: string): Promise<{ blob: Blob; filename: string }> {
    const token = useAuthStore.getState().accessToken;
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error("Download failed");

    const disposition = response.headers.get("content-disposition");
    const match = disposition?.match(/filename="?([^"]+)"?/);
    return { blob: await response.blob(), filename: match?.[1] ?? "document" };
  },
};
