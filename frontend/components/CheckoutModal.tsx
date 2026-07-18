"use client";

import { useState } from "react";
import { X, Minus, Plus, Loader2, CheckCircle2, Radio } from "lucide-react";
import { Finish, IPhone } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "@/lib/api";
import { ProductImage } from "./ProductImage";

type Status = "idle" | "loading" | "success" | "error";

export function CheckoutModal({
  phone,
  finish,
  onClose,
}: {
  phone: IPhone;
  finish: Finish;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const total = phone.price * quantity;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const response = await placeOrder({
        customerName: name.trim(),
        product: `${phone.name} · ${finish.name}`,
        quantity,
        amount: total,
      });
      setOrderId(response.orderId);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Could not reach the order service. Is the backend running on port 8080?");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={() => status !== "loading" && onClose()}
    >
      <div
        className="animate-rise glass relative w-full max-w-md overflow-hidden rounded-t-3xl border-line sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <CheckCircle2 className="h-14 w-14 text-mint" strokeWidth={1.5} />
            <h3 className="mt-5 font-display text-2xl font-bold">Order placed</h3>
            <p className="mt-2 text-sm text-muted">
              We&apos;ve published your order to the pipeline.
            </p>
            <code className="mt-4 rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-faint">
              {orderId}
            </code>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-muted">
              <Radio className="h-4 w-4 text-mint" />
              Watch it land in <span className="text-ink">Live Orders</span> below.
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-semibold text-night"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex gap-4">
              <div className="relative grid h-28 w-20 shrink-0 place-items-center rounded-2xl bg-surface-2">
                <div
                  className="absolute h-20 w-20 rounded-full blur-xl"
                  style={{ background: `radial-gradient(circle, ${finish.hex}55, transparent 70%)` }}
                  aria-hidden
                />
                <ProductImage phone={phone} finish={finish} className="relative h-24 w-auto" />
              </div>
              <div className="pt-1">
                <h3 className="font-display text-lg font-bold leading-tight">{phone.name}</h3>
                <p className="mt-1 text-sm text-muted">{finish.name}</p>
                <p className="mt-1 text-xs text-faint">{phone.storage} · {phone.condition}</p>
              </div>
            </div>

            <label className="mt-6 block text-sm font-medium">
              Your name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanele Dlamini"
                autoFocus
                className="mt-2 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm outline-none transition-colors focus:border-line-strong"
              />
            </label>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid h-7 w-7 place-items-center rounded-full text-muted hover:text-ink"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                  className="grid h-7 w-7 place-items-center rounded-full text-muted hover:text-ink"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
              <span className="text-sm text-muted">Total</span>
              <span className="font-display text-2xl font-bold">{formatPrice(total)}</span>
            </div>

            {status === "error" && (
              <p className="mt-4 rounded-xl border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 px-4 py-3 text-xs text-[#ff9a9a]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !name.trim()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-night transition-opacity disabled:opacity-40"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                </>
              ) : (
                <>Place order · {formatPrice(total)}</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
