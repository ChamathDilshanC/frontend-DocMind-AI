"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSignalR } from "@/hooks/useSignalR";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();
  useSignalR();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || !accessToken) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
