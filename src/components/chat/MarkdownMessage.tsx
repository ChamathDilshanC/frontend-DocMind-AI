"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders an assistant answer as markdown.
 *
 * The model replies in markdown, so rendering it as plain text showed readers the
 * literal syntax — "**Technical Skills:**" instead of a bold run. Components are
 * mapped explicitly rather than styled through a prose plugin so headings inside a
 * chat turn stay close to body size: an answer is not a document, and an <h1> at
 * document scale in the middle of a conversation reads as a mistake.
 *
 * Streaming means this renders partial markdown many times per answer — an unclosed
 * ** or a half-written table is normal mid-stream, so every element is styled to look
 * reasonable on its own rather than assuming a well-formed whole.
 */

const components: Components = {
  p: ({ children }) => <p className="mb-4 leading-7 last:mb-0">{children}</p>,

  h1: ({ children }) => <h1 className="mt-6 mb-3 font-semibold text-base first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-6 mb-3 font-semibold text-base first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-5 mb-2 font-semibold text-sm first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-5 mb-2 font-semibold text-sm first:mt-0">{children}</h4>,

  ul: ({ children }) => <ul className="mb-4 list-disc space-y-2 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-2 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-7 marker:text-muted-foreground">{children}</li>,

  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,

  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
    >
      {children}
    </a>
  ),

  code: ({ className, children }) => {
    // react-markdown gives fenced blocks a language-* class and inline code none,
    // which is the only reliable way to tell the two apart here.
    const isBlock = /language-/.test(className ?? "");

    if (!isBlock) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {children}
        </code>
      );
    }

    return <code className="font-mono text-[0.85em] leading-6">{children}</code>;
  },

  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-xl border bg-muted/60 p-4 last:mb-0">{children}</pre>
  ),

  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 pl-4 text-muted-foreground italic last:mb-0">{children}</blockquote>
  ),

  hr: () => <hr className="my-6 border-border" />,

  // Wide tables scroll inside their own container so a long answer never makes the
  // whole conversation pane scroll sideways.
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b px-3 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-border/60 px-3 py-2 align-top">{children}</td>,
};

export function MarkdownMessage({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("text-[0.9375rem] text-foreground", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
