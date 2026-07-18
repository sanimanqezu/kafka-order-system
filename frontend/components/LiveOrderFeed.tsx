"use client";

import { Radio, PackageCheck } from "lucide-react";
import { ConnectionState, OrderStatusUpdate } from "@/lib/types";
import { formatTime } from "@/lib/format";

const STATUS_COLOR: Record<string, string> = {
  PLACED: "#6ea8fe",
  PAID: "#7df9d0",
  CONFIRMED: "#7df9d0",
  FAILED: "#ff6b6b",
};

export function LiveOrderFeed({
  orders,
  connection,
}: {
  orders: OrderStatusUpdate[];
  connection: ConnectionState;
}) {
  return (
    <section id="activity" className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-line bg-surface/40 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint/10">
              <Radio className="h-5 w-5 text-mint" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Live order activity</h2>
              <p className="text-sm text-muted">
                Pushed straight from the Kafka consumer over WebSocket — no refresh.
              </p>
            </div>
          </div>
          <span className="hidden text-xs text-faint sm:block">
            {connection === "connected" ? `${orders.length} this session` : "Reconnecting…"}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-14 text-center">
              <PackageCheck className="h-8 w-8 text-faint" strokeWidth={1.5} />
              <p className="text-sm text-muted">
                No orders yet. Place one above and watch it appear here in real time.
              </p>
            </div>
          ) : (
            orders.map((order, i) => {
              const color = STATUS_COLOR[order.status] ?? "#9b9ba7";
              return (
                <div
                  key={`${order.orderId}-${i}`}
                  className="animate-slide-in flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface-2/60 px-4 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide"
                      style={{ color, backgroundColor: `${color}1a` }}
                    >
                      {order.status}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{order.product}</p>
                      <p className="truncate text-xs text-faint">
                        {order.customerName} · {order.orderId.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-faint">{formatTime(order.updatedAt)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
