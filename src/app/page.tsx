"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(accessToken ? "/dashboard" : "/login");
  }, [hasHydrated, accessToken, router]);

  return null;
}
