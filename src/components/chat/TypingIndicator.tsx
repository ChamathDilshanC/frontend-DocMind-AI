import { Sparkles } from "lucide-react";
import { TextType } from "@/components/ui/text-type";

const SEARCH_PHRASES = ["Searching your documents", "Reading the relevant pages", "Drafting an answer"];

/**
 * Shown between sending a question and the first streamed token arriving.
 * The three dots are staggered via negative animation delays so they ripple
 * rather than pulsing in unison.
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      {/* Matches the assistant avatar in MessageBubble, so the answer replaces the
          indicator in place rather than shifting the column when it arrives. */}
      <span className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-card text-brand-700">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/20" />
        <Sparkles className="relative h-3.5 w-3.5" />
      </span>

      <div className="flex min-w-0 items-center gap-2.5 pt-1">
        <span className="flex items-end gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </span>
        <TextType
          text={SEARCH_PHRASES}
          as="span"
          className="text-muted-foreground text-sm"
          typingSpeed={35}
          deletingSpeed={20}
          pauseDuration={1200}
          cursorCharacter="●"
          cursorClassName="text-muted-foreground/50"
          cursorBlinkDuration={0.6}
        />
        <span className="sr-only" role="status">
          Generating an answer
        </span>
      </div>
    </div>
  );
}
