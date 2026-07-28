import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@/types/api";

const variants: Record<DocumentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Uploaded: "outline",
  Queued: "outline",
  Processing: "secondary",
  Completed: "default",
  Failed: "destructive",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>;
}
