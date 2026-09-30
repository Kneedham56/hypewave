"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Avatar, TIER_COLOR } from "@/components/Avatar";
import { Button, Card, LinkButton, PageTitle, Stat, TierChip } from "@/components/ui";
import { SESSION, TIERS } from "@/lib/config";
import { dataset } from "@/lib/data";
import { longDate, money, pctPlain, shares as fmtShares } from "@/lib/format";
import { positions } from "@/lib/portfolio";
import { useSession } from "@/lib/store";

export default function PortfolioPage() {
  const router = useRouter();
  const cash = useSession((s) => s.cash);
  const holdings = useSession((s) => s.holdings);
  const q = useSession((s) => s.q);
  const phase = useSession((s) => s.phase);
  const reveal = useSession((s) => s.reveal);
  const [confirming, setConfirming] = useState(false);

  const revealed = phase === "revealed";
  const ps = positions({ holdings, q }, revealed ? "now" : "then").sort((a, b) => b.marketValue - a.marketValue);
  const invested = ps.reduce((s, p) => s + p.marketValue, 0);
  const total = cash + invested;

  const byTier = TIERS.map((t) => ({
    ...t,
    value: ps.filter((p) => p.artist.tier === t.id).reduce((s, p) => s + p.marketValue, 0),
  }));

  function doReveal() {
    reveal();
    router.push("/reveal");
  }

  return (
    <div>
      <PageTitle sub={revealed ? "Valued at today's stats" : `Valued at ${longDate(dataset.thenDate)} prices`}>Portfolio</PageTitle>

      <Card className="p-5">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Total" value={money(total, { cents: false })} />
          <Stat label="Cash" value={money(cash, { cents: false })} />
          <Stat label="Holdings" value={money(invested, { cents: false })} />
        </div>
        {invested > 0 && (
          <div className="mt-5">
            <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2" role="img" aria-label="Allocation by tier">
              {byTier.map((t) => (
                <div key={t.id} style={{ width: `${(t.value / invested) * 100}%`, background: TIER_COLOR[t.id] }} />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              {byTier
                .filter((t) => t.value > 0)
                .map((t) => (
                  <span key={t.id} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: TIER_COLOR[t.id] }} />
                    {t.label} <b className="nums text-ink">{pctPlain(t.value / invested)}</b>
                  </span>
                ))}
            </div>
          </div>
        )}
      </Card>

      <h2 className="mt-6 mb-3 font-display text-lg font-semibold">Holdings</h2>
      {ps.length ? (
        <div className="space-y-2">
          {ps.map((p) => (
            <Link
              key={p.artist.id}
              href={`/artist/${p.artist.id}`}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-3 hover:border-violet/60"
            >
              <Avatar id={p.artist.id} name={p.artist.name} tier={p.artist.tier} size={44} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display font-semibold">{p.artist.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                  <TierChip tier={p.artist.tier} />
                  <span className="nums">{fmtShares(p.shares)} shares</span>
                </div>
              </div>
              <div className="text-right">
                <div className="nums font-semibold">{money(p.marketValue)}</div>
                <div className="nums text-xs text-muted">paid {money(p.costBasis)}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted">No holdings yet. Find an artist you believe in.</p>
          <LinkButton href="/market" className="mt-4">
            Browse the market
          </LinkButton>
        </Card>
      )}

      <div className="mt-8">
        {revealed ? (
          <LinkButton href="/results" className="w-full md:w-auto">
            See your results
          </LinkButton>
        ) : (
          <>
            <Button className="w-full md:w-auto" disabled={!ps.length} onClick={() => setConfirming(true)}>
              Reveal {longDate(dataset.nowDate)}
            </Button>
            <p className="mt-2 text-xs text-muted">
              The Reveal jumps six months ahead to today&apos;s real stats and locks trading. You started with{" "}
              {money(SESSION.startingCash, { cents: false })}.
            </p>
          </>
        )}
      </div>

      <AnimatePresence>
        {confirming && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Cancel" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirming(false)} />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="reveal-title"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-sm rounded-3xl border border-line bg-surface p-6 text-center"
            >
              <h2 id="reveal-title" className="font-display text-2xl font-bold">
                Lock it in?
              </h2>
              <p className="mt-2 text-sm text-muted">
                You&apos;re holding {ps.length} artist{ps.length === 1 ? "" : "s"} and {money(cash, { cents: false })} in cash.
                After the Reveal you can&apos;t trade.
              </p>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirming(false)}>
                  Not yet
                </Button>
                <Button className="flex-1" onClick={doReveal} autoFocus>
                  Reveal
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
