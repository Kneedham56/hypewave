"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MARKET } from "@/lib/config";
import { baseThen } from "@/lib/data";
import { money, pct, shares as fmtShares } from "@/lib/format";
import { buyRoom, quoteBuyByShares, quoteBuyBySpend, quoteSell, type Quote } from "@/lib/market";
import { emptyHolding, useSession } from "@/lib/store";
import type { Artist } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Button } from "./ui";

export type Side = "buy" | "sell";

export function TradeSheet({ artist, side, onClose }: { artist: Artist; side: Side | null; onClose: () => void }) {
  useEffect(() => {
    if (!side) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [side, onClose]);

  return (
    <AnimatePresence>
      {side && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${side === "buy" ? "Buy" : "Sell"} ${artist.name}`}
            className="relative w-full min-w-0 max-w-md rounded-t-3xl border border-line bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:rounded-3xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line md:hidden" />
            <TradeForm key={side} artist={artist} side={side} onDone={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TradeForm({ artist, side, onDone }: { artist: Artist; side: Side; onDone: () => void }) {
  const cash = useSession((s) => s.cash);
  const q = useSession((s) => s.q[artist.id]);
  const held = useSession((s) => s.holdings[artist.id] ?? emptyHolding);
  const buy = useSession((s) => s.buy);
  const sell = useSession((s) => s.sell);

  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Quote | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const base = baseThen(artist);
  const room = buyRoom(base, q, held.shares, held.boughtShares, cash);
  // Largest spend the limits allow, fee included
  const maxSpend = room.max > 0 ? Math.min(cash, quoteBuyByShares(base, q, room.max).cash) : 0;

  const amount = Number(input.replace(/[^0-9.]/g, "")) || 0;

  // The React Compiler memoizes this; no manual useMemo needed.
  const quote =
    amount <= 0
      ? null
      : side === "buy"
        ? quoteBuyBySpend(base, q, amount)
        : quoteSell(base, q, Math.min(amount, held.shares));

  let problem: string | null = null;
  if (side === "buy" && quote) {
    if (amount > cash + 1e-6) problem = `You have ${money(cash)} to spend.`;
    else if (quote.shares > room.max + 1e-6)
      problem =
        room.reason === "limit"
          ? `Buy limit: you can buy ${fmtShares(Math.max(0, room.byLimit))} more shares of ${artist.name}.`
          : room.reason === "stake"
            ? `Stake cap: you can hold ${fmtShares(Math.max(0, room.byStake))} more shares of ${artist.name}.`
            : `You have ${money(cash)} to spend.`;
  }
  if (side === "sell" && amount > held.shares + 1e-9) problem = `You hold ${fmtShares(held.shares)} shares.`;

  function setMax() {
    setInput(side === "buy" ? (Math.floor(maxSpend * 100) / 100).toString() : held.shares.toString());
  }

  function confirm() {
    const result = side === "buy" ? buy(artist.id, amount) : sell(artist.id, Math.min(amount, held.shares));
    if (!result.ok) return setError(result.error);
    setDone(quote);
    setTimeout(onDone, 1100);
  }

  if (done) {
    return (
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 text-center" role="status">
        <div className="wave-text font-display text-3xl font-bold">{side === "buy" ? "You're in." : "Cashed out."}</div>
        <p className="nums mt-2 text-muted">
          {side === "buy" ? "Bought" : "Sold"} {fmtShares(done.shares)} shares of {artist.name} for {money(done.cash)}
        </p>
      </motion.div>
    );
  }

  const picks = side === "buy" ? [100, 500, 1000] : [0.25, 0.5];

  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar id={artist.id} name={artist.name} tier={artist.tier} size={40} />
        <div>
          <div className="text-xs text-muted">{side === "buy" ? "Buy in" : "Cash out"}</div>
          <div className="font-display text-lg font-semibold">{artist.name}</div>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="text-xs text-muted">{side === "buy" ? "Amount (H$, fee included)" : "Shares to sell"}</span>
        <div className="mt-1 flex items-center rounded-2xl border border-line bg-bg px-4 focus-within:border-violet">
          {side === "buy" && <span className="font-display text-2xl text-muted">H$</span>}
          <input
            ref={inputRef}
            autoFocus
            inputMode="decimal"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="0"
            aria-label={side === "buy" ? "Amount in HypeCash, fee included" : "Shares to sell"}
            className="nums h-14 w-full min-w-0 bg-transparent px-1 font-display text-2xl outline-none placeholder:text-line"
          />
        </div>
      </label>

      <div className="mt-3 flex gap-2">
        {picks.map((p) => (
          <button
            key={p}
            onClick={() => setInput(side === "buy" ? String(Math.min(p, Math.floor(maxSpend * 100) / 100)) : String(held.shares * p))}
            className="nums flex-1 rounded-full border border-line py-2 text-sm hover:border-muted"
          >
            {side === "buy" ? money(p, { cents: false }) : `${p * 100}%`}
          </button>
        ))}
        <button onClick={setMax} className="flex-1 rounded-full border border-line py-2 text-sm hover:border-muted">
          {side === "buy" ? "Max" : "All"}
        </button>
      </div>

      <dl className="nums mt-5 space-y-2 text-sm">
        <Row label={side === "buy" ? "Shares you get" : "Shares sold"} value={quote ? fmtShares(quote.shares) : "—"} />
        <Row label="Average price" value={quote ? money(quote.avgPrice) : "—"} />
        <Row label={`Fee (${MARKET.feeRate * 100}%)`} value={quote ? money(quote.fee) : "—"} />
        <Row label="Your price impact" value={quote ? pct(quote.impact, 2) : "—"} />
        {side === "sell" && <Row label="You receive" value={quote ? money(quote.cash) : "—"} strong />}
        {side === "buy" && (
          <Row
            label="Buy room left after"
            value={quote ? `${fmtShares(Math.max(0, room.max - quote.shares))} shares` : `${fmtShares(room.max)} shares`}
          />
        )}
      </dl>

      {(problem || error) && (
        <p role="alert" className="mt-4 rounded-xl bg-down/10 px-3 py-2 text-sm text-down">
          {problem ?? error}
        </p>
      )}

      <Button className="mt-5 w-full" variant={side === "buy" ? "primary" : "secondary"} disabled={!quote || !!problem} onClick={confirm}>
        {side === "buy" ? "Confirm buy" : "Confirm sell"}
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted">
        {side === "buy" ? "Big orders pay a rising price as they move the curve." : "Selling is never limited."}
      </p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-semibold text-ink" : ""}>{value}</dd>
    </div>
  );
}
