"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble, type DisplayMessage } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatMessagesSkeleton } from "@/components/ui/loading-skeletons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAskQuestion, useConversation, upsertMessage } from "@/hooks/useChat";
import { getHubConnection } from "@/lib/signalr/connection";

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const queryClient = useQueryClient();
  const { data: conversation, isLoading } = useConversation(conversationId);
  const ask = useAskQuestion(conversationId);

  // Only identifies which message the cursor belongs to; the text itself lives in
  // the query cache like every other message. Re-setting it to the same id on every
  // token is a no-op, so this re-renders once when streaming starts, not per token.
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hub = getHubConnection();

    const onToken = (payload: { conversationId: string; messageId: string; token: string }) => {
      if (payload.conversationId !== conversationId) return;

      setStreamingMessageId(payload.messageId);
      upsertMessage(
        queryClient,
        conversationId,
        { id: payload.messageId, role: "Assistant", content: payload.token },
        { appendContent: true },
      );
    };

    hub.on("ReceiveAnswerToken", onToken);
    return () => {
      hub.off("ReceiveAnswerToken", onToken);
    };
  }, [conversationId, queryClient]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Failures surface through the mutation's own onError, and both the cursor and the
  // indicator are gated on isPending — so a leftover id after a turn cannot render
  // anything, and the next send clears it.
  const handleSend = (question: string, documentId?: string) => {
    setStreamingMessageId(null);
    ask.mutate({ question, documentId });
  };

  const messages: DisplayMessage[] = (conversation?.messages ?? []).map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    citations: m.citations,
    isStreaming: ask.isPending && m.id === streamingMessageId,
  }));

  // Between sending and the first streamed token there is nothing to render as a
  // message yet, so show the animated indicator instead of an empty bubble.
  const showTypingIndicator = ask.isPending && streamingMessageId === null;

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
          <ChatInput onSend={handleSend} disabled={ask.isPending} />
        </div>
      </div>
    </div>
  );
}
