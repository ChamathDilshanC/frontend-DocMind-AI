"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";
import type { DocumentDto } from "@/types/api";

interface ChatInputProps {
  onSend: (question: string, documentId?: string) => void;
  disabled?: boolean;
}

function findMentionQuery(text: string, cursor: number): string | null {
  const upToCursor = text.slice(0, cursor);
  const atIndex = upToCursor.lastIndexOf("@");
  if (atIndex === -1) return null;

  const charBefore = atIndex === 0 ? " " : upToCursor[atIndex - 1];
  if (!/\s/.test(charBefore)) return null;

  const afterAt = upToCursor.slice(atIndex + 1);
  if (/\s/.test(afterAt)) return null;

  return afterAt;
}

const QUICK_PROMPTS = ["Summarize this document", "List the key points"];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [taggedDocument, setTaggedDocument] = useState<DocumentDto | null>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data } = useDocuments(1, 50);
  const documents = useMemo(() => data?.items ?? [], [data]);

  const filteredDocuments = useMemo(() => {
    if (mentionQuery === null) return [];
    const query = mentionQuery.toLowerCase();
    return documents.filter((doc) => doc.name.toLowerCase().includes(query)).slice(0, 8);
  }, [documents, mentionQuery]);

  const mentionOpen = mentionQuery !== null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value;
    setValue(nextValue);
    setMentionQuery(findMentionQuery(nextValue, e.target.selectionStart ?? nextValue.length));
  };

  const selectMention = (doc: DocumentDto) => {
    const textarea = textareaRef.current;
    const cursor = textarea?.selectionStart ?? value.length;
    const upToCursor = value.slice(0, cursor);
    const atIndex = upToCursor.lastIndexOf("@");
    if (atIndex === -1) return;

    const nextValue = value.slice(0, atIndex) + value.slice(cursor);
    setValue(nextValue);
    setTaggedDocument(doc);
    setMentionQuery(null);
    requestAnimationFrame(() => textarea?.focus());
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, taggedDocument?.id);
    setValue("");
    setMentionQuery(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionOpen) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionQuery(null);
        return;
      }
      if (e.key === "Enter" && !e.shiftKey && filteredDocuments.length === 1) {
        e.preventDefault();
        selectMention(filteredDocuments[0]);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey && !mentionOpen) {
      e.preventDefault();
      submit();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setValue(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-background px-6 pt-2 pb-5">
      {taggedDocument && (
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-xs font-medium">
            <FileText className="h-3 w-3" />
            Asking about {taggedDocument.name}
            <button
              type="button"
              aria-label="Remove tagged document"
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => setTaggedDocument(null)}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      <div className="relative">
        {mentionOpen && (
          <div className="absolute bottom-full left-0 z-50 mb-2 w-72 overflow-hidden rounded-lg border bg-popover shadow-md">
            <Command shouldFilter={false}>
              <CommandList>
                <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                  No matching documents.
                </CommandEmpty>
                {filteredDocuments.length > 0 && (
                  <CommandGroup heading="Tag a document">
                    {filteredDocuments.map((doc) => (
                      <CommandItem key={doc.id} onSelect={() => selectMention(doc)}>
                        <FileText className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{doc.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}

        {/* The whole composer reacts to focus rather than the textarea alone, so the
            control reads as one surface instead of a box with a ring inside it. */}
        <div className="flex min-h-[52px] flex-col rounded-3xl border bg-card shadow-sm transition-shadow focus-within:border-foreground/20 focus-within:shadow-md">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents... (@ to tag one)"
            className="min-h-11 flex-1 resize-none border-0 bg-transparent px-4 pt-3 text-[0.9375rem] leading-6 shadow-none focus-visible:ring-0"
            rows={1}
            disabled={disabled}
          />
          <div className="flex items-center justify-end p-2.5 pt-0">
            <Button
              size="icon"
              className="rounded-full"
              onClick={submit}
              disabled={disabled || !value.trim()}
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {!taggedDocument && (
        <p className="mt-2 text-center text-muted-foreground/70 text-xs">
          Answers are grounded in your uploaded documents. Press{" "}
          <kbd className="font-sans font-medium">Enter</kbd> to send.
        </p>
      )}

      {taggedDocument && (
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className={cn(
                "rounded-full border bg-transparent px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted",
              )}
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
