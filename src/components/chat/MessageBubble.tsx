import { Sparkles } from "lucide-react";
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

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-700 px-4 py-2.5 text-sm text-white">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="min-w-0 max-w-[85%] rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 text-sm">
        <p className="whitespace-pre-wrap leading-relaxed">
          {message.content}
          {message.isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-current align-middle" />
          )}
        </p>
        {message.citations && message.citations.length > 0 && <CitationList citations={message.citations} />}
      </div>
    </div>
  );
}
