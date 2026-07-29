"use client";

import { Skeleton } from "@heroui/react";

/** Placeholder for a metric/stat tile while its number is loading. */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-8 w-16 rounded-lg" />
      <Skeleton className="mt-2 h-3 w-28 rounded" />
    </div>
  );
}

/** Placeholder for a chart panel. */
export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 ${className}`}>
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="mt-2 h-3 w-56 rounded" />
      <Skeleton className="mt-6 h-48 rounded-xl" />
    </div>
  );
}

/** Placeholder rows for a list of documents/conversations. */
export function ListRowsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Placeholder paragraph lines, for text-heavy content. */
export function TextContentSkeleton({ lines = 5 }: { lines?: number }) {
  const widths = ["w-full", "w-5/6", "w-4/6", "w-full", "w-3/6"];
  return (
    <div className="w-full max-w-md space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 rounded ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

/** Placeholder for chat message bubbles while a conversation loads. */
export function ChatMessagesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Skeleton className="h-12 w-2/5 rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-3/6 rounded" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-1/3 rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-4/6 rounded" />
        <Skeleton className="h-4 w-full rounded" />
      </div>
    </div>
  );
}

/** Placeholder for the settings form cards. */
export function FormCardSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <Skeleton className="h-5 w-32 rounded" />
      <Skeleton className="mt-2 h-3 w-52 rounded" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-6 h-10 w-32 rounded-lg" />
    </div>
  );
}
