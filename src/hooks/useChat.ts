"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { gooeyToast as toast } from "goey-toast";
import { chatApi } from "@/lib/api/chat";
import type { CitationDto, ConversationDetailDto, MessageDto } from "@/types/api";

/**
 * The list and the detail used to be keyed ["conversations", page, size] and
 * ["conversations", id], which share a prefix — so invalidating the list after a
 * create, a delete or an answer also refetched whichever conversation was open.
 * Separating them lets each be invalidated on its own.
 */
export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  list: (pageNumber: number, pageSize: number) => [...conversationKeys.lists(), pageNumber, pageSize] as const,
  detail: (conversationId: string) => [...conversationKeys.all, "detail", conversationId] as const,
};

export function useChatHistory(pageNumber = 1, pageSize = 20) {
  return useQuery({
    queryKey: conversationKeys.list(pageNumber, pageSize),
    queryFn: () => chatApi.history(pageNumber, pageSize),
  });
}

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId ?? ""),
    queryFn: () => chatApi.getConversation(conversationId!),
    enabled: Boolean(conversationId),
  });
}

/**
 * Inserts or updates one message in a cached conversation, leaving the rest alone.
 *
 * This is the single write path for the query cache during a turn: the optimistic
 * question, every streamed token and the final persisted answer all go through it.
 * Streaming used to live in component state alongside the cache, which meant the
 * same answer existed twice and the component had to check whether a refetch had
 * caught up before deciding which copy to render.
 */
export function upsertMessage(
  queryClient: QueryClient,
  conversationId: string,
  message: Pick<MessageDto, "id" | "role"> & Partial<MessageDto>,
  { appendContent = false }: { appendContent?: boolean } = {},
) {
  queryClient.setQueryData<ConversationDetailDto>(conversationKeys.detail(conversationId), (current) => {
    if (!current) return current;

    const index = current.messages.findIndex((m) => m.id === message.id);
    const existing = index === -1 ? undefined : current.messages[index];

    const merged: MessageDto = {
      id: message.id,
      role: message.role,
      content: appendContent
        ? (existing?.content ?? "") + (message.content ?? "")
        : (message.content ?? existing?.content ?? ""),
      citations: message.citations ?? existing?.citations ?? null,
      createdAt: existing?.createdAt ?? message.createdAt ?? new Date().toISOString(),
    };

    // Not Array.prototype.with: tsconfig targets ES2017, and a runtime method cannot
    // be downlevelled, so it would throw on any browser older than 2023.
    const messages =
      index === -1
        ? [...current.messages, merged]
        : current.messages.map((m, i) => (i === index ? merged : m));
    return { ...current, messages };
  });
}

interface AskVariables {
  question: string;
  documentId?: string;
}

/**
 * Sends a question and keeps the cached conversation in step with it.
 *
 * The answer is written straight from the response rather than by invalidating and
 * refetching: the POST already returns the persisted message id, text and citations,
 * so a refetch would be a second round-trip to learn what we were just told — and it
 * was that refetch racing the streamed copy that the component had to defend against.
 */
export function useAskQuestion(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ question, documentId }: AskVariables) => chatApi.ask(question, conversationId, documentId),

    onMutate: async ({ question }) => {
      const key = conversationKeys.detail(conversationId);
      // Stop an in-flight refetch from overwriting the optimistic question.
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<ConversationDetailDto>(key);
      // Only needs to be unique within this conversation until the next refetch
      // replaces it with the server's row.
      const optimisticId = `pending-${crypto.randomUUID()}`;

      upsertMessage(queryClient, conversationId, { id: optimisticId, role: "User", content: question });

      return { previous };
    },

    onSuccess: (result) => {
      // Tokens have been arriving under this id all along; this settles the final
      // text and attaches the citations, which streaming does not carry.
      upsertMessage(queryClient, conversationId, {
        id: result.messageId,
        role: "Assistant",
        content: result.answer,
        citations: result.citations as CitationDto[],
      });

      // The title and preview in the rail change with every answer — the detail does
      // not, and is already up to date.
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(conversationKeys.detail(conversationId), context.previous);
      }
      toast.error(error.message || "Failed to get an answer");
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (title?: string) => chatApi.createConversation(title),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      router.push(`/chat/${conversation.id}`);
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => chatApi.deleteConversation(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.removeQueries({ queryKey: conversationKeys.detail(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to delete conversation"),
  });
}

export function useDeleteAllConversations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.deleteAllConversations(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: conversationKeys.all });
      toast.success("All conversations deleted");
    },
    onError: (error: Error) => toast.error(error.message || "Failed to delete conversations"),
  });
}
