"use client";

import { ChevronDown, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = {
  Completed: "bg-green-500",
  Processing: "bg-amber-500",
  Queued: "bg-amber-500",
  Uploaded: "bg-amber-500",
  Failed: "bg-red-500",
};

export function NavRecentDocuments() {
  const pathname = usePathname();
  const { data, isLoading } = useDocuments(1, 5);
  const documents = data?.items ?? [];

  return (
    <Collapsible className="group/collapsible" defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel
          className="font-medium text-muted-foreground text-xs uppercase tracking-wide hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          render={<CollapsibleTrigger />}
        >
          Recent Documents
          <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && (
                <SidebarMenuItem>
                  <span className="px-2 text-xs text-muted-foreground">Loading...</span>
                </SidebarMenuItem>
              )}
              {!isLoading && documents.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/documents" />}>
                    <span className="text-muted-foreground">No documents yet</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {documents.map((doc) => {
                const href = `/documents/${doc.id}`;
                return (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton
                      isActive={pathname === href}
                      render={<Link href={href} />}
                      tooltip={doc.name}
                    >
                      <FileText className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{doc.name}</span>
                      <span
                        className={cn(
                          "ml-auto h-1.5 w-1.5 shrink-0 rounded-full",
                          STATUS_DOT[doc.status] ?? "bg-muted-foreground",
                        )}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
