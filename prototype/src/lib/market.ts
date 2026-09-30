// Pure market math from PRD Section 6. No state, no UI: every screen and the
// score call into these functions, so the numbers can never disagree.
//
//   Price       P = B * H
//   Base value  B = k * R^alpha          (R = monthly listeners)
//   Multiplier  H = e^(q / D)            (q = shares outstanding)
//   Curve cost  cost(q1 -> q2) = B * D * (e^(q2/D) - e^(q1/D))

import { MARKET } from "./config";

const { k, alpha, depth: D, feeRate } = MARKET;

export function baseValue(listeners: number): number {
  return k * Math.pow(listeners, alpha);
}

export function multiplier(q: number): number {
  return Math.exp(q / D);
}

export function price(base: number, q: number): number {
  return base * multiplier(q);
}

/** Hype premium as a fraction: 0.18 means priced 18% above stats. */
export function premium(q: number): number {
  return multiplier(q) - 1;
}

/** Shares outstanding that produce a given starting premium. */
export function sharesForPremium(p: number): number {
  return D * Math.log(1 + p);
}

/** What the curve charges to move shares outstanding from q1 up to q2. */
export function curveCost(base: number, q1: number, q2: number): number {
  return base * D * (multiplier(q2) - multiplier(q1));
}

/** Shares a curve spend buys, starting from q shares outstanding. */
export function sharesForCurveSpend(base: number, q: number, spend: number): number {
  if (spend <= 0) return 0;
  return D * Math.log(multiplier(q) + spend / (base * D)) - q;
}

export interface Quote {
  shares: number;
  /** Order value before the fee (what moves along the curve) */
  gross: number;
  fee: number;
  /** Cash out of the wallet (buy) or into it (sell) */
  cash: number;
  avgPrice: number;
  priceBefore: number;
  priceAfter: number;
  /** Relative price move caused by this order */
  impact: number;
}

/** Buy by spending `cash` H$, fee included. */
export function quoteBuyBySpend(base: number, q: number, cash: number): Quote {
  const fee = cash * feeRate;
  const gross = cash - fee;
  const shares = sharesForCurveSpend(base, q, gross);
  return buildQuote(base, q, q + shares, shares, gross, fee, cash);
}

/** Buy an exact number of shares. */
export function quoteBuyByShares(base: number, q: number, shares: number): Quote {
  const gross = curveCost(base, q, q + shares);
  const cash = gross / (1 - feeRate);
  return buildQuote(base, q, q + shares, shares, gross, cash - gross, cash);
}

/** Sell `shares`, walking the curve back down. */
export function quoteSell(base: number, q: number, shares: number): Quote {
  const gross = curveCost(base, q - shares, q);
  const fee = gross * feeRate;
  return buildQuote(base, q, q - shares, shares, gross, fee, gross - fee);
}

function buildQuote(
  base: number,
  qBefore: number,
  qAfter: number,
  shares: number,
  gross: number,
  fee: number,
  cash: number,
): Quote {
  const priceBefore = price(base, qBefore);
  const priceAfter = price(base, qAfter);
  return {
    shares,
    gross,
    fee,
    cash,
    avgPrice: shares > 0 ? gross / shares : priceBefore,
    priceBefore,
    priceAfter,
    impact: priceAfter / priceBefore - 1,
  };
}

/** Largest stake one account may hold, given shares outstanding. */
export function stakeCap(q: number): number {
  return Math.max(MARKET.stakeCapFloor, MARKET.stakeCapPct * q);
}

export interface BuyRoom {
  /** Shares still allowed under the stake cap */
  byStake: number;
  /** Shares still allowed under the buy limit */
  byLimit: number;
  /** Shares the player's cash can pay for */
  byCash: number;
  /** The binding maximum */
  max: number;
  reason: "stake" | "limit" | "cash";
}

export function buyRoom(
  base: number,
  q: number,
  held: number,
  bought: number,
  cash: number,
): BuyRoom {
  // Stake cap after buying d shares: held + d <= max(floor, pct * (q + d)).
  const pct = MARKET.stakeCapPct;
  const byStake = Math.max(
    0,
    MARKET.stakeCapFloor - held,
    (pct * q - held) / (1 - pct),
  );
  const byLimit = Math.max(0, MARKET.buyLimitShares - bought);
  const byCash = sharesForCurveSpend(base, q, cash * (1 - feeRate));
  const max = Math.min(byStake, byLimit, byCash);
  const reason = max === byCash ? "cash" : max === byLimit ? "limit" : "stake";
  return { byStake, byLimit, byCash, max, reason };
}

/** What a position returns if sold now, after price impact and fees. */
export function cashOutValue(base: number, q: number, shares: number): number {
  if (shares <= 0) return 0;
  return quoteSell(base, q, shares).cash;
}
