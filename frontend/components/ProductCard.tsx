"use client";

import { useState } from "react";
import { Cpu, BatteryMedium } from "lucide-react";
import { Finish, IPhone } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";

const CONDITION_COLOR: Record<string, string> = {
  Pristine: "#7df9d0",
  Excellent: "#6ea8fe",
  Good: "#e7c79a",
};

export function ProductCard({
  phone,
  index,
  onBuy,
}: {
  phone: IPhone;
  index: number;
  onBuy: (phone: IPhone, finish: Finish) => void;
}) {
  const [finish, setFinish] = useState<Finish>(phone.finishes[0]);
  const conditionColor = CONDITION_COLOR[phone.condition];

  return (
    <article
      className="group animate-rise relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ color: conditionColor, backgroundColor: `${conditionColor}1a` }}
        >
          {phone.condition}
        </span>
        <span className="text-xs text-faint">{phone.releaseYear}</span>
      </div>

      <div className="relative my-2 flex h-56 items-center justify-center">
        <div
          className="absolute h-44 w-44 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle, ${finish.hex}66, transparent 70%)`, opacity: 0.55 }}
          aria-hidden
        />
        <ProductImage phone={phone} finish={finish} className="relative h-56 w-auto" />
      </div>

      <h3 className="font-display text-lg font-bold tracking-tight">{phone.name}</h3>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
        <span className="inline-flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5" strokeWidth={1.5} /> {phone.chip}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BatteryMedium className="h-3.5 w-3.5" strokeWidth={1.5} /> {phone.batteryHealth}% health
        </span>
      </div>
      <p className="mt-1 text-xs text-faint">{phone.display} · {phone.storage}</p>

      <div className="mt-4 flex items-center gap-2">
        {phone.finishes.map((f) => (
          <button
            key={f.name}
            onClick={() => setFinish(f)}
            title={f.name}
            aria-label={f.name}
            className={`h-5 w-5 rounded-full border border-line-strong transition-transform hover:scale-110 ${
              finish.name === f.name ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : ""
            }`}
            style={{ backgroundColor: f.hex }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-faint">From</p>
          <p className="font-display text-xl font-bold">{formatPrice(phone.price)}</p>
        </div>
        <button
          onClick={() => onBuy(phone, finish)}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-night transition-transform hover:-translate-y-0.5"
        >
          Buy
        </button>
      </div>
    </article>
  );
}
