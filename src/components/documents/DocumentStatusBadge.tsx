import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/types/api";

const styles: Record<DocumentStatus, string> = {
  Uploaded: "bg-brand-100 text-brand-700",
  Queued: "bg-brand-100 text-brand-700",
  Processing: "bg-brand-500/15 text-brand-600",
  Completed: "bg-brand-700/10 text-brand-700",
  Failed: "bg-destructive/10 text-destructive",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const isActive = status === "Processing" || status === "Queued" || status === "Uploaded";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
      )}
    >
      {isActive && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
      {status}
    </span>
  );
}
