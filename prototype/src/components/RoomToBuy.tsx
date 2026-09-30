import { MARKET } from "@/lib/config";
import { shares as fmtShares } from "@/lib/format";
import { stakeCap } from "@/lib/market";

/** Remaining buy limit and stake cap for one artist (PRD Section 8). */
export function RoomToBuy({ q, held, bought }: { q: number; held: number; bought: number }) {
  const cap = stakeCap(q);
  return (
    <div className="space-y-3">
      <Meter
        label="Buy limit"
        help="Max shares you can buy of one artist per 30 days. Selling doesn't give room back."
        used={bought}
        total={MARKET.buyLimitShares}
      />
      <Meter
        label="Stake cap"
        help="Max shares of one artist any account can hold."
        used={held}
        total={cap}
      />
    </div>
  );
}

function Meter({ label, help, used, total }: { label: string; help: string; used: number; total: number }) {
  const frac = Math.min(1, used / total);
  const left = Math.max(0, total - used);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted" title={help}>
          {label}
        </span>
        <span className="nums">
          <b>{fmtShares(left)}</b> <span className="text-muted">of {fmtShares(total)} shares left</span>
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${frac >= 1 ? "bg-down" : "bg-cyan"}`} style={{ width: `${frac * 100}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-muted">{help}</p>
    </div>
  );
}
