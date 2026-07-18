import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { PhoneRender } from "./PhoneRender";

const STATS = [
  { icon: BadgeCheck, label: "70-point inspection", note: "Every device certified" },
  { icon: ShieldCheck, label: "12-month warranty", note: "Backed in writing" },
  { icon: Truck, label: "Free delivery", note: "Anywhere in SA" },
];

export function Hero() {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-16 md:grid-cols-2 md:pt-24">
      <div className="animate-rise">
        <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          Certified pre-owned
        </span>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
          The iPhone,
          <br />
          <span className="aura-text">elevated.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
          Premium second-hand iPhones, inspected and graded by hand. The icon you
          want, at a price that finally makes sense.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <a
            href="#shop"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-night transition-transform hover:-translate-y-0.5"
          >
            Browse the collection
          </a>
          <a href="#assurance" className="text-sm font-medium text-muted transition-colors hover:text-ink">
            How we grade →
          </a>
        </div>

        <dl className="mt-12 grid grid-cols-3 gap-4">
          {STATS.map(({ icon: Icon, label, note }) => (
            <div key={label} className="rounded-2xl border border-line p-4">
              <Icon className="h-5 w-5 text-mint" strokeWidth={1.5} />
              <dt className="mt-3 text-sm font-semibold">{label}</dt>
              <dd className="text-xs text-faint">{note}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative flex justify-center">
        <div
          className="absolute h-[460px] w-[460px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(110,168,254,0.28), transparent 65%)" }}
          aria-hidden
        />
        <PhoneRender
          finish={{ name: "Natural Titanium", hex: "#b8afa3", screenTint: "#8a8170" }}
          className="relative h-[460px] w-auto animate-float drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
        />
      </div>
    </section>
  );
}
