import { ScanLine, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

const ITEMS = [
  {
    icon: ScanLine,
    title: "Graded by hand",
    body: "Every iPhone passes a 70-point inspection. Battery health and condition are listed honestly — no surprises.",
  },
  {
    icon: ShieldCheck,
    title: "12-month warranty",
    body: "Each device is covered for a full year. If something fails, we repair or replace it.",
  },
  {
    icon: CreditCard,
    title: "Secure checkout",
    body: "Card payments via PayFast are coming next — protected, local, and built for South Africa.",
  },
  {
    icon: RotateCcw,
    title: "7-day returns",
    body: "Changed your mind? Send it back within a week for a full refund, no questions asked.",
  },
];

export function Assurance() {
  return (
    <section id="assurance" className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="font-display text-3xl font-bold tracking-tight">Bought with confidence</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-3xl border border-line bg-surface/40 p-6">
            <Icon className="h-6 w-6 text-mint" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
