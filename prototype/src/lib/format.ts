import { SESSION } from "./config";

const c = SESSION.currency;

/** H$ amount. Prices under 1,000 get cents; bigger amounts are whole. */
export function money(n: number, opts: { cents?: boolean } = {}): string {
  const cents = opts.cents ?? Math.abs(n) < 1_000;
  const s = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
  return `${n < 0 ? "-" : ""}${c}${s}`;
}

/** Signed percent: +3.2%, -12%. */
export function pct(n: number, digits = 1): string {
  const v = n * 100;
  const shown = Math.abs(v) >= 100 ? Math.round(v).toString() : v.toFixed(digits);
  return `${v > 0 ? "+" : ""}${shown}%`;
}

/** Unsigned percent for premiums and shares of a whole. */
export function pctPlain(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

/** 1.2M, 450K, 88.3M */
export function listeners(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e8 ? 0 : 1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return n.toString();
}

export function shares(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: n < 100 ? 2 : 1 });
}

export function longDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
