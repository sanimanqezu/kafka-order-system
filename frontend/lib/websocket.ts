"use client";

// sockjs-client expects a Node-style `global`; provide it in the browser.
if (typeof window !== "undefined" && typeof (window as unknown as { global?: unknown }).global === "undefined") {
  (window as unknown as { global: unknown }).global = window;
}

import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ConnectionState, OrderStatusUpdate } from "./types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8081/ws";
const DESTINATION = "/topic/orders";

let client: Client | null = null;
let subscription: StompSubscription | null = null;

export function connectOrderFeed(
  onUpdate: (update: OrderStatusUpdate) => void,
  onState: (state: ConnectionState) => void,
): void {
  if (client?.active) return;

  onState("connecting");
  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
    reconnectDelay: 4000,
    onConnect: () => {
      onState("connected");
      subscription = client!.subscribe(DESTINATION, (message: IMessage) => {
        try {
          onUpdate(JSON.parse(message.body) as OrderStatusUpdate);
        } catch {
          /* ignore malformed frames */
        }
      });
    },
    onWebSocketClose: () => onState("disconnected"),
    onStompError: () => onState("error"),
  });

  client.activate();
}

export function disconnectOrderFeed(): void {
  subscription?.unsubscribe();
  subscription = null;
  client?.deactivate();
  client = null;
}
