"use client";

import { FileText, MessageSquare, Quote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/hooks/useChat";

const TIPS = [
  {
    icon: FileText,
    title: "Tag a document",
    body: "Type @ in the message box to scope your question to one specific file.",
  },
  {
    icon: Quote,
    title: "Get citations",
    body: "Every answer points back to the exact pages it was drawn from.",
  },
  {
    icon: Sparkles,
    title: "Ask naturally",
    body: "No special syntax — just ask the way you'd ask a colleague.",
  },
];

export default function ChatIndexPage() {
  const createConversation = useCreateConversation();

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
      <div className="w-full max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <MessageSquare className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Start a conversation</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Pick a conversation from the sidebar, or start a new one to ask questions about your uploaded documents.
        </p>

        <Button
          className="mt-6 bg-brand-700 text-white hover:bg-brand-600"
          onClick={() => createConversation.mutate(undefined)}
          disabled={createConversation.isPending}
        >
          {createConversation.isPending ? "Starting..." : "Start a new chat"}
        </Button>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {TIPS.map((tip) => (
            <div key={tip.title} className="rounded-2xl border bg-card p-4 text-left">
              <tip.icon className="h-4 w-4 text-brand-600" />
              <p className="mt-3 text-sm font-medium">{tip.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
