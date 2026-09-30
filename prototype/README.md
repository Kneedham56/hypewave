# HypeWave prototype

The time-capsule demo from the PRD (Section 12). Each session drops you on March 31, 2026 with H$10,000 and 50 artists. You buy and sell, then hit Reveal to jump to September 30, 2026 and get scored on what your picks became.

Play money only. **The current dataset is fictional sample data**; see "Swapping in real data" below.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm test` | Market math tests (checks the PRD's worked example to the cent) |
| `npm run build` | Production build; every page is prerendered static |
| `npm run lint` | ESLint |
| `npm run data:sample` | Regenerates the fictional 50-artist dataset |

## Where things live

| Path | What's there |
| --- | --- |
| `src/lib/config.ts` | Every tunable number: depth, fee, stake cap, buy limit, starting cash, tiers |
| `src/lib/market.ts` | Pure pricing math (PRD Section 6). Everything else calls into it |
| `src/lib/store.ts` | Session state, buy and sell rules, Reveal. Stored per tab in sessionStorage |
| `src/lib/portfolio.ts` | Position values and the Reveal score (cash-out value, not market value) |
| `src/data/artists.json` | The 50-artist dataset |
| `src/app/` | Screens: welcome, market, artist, portfolio, reveal, results, how it works |

## Swapping in real data

The app reads only `src/data/artists.json`. To use real stats, replace it with a file of the same shape (see `src/lib/types.ts`):

- Set `"sample": false`. This removes the "fictional placeholders" banners.
- Set `thenDate` and `nowDate`.
- For each artist, provide `listenersThen` and `listenersNow` (Spotify monthly listeners on those dates), six monthly `history` values before Then, and a one-line factual `revealNote`.
- `startPremium` is half the six-month growth before Then, clamped to 0 to 0.40. `scripts/generate-sample-data.mjs` shows the calculation and the selection-rule checks.

## Not built yet

Leaderboard (needs Supabase and server-side scoring so the Now numbers stay hidden), accounts, live multiplayer, daily data, and nominations, claims and opt-outs.
