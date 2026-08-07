import { Sparkles } from "lucide-react";
import { CitationList } from "@/components/chat/CitationList";
import { TypingAnimation } from "@/components/ui/typing-animation";
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
      <div className="min-w-0 max-w-[85%] rounded-2xl rounded-tl-md border border-border/70 bg-white px-4 py-2.5 text-sm shadow-sm">
        <TypingAnimation as="p" typeSpeed={12} className="whitespace-pre-wrap leading-relaxed tracking-normal">
          {message.content}
        </TypingAnimation>
        {message.citations && message.citations.length > 0 && <CitationList citations={message.citations} />}
      </div>
    </div>
  );
}
