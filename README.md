# HypeWave

**A market where fans buy and sell shares in music artists.** Prices track both real-world audience growth and player demand. The fantasy: you saw the opening act before anyone knew their name, you bought in, and when they blew up you got paid for being right.

This repo holds the product spec and a working play-money prototype.

## What's here

| | |
| --- | --- |
| [Product requirements (PRD)](HypeWave_PRD.md) | The full spec: market design, fairness rules, listing lifecycle, prototype spec, architecture, money and legal options, and roadmap |
| [Prototype](prototype/) | A Next.js web app: the "time capsule" demo described in Section 12 of the PRD |

## The prototype in one minute

1. It's March 31, 2026. You have H$10,000 in play money and 50 artists to choose from.
2. Each price has two parts: a **stats value** from the artist's monthly listeners and a **hype premium** set by player demand.
3. Buy and sell under fairness limits: a per-artist buy limit and stake cap, with selling never restricted.
4. Hit **Reveal** to jump to September 30, 2026. Every artist's real stats update, and you're scored on what your portfolio would actually sell for.

The current build uses fictional sample artists and stats. Real data drops in by replacing one JSON file ([details](prototype/README.md#swapping-in-real-data)).

## Design highlights

- **Price = base value × hype multiplier.** Base value is `0.01 × √(monthly listeners)`; the multiplier is `e^(shares outstanding / 25,000)`. Being right about an artist's growth pays even if nobody follows you in, and pump-and-dumps unwind.
- **Fair by construction.** One account can move any artist's price only about 5% a month, a round trip costs about 2% in fees, and scores use cash-out value, so you can't pump your own score.
- **Tested math.** The pricing module is covered by unit tests that reproduce the PRD's worked example to the cent.

## Run it locally

Requires Node.js 20 or later.

```bash
cd prototype
npm install
npm run dev
```

Then open http://localhost:3000. On Windows PowerShell, use `npm.cmd` if `npm` is blocked by the script policy.

## Tech

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand, Motion and Vitest. Every page is statically prerendered, so it deploys to any static host.
