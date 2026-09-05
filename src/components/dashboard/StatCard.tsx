import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon chip (background + text). */
  accent?: string;
}

export function StatCard({ label, value, hint, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-colors hover:border-foreground/15">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            accent ?? "bg-brand-100 text-brand-700",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-4 font-semibold text-3xl tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
