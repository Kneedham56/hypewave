"use client";

import Link from "next/link";
import { useState } from "react";
import { baseNow, baseThen, dataset, getArtist, priorGrowth } from "@/lib/data";
import { listeners, longDate, money, pct, shares as fmtShares } from "@/lib/format";
import { cashOutValue, multiplier, price } from "@/lib/market";
import { emptyHolding, useSession } from "@/lib/store";
import { Avatar } from "./Avatar";
import { PriceBreakdown } from "./PriceBreakdown";
import { RoomToBuy } from "./RoomToBuy";
import { Sparkline } from "./Sparkline";
import { TradeSheet, type Side } from "./TradeSheet";
import { Button, Card, Delta, Stat, TierChip } from "./ui";

export function ArtistView({ id }: { id: string }) {
  const artist = getArtist(id)!;
  const q = useSession((s) => s.q[id]);
  const held = useSession((s) => s.holdings[id] ?? emptyHolding);
  const phase = useSession((s) => s.phase);
  const [side, setSide] = useState<Side | null>(null);

  const revealed = phase === "revealed";
  const bThen = baseThen(artist);
  const bNow = baseNow(artist);
  const base = revealed ? bNow : bThen;
  const h = multiplier(q);
  const p = price(base, q);
  const growth = priorGrowth(artist);

  return (
    <div className="pb-20 md:pb-0">
      <Link href="/market" className="text-sm text-muted hover:text-ink">
        ← Market
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <Avatar id={artist.id} name={artist.name} tier={artist.tier} size={84} />
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold tracking-tight">{artist.name}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <TierChip tier={artist.tier} />
            <span className="capitalize">{artist.genres.join(", ")}</span>
            {dataset.sample && <span className="text-[11px]">· sample artist</span>}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs text-muted">{revealed ? `Price on ${longDate(dataset.nowDate)}` : "Price per share"}</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="nums font-display text-4xl font-bold">{money(p)}</span>
              {revealed && <Delta value={bNow / bThen - 1} />}
            </div>
            {revealed && <div className="nums mt-1 text-sm text-muted">Was {money(price(bThen, q))} on {longDate(dataset.thenDate)}</div>}
            <div className="mt-5">
              <PriceBreakdown base={base} multiplier={h} />
            </div>
          </Card>

          {revealed && (
            <Card className="border-violet/50 p-5">
              <div className="text-xs uppercase tracking-wide text-muted">What happened</div>
              <p className="mt-1 font-display text-lg">{artist.revealNote}</p>
              <div className="nums mt-3 flex items-center gap-2 text-sm">
                {listeners(artist.listenersThen)} → <b>{listeners(artist.listenersNow)}</b> monthly listeners
                <Delta value={artist.listenersNow / artist.listenersThen - 1} />
              </div>
            </Card>
          )}

          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <Stat
                label="Monthly listeners"
                value={listeners(artist.listenersThen)}
                sub={<>as of {longDate(dataset.thenDate)}</>}
              />
              <div className="text-right">
                <Sparkline values={[...artist.history, artist.listenersThen]} width={140} height={44} label="Monthly listeners over the last six months" />
                <div className="mt-1 text-xs text-muted">
                  6 months <Delta value={growth} />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
              <Stat label="Holders" value={artist.holders.toLocaleString("en-US")} />
              <Stat label="Shares out" value={fmtShares(Math.round(q))} />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted">Your position</div>
            {held.shares > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-4">
                <Stat label="Shares" value={fmtShares(held.shares)} />
                <Stat label="Paid" value={money(held.costBasis)} />
                <Stat label="Market value" value={money(held.shares * p)} />
                <Stat
                  label="Cash-out value"
                  value={money(cashOutValue(base, q, held.shares))}
                  sub={<>{pct(cashOutValue(base, q, held.shares) / held.costBasis - 1)} after fees</>}
                />
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">You don&apos;t own {artist.name} yet.</p>
            )}
          </Card>

          {!revealed && (
            <Card className="p-5">
              <RoomToBuy q={q} held={held.shares} bought={held.boughtShares} />
            </Card>
          )}

          <Card className="p-5 text-sm leading-relaxed text-muted">
            <div className="mb-1 text-xs uppercase tracking-wide">What moves this price</div>
            <p>
              <b className="text-ink">Stats value</b> follows {artist.name}&apos;s real audience. It only changes when their
              listener count does.
            </p>
            <p className="mt-2">
              <b className="text-ink">Hype premium</b> is how far players have bid them up. It rises when people buy and falls
              when they sell.
            </p>
          </Card>
        </div>
      </div>

      {!revealed ? (
        <div className="fixed inset-x-0 bottom-[68px] z-20 border-t border-line/60 bg-bg/90 px-4 py-3 backdrop-blur md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
          <div className="mx-auto flex max-w-5xl gap-3 md:max-w-sm">
            <Button className="flex-1" onClick={() => setSide("buy")}>
              Buy in
            </Button>
            <Button className="flex-1" variant="secondary" disabled={held.shares <= 0} onClick={() => setSide("sell")}>
              Cash out
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Trading closed at the Reveal. Start a new session to play again.</p>
      )}

      <TradeSheet artist={artist} side={side} onClose={() => setSide(null)} />
    </div>
  );
}
