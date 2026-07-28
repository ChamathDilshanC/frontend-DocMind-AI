"use client";

import Link from "next/link";
import { FileText, MessageSquare, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatHistory } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: documents } = useDocuments(1, 5);
  const { data: conversations } = useChatHistory(1, 5);

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back{user ? `, ${user.name}` : ""}</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your documents.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents?.totalCount ?? 0}</div>
            <Button
              variant="link"
              className="h-auto p-0 text-sm"
              render={<Link href="/documents">Manage documents</Link>}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations?.totalCount ?? 0}</div>
            <Button
              variant="link"
              className="h-auto p-0 text-sm"
              render={<Link href="/chat">Start chatting</Link>}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get started</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            render={
              <Link href="/documents">
                <Upload className="mr-2 h-4 w-4" />
                Upload a document
              </Link>
            }
          />
          <Button
            variant="outline"
            render={
              <Link href="/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask a question
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
