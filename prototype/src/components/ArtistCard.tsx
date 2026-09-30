"use client";

import Link from "next/link";
import { baseNow, baseThen, priorGrowth } from "@/lib/data";
import { listeners, money } from "@/lib/format";
import { multiplier, price } from "@/lib/market";
import type { Artist } from "@/lib/types";
import { Avatar } from "./Avatar";
import { HypeChip } from "./PriceBreakdown";
import { Sparkline } from "./Sparkline";
import { Delta, TierChip } from "./ui";

export function ArtistCard({ artist, q, held, revealed }: { artist: Artist; q: number; held: number; revealed: boolean }) {
  const pThen = price(baseThen(artist), q);
  const pNow = price(baseNow(artist), q);
  const trend = revealed ? [...artist.history, artist.listenersThen, artist.listenersNow] : [...artist.history, artist.listenersThen];

  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3 transition hover:border-violet/60 hover:bg-surface-2"
    >
      <Avatar id={artist.id} name={artist.name} tier={artist.tier} size={52} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-display font-semibold">{artist.name}</h3>
          {held > 0 && <span className="rounded-full bg-cyan/15 px-1.5 text-[10px] font-semibold text-cyan">OWNED</span>}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <TierChip tier={artist.tier} />
          <span className="capitalize">{artist.genres[0]}</span>
          <span className="nums">{listeners(revealed ? artist.listenersNow : artist.listenersThen)} listeners</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="nums font-display text-lg font-semibold">{money(revealed ? pNow : pThen)}</span>
        {revealed ? (
          <Delta value={pNow / pThen - 1} className="text-xs" />
        ) : (
          <HypeChip premium={multiplier(q) - 1} />
        )}
      </div>
      <div className="hidden sm:block">
        <Sparkline
          values={trend}
          label={revealed ? "Listeners through the Reveal" : `Listeners over six months, ${priorGrowth(artist) >= 0 ? "up" : "down"}`}
        />
      </div>
    </Link>
  );
}
