import { apiFetch } from "@/lib/api/client";
import type {
  AskQuestionResultDto,
  ConversationDetailDto,
  ConversationSummaryDto,
  PaginatedList,
} from "@/types/api";

export const chatApi = {
  ask: (question: string, conversationId?: string, documentId?: string) =>
    apiFetch<AskQuestionResultDto>("/api/chat/ask", {
      method: "POST",
      body: { question, conversationId: conversationId ?? null, documentId: documentId ?? null },
    }),

  createConversation: (title?: string) =>
    apiFetch<{ id: string; title: string }>("/api/chat/conversations", {
      method: "POST",
      body: { title: title ?? null },
    }),

  deleteConversation: (conversationId: string) =>
    apiFetch<void>(`/api/chat/conversations/${conversationId}`, { method: "DELETE" }),

  deleteAllConversations: () => apiFetch<void>("/api/chat/conversations", { method: "DELETE" }),

  history: (pageNumber = 1, pageSize = 20) =>
    apiFetch<PaginatedList<ConversationSummaryDto>>(`/api/chat/history?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getConversation: (conversationId: string) =>
    apiFetch<ConversationDetailDto>(`/api/chat/${conversationId}`),
};
