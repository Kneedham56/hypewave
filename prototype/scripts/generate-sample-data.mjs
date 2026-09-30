// Generates src/data/artists.json: 50 FICTIONAL artists with realistic numbers,
// following the PRD Section 12 selection rules. Replace the output with real
// stats later; the app only depends on the schema in src/lib/types.ts.
//
//   node scripts/generate-sample-data.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SEED = 20260930;
const THEN = "2026-03-31";
const NOW = "2026-09-30";
const DEPTH = 25_000; // keep in sync with MARKET.depth
const MAX_START_PREMIUM = 0.4;

// Tier ranges in monthly listeners (Then date)
const TIER_RANGE = {
  arena: [20_000_000, 110_000_000],
  mainstream: [2_000_000, 20_000_000],
  breakout: [250_000, 2_000_000],
  underground: [50_000, 250_000],
};

// Now / Then multiplier bands
const OUTCOME = {
  rocket: [4, 14],
  rise: [1.5, 3],
  flat: [0.92, 1.3],
  fall: [0.55, 0.88],
};

// Momentum in the six months before Then. Deliberately loose: some hyped
// artists fall, so a high starting premium is a trap as often as a signal.
const PRIOR_GROWTH = {
  rocket: [0, 0.5],
  rise: [-0.1, 0.5],
  flat: [-0.15, 0.4],
  fall: [-0.2, 0.7],
};

const NOTES = {
  rocket: [
    "A single went viral and passed 100M streams; debut album charted",
    "Breakout festival set, then a sold-out first headline tour",
    "Sync placement in a hit series sent streams through the roof",
  ],
  rise: [
    "New single landed on major editorial playlists",
    "Opened for an arena tour and kept the new fans",
    "Second album beat the debut in its first week",
  ],
  flat: [
    "Steady touring, no new album",
    "Released a deluxe edition; numbers held",
    "Quiet period in the studio",
  ],
  fall: [
    "Album pushed back; fewer playlist placements",
    "Lead single underperformed and the tour was scaled down",
    "Went on hiatus after the last tour",
  ],
};

// [name, genre, tier, outcome]
const ROSTER = [
  ["Nova Kade", "pop", "arena", "flat"],
  ["Lil Parallax", "hip-hop", "arena", "fall"],
  ["Selene Marquez", "latin", "arena", "rise"],
  ["The Glass Harbors", "rock", "arena", "fall"],
  ["JUNO9", "k-pop", "arena", "flat"],
  ["Dex Monroe", "country", "arena", "flat"],
  ["Aurelia Vance", "r&b", "arena", "fall"],
  ["Kilowatt Kids", "electronic", "arena", "flat"],
  ["Tobi Adeyemi", "afrobeats", "arena", "rise"],
  ["Marlowe Grey", "pop", "arena", "flat"],

  ["Violet Static", "indie", "mainstream", "rise"],
  ["Cash Palmer", "country", "mainstream", "flat"],
  ["Rico Solano", "latin", "mainstream", "fall"],
  ["Yung Meridian", "hip-hop", "mainstream", "rise"],
  ["Halcyon Drift", "electronic", "mainstream", "flat"],
  ["Sable & The Saints", "rock", "mainstream", "fall"],
  ["Keira Moon", "r&b", "mainstream", "flat"],
  ["BLVD 7", "k-pop", "mainstream", "rise"],
  ["Wren Holloway", "folk", "mainstream", "flat"],
  ["Ironclad Choir", "metal", "mainstream", "fall"],
  ["Amara Okafor", "afrobeats", "mainstream", "rise"],
  ["Lux Avenue", "pop", "mainstream", "flat"],

  ["Paper Satellites", "indie", "breakout", "rocket"],
  ["Jade Fontaine", "r&b", "breakout", "flat"],
  ["Colt Barrow", "country", "breakout", "rise"],
  ["Mira Sol", "latin", "breakout", "fall"],
  ["Neon Coast", "electronic", "breakout", "rocket"],
  ["Tay Rivers", "hip-hop", "breakout", "flat"],
  ["Peach Theory", "pop", "breakout", "fall"],
  ["Grimwood", "metal", "breakout", "flat"],
  ["Olu Bankole", "afrobeats", "breakout", "rise"],
  ["Fern & Fable", "folk", "breakout", "flat"],
  ["AERIS", "k-pop", "breakout", "rise"],
  ["The Velvet Loops", "rock", "breakout", "fall"],
  ["Sunday Fever", "pop", "breakout", "flat"],
  ["Kid Cobalt", "hip-hop", "breakout", "rocket"],

  ["Moth Parade", "indie", "underground", "rocket"],
  ["Rosa Quill", "folk", "underground", "flat"],
  ["Pale Circuit", "electronic", "underground", "fall"],
  ["Lani Vega", "latin", "underground", "rise"],
  ["Bricktown Saints", "rock", "underground", "flat"],
  ["Dre Solace", "r&b", "underground", "rocket"],
  ["Hollow Pines", "country", "underground", "flat"],
  ["Tunde Wave", "afrobeats", "underground", "rise"],
  ["Ghostline", "hip-hop", "underground", "fall"],
  ["Cinder Lake", "metal", "underground", "flat"],
  ["Pixie Riot", "pop", "underground", "rocket"],
  ["Sera & the Tides", "indie", "underground", "flat"],
  ["LUMI-9", "k-pop", "underground", "rise"],
  ["Juniper Hale", "folk", "underground", "fall"],
];

