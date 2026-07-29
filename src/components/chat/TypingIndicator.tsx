import { Sparkles } from "lucide-react";

/**
 * Shown between sending a question and the first streamed token arriving.
 * The three dots are staggered via negative animation delays so they ripple
 * rather than pulsing in unison.
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/30" />
        <Sparkles className="relative h-4 w-4" />
      </span>

      <div className="flex items-center gap-3 rounded-2xl rounded-tl-md bg-muted px-4 py-3">
        <span className="flex items-end gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-600"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </span>
        <span className="bg-gradient-to-r from-brand-700 via-brand-400 to-brand-700 bg-[length:200%_100%] bg-clip-text text-sm font-medium text-transparent [animation:shimmer_2s_linear_infinite]">
          Searching your documents
        </span>
        <span className="sr-only" role="status">
          Generating an answer
        </span>
      </div>
    </div>
  );
}
