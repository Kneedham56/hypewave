import { SESSION } from "./config";
import { baseNow, baseThen, getArtist } from "./data";
import { cashOutValue, price } from "./market";
import type { SessionState } from "./store";
import { heldIds } from "./store";
import type { Artist } from "./types";

export interface Position {
  artist: Artist;
  shares: number;
  costBasis: number;
  /** shares x current price: what the portfolio screen shows */
  marketValue: number;
  /** What selling everything would actually return, after impact and fees */
  cashOut: number;
  priceNow: number;
}

type Snapshot = Pick<SessionState, "holdings" | "q">;

/** Positions valued at Then prices (while trading) or Now prices (after the Reveal). */
export function positions(s: Snapshot, at: "then" | "now"): Position[] {
  return heldIds(s.holdings).flatMap((id) => {
    const artist = getArtist(id);
    if (!artist) return [];
    const h = s.holdings[id];
    const base = at === "then" ? baseThen(artist) : baseNow(artist);
    const p = price(base, s.q[id]);
    return [
      {
        artist,
        shares: h.shares,
        costBasis: h.costBasis,
        marketValue: h.shares * p,
        cashOut: cashOutValue(base, s.q[id], h.shares),
        priceNow: p,
      },
    ];
  });
}

export interface Score {
  total: number;
  returnPct: number;
  positions: Position[];
  best: Position | null;
  worst: Position | null;
}

/**
 * The Reveal score (PRD Section 12, rule 7): cash plus the cash-out value of
 * every position at Now prices. Using cash-out value, not market value, means
 * pumping a thin artist yourself can't inflate your score.
 */
export function score(s: Snapshot & Pick<SessionState, "cash">): Score {
  const ps = positions(s, "now");
  const total = s.cash + ps.reduce((sum, p) => sum + p.cashOut, 0);
  const ret = (p: Position) => p.cashOut / p.costBasis - 1;
  const sorted = [...ps].sort((a, b) => ret(b) - ret(a));
  return {
    total,
    returnPct: total / SESSION.startingCash - 1,
    positions: sorted,
    best: sorted[0] ?? null,
    worst: sorted.length > 1 ? sorted[sorted.length - 1] : null,
  };
}

export function positionReturn(p: Position): number {
  return p.costBasis > 0 ? p.cashOut / p.costBasis - 1 : 0;
}
