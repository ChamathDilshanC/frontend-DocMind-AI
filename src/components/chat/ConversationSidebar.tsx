"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatHistory, useCreateConversation, useDeleteConversation } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function ConversationSidebar() {
  const pathname = usePathname();
  const { data, isLoading } = useChatHistory();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();

  return (
    <div className="flex w-72 shrink-0 flex-col border-r bg-card">
      <div className="border-b p-3">
        <Button
          className="w-full bg-brand-700 text-white hover:bg-brand-600"
          onClick={() => createConversation.mutate(undefined)}
          disabled={createConversation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 rounded-lg px-2 py-2.5">
                <Skeleton className="h-3.5 w-4/5 rounded" />
                <Skeleton className="h-3 w-3/5 rounded" />
              </div>
            ))}

          {!isLoading && data?.items.length === 0 && (
            <div className="flex flex-col items-center px-2 py-10 text-center">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No conversations yet</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Start a new chat to begin.</p>
            </div>
          )}

          {!isLoading &&
            data?.items.map((conversation) => {
              const active = pathname === `/chat/${conversation.id}`;
              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "group flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                    active ? "bg-brand-100 text-brand-700" : "hover:bg-muted",
                  )}
                >
                  <Link href={`/chat/${conversation.id}`} className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{conversation.title}</span>
                    {conversation.lastMessagePreview && (
                      <span
                        className={cn(
                          "block truncate text-xs",
                          active ? "text-brand-700/70" : "text-muted-foreground",
                        )}
                      >
                        {conversation.lastMessagePreview}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteConversation.mutate(conversation.id);
                    }}
                    aria-label={`Delete conversation ${conversation.title}`}
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
