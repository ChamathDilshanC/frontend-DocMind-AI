"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { gooeyToast } from "goey-toast";
import { Button } from "@/components/ui/button";
import { useChatHistory, useCreateConversation, useDeleteAllConversations, useDeleteConversation } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function ConversationSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading } = useChatHistory();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const clearAllConversations = useDeleteAllConversations();

  const confirmDelete = (conversationId: string, title: string) => {
    const isActive = pathname === `/chat/${conversationId}`;

    gooeyToast.warning(`Delete "${title}"?`, {
      description: "This conversation and its messages will be permanently deleted.",
      duration: 6000,
      action: {
        label: "Delete",
        onClick: () => {
          // Deleting the conversation currently open leaves the chat window pointed at
          // an id that no longer exists, so send it back to the empty state.
          deleteConversation.mutate(conversationId, {
            onSuccess: () => {
              if (isActive) router.push("/chat");
            },
          });
        },
        successLabel: "Deleted",
      },
    });
  };

  const confirmClearAll = () => {
    gooeyToast.warning("Delete all conversations?", {
      description: "All chats and their messages will be permanently deleted. This can't be undone.",
      duration: 6000,
      action: {
        label: "Delete all",
        onClick: () => {
          const wasViewingAConversation = pathname.startsWith("/chat/");
          clearAllConversations.mutate(undefined, {
            onSuccess: () => {
              if (wasViewingAConversation) router.push("/chat");
            },
          });
        },
        successLabel: "Deleted",
      },
    });
  };

  return (
    <div className="flex w-64 shrink-0 flex-col border-r bg-muted/30">
      <div className="flex items-center gap-2 p-3">
        <Button
          className="flex-1 justify-start border bg-card text-foreground shadow-sm hover:bg-card hover:shadow"
          onClick={() => createConversation.mutate(undefined)}
          disabled={createConversation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
        {!isLoading && (data?.items.length ?? 0) > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={confirmClearAll}
            disabled={clearAllConversations.isPending}
            aria-label="Clear all chats"
            title="Clear all chats"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
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

          <AnimatePresence initial={false}>
            {!isLoading &&
              data?.items.map((conversation) => {
                const active = pathname === `/chat/${conversation.id}`;
                return (
                  <motion.div
                    key={conversation.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "group flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                        active ? "bg-card shadow-sm" : "hover:bg-card/60",
                      )}
                    >
                      <Link href={`/chat/${conversation.id}`} className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{conversation.title}</span>
                        {conversation.lastMessagePreview && (
                          <span className="block truncate text-muted-foreground text-xs">
                            {conversation.lastMessagePreview}
                          </span>
                        )}
                      </Link>
                      <button
                        type="button"
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          confirmDelete(conversation.id, conversation.title);
                        }}
                        aria-label={`Delete conversation ${conversation.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
