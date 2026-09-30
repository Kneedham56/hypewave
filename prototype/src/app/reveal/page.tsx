"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, animate, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Delta } from "@/components/ui";
import { SESSION } from "@/lib/config";
import { dataset } from "@/lib/data";
import { listeners, longDate, money, pct } from "@/lib/format";
import { positionReturn, score, type Position } from "@/lib/portfolio";
import { useSession } from "@/lib/store";

export default function RevealPage() {
  const router = useRouter();
  const state = useSession();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (state.phase !== "revealed") router.replace("/portfolio");
  }, [state.phase, router]);

  const result = score(state);
  // Worst first, so the story ends on the best call
  const story = [...result.positions].reverse();
  const count = story.length + 2;

  const next = useCallback(() => (i < count - 1 ? setI(i + 1) : router.push("/results")), [i, count, router]);
  const prev = useCallback(() => setI(Math.max(0, i - 1)), [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (state.phase !== "revealed") return null;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg">
      <Glow />
      <div className="relative z-10 mx-auto flex w-full max-w-md gap-1 px-4 pt-4" aria-hidden>
        {Array.from({ length: count }, (_, k) => (
          <div key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <div className={`h-full bg-ink transition-all duration-300 ${k <= i ? "w-full" : "w-0"}`} />
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            className="flex flex-1 flex-col justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
          >
            {i === 0 ? (
              <Intro />
            ) : i === count - 1 ? (
              <Summary total={result.total} returnPct={result.returnPct} />
            ) : (
              <PositionCard p={story[i - 1]} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tap zones: left goes back, right goes forward */}
      <button aria-label="Previous" className="absolute inset-y-0 left-0 z-20 w-1/3" onClick={prev} />
      <button aria-label="Next" className="absolute inset-y-0 right-0 z-20 w-2/3" onClick={next} />
      <p className="relative z-10 pb-6 text-center text-xs text-muted">Tap to continue</p>
    </div>
  );
}

function Intro() {
  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-[.2em] text-muted">Fast-forward</p>
      <h1 className="wave-text mt-3 font-display text-5xl font-bold leading-tight">{longDate(dataset.nowDate)}</h1>
      <p className="mt-4 text-muted">Six months later. Here&apos;s what your picks did.</p>
    </div>
  );
}

function PositionCard({ p }: { p: Position }) {
  const r = positionReturn(p);
  const a = p.artist;
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Avatar id={a.id} name={a.name} tier={a.tier} size={112} />
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold">{a.name}</h2>
      <p className="mt-2 text-muted">{a.revealNote}</p>

      <div className="nums mt-6 flex items-center justify-center gap-3 font-display text-xl">
        <span className="text-muted">{listeners(a.listenersThen)}</span>
        <span aria-hidden>→</span>
        <CountUp from={a.listenersThen} to={a.listenersNow} format={listeners} />
        <span className="text-sm text-muted">listeners</span>
      </div>

      <div className={`nums mt-8 font-display text-6xl font-bold ${r > 0 ? "text-up" : r < 0 ? "text-down" : ""}`}>
        <CountUp from={0} to={r} format={(v) => pct(v)} />
      </div>
      <p className="nums mt-2 text-sm text-muted">
        Paid {money(p.costBasis)} · worth {money(p.cashOut)} after fees
      </p>
    </div>
  );
}

function Summary({ total, returnPct }: { total: number; returnPct: number }) {
  return (
    <div className="text-center">
      <p className="text-sm uppercase tracking-[.2em] text-muted">Your score</p>
      <div className="nums wave-text mt-3 font-display text-6xl font-bold">
        <CountUp from={SESSION.startingCash} to={total} format={(v) => money(v, { cents: false })} />
      </div>
      <div className="mt-3 text-xl">
        <Delta value={returnPct} />
      </div>
      <p className="mt-4 text-muted">From {money(SESSION.startingCash, { cents: false })}. Tap for the full breakdown.</p>
    </div>
  );
}

function CountUp({ from, to, format }: { from: number; to: number; format: (v: number) => string }) {
  const [v, setV] = useState(from);
  useEffect(() => {
    const c = animate(from, to, { duration: 1.1, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [from, to]);
  return <span>{format(v)}</span>;
}

function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-violet/25 blur-3xl" />
      <div className="absolute -bottom-48 -right-20 size-[28rem] rounded-full bg-pink/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-24 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
    </div>
  );
}
