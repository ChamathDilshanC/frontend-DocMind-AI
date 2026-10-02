import { Sparkles, UserRound } from "lucide-react";
import {
  Message as BeMessage,
  MessageAvatar,
  MessageBubble as BeMessageBubble,
  MessageBubbleContent,
  MessageContent,
} from "@/components/agents/message";
import { CitationList } from "@/components/chat/CitationList";
import { MarkdownMessage } from "@/components/chat/MarkdownMessage";
import { StreamingCursor } from "@/components/chat/StreamingCursor";
import type { CitationDto } from "@/types/api";

export interface DisplayMessage {
  id: string;
  role: "User" | "Assistant" | "System";
  content: string;
  citations?: CitationDto[] | null;
  isStreaming?: boolean;
}

/**
 * A single conversation turn.
 *
 * The two roles are deliberately asymmetric. A question is short and benefits from
 * being visually bounded, so it keeps a container and sits right. An answer is the
 * content the reader came for — boxing it inside a bubble caps its width, fights the
 * markdown's own spacing and makes long answers feel cramped, so it runs as plain
 * text on the page with only the avatar to mark whose turn it is.
 */
export function MessageBubble({ message }: { message: DisplayMessage }) {
  if (message.role === "User") {
    return (
      <BeMessage from="user" animateIn>
        <MessageAvatar className="bg-foreground text-background">
          <UserRound />
        </MessageAvatar>
        <MessageContent>
          <BeMessageBubble variant="soft" animateIn>
            <MessageBubbleContent>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </MessageBubbleContent>
          </BeMessageBubble>
        </MessageContent>
      </BeMessage>
    );
  }

  return (
    <BeMessage from="assistant" animateIn>
      <MessageAvatar className="border bg-card text-brand-700">
        <Sparkles />
      </MessageAvatar>
      <MessageContent>
        <BeMessageBubble variant="ghost" className="max-w-none">
          <MessageBubbleContent className="max-w-none px-0 py-0">
            <MarkdownMessage content={message.content} />
            {message.isStreaming && <StreamingCursor />}
            {message.citations && message.citations.length > 0 && (
              <CitationList citations={message.citations} />
            )}
          </MessageBubbleContent>
        </BeMessageBubble>
      </MessageContent>
    </BeMessage>
  );
}
