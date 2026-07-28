import { ConversationSidebar } from "@/components/chat/ConversationSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <ConversationSidebar />
      {children}
    </div>
  );
}
