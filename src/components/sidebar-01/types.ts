import type { ElementType } from "react";

export interface NavItem {
  id: string;
  title: string;
  icon: ElementType;
  url: string;
}

export interface User {
  name: string;
  email: string;
}

export interface SidebarData {
  user: User;
  navMain: NavItem[];
}
