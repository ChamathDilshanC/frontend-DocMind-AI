import { cn } from "@/lib/utils";
import { CitationList } from "@/components/chat/CitationList";
import type { CitationDto } from "@/types/api";

export interface DisplayMessage {
  id: string;
  role: "User" | "Assistant" | "System";
  content: string;
  citations?: CitationDto[] | null;
  isStreaming?: boolean;
}

export function MessageBubble({ message }: { message: DisplayMessage }) {
  const isUser = message.role === "User";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">
          {message.content}
          {message.isStreaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-current align-middle" />}
        </p>
        {!isUser && message.citations && message.citations.length > 0 && (
          <CitationList citations={message.citations} />
        )}
      </div>
    </div>
  );
}
