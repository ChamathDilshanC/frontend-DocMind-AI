"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble, type DisplayMessage } from "@/components/chat/MessageBubble";
import { useConversation } from "@/hooks/useChat";
import { chatApi } from "@/lib/api/chat";
import { getHubConnection } from "@/lib/signalr/connection";

interface StreamingState {
  messageId: string;
  content: string;
}

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const queryClient = useQueryClient();
  const { data: conversation, isLoading } = useConversation(conversationId);

  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [streaming, setStreaming] = useState<StreamingState | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hub = getHubConnection();

    const onToken = (payload: { conversationId: string; messageId: string; token: string }) => {
      if (payload.conversationId !== conversationId) return;
      setStreaming((prev) =>
        prev && prev.messageId === payload.messageId
          ? { ...prev, content: prev.content + payload.token }
          : { messageId: payload.messageId, content: payload.token },
      );
    };

    hub.on("ReceiveAnswerToken", onToken);
    return () => {
      hub.off("ReceiveAnswerToken", onToken);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, streaming, pendingQuestion]);

  const handleSend = async (question: string) => {
    setPendingQuestion(question);
    setStreaming(null);
    setIsAsking(true);

    try {
      await chatApi.ask(question, conversationId);
      await queryClient.invalidateQueries({ queryKey: ["conversations", conversationId] });
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to get an answer");
    } finally {
      setPendingQuestion(null);
      setStreaming(null);
      setIsAsking(false);
    }
  };

  const persistedMessages: DisplayMessage[] = (conversation?.messages ?? []).map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    citations: m.citations,
  }));

  const optimisticMessages: DisplayMessage[] = [];
  if (pendingQuestion) {
    optimisticMessages.push({ id: "pending-question", role: "User", content: pendingQuestion });
  }
  if (streaming) {
    optimisticMessages.push({ id: streaming.messageId, role: "Assistant", content: streaming.content, isStreaming: true });
  } else if (isAsking) {
    optimisticMessages.push({ id: "pending-answer", role: "Assistant", content: "Thinking...", isStreaming: true });
  }

  const messages = [...persistedMessages, ...optimisticMessages];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ask a question about your uploaded documents to get started.</p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={scrollRef} />
      </div>
      <ChatInput onSend={handleSend} disabled={isAsking} />
    </div>
  );
}
