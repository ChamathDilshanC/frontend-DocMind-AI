"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/hooks/useChat";

export default function ChatIndexPage() {
  const createConversation = useCreateConversation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <MessageSquare className="h-10 w-10 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-medium">No conversation selected</h2>
        <p className="text-sm text-muted-foreground">Pick a conversation from the sidebar or start a new one.</p>
      </div>
      <Button onClick={() => createConversation.mutate(undefined)} disabled={createConversation.isPending}>
        Start a new chat
      </Button>
    </div>
  );
}
