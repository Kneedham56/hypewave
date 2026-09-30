import { money, pctPlain } from "@/lib/format";

/** Stacked bar: how much of the price is stats and how much is hype. */
export function PriceBreakdown({ base, multiplier }: { base: number; multiplier: number }) {
  const statsShare = 1 / multiplier;
  const premium = multiplier - 1;
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`Stats value ${money(base)}, hype premium ${pctPlain(premium)}`}>
        <div className="bg-violet" style={{ width: `${statsShare * 100}%` }} />
        <div className="bg-pink" style={{ width: `${(1 - statsShare) * 100}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted">
          <span className="size-2 rounded-full bg-violet" /> Stats value <b className="nums text-ink">{money(base)}</b>
        </span>
        <span className="flex items-center gap-1.5 text-muted">
          <span className="size-2 rounded-full bg-pink" /> Hype premium <b className="nums text-ink">+{pctPlain(premium, 1)}</b>
        </span>
      </div>
    </div>
  );
}

/** Small pill used on cards. */
export function HypeChip({ premium }: { premium: number }) {
  const hot = premium >= 0.2;
  return (
    <span
      className={`nums rounded-full px-2 py-0.5 text-[11px] font-medium ${hot ? "bg-pink/15 text-pink" : "bg-surface-2 text-muted"}`}
      title="How far players have priced this artist above their stats"
    >
      +{pctPlain(premium)} hype
    </span>
  );
}
