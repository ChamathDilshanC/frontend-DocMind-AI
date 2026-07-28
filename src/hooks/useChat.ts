"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { chatApi } from "@/lib/api/chat";

export function useChatHistory(pageNumber = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["conversations", pageNumber, pageSize],
    queryFn: () => chatApi.history(pageNumber, pageSize),
  });
}

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => chatApi.getConversation(conversationId!),
    enabled: Boolean(conversationId),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (title?: string) => chatApi.createConversation(title),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/chat/${conversation.id}`);
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => chatApi.deleteConversation(conversationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });
}
