"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SESSION } from "./config";
import { artists, baseThen, getArtist } from "./data";
import { buyRoom, quoteBuyBySpend, quoteSell, sharesForPremium } from "./market";
import type { Holding, Trade } from "./types";

export type Phase = "trading" | "revealed";

export interface SessionState {
  sessionId: string;
  startedAt: number;
  phase: Phase;
  revealedAt: number | null;
  cash: number;
  /** Shares outstanding per artist, starting premium included */
  q: Record<string, number>;
  holdings: Record<string, Holding>;
  trades: Trade[];
}

interface Actions {
  buy: (artistId: string, spend: number) => TradeResult;
  sell: (artistId: string, shares: number) => TradeResult;
  reveal: () => void;
  reset: () => void;
}

export type TradeResult = { ok: true; trade: Trade } | { ok: false; error: string };

// Shares below this are treated as zero, so "Sell all" never leaves dust
const DUST = 1e-9;

function freshSession(): SessionState {
  return {
    sessionId: crypto.randomUUID(),
    startedAt: Date.now(),
    phase: "trading",
    revealedAt: null,
    cash: SESSION.startingCash,
    q: Object.fromEntries(artists.map((a) => [a.id, sharesForPremium(a.startPremium)])),
    holdings: {},
    trades: [],
  };
}

export const emptyHolding: Holding = { shares: 0, costBasis: 0, boughtShares: 0 };

export const useSession = create<SessionState & Actions>()(
  persist(
    (set, get) => ({
      ...freshSession(),

      buy(artistId, spend) {
        const s = get();
        const artist = getArtist(artistId);
        if (s.phase !== "trading") return { ok: false, error: "Trading is closed after the Reveal." };
        if (!artist) return { ok: false, error: "Unknown artist." };
        if (!(spend > 0)) return { ok: false, error: "Enter an amount to buy." };
        if (spend > s.cash + 1e-6) return { ok: false, error: "Not enough HypeCash." };

        const base = baseThen(artist);
        const q = s.q[artistId];
        const held = s.holdings[artistId] ?? emptyHolding;
        const quote = quoteBuyBySpend(base, q, Math.min(spend, s.cash));
        const room = buyRoom(base, q, held.shares, held.boughtShares, s.cash);
        if (quote.shares > room.max + 1e-6) {
          return {
            ok: false,
            error:
              room.reason === "limit"
                ? "That's past your buy limit for this artist."
                : "That's past your stake cap for this artist.",
          };
        }

        const trade: Trade = {
          artistId,
          side: "buy",
          shares: quote.shares,
          avgPrice: quote.avgPrice,
          fee: quote.fee,
          cash: quote.cash,
          at: Date.now(),
        };
        set({
          cash: Math.max(0, s.cash - quote.cash),
          q: { ...s.q, [artistId]: q + quote.shares },
          holdings: {
            ...s.holdings,
            [artistId]: {
              shares: held.shares + quote.shares,
              costBasis: held.costBasis + quote.cash,
              boughtShares: held.boughtShares + quote.shares,
            },
          },
          trades: [...s.trades, trade],
        });
        return { ok: true, trade };
      },

      sell(artistId, shares) {
        const s = get();
        const artist = getArtist(artistId);
        const held = s.holdings[artistId] ?? emptyHolding;
        if (s.phase !== "trading") return { ok: false, error: "Trading is closed after the Reveal." };
        if (!artist) return { ok: false, error: "Unknown artist." };
        if (!(shares > 0)) return { ok: false, error: "Enter shares to sell." };
        // Selling is never limited; only clamp to what the player holds.
        const n = Math.min(shares, held.shares);
        if (n <= DUST) return { ok: false, error: "You don't hold any shares." };

        const q = s.q[artistId];
        const quote = quoteSell(baseThen(artist), q, n);
        const left = held.shares - n <= DUST ? 0 : held.shares - n;
        const trade: Trade = {
          artistId,
          side: "sell",
          shares: n,
          avgPrice: quote.avgPrice,
          fee: quote.fee,
          cash: quote.cash,
          at: Date.now(),
        };
        set({
          cash: s.cash + quote.cash,
          q: { ...s.q, [artistId]: q - n },
          holdings: {
            ...s.holdings,
            [artistId]: {
              shares: left,
              costBasis: left === 0 ? 0 : held.costBasis * (left / held.shares),
              // Gross buys stay counted: selling does not restore buy room.
              boughtShares: held.boughtShares,
            },
          },
          trades: [...s.trades, trade],
        });
        return { ok: true, trade };
      },

      reveal() {
        if (get().phase === "trading") set({ phase: "revealed", revealedAt: Date.now() });
      },

      reset() {
        set(freshSession());
      },
    }),
    {
      name: "hypewave-session",
      // One session per tab: a reload keeps it, a new tab starts fresh.
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: (s): SessionState => ({
        sessionId: s.sessionId,
        startedAt: s.startedAt,
        phase: s.phase,
        revealedAt: s.revealedAt,
        cash: s.cash,
        q: s.q,
        holdings: s.holdings,
        trades: s.trades,
      }),
    },
  ),
);

/** Held positions, largest first by shares. */
export function heldIds(holdings: Record<string, Holding>): string[] {
  return Object.entries(holdings)
    .filter(([, h]) => h.shares > DUST)
    .map(([id]) => id);
}
