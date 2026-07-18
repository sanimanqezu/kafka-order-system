"use client";

import { useState } from "react";
import { LINES, LineFilter, PRODUCTS } from "@/lib/products";
import { Finish, IPhone } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ onBuy }: { onBuy: (phone: IPhone, finish: Finish) => void }) {
  const [filter, setFilter] = useState<LineFilter>("All");
  const items = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.line === filter);

  return (
    <section id="shop" className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">The collection</h2>
          <p className="mt-2 text-muted">{items.length} certified devices ready to ship.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LINES.map((line) => (
            <button
              key={line}
              onClick={() => setFilter(line)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === line
                  ? "border-transparent bg-ink text-night"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {line}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((phone, index) => (
          <ProductCard key={phone.id} phone={phone} index={index} onBuy={onBuy} />
        ))}
      </div>
    </section>
  );
}
