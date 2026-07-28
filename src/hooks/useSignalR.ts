"use client";

import { useEffect, useRef } from "react";
import type { HubConnection } from "@microsoft/signalr";
import { ensureHubConnected } from "@/lib/signalr/connection";
import { useAuthStore } from "@/stores/auth-store";

/** Ensures the SignalR hub connection is open while the user is authenticated. */
export function useSignalR() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    ensureHubConnected().then((hub) => {
      if (!cancelled) connectionRef.current = hub;
    });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return connectionRef;
}
