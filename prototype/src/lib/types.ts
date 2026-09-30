import type { TierId } from "./config";

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  tier: TierId;
  /** Spotify monthly listeners on the Then date */
  listenersThen: number;
  /** Same stat on the Now date; only shown after the Reveal */
  listenersNow: number;
  /** Monthly listeners for the six months before Then, oldest first */
  history: number[];
  /** 0 to 0.40; sets starting shares outstanding */
  startPremium: number;
  /** Simulated other players, display only */
  holders: number;
  /** One factual line, shown only after the Reveal */
  revealNote: string;
  profileUrl: string | null;
}

export interface Dataset {
  version: string;
  /** True while the numbers are placeholders, not real stats */
  sample: boolean;
  source: string;
  thenDate: string;
  nowDate: string;
  artists: Artist[];
}

export interface Holding {
  shares: number;
  /** Total H$ spent on the shares still held, fees included */
  costBasis: number;
  /** Gross shares bought this session; counts toward the buy limit */
  boughtShares: number;
}

export interface Trade {
  artistId: string;
  side: "buy" | "sell";
  shares: number;
  /** Average price per share, before fees */
  avgPrice: number;
  fee: number;
  /** Cash moved: spent (buy) or received (sell), fees included */
  cash: number;
  at: number;
}
