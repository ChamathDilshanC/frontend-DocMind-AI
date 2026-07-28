"use client";

import { use } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  return <ChatWindow conversationId={conversationId} />;
}
