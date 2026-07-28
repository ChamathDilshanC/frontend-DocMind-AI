"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatHistory, useCreateConversation, useDeleteConversation } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function ConversationSidebar() {
  const pathname = usePathname();
  const { data } = useChatHistory();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();

  return (
    <div className="flex w-72 shrink-0 flex-col border-r">
      <div className="border-b p-3">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => createConversation.mutate(undefined)}
          disabled={createConversation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {data?.items.length === 0 && (
            <p className="p-2 text-sm text-muted-foreground">No conversations yet.</p>
          )}
          {data?.items.map((conversation) => {
            const active = pathname === `/chat/${conversation.id}`;
            return (
              <div
                key={conversation.id}
                className={cn(
                  "group flex items-center justify-between rounded-md px-2 py-2 text-sm",
                  active ? "bg-secondary text-secondary-foreground" : "hover:bg-muted",
                )}
              >
                <Link href={`/chat/${conversation.id}`} className="flex-1 truncate">
                  <p className="truncate font-medium">{conversation.title}</p>
                  {conversation.lastMessagePreview && (
                    <p className="truncate text-xs text-muted-foreground">{conversation.lastMessagePreview}</p>
                  )}
                </Link>
                <button
                  type="button"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteConversation.mutate(conversation.id);
                  }}
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
