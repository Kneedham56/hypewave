"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { ShareCard, downloadSvgAsPng } from "@/components/ShareCard";
import { Button, Card, Delta, PageTitle, Stat } from "@/components/ui";
import { SESSION } from "@/lib/config";
import { artists } from "@/lib/data";
import { listeners, money, pct } from "@/lib/format";
import { positionReturn, score } from "@/lib/portfolio";
import { heldIds, useSession } from "@/lib/store";

export default function ResultsPage() {
  const router = useRouter();
  const state = useSession();
  const cardRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);
  // Set when "Play again" resets the session, so the guard below doesn't
  // bounce the player to the portfolio on the way home.
  const leaving = useRef(false);

  useEffect(() => {
    if (state.phase !== "revealed" && !leaving.current) router.replace("/portfolio");
  }, [state.phase, router]);
  if (state.phase !== "revealed") return null;

  const result = score(state);
  const owned = new Set(heldIds(state.holdings));
  // The ones that got away: biggest real-world growth you didn't own
  const missed = artists
    .filter((a) => !owned.has(a.id))
    .sort((a, b) => b.listenersNow / b.listenersThen - a.listenersNow / a.listenersThen)
    .slice(0, 3);

  const shareText = result.best
    ? `I bought ${result.best.artist.name} at ${listeners(result.best.artist.listenersThen)} listeners on HypeWave: ${pct(positionReturn(result.best))}. Portfolio ${pct(result.returnPct)}.`
    : `My HypeWave portfolio: ${pct(result.returnPct)}.`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // Cancelled or unavailable; fall through to copy
      }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function playAgain() {
    leaving.current = true;
    state.reset();
    router.push("/");
  }

  return (
    <div>
      <PageTitle sub="Scored on cash-out value: every position sold at today's prices, after fees and price impact.">Results</PageTitle>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Final score" value={money(result.total, { cents: false })} />
              <Stat label="Return" value={<Delta value={result.returnPct} />} />
              <Stat label="Started with" value={money(SESSION.startingCash, { cents: false })} />
            </div>
          </Card>

          {result.best && (
            <div className="grid gap-4 sm:grid-cols-2">
              <CallCard title="Best call" p={result.best} />
              {result.worst && <CallCard title="Toughest call" p={result.worst} />}
            </div>
          )}

          <Card className="p-5">
            <h2 className="mb-3 font-display font-semibold">Every position</h2>
            <div className="divide-y divide-line">
              {result.positions.map((p) => (
                <Link key={p.artist.id} href={`/artist/${p.artist.id}`} className="flex items-center gap-3 py-2.5">
                  <Avatar id={p.artist.id} name={p.artist.name} tier={p.artist.tier} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{p.artist.name}</div>
                    <div className="nums text-xs text-muted">
                      {listeners(p.artist.listenersThen)} → {listeners(p.artist.listenersNow)} listeners
                    </div>
                  </div>
                  <div className="nums text-right text-sm">
                    <div>{money(p.cashOut)}</div>
                    <Delta value={positionReturn(p)} className="text-xs" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display font-semibold">The ones that got away</h2>
            <p className="mt-1 text-xs text-muted">Biggest growth you didn&apos;t own.</p>
            <div className="mt-3 space-y-2">
              {missed.map((a) => (
                <Link key={a.id} href={`/artist/${a.id}`} className="flex items-center gap-3">
                  <Avatar id={a.id} name={a.name} tier={a.tier} size={32} />
                  <span className="flex-1 truncate text-sm">{a.name}</span>
                  <span className="nums text-xs text-muted">
                    {listeners(a.listenersThen)} → {listeners(a.listenersNow)}
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px] border border-line">
            <ShareCard ref={cardRef} best={result.best} total={result.total} returnPct={result.returnPct} />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => cardRef.current && downloadSvgAsPng(cardRef.current, "hypewave-results.png")}>
              Save card
            </Button>
            <Button variant="secondary" className="flex-1" onClick={share}>
              {copied ? "Copied" : "Share"}
            </Button>
          </div>
          <Button className="w-full" onClick={playAgain}>
            Play again
          </Button>
        </div>
      </div>
    </div>
  );
}

function CallCard({ title, p }: { title: string; p: ReturnType<typeof score>["positions"][number] }) {
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-wide text-muted">{title}</div>
      <div className="mt-3 flex items-center gap-3">
        <Avatar id={p.artist.id} name={p.artist.name} tier={p.artist.tier} size={48} />
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-semibold">{p.artist.name}</div>
          <Delta value={positionReturn(p)} />
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">{p.artist.revealNote}</p>
    </Card>
  );
}