// Seeded PRNG (mulberry32) so the dataset is reproducible
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const between = (lo, hi) => lo + rand() * (hi - lo);
const logBetween = (lo, hi) => Math.exp(between(Math.log(lo), Math.log(hi)));
const pick = (xs) => xs[Math.floor(rand() * xs.length)];
const roundTo = (n, step) => Math.round(n / step) * step;
const slug = (s) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const artists = ROSTER.map(([name, genre, tier, outcome]) => {
  const [lo, hi] = TIER_RANGE[tier];
  // Stay a little inside the band so rounding never crosses a tier edge
  const then = Math.round(logBetween(lo * 1.05, hi * 0.95));
  const now = Math.round(then * between(...OUTCOME[outcome]));

  const prior = between(...PRIOR_GROWTH[outcome]);
  const start = then / (1 + prior);
  const history = Array.from({ length: 6 }, (_, i) => {
    const trend = start * Math.pow(then / start, i / 6);
    return Math.round(trend * between(0.96, 1.04));
  });

  const startPremium = roundTo(Math.min(MAX_START_PREMIUM, Math.max(0, prior / 2)), 0.01);
  const q0 = DEPTH * Math.log(1 + startPremium);
  const holders = Math.round(25 + q0 / between(10, 20) + between(0, 60));

  return {
    id: slug(name),
    name,
    genres: [genre],
    tier,
    listenersThen: then,
    listenersNow: now,
    history,
    startPremium,
    holders,
    revealNote: pick(NOTES[outcome]),
    profileUrl: null,
  };
});

const dataset = {
  version: `sample-${SEED}`,
  sample: true,
  source: "Fictional sample data generated by scripts/generate-sample-data.mjs. Not real artists or real stats.",
  thenDate: THEN,
  nowDate: NOW,
  artists,
};

// Check the Section 12 rules before writing
const count = (f) => artists.filter(f).length;
const tiers = Object.fromEntries(Object.keys(TIER_RANGE).map((t) => [t, count((a) => a.tier === t)]));
const genres = {};
for (const a of artists) genres[a.genres[0]] = (genres[a.genres[0]] ?? 0) + 1;
const up = count((a) => a.listenersNow >= a.listenersThen * 1.5);
const down = count((a) => a.listenersNow <= a.listenersThen * 0.9);
const checks = [
  [artists.length === 50, "50 artists"],
  [tiers.arena === 10 && tiers.mainstream === 12 && tiers.breakout === 14 && tiers.underground === 14, "tier mix 10/12/14/14"],
  [Object.keys(genres).length >= 8, "at least 8 genres"],
  [Math.max(...Object.values(genres)) <= 10, "no genre over 20%"],
  [up >= 12, "at least 12 artists up 50%+"],
  [down >= 10, "at least 10 artists down 10%+"],
  [new Set(artists.map((a) => a.id)).size === 50, "unique ids"],
];
const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("Dataset rules failed:", failed.map(([, name]) => name).join(", "));
  process.exit(1);
}

const out = fileURLToPath(new URL("../src/data/artists.json", import.meta.url));
writeFileSync(out, JSON.stringify(dataset, null, 2) + "\n");
console.log(`Wrote ${artists.length} artists to ${out}`);
console.log({ tiers, genres, up, down });
