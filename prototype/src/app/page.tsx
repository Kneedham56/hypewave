"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Footer } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { Button, LinkButton } from "@/components/ui";
import { MARKET, SESSION } from "@/lib/config";
import { dataset } from "@/lib/data";
import { longDate, money } from "@/lib/format";
import { useSession } from "@/lib/store";

const CARDS = [
  {
    title: "Two-part prices",
    body: "Each artist's price is their stats value (real monthly listeners) plus a hype premium from other players.",
  },
  {
    title: "Fair limits",
    body: `Buy up to ${MARKET.buyLimitShares.toLocaleString("en-US")} shares of any one artist. Sell whenever you want.`,
  },
  {
    title: "Then, the Reveal",
    body: `Jump to ${longDate(dataset.nowDate)}, see their real numbers, and find out if you called it.`,
  },
];

export default function Welcome() {
  const router = useRouter();
  const phase = useSession((s) => s.phase);
  const trades = useSession((s) => s.trades.length);
  const reset = useSession((s) => s.reset);

  function startFresh() {
    reset();
    router.push("/market");
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-32 size-[34rem] rounded-full bg-violet/30 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[30rem] rounded-full bg-pink/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 size-[26rem] rounded-full bg-cyan/15 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-8 pb-10">
        <Logo className="h-7" />

        <div className="flex flex-1 flex-col justify-center py-10">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-sm uppercase tracking-[.2em] text-muted">
            It&apos;s {longDate(dataset.thenDate)}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-3 max-w-2xl font-display text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl"
          >
            You&apos;ve got <span className="wave-text">{money(SESSION.startingCash, { cents: false })}</span>.
            <br />
            Find the next big thing.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-5 max-w-lg text-lg text-muted">
            Buy into artists before they blow up. When you&apos;re ready, fast-forward six months and see who you called right.
          </motion.p>

          <div className="no-scrollbar -mx-5 mt-10 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:px-0">
            {CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="w-[78%] shrink-0 snap-start rounded-[var(--radius-card)] border border-line bg-surface/80 p-5 backdrop-blur md:w-auto"
              >
                <div className="wave-text font-display text-sm font-bold">0{i + 1}</div>
                <h2 className="mt-2 font-display text-lg font-semibold">{c.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {phase === "revealed" ? (
              <>
                <Button onClick={startFresh} className="sm:w-56">
                  Play again
                </Button>
                <LinkButton href="/results" variant="secondary" className="sm:w-56">
                  See last results
                </LinkButton>
              </>
            ) : trades > 0 ? (
              <>
                <LinkButton href="/market" className="sm:w-56">
                  Continue
                </LinkButton>
                <Button onClick={startFresh} variant="secondary" className="sm:w-56">
                  Start over
                </Button>
              </>
            ) : (
              <LinkButton href="/market" className="sm:w-56">
                Start scouting
              </LinkButton>
            )}
          </div>
          {dataset.sample && (
            <p className="mt-6 text-xs text-muted">Sample build: the 50 artists and their stats are fictional placeholders.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
