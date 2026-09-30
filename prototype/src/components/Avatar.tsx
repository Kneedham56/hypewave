import { useId } from "react";
import type { TierId } from "@/lib/config";

// Generated artist art (PRD Section 11): a gradient and waveform seeded from
// the artist's id, inside a ring colored by tier. No photos.

const PALETTE = ["#7c5cff", "#22d3ee", "#ff4d8d", "#b8ff3c", "#ffb547", "#5b8cff", "#c86bff"];

export const TIER_COLOR: Record<TierId, string> = {
  arena: "#ff4d8d",
  mainstream: "#7c5cff",
  breakout: "#22d3ee",
  underground: "#b8ff3c",
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function initials(name: string): string {
  const words = name.replace(/^the\s+/i, "").split(/[\s&-]+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}

export function Avatar({
  id,
  name,
  tier,
  size = 48,
}: {
  id: string;
  name: string;
  tier: TierId;
  size?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const h = hash(id);
  const c1 = PALETTE[h % PALETTE.length];
  const c2 = PALETTE[(h >>> 3) % PALETTE.length] === c1 ? PALETTE[(h + 2) % PALETTE.length] : PALETTE[(h >>> 3) % PALETTE.length];
  const angle = (h >>> 7) % 360;
  // Waveform: 9 bars with seeded heights
  const bars = Array.from({ length: 9 }, (_, i) => 6 + ((h >>> (i * 3)) % 7) * 3.2);

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={`g${uid}`} gradientTransform={`rotate(${angle} .5 .5)`}>
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <clipPath id={`c${uid}`}>
          <circle cx="32" cy="32" r="27" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30.5" fill="none" stroke={TIER_COLOR[tier]} strokeWidth="3" />
      <g clipPath={`url(#c${uid})`}>
        <rect width="64" height="64" fill={`url(#g${uid})`} />
        <g fill="#0b0b10" opacity="0.28">
          {bars.map((b, i) => (
            <rect key={i} x={9 + i * 5.3} y={32 - b / 2} width="3" height={b} rx="1.5" />
          ))}
        </g>
      </g>
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-space-grotesk)"
        fontWeight="700"
        fontSize="17"
        fill="#0b0b10"
      >
        {initials(name)}
      </text>
    </svg>
  );
}
