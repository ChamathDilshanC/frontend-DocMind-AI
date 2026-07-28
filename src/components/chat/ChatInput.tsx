"use client";

import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput({ onSend, disabled }: { onSend: (question: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t bg-background p-4">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your documents..."
        className="min-h-11 flex-1 resize-none"
        rows={1}
        disabled={disabled}
      />
      <Button size="icon" onClick={submit} disabled={disabled || !value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
