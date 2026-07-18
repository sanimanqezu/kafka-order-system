"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Assurance } from "@/components/Assurance";
import { LiveOrderFeed } from "@/components/LiveOrderFeed";
import { Footer } from "@/components/Footer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { connectOrderFeed, disconnectOrderFeed } from "@/lib/websocket";
import { ConnectionState, Finish, IPhone, OrderStatusUpdate } from "@/lib/types";

export default function Home() {
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [orders, setOrders] = useState<OrderStatusUpdate[]>([]);
  const [selection, setSelection] = useState<{ phone: IPhone; finish: Finish } | null>(null);

  useEffect(() => {
    connectOrderFeed(
      (update) => setOrders((prev) => [update, ...prev].slice(0, 30)),
      setConnection,
    );
    return () => disconnectOrderFeed();
  }, []);

  return (
    <>
      <Navbar connection={connection} />
      <main className="flex-1">
        <Hero />
        <ProductGrid onBuy={(phone, finish) => setSelection({ phone, finish })} />
        <Assurance />
        <LiveOrderFeed orders={orders} connection={connection} />
      </main>
      <Footer />
      {selection && (
        <CheckoutModal
          phone={selection.phone}
          finish={selection.finish}
          onClose={() => setSelection(null)}
        />
      )}
    </>
  );
}
