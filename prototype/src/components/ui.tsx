import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { TIER_COLOR } from "./Avatar";
import type { TierId } from "@/lib/config";
import { tierLabel } from "@/lib/data";
import { pct } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT: Record<Variant, string> = {
  primary: "wave-bg text-bg font-semibold shadow-[0_0_24px_-6px_rgba(124,92,255,.7)]",
  secondary: "bg-surface-2 text-ink border border-line hover:border-muted/60",
  ghost: "text-muted hover:text-ink",
  danger: "bg-down text-bg font-semibold",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 h-12 text-[15px] transition active:scale-[.98] disabled:opacity-40 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${VARIANT[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${VARIANT[variant]} ${className}`} {...props} />;
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[var(--radius-card)] border border-line bg-surface ${className}`}>{children}</div>;
}

export function TierChip({ tier }: { tier: TierId }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[11px] text-muted"
      title="Size band by monthly listeners"
    >
      <span className="size-1.5 rounded-full" style={{ background: TIER_COLOR[tier] }} />
      {tierLabel(tier)}
    </span>
  );
}

/** Change with an arrow and sign, never color alone (PRD accessibility rule). */
export function Delta({ value, className = "" }: { value: number; className?: string }) {
  const up = value > 0.0005;
  const down = value < -0.0005;
  return (
    <span className={`nums inline-flex items-center gap-0.5 ${up ? "text-up" : down ? "text-down" : "text-muted"} ${className}`}>
      <span aria-hidden>{up ? "▲" : down ? "▼" : "•"}</span>
      {pct(value)}
    </span>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className="nums mt-0.5 font-display text-lg font-semibold">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4">
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{children}</h1>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}
