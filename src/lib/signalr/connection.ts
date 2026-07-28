import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

let connection: signalR.HubConnection | null = null;

export function getHubConnection(): signalR.HubConnection {
  connection ??= new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/app`, {
      accessTokenFactory: () => useAuthStore.getState().accessToken ?? "",
    })
    .withAutomaticReconnect()
    .build();

  return connection;
}

export async function ensureHubConnected(): Promise<signalR.HubConnection> {
  const hub = getHubConnection();
  if (hub.state === signalR.HubConnectionState.Disconnected) {
    await hub.start();
  }
  return hub;
}
