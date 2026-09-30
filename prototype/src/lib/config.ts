// Every tunable number in the market lives here. Defaults come from the PRD,
// Section 19 ("Default parameters"). Change them here, nowhere else.

export const MARKET = {
  /** Base value constant: B = k * R^alpha */
  k: 0.01,
  /** Stats exponent: square root by default */
  alpha: 0.5,
  /** Depth D in shares, the same for every artist: H = e^(q / D) */
  depth: 25_000,
  /** Fee charged on the value of every buy and every sell */
  feeRate: 0.01,
  /** Stake cap: the greater of this share of shares outstanding... */
  stakeCapPct: 0.05,
  /** ...or this many shares */
  stakeCapFloor: 2_500,
  /** Max shares one account may buy of one artist per rolling 30 days (one session here) */
  buyLimitShares: 1_250,
  /** Starting premium can't exceed this */
  maxStartPremium: 0.4,
} as const;

export const SESSION = {
  startingCash: 10_000,
  currency: "H$",
} as const;

export const TIERS = [
  { id: "underground", label: "Underground", min: 50_000, max: 250_000 },
  { id: "breakout", label: "Breakout", min: 250_000, max: 2_000_000 },
  { id: "mainstream", label: "Mainstream", min: 2_000_000, max: 20_000_000 },
  { id: "arena", label: "Arena", min: 20_000_000, max: Infinity },
] as const;

export type TierId = (typeof TIERS)[number]["id"];
