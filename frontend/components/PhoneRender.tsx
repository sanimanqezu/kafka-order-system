import { Finish } from "@/lib/types";

function shade(hex: string, percent: number): string {
  const n = parseInt(hex.slice(1), 16);
  const adjust = (c: number) => Math.round(Math.min(255, Math.max(0, c + (percent / 100) * 255)));
  const r = adjust((n >> 16) & 0xff);
  const g = adjust((n >> 8) & 0xff);
  const b = adjust(n & 0xff);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function PhoneRender({ finish, className }: { finish: Finish; className?: string }) {
  const uid = finish.name.replace(/[^a-z0-9]/gi, "");
  const light = shade(finish.hex, 16);
  const dark = shade(finish.hex, -24);

  return (
    <svg viewBox="0 0 260 540" className={className} role="img" aria-label={`${finish.name} iPhone`}>
      <defs>
        <linearGradient id={`frame-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="48%" stopColor={finish.hex} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`aura-${uid}`} cx="32%" cy="22%" r="85%">
          <stop offset="0%" stopColor={finish.screenTint} stopOpacity="0.85" />
          <stop offset="55%" stopColor={finish.screenTint} stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Titanium frame */}
      <rect x="30" y="18" width="200" height="504" rx="46" fill={`url(#frame-${uid})`} />
      {/* Inner bezel */}
      <rect x="39" y="27" width="182" height="486" rx="38" fill="#080809" />
      {/* Screen */}
      <rect x="46" y="34" width="168" height="472" rx="31" fill="#0a0a0e" />
      <rect x="46" y="34" width="168" height="472" rx="31" fill={`url(#aura-${uid})`} />
      {/* Glass gloss */}
      <rect x="46" y="34" width="168" height="472" rx="31" fill={`url(#gloss-${uid})`} />
      {/* Dynamic Island */}
      <rect x="106" y="48" width="48" height="14" rx="7" fill="#000000" />
      <circle cx="146" cy="55" r="3" fill="#101216" />
      {/* Side buttons */}
      <rect x="26" y="120" width="4" height="34" rx="2" fill={dark} />
      <rect x="26" y="170" width="4" height="54" rx="2" fill={dark} />
      <rect x="230" y="150" width="4" height="70" rx="2" fill={dark} />
    </svg>
  );
}
