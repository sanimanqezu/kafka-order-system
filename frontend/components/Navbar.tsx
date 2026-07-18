import { ConnectionState } from "@/lib/types";

const STATE_LABEL: Record<ConnectionState, string> = {
  connecting: "Connecting",
  connected: "Live",
  disconnected: "Offline",
  error: "Error",
};

const STATE_COLOR: Record<ConnectionState, string> = {
  connecting: "#e7c79a",
  connected: "#7df9d0",
  disconnected: "#62626d",
  error: "#ff6b6b",
};

export function Navbar({ connection }: { connection: ConnectionState }) {
  const color = STATE_COLOR[connection];
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#7df9d0,#6ea8fe_50%,#b68cff)]">
            <span className="h-2.5 w-2.5 rounded-full bg-night" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Aura<span className="text-muted"> Mobile</span>
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a className="transition-colors hover:text-ink" href="#shop">Shop</a>
          <a className="transition-colors hover:text-ink" href="#activity">Live Orders</a>
          <a className="transition-colors hover:text-ink" href="#assurance">Assurance</a>
        </nav>

        <div
          className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium"
          title={`Order feed: ${STATE_LABEL[connection]}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${connection === "connected" ? "live-dot" : ""}`}
            style={{ backgroundColor: color }}
          />
          <span style={{ color }}>{STATE_LABEL[connection]}</span>
        </div>
      </div>
    </header>
  );
}
