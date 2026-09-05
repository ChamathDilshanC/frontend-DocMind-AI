"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileText,
  HardDrive,
  MessageSquare,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartSkeleton, ListRowsSkeleton, StatCardSkeleton } from "@/components/ui/loading-skeletons";
import { useChatHistory } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuthStore } from "@/stores/auth-store";
import type { DocumentDto } from "@/types/api";

const STATUS_COLORS: Record<string, string> = {
  Completed: "var(--color-brand-700)",
  Processing: "var(--color-brand-500)",
  Queued: "var(--color-brand-500)",
  Uploaded: "var(--color-brand-100)",
  Failed: "#e11d48",
};

const uploadsChartConfig = {
  uploads: { label: "Uploads", color: "var(--color-brand-600)" },
} satisfies ChartConfig;

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 MB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function buildWeeklyUploads(documents: DocumentDto[]) {
  const days: { day: string; uploads: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toDateString();
    const uploads = documents.filter((doc) => new Date(doc.createdAt).toDateString() === key).length;
    days.push({ day: date.toLocaleDateString(undefined, { weekday: "short" }), uploads });
  }

  return days;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: documentsPage, isLoading: documentsLoading } = useDocuments(1, 100);
  const { data: conversationsPage, isLoading: conversationsLoading } = useChatHistory(1, 5);

  const documents = useMemo(() => documentsPage?.items ?? [], [documentsPage]);

  const stats = useMemo(() => {
    const completed = documents.filter((d) => d.status === "Completed").length;
    const inFlight = documents.filter(
      (d) => d.status === "Uploaded" || d.status === "Queued" || d.status === "Processing",
    ).length;
    const storage = documents.reduce((sum, d) => sum + d.fileSizeBytes, 0);
    return { completed, inFlight, storage };
  }, [documents]);

  const weeklyUploads = useMemo(() => buildWeeklyUploads(documents), [documents]);

  const statusBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    documents.forEach((doc) => counts.set(doc.status, (counts.get(doc.status) ?? 0) + 1));
    return Array.from(counts, ([status, count]) => ({ status, count }));
  }, [documents]);

  const statusChartConfig = useMemo(
    () =>
      Object.fromEntries(
        statusBreakdown.map(({ status }) => [
          status,
          { label: status, color: STATUS_COLORS[status] ?? "var(--color-brand-500)" },
        ]),
      ) satisfies ChartConfig,
    [statusBreakdown],
  );

  const conversations = conversationsPage?.items ?? [];
  const hasUploads = weeklyUploads.some((d) => d.uploads > 0);

  return (
    <div className="h-full overflow-y-auto">
      {/* A saturated hero band pushed the actual workspace below the fold and made the
          brand, rather than the reader's documents, the loudest thing on the page. */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back{user ? `, ${user.name}` : ""}</p>
            <h1 className="mt-1 font-semibold text-2xl tracking-tight">Your document workspace</h1>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm leading-6">
              Upload a document, then ask questions in plain language and get answers grounded in the exact pages
              they came from.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              render={
                <Link href="/documents">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Link>
              }
            />
            <Button
              className="bg-brand-700 text-white hover:bg-brand-600"
              render={
                <Link href="/chat">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask a question
                </Link>
              }
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 p-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {documentsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                label="Documents"
                value={documentsPage?.totalCount ?? 0}
                hint="Total uploaded"
                icon={FileText}
                accent="bg-brand-100 text-brand-700"
              />
              <StatCard
                label="Ready to query"
                value={stats.completed}
                hint="Finished processing"
                icon={CheckCircle2}
                accent="bg-muted text-muted-foreground"
              />
              <StatCard
                label="In progress"
                value={stats.inFlight}
                hint="Queued or processing"
                icon={Clock}
                accent="bg-muted text-muted-foreground"
              />
              <StatCard
                label="Storage used"
                value={formatBytes(stats.storage)}
                hint="Across your documents"
                icon={HardDrive}
                accent="bg-muted text-muted-foreground"
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          {documentsLoading ? (
            <>
              <ChartSkeleton className="lg:col-span-2" />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
                <h2 className="font-semibold text-sm">Uploads this week</h2>
                <p className="text-sm text-muted-foreground">Documents you added over the last 7 days.</p>
                {hasUploads ? (
                  <ChartContainer config={uploadsChartConfig} className="mt-6 h-56 w-full">
                    <BarChart accessibilityLayer data={weeklyUploads}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis axisLine={false} dataKey="day" tickLine={false} tickMargin={8} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={28} />
                      <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                      <Bar dataKey="uploads" fill="var(--color-uploads)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="mt-6 flex h-56 flex-col items-center justify-center rounded-xl border border-dashed text-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-3 text-sm font-medium">No uploads in the last 7 days</p>
                    <p className="text-xs text-muted-foreground">Upload a document to see activity here.</p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border bg-card p-5">
                <h2 className="font-semibold text-sm">Processing status</h2>
                <p className="text-sm text-muted-foreground">How your documents break down.</p>
                {statusBreakdown.length > 0 ? (
                  <>
                    <ChartContainer config={statusChartConfig} className="mt-4 h-40 w-full">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                        <Pie data={statusBreakdown} dataKey="count" nameKey="status" innerRadius={42} strokeWidth={2}>
                          {statusBreakdown.map((entry) => (
                            <Cell
                              key={entry.status}
                              fill={STATUS_COLORS[entry.status] ?? "var(--color-brand-500)"}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <ul className="mt-4 space-y-2">
                      {statusBreakdown.map(({ status, count }) => (
                        <li key={status} className="flex items-center gap-2 text-sm">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: STATUS_COLORS[status] ?? "var(--color-brand-500)" }}
                          />
                          <span className="text-muted-foreground">{status}</span>
                          <span className="ml-auto font-medium">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="mt-6 flex h-40 items-center justify-center rounded-xl border border-dashed">
                    <p className="text-sm text-muted-foreground">No documents yet</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Recent conversations */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Recent conversations</h2>
              <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={
                <Link href="/chat">
                  <Plus className="mr-2 h-4 w-4" />
                  New chat
                </Link>
              }
            />
          </div>

          <div className="mt-4">
            {conversationsLoading ? (
              <ListRowsSkeleton rows={3} />
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">No conversations yet</p>
                <p className="text-xs text-muted-foreground">Ask your first question to get started.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {conversations.map((conversation) => (
                  <li key={conversation.id}>
                    <Link
                      href={`/chat/${conversation.id}`}
                      className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                        <MessageSquare className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{conversation.title}</span>
                        {conversation.lastMessagePreview && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {conversation.lastMessagePreview}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
