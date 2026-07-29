"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { Sparkles } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble, type DisplayMessage } from "@/components/chat/MessageBubble";
import { ChatMessagesSkeleton } from "@/components/ui/loading-skeletons";
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

  const handleSend = async (question: string, documentId?: string) => {
    setPendingQuestion(question);
    setStreaming(null);
    setIsAsking(true);

    try {
      await chatApi.ask(question, conversationId, documentId);
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
      {conversation && (
        <header className="border-b bg-card px-6 py-4">
          <h1 className="truncate font-semibold">{conversation.title}</h1>
        </header>
      )}

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {isLoading ? (
          <ChatMessagesSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="mt-4 font-medium">Ask about your documents</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Type a question below, or use <span className="font-medium text-foreground">@</span> to tag a specific
              document first.
            </p>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={scrollRef} />
      </div>
      <ChatInput onSend={handleSend} disabled={isAsking} />
    </div>
  );
}
