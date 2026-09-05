"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { Sparkles } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble, type DisplayMessage } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatMessagesSkeleton } from "@/components/ui/loading-skeletons";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  // Once the refetched conversation contains the persisted copy of the streamed
  // answer (same message id), drop the streaming bubble — otherwise the answer
  // renders twice until the streaming state clears.
  if (streaming && !persistedMessages.some((m) => m.id === streaming.messageId)) {
    optimisticMessages.push({ id: streaming.messageId, role: "Assistant", content: streaming.content, isStreaming: true });
  }

  const messages = [...persistedMessages, ...optimisticMessages];
  // Between sending and the first streamed token there is nothing to render as
  // a message yet, so show the animated indicator instead of a placeholder
  // bubble containing the literal word "Thinking...".
  const showTypingIndicator = isAsking && !streaming;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {conversation && (
        <header className="shrink-0 border-b px-6 py-3">
          {/* The title is orientation, not a page heading — it stays at body size so it
              never competes with the answer text for attention. */}
          <div className="mx-auto max-w-3xl">
            <h1 className="truncate font-medium text-sm">{conversation.title}</h1>
          </div>
        </header>
      )}

      <ScrollArea className="flex-1">
        <div className="mx-auto min-h-full max-w-3xl space-y-8 px-6 py-8">
          {isLoading ? (
            <ChatMessagesSkeleton />
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border bg-card text-brand-700">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="mt-5 font-medium">Ask about your documents</p>
              <p className="mt-1.5 max-w-sm text-muted-foreground text-sm leading-6">
                Type a question below, or use <span className="font-medium text-foreground">@</span> to tag a
                specific document first.
              </p>
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}
          {showTypingIndicator && <TypingIndicator />}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="shrink-0">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} disabled={isAsking} />
        </div>
      </div>
    </div>
  );
}
