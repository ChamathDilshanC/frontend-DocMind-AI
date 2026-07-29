"use client";

import { FileText, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NavFooter } from "@/components/sidebar-01/nav-footer";
import { NavHeader } from "@/components/sidebar-01/nav-header";
import { NavMain } from "@/components/sidebar-01/nav-main";
import { NavRecentDocuments } from "@/components/sidebar-01/nav-recent-documents";
import type { NavItem } from "@/components/sidebar-01/types";

export const navMain: NavItem[] = [
  { id: "dashboard", title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { id: "documents", title: "Documents", url: "/documents", icon: FileText },
  { id: "chat", title: "Chat", url: "/chat", icon: MessageSquare },
  { id: "settings", title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <NavHeader items={navMain} />
      <SidebarContent>
        <NavMain items={navMain} />
        <NavRecentDocuments />
      </SidebarContent>
      <NavFooter />
    </Sidebar>
  );
}
