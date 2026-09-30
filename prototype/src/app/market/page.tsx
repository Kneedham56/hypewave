"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArtistCard } from "@/components/ArtistCard";
import { TIER_COLOR } from "@/components/Avatar";
import { Card, PageTitle, Stat } from "@/components/ui";
import { TIERS, type TierId } from "@/lib/config";
import { artists, baseThen, dataset, genres, priorGrowth } from "@/lib/data";
import { longDate, money } from "@/lib/format";
import { multiplier, price } from "@/lib/market";
import { positions } from "@/lib/portfolio";
import { heldIds, useSession } from "@/lib/store";

const SORTS = {
  listeners: { label: "Most listeners", fn: (a: number, b: number) => b - a },
  trend: { label: "6-month trend", fn: (a: number, b: number) => b - a },
  premium: { label: "Lowest hype premium", fn: (a: number, b: number) => a - b },
  price: { label: "Lowest price", fn: (a: number, b: number) => a - b },
} as const;
type SortKey = keyof typeof SORTS;

export default function MarketPage() {
  const q = useSession((s) => s.q);
  const holdings = useSession((s) => s.holdings);
  const cash = useSession((s) => s.cash);
  const phase = useSession((s) => s.phase);
  const revealed = phase === "revealed";

  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<TierId | "all">("all");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState<SortKey>("listeners");

  const list = useMemo(() => {
    const key = (id: string) => {
      const a = artists.find((x) => x.id === id)!;
      if (sort === "listeners") return a.listenersThen;
      if (sort === "trend") return priorGrowth(a);
      if (sort === "premium") return multiplier(q[id]);
      return price(baseThen(a), q[id]);
    };
    const needle = search.trim().toLowerCase();
    return artists
      .filter((a) => tier === "all" || a.tier === tier)
      .filter((a) => genre === "all" || a.genres.includes(genre))
      .filter((a) => !needle || a.name.toLowerCase().includes(needle))
      .sort((a, b) => SORTS[sort].fn(key(a.id), key(b.id)));
  }, [search, tier, genre, sort, q]);

  const ps = positions({ holdings, q }, revealed ? "now" : "then");
  const invested = ps.reduce((s, p) => s + p.marketValue, 0);
  const owned = heldIds(holdings).length;

  return (
    <div>
      <PageTitle sub={revealed ? `Revealed: stats as of ${longDate(dataset.nowDate)}` : `Prices as of ${longDate(dataset.thenDate)}`}>
        {revealed ? "What happened" : "Market"}
      </PageTitle>

      <Card className="mb-5 flex items-center gap-6 p-4">
        <Stat label="Cash" value={money(cash, { cents: false })} />
        <Stat label="Holdings" value={money(invested, { cents: false })} sub={`${owned} artist${owned === 1 ? "" : "s"}`} />
        <Link
          href={revealed ? "/results" : "/portfolio"}
          className="wave-bg ml-auto rounded-full px-4 py-2 text-sm font-semibold text-bg"
        >
          {revealed ? "Results" : owned ? "Ready? Reveal" : "Portfolio"}
        </Link>
      </Card>

      <div className="sticky top-[5.25rem] z-10 -mx-4 mb-4 space-y-3 bg-bg/90 px-4 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artists"
          aria-label="Search artists"
          className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm outline-none placeholder:text-muted focus:border-violet"
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          <Chip active={tier === "all"} onClick={() => setTier("all")}>
            All tiers
          </Chip>
          {TIERS.map((t) => (
            <Chip key={t.id} active={tier === t.id} onClick={() => setTier(t.id)}>
              <span className="size-1.5 rounded-full" style={{ background: TIER_COLOR[t.id] }} />
              {t.label}
            </Chip>
          ))}
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            aria-label="Genre"
            className="h-9 shrink-0 rounded-full border border-line bg-surface px-3 text-sm capitalize"
          >
            <option value="all">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort"
            className="h-9 shrink-0 rounded-full border border-line bg-surface px-3 text-sm"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {list.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((a) => (
            <ArtistCard key={a.id} artist={a} q={q[a.id]} held={holdings[a.id]?.shares ?? 0} revealed={revealed} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted">No artists match those filters.</p>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition ${
        active ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
