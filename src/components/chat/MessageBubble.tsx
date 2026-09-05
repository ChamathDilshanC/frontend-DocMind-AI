import { Sparkles } from "lucide-react";
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
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-2.5 text-[0.9375rem] leading-7">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-card text-brand-700">
        <Sparkles className="h-3.5 w-3.5" />
      </span>

      <div className="min-w-0 flex-1">
        <MarkdownMessage content={message.content} />
        {message.isStreaming && <StreamingCursor />}
        {message.citations && message.citations.length > 0 && <CitationList citations={message.citations} />}
      </div>
    </div>
  );
}
