# HypeWave — Product Requirements Document

Sep 30, 2026 · @Dr Quadrakill

## 1. Summary

HypeWave is a market where fans buy and sell shares in music artists, and prices track both real-world audience growth and player demand. The fantasy it serves: you saw the opening act before anyone knew their name, you bought in, and when they blew up you got paid for being right.

Every artist's price has two parts. A **base value** comes from real stats such as monthly listeners, and a **hype premium** comes from net buying on HypeWave. When an artist grows in the real world every holder gains; when the crowd gets ahead of the stats, the premium shows it.

Limits on how much one account can own or buy keep the game about taste, not bankroll. Selling is never restricted, so a player who sees trouble coming can always get out.

Version 1 is music only, buy and sell only, and play money. This document is a build manual: an operator with the resources can take it and build HypeWave, starting with the 50-artist play-money prototype in Section 12.

**How to read it**

- Sections 2–4: why, for whom, and what is in and out of scope.
- Sections 5–9: the market rules (pricing, the Hype Index, fairness, listings). These are the core of the product.
- Sections 10–11: player experience and design direction.
- Section 12: the prototype, buildable as written.
- Sections 13–17: production architecture, money options, legal, risks and roadmap.
- Sections 18–19: decisions, open questions, precedents and default parameters.

## 2. Problem and opportunity

Fans already compete over who found an artist first, but there is no way to prove it or be rewarded for it. "I liked them before they were famous" is social currency with no scoreboard. HypeWave turns that taste into a visible, scored track record.

**Who it's for**

- **Primary: early-discovery music fans, 18–30.** They find artists at live shows, on TikTok and SoundCloud, and in algorithmic playlists, and being early is part of their identity.
- **Secondary: casual fans and friend groups** who want a light way to back favorites and compare picks.
- **Tertiary: industry watchers** (A&R, promoters, bookers, playlist curators), for whom crowd sentiment on emerging artists is a useful signal.

**Why now**

- Prediction markets have gone mainstream, but most of their activity centers on politics, sports and economics. Culture is comparatively underserved.
- Streaming and social platforms publish audience numbers for nearly every working artist, so a price can be anchored to real data from day one.
- Fantasy sports proved people will manage a roster of real people for fun. Music has no equivalent.

**What earlier attempts teach** (details and sources in Section 19)

- **Hollywood Stock Exchange** showed a play-money entertainment market can run for decades, and that an industry can lobby to block the real-money version.
- **Fantex** showed that real securities tied to a person are possible but illiquid and joyless.
- **BitClout** showed that listing people without their consent, and without a clear way out, triggers backlash.
- **friend.tech** showed that prices driven only by new buyers collapse when new buyers stop. That is why HypeWave anchors every price to real stats.

## 3. Goals, non-goals and success metrics

HypeWave succeeds when spotting an artist early is fun, fair and legible: players who know music win, money alone doesn't, and anyone can say why a price moved.

**Goals**

1. **Reward taste.** Returns come from real-world artist growth, and from being early to what the crowd later believes.
2. **Keep it fair.** No account can corner an artist. Insight matters more than money or speed.
3. **Make it legible.** Every price splits into "what the stats say" and "what the crowd adds."
4. **Make it fun without making it a casino.** Celebrate good calls, not trading volume.
5. **Be buildable.** A funded operator can build the prototype from Section 12 and the product from Sections 5–9 and 13.

**Non-goals for v1**

- Real money, prizes or cash-out of any kind.
- Categories beyond music.
- Short selling, options, leverage and limit orders.
- Social features beyond a leaderboard and share cards. No chat, and no messaging artists.
- Native mobile apps. The prototype is a responsive web app.

**Success metrics**

| Metric | Target | Stage |
| --- | --- | --- |
| Sessions that reach the Reveal | 60% or more | Prototype playtests |
| Median session length | 5–12 minutes | Prototype playtests |
| Players who start a second session | 30% or more | Prototype playtests |
| Players who share a results card | 15% or more | Prototype playtests |
| Playtesters who can explain why a price changed | 80% or more | Prototype playtests |
| "Spend the most on the biggest artists" beats the median informed strategy | Never | Balance simulation |
| Coordinated pump-and-dump groups profit on average after fees | Never | Balance simulation |
| Day-7 retention | 25% or more | Live beta |
| Distinct artists held per active player | 5 or more | Live beta |
| Share of holdings, by value, in the two smallest tiers | 30% or more | Live beta |
| Share of any artist held by its top 10 holders | 35% or less | Live beta |

Targets are starting hypotheses to validate in playtests and simulation, not industry benchmarks.

## 4. Scope and expansion path

Version 1 lists music artists only and supports two actions: buy and sell. Other kinds of public figures and other instruments come later, in the order below, once the core market is stable.

**v1: music**

- Solo artists, bands, duos, DJs and producers with a verifiable catalog on major streaming platforms.
- Every listed person must be 18 or older. A band is eligible only if every member is.
- Eligibility also requires crossing the attention threshold in Section 9.

Music goes first because its audience data is public, frequent and comparable across artists. The "saw the opener before they blew up" story is also the product's clearest hook.

**Expansion order**

| Stage | Category | Stats that anchor the price | Extra rules |
| --- | --- | --- | --- |
| 2 | Creators and streamers | Followers, views and watch time on YouTube, Twitch and TikTok | Same as music |
| 3 | Actors and TV talent | Social followers, search interest, credits | Anchor to audience, never box office receipts (Section 15) |
| 4 | Athletes | Social following and search interest, not on-field stats | Athletes and team staff may not trade; follow league integrity rules; no overlap with sports betting |
| 5 | Comedians, authors, podcasters and other public figures | Platform-specific audience data | Reviewed category by category |

**Never listed**

- Minors.
- Politicians, candidates and government officials.
- Private individuals, and anyone whose fame comes mainly from a crime or a tragedy.
- Fictional characters, pets and memes. These could return later as a separate, clearly labeled mode.

**Instruments**

- **v1:** buy and sell at the market price.
- **Later, where regulation allows:** calls and puts, so players can express a bearish view or cap their downside; limit orders; baskets such as a genre index.
- **Not planned:** leverage and margin.

## 5. Core concepts and glossary

These terms are used the same way everywhere in this document and in the product.

| Term | Meaning |
| --- | --- |
| Artist | A listed musician or band. One canonical listing per real artist. |
| Share | A unit of exposure to one artist's price. Shares are created when players buy and removed when they sell; there is no fixed supply. |
| Hype Index (R) | An artist's real-world audience, combined from several stats into one number and expressed in monthly-listener equivalents (Section 7). |
| Base value (B) | The part of the price set by the Hype Index. It moves only when real stats move. |
| Hype multiplier (H) | The part of the price set by net buying on HypeWave. 1.0 means no premium. |
| Hype premium | H minus 1, shown as a percent: how far players have priced an artist above their stats. |
| Price (P) | B × H. What the next share costs. |
| Shares outstanding (q) | All shares of one artist currently held by players. |
| Depth (D) | How many net shares it takes to move the multiplier. More depth means a steadier price. |
| Stake cap | The most shares of one artist a single account may hold. |
| Buy limit | The most shares of one artist a single account may buy in any rolling 30 days. |
| Cash-out value | What a position would return if sold now, after price impact and fees. |
| Tier | A size band by Hype Index: Underground, Breakout, Mainstream, Arena (Section 7). |
| Scout | A player. |
| First Scout | A permanent badge for the players whose nominations got an artist listed. |
| Verified artist | An artist, or a declared member of their team, who has claimed the listing. Their trades are publicly disclosed. |
| HypeCash (H$) | The play-money currency. It cannot be bought, sold or redeemed. |
| Time capsule and Reveal | The prototype's game loop: trade on past stats, then reveal today's. |

## 6. Market design

Every artist's price is a base value from real stats multiplied by a hype multiplier from player demand: P = B × H. The first part rewards being right about an artist's real growth. The second rewards being early to what other players later believe.

&#91;embedded content: How a price is built · default parameters\]

The two halves never mix: base value moves only when real stats move, and the multiplier moves only when players buy or sell.

**Base value from stats**

```latex
B = k \cdot R^{\alpha}
```

R is the artist's Hype Index in monthly-listener equivalents (Section 7). The defaults are k = 0.01 and α = 0.5, so base value grows with the square root of audience.

The square root squeezes a huge range into readable prices: 50,000 listeners gives H$2.24, 2 million gives H$14.14 and 80 million gives H$89.44. It also makes discovery pay. An artist who grows 16× sees base value rise 4×, while a superstar who grows 5% sees about 2.5%.

**Hype multiplier from demand**

```latex
H = e^{q / D}
```

q is shares outstanding and D is depth, 25,000 shares for every artist by default. With no shares held, H = 1 and price equals base value. Each net share bought lifts H; each share sold lowers it.

Because base value already scales with audience, one share depth gives bigger artists deeper dollar liquidity automatically. Lifting any artist 10% above base takes about 2,400 shares: roughly H$5,600 for a 50,000-listener act and H$224,000 for an 80-million-listener star.

**Trading math**

Orders move along the curve, so a large buy pays a rising average price. Both directions have closed forms. The cost of buying from q₁ to q₂ shares outstanding (sale proceeds are the same formula in reverse):

```latex
\text{cost}(q_1 \to q_2) = B \cdot D \cdot \left(e^{q_2/D} - e^{q_1/D}\right)
```

The number of shares a spend of C buys, starting from q shares outstanding:

```latex
\Delta q = D \cdot \ln\!\left(e^{q/D} + \frac{C}{B \cdot D}\right) - q
```

**Fees**

A flat 1% fee applies to every buy and every sell, charged on the order's value. In play money the fee is a sink that teaches the cost of churning. In a real-money product it is the operator's main revenue lever (Section 14). Holding is free.

**Why the design holds up**

- **Being right pays even if nobody follows you.** Stat growth lifts B, and B lifts every holder.
- **Pumps unwind.** A premium not backed by stat growth holds only while buyers keep coming, and the limits in Section 8 cap how much any one account can add.
- **Churning loses.** Buying and selling back with no stat change returns 98.01% of the amount spent: the curve pays back what it took, minus two fees.
- **Every price explains itself.** Each artist page shows base value and premium separately.

**The limit of buy-only**

Price cannot fall below base value, because players can only sell shares they hold. Bearish players act by selling, which pulls the price toward base; base itself falls if the audience shrinks. Calls and puts (Section 4) would let price reflect bearish views directly.

**Worked example: an opening act vs. a superstar**

Two players each spend H$2,000 on the same day, and six months pass. Both artists start with a 10.5% premium (2,500 shares already held).

|  | Opening act | Superstar |
| --- | --- | --- |
| Monthly listeners, then → now | 50,000 → 800,000 | 80 million → 88 million |
| Base value, then → now | H$2.24 → H$8.94 | H$89.44 → H$93.81 |
| Price at purchase | H$2.47 | H$98.85 |
| Shares bought after the 1% fee | 788.7 | 20.0 |
| Price move caused by the buy | +3.2% | +0.08% |
| Cash-out value now, after fees | H$7,841 | H$2,056 |
| Return | +292% | +2.8% |

The example holds the premium constant. In a live market, other players' buying and selling move it too.

## 7. The Hype Index

The Hype Index (R) is one number for an artist's real-world audience, built from several platforms' stats and expressed in monthly-listener equivalents. It updates daily in production and is frozen in the prototype.

**Inputs for music**

| Stat | Weight | Why it's in |
| --- | --- | --- |
| Spotify monthly listeners | 0.45 | The most widely cited measure of active listening |
| YouTube views, trailing 30 days | 0.20 | Video reach; strong for hip-hop, Latin and K-pop |
| Streaming followers (Spotify, plus Apple Music where available) | 0.15 | Committed fans; moves slowly |
| TikTok and Instagram followers | 0.15 | The earliest signal of a breakout |
| Live demand (trackers on Songkick or Bandsintown) | 0.05 | The "saw them live" signal |

Production pulls these from licensed music-data providers or platform partnerships, never from scraping.

**Combining them**

```latex
R = \prod_i \left(c_i \cdot m_i\right)^{w_i}
```

mᵢ is each stat and wᵢ its weight; the weights sum to 1. cᵢ converts a stat into monthly-listener equivalents: the median ratio of monthly listeners to that stat across all listed artists, recalculated quarterly.

This is a weighted geometric mean, so a 10% rise in any one stat lifts R by roughly its weight times 10%. No single platform dominates. If an artist is missing a platform, the remaining weights are rescaled to sum to 1.

The prototype uses Spotify monthly listeners alone, at two dates (Section 12). One stat keeps the data work small and makes the Reveal easy to explain.

**Tiers**

| Tier | Hype Index (monthly-listener equivalents) | Base value |
| --- | --- | --- |
| Underground | 50,000 to 250,000 | H$2.24 to H$5.00 |
| Breakout | 250,000 to 2 million | H$5.00 to H$14.14 |
| Mainstream | 2 million to 20 million | H$14.14 to H$44.72 |
| Arena | Over 20 million | Over H$44.72 |

**Updates and smoothing (production)**

- Pull stats daily and compute R from a 7-day trailing average of each stat.
- If base value would move more than 20% in a day, halt trading on that artist until a reviewer confirms the data, then apply the full move (Section 8).
- Publish every base-value change with its inputs, so players can see exactly why a price moved.
- Store every raw stat and index version. Never overwrite history.

**Defending the index**

Tying price to stats gives holders a direct reason to buy fake streams, followers or views. Platforms already strip much of that out of the numbers they publish, so HypeWave's job is narrower:

- Use only platform-reported stats, never self-reported numbers.
- Blend several platforms, so gaming one moves R by only that platform's weight.
- Smooth with the 7-day average and the 20% halt.
- Flag divergence: a stat spiking on one platform while the others stay flat triggers review.
- Review accounts that bought just before a flagged spike; confirmed manipulation voids their trades.
- Never price a surge caused by an artist's death or medical emergency (the compassion halt in Section 8).

## 8. Fairness and balance rules

HypeWave is fair when insight beats money and speed: no account can corner an artist, anyone can always sell, and insiders trade in the open.

**Stake cap**

- No account may hold more than the greater of 5% of an artist's shares outstanding or 2,500 shares.
- The 2,500-share floor lets early scouts in; when few shares exist, 5% alone would block the first buyers.
- The cap counts shares, not dollars, so it bites the same at H$2 and at H$90. A full 2,500-share stake moves the price about 10%.

**Buy limit**

- No account may buy more than 1,250 shares of one artist in any rolling 30 days.
- 1,250 shares moves any artist's price about 5%, so no single account can push the premium faster than that.
- The limit counts gross buys. Selling does not restore buy room, so churning can't get around it.

**Selling is never restricted**

- Players can sell any amount at any time. Only a trading halt pauses selling, and every halt pauses buying too.
- A player who sees bad news coming must be able to act on it. Locking them in would punish insight.
- A large seller can drop a price sharply, and that is accepted. The stake cap bounds how much one account holds, so it also bounds how far one seller can move the price.

**Artists trading their own stock**

- Verified artists and declared team members (managers, label staff) may buy and sell their own listing, under the same cap and limit as everyone else.
- Every insider trade appears on the artist's page and in a public feed within 15 minutes, with the account's role, the side, the share count and the price.
- Insiders' combined holdings are shown on the artist page. An artist betting on themselves is a signal fans can see.
- A real-money operator should expect regulators to require more, such as blackout windows before announcements or an outright ban. The disclosure system is built so those rules can be switched on per market.

**Discovery and ranking**

- The default sort surfaces quality signals: unique holders, holder growth and base-value growth. Raw price change is not the default.
- "Biggest movers" ranks by base-value change, with the premium's change shown beside it.
- Small and newly listed artists get a guaranteed share of discovery slots, so stars don't crowd out scouting.
- An artist whose top 10 holders own more than half the shares is labeled "concentrated" and left out of trending lists.

**One person, one account**

Every limit above assumes one account per person. Production verifies identity before trading; the play-money beta uses phone verification and device checks.

**Halts**

| Halt | Trigger | What happens |
| --- | --- | --- |
| Data review | Base value would move more than 20% in a day, or one platform's stats diverge from the rest | All trading pauses for up to 24 hours while a reviewer checks the data; the confirmed move then applies |
| Manipulation review | Surveillance flags coordinated buying or trades between linked accounts | Trading pauses for up to 24 hours; confirmed manipulative trades are voided |
| Compassion | The artist dies or has a publicly reported medical emergency | Trading stops at once; positions settle at the last price before the news; the listing retires or pauses |
| Delisting | Opt-out, lost eligibility or a policy breach | A 7-day sell-only window, then remaining positions settle at the final price |

The compassion halt exists because streams surge after an artist dies. A market that pays out on that surge is indefensible, so nobody profits from tragedy.

## 9. Listing lifecycle

An artist gets listed by crossing an attention threshold and being nominated, then passing an identity and eligibility review. Once listed, they can claim or opt out of the listing at any time.

&#91;embedded content: Listing states · launch-stage threshold\]

Claimed listings follow the same halt and delisting paths. A compassion halt skips the sell-only window and settles at the pre-news price (Section 8).

**Attention threshold**

The bar starts high to keep the catalog clean. It comes down as moderation and surveillance prove they can handle smaller artists.

| Stage | Minimum Hype Index | Move to the next stage when |
| --- | --- | --- |
| Launch | 50,000 monthly-listener equivalents | 90 days with no confirmed stat manipulation among listings under 100,000, and a review backlog under 48 hours |
| Stage 2 | 10,000 | The same test, applied to listings under 25,000 |
| Stage 3 | 2,000 | The floor; revisit only with new surveillance tools |

**Nominations**

- Any player can nominate an artist who meets the current threshold.
- An artist enters review after 25 unique players nominate them. The operator can also add artists above 5× the threshold directly, to seed the catalog.
- The first nominators get a permanent First Scout badge on the artist's page. That badge is the proof of being early that the product is built on.

**Review**

Every candidate passes these checks before listing:

1. **Identity:** official profiles on at least two platforms that clearly point at the same act.
2. **Uniqueness:** one listing per real artist. A band member's solo career lists separately only if it has its own catalog.
3. **Age:** every listed person is 18 or older.
4. **Opt-out registry:** artists who opted out are never relisted.
5. **Exclusions:** nobody from the never-listed groups in Section 4.

**Claiming a listing**

- An artist or their authorized team verifies through an official channel, such as a post from the artist's verified account or confirmation from their label or distributor.
- A claimed listing gets a verified badge and can post official updates such as release dates and tour announcements.
- Claiming turns on insider disclosure for the artist and every team member they add (Section 8).

**Opting out**

- An artist or their authorized representative can ask to be removed at any time. The operator honors the request within 7 days.
- Removal starts the 7-day sell-only window (Section 8), and the artist joins the opt-out registry.
- Only the artist can reverse an opt-out.

**Other delistings**

An artist is also delisted after 90 days below half the current threshold, after an identity problem, or after a policy breach. The same sell-only window applies.

## 10. Player experience

The core loop is: scout an artist, buy in, follow their real career, and get credit when you were right. Everything in the product feeds that loop.

&#91;embedded content: Core loop · live product\]

The credit step is the payoff the product is built around, and sharing it is how new scouts arrive.

**Core flows (live product)**

1. **Onboarding:** confirm age (18+), swipe through three cards (base value, hype premium, limits), receive the starting balance, and pick three favorite genres to seed discovery.
2. **Discover:** browse by tier and genre, search any artist, and check the "Rising stats" and "Underhyped" lists. Underhyped means strong stat growth with a low premium.
3. **Artist page:** price, base value, premium, stat trend, holder count, insider activity, your position and your remaining buy room.
4. **Buy:** enter an amount. The preview shows shares, average price, fee, price impact and the room left under your limits. Confirm.
5. **Sell:** choose a share count or "Sell all." The preview shows proceeds after fees and impact. Confirm. Limits never block a sale.
6. **Follow:** get alerts when a held artist drops a release, crosses a stat milestone, has an insider trade, or moves more than 10%.
7. **Nominate:** search an unlisted artist, nominate them if they meet the threshold, and get notified when they list.
8. **Share:** post portfolio and big-call cards sized for Stories, such as "Bought at 50K listeners. Now 800K."

**Moments that make it fun**

- **The call that paid:** when a held artist's base value doubles, show when you bought and what their listener count was then.
- **First Scout:** the badge on an artist's page carries your handle for good.
- **Release day:** a new single moves stats within days, so players trade on what the single suggests about the album.

## 11. Design direction

HypeWave should feel like a music app with a scoreboard, not a brokerage and not a casino. That means phone-first, dark, bold type, and motion that follows the music.

**Principles**

1. **Phone first.** Design at 375 px wide first. Keep primary actions within thumb reach and put trading in bottom sheets.
2. **Plain language.** Say "Buy in," "Cash out," "Stats value" and "Hype premium." Never "bid/ask," "YOLO" or "bet."
3. **Celebrate calls, not clicks.** No animation rewards the act of trading. Robinhood [dropped its confetti in March 2021](https://www.shacknews.com/article/123629/robinhood-removes-confetti-feature-due-to-criticism-over-gamification-of-investing) after criticism that it gamified trading. Celebrate when a call proves right, and say why.
4. **Every number explains itself.** Tapping a price shows its two parts. Tapping a limit shows why it exists.
5. **Artists look like art, not headshots.** Each artist gets a generated avatar: a gradient and waveform seeded from the artist's ID, inside a ring colored by tier.
6. **Accessible by default.** Meet WCAG AA contrast, show up and down with arrows and signs rather than color alone, and honor reduced-motion settings.

**Visual language**

| Element | Direction |
| --- | --- |
| Background | Near-black (#0B0B10) by default; a light theme exists but is secondary |
| Brand gradient | Electric violet (#7C5CFF) to cyan (#22D3EE) to hot pink (#FF4D8D), used for the logo, the hype meter and Reveal moments |
| Up and down | Lime (#B8FF3C) with ▲, coral (#FF5A5F) with ▼ |
| Type | Space Grotesk for display, Inter for body, tabular numerals for every price |
| Shape | Rounded cards (16 px radius), pill buttons, generous spacing |
| Motion | Numbers roll when they change, a waveform breathes on the artist header, bottom sheets spring, and the Reveal plays as tap-through story cards |

**Key components**

- **Artist card:** avatar, name, genre, tier, price, premium chip and a six-month stat sparkline.
- **Price breakdown:** a stacked bar showing base value and premium.
- **Hype meter:** a gauge of the premium, from 0% to 100% and beyond.
- **Trade sheet:** an amount field with quick picks (H$100, H$500, H$1,000, and Max within limits), a live preview and one confirm button.
- **Room-to-buy bar:** the remaining stake cap and buy limit for this artist.
- **Portfolio view:** total value, cash, and allocation by tier.
- **Reveal story:** full-screen cards, one per holding, then a summary.
- **Share card:** a 9:16 image with the player's best call and total return.

## 12. Prototype specification

The prototype is a single-player, play-money web app built around a time capsule. Each session drops the player six months into the past with H$10,000 and 50 real artists, lets them build a portfolio, then reveals today's real stats and scores the result.

It proves three things:

- Spotting growth early pays.
- The limits stop one player from dominating an artist.
- Players understand why their prices moved.

**Session rules**

1. Each session starts with H$10,000 and no holdings. Nothing carries over. A new tab or "Play again" starts fresh; a reload within the tab keeps the session.
2. The market opens on the Then date. Each artist shows their base value on that date plus a fixed starting premium.
3. The player buys and sells under the Section 6 pricing, the 1% fee and the Section 8 limits. Within one session, the 30-day buy limit caps total buys at 1,250 shares per artist.
4. Other players exist only as each artist's starting premium and a displayed holder count. They do not trade during the session.
5. The player taps Reveal when ready; at least one holding is required. Trading locks.
6. Base values jump to the Now date's stats. Premiums stay where the player left them.
7. The score is cash-out value (cash plus every position sold at the new prices, after fees and price impact) against the starting H$10,000. Scoring on cash-out value means a player can't inflate their score by pumping a thin stock themselves.
8. After the Reveal, the player can share a results card, check the leaderboard if it's enabled, or play again.

**Time capsule dates**

Then is six months before the data pull (for a September 30, 2026 pull, Then is March 31, 2026). Six months is long enough for real breakouts and short enough to feel current.

**The 50-artist dataset**

Selection rules:

- 10 Arena, 12 Mainstream, 14 Breakout and 14 Underground artists (tiers from Section 7, measured on the Then date). The mix leans small because that is where scouting matters.
- At least eight genres, with no genre over 20% of the list.
- Outcome mix between Then and Now: at least 12 artists up 50% or more, at least 10 down 10% or more, and the rest in between. Several well-known names should be flat or down, so recognizing a hit isn't enough.
- Every listed person is 18 or older on the Then date.
- No artist is chosen because of legal trouble, health news or a death. Reveal notes stick to releases, tours and charts.

| Field | Example | Notes |
| --- | --- | --- |
| id | art\_017 | Stable slug; also seeds the avatar |
| name | As on streaming platforms |  |
| genres | indie pop | One or two tags |
| tier | Breakout | From Then listeners |
| listenersThen | 420,000 | Spotify monthly listeners on the Then date |
| listenersNow | 1,150,000 | The same stat on the Now date; hidden until the Reveal |
| history | Six monthly values before Then | Optional; drives the trend sparkline |
| startPremium | 0.18 | 0 to 0.40; sets starting shares outstanding |
| holders | 1,240 | Display only |
| revealNote | Debut album, first headline tour | One factual line, shown only after the Reveal |
| profileUrl | The artist's Spotify page | Identity check; shown as a link on the artist page |

The starting premium follows momentum, so artists already trending cost more to buy into. Set startPremium to half the artist's listener growth over the six months before Then, clamped between 0 and 0.40, or by hand if history is missing. Starting shares outstanding are then D × ln(1 + startPremium).

**Sourcing the data**

- Spotify's public Web API does not return monthly listeners or any history, and its follower, genre and popularity fields are [marked deprecated](https://developer.spotify.com/documentation/web-api/reference/get-an-artist). It is not enough on its own.
- For monthly listeners on two dates, use a music-analytics provider that sells historical artist stats (Chartmetric and Songstats are examples), within its terms. For a 50-artist demo, recording the numbers by hand from archived public pages also works.
- Don't scrape platforms against their terms. Production needs licensed data regardless.
- Freeze the result in one versioned JSON file. The app never calls a data source at runtime.

Players who follow music will remember some of these stories. That is the thesis, since music knowledge is the edge, and the outcome mix keeps memory alone from winning.

**Screens**

| Screen | Purpose | Must include |
| --- | --- | --- |
| Welcome | Set the scene | "It's March 31, 2026. You have H$10,000." A three-card explainer and a Start button |
| Market | Browse and pick | Artist cards; filters by tier and genre; sorting by listeners, six-month trend, premium and price; search |
| Artist | Decide | Price breakdown, stats and trend, holder count, room-to-buy bar, Buy and Sell |
| Trade sheet | Execute | Amount field, quick picks, a preview (shares, average price, fee, impact, room left) and Confirm |
| Portfolio | Review | Cash, holdings, allocation by tier and the Reveal button |
| Reveal | Pay off | One story card per holding (Then and Now listeners, price, return, note), then totals and best and worst calls |
| Results | Share and replay | Score, share card, leaderboard rank if enabled, and Play again |
| How it works | Explain | The price formula in plain words, the limits and why they exist, and the play-money disclaimer |

**Tech stack**

| Layer | Choice | Why |
| --- | --- | --- |
| App | Next.js (App Router) and TypeScript | Static pages plus one API route; deploys natively to Vercel |
| Styling | Tailwind CSS and a small custom component set | Fast path to the dark, bold look |
| Motion | Framer Motion | Rolling numbers, bottom sheets, the Reveal story |
| Charts | visx or Recharts | Sparklines and Then-to-Now lines |
| State | Zustand, persisted to sessionStorage | One session per tab |
| Data | A static artists.json in the repo | No runtime data calls |
| Hosting | Vercel | Preview deploys per branch |
| Optional backend | Supabase (Postgres) | Only for the leaderboard and playtest analytics |
| Analytics | Vercel Analytics or PostHog | Completion rate, time to Reveal, shares |

If the leaderboard is on, the Now numbers stay on the server. The client sends its trade log to a Reveal API route, which replays the trades, checks every limit and computes the score. Without a leaderboard, all data can ship to the browser.

**Data model**

Session state lives in the browser: the session ID, start time, cash, and per-artist shares outstanding. It also holds the player's holdings (shares, cost basis, shares bought this session) and a trade log. Each trade records the artist, side, shares, average price, fee and time.

| Supabase table (optional) | Columns | Access |
| --- | --- | --- |
| sessions | id, started\_at, revealed\_at, nickname, score, return\_pct, best\_artist\_id, trade\_count | Written only by the Reveal route |
| trades | id, session\_id, artist\_id, side, shares, avg\_price, fee, created\_at | Written only by the Reveal route |
| events | id, session\_id, name, props (JSON), created\_at | Insert-only from the client, for analytics |
| leaderboard (view) | nickname, score, return\_pct, created\_at | Public read |

**Acceptance criteria**

- [ ] 50 artists load from one JSON file and meet the tier, genre and outcome-mix rules.
- [ ] Every displayed price equals B × H from Section 6, to the cent.
- [ ] A buy preview's shares, average price, fee and impact match the executed trade.
- [ ] Buying past the stake cap or buy limit is blocked with a message showing the limit and the room left.
- [ ] Selling is never blocked, and "Sell all" always works.
- [ ] Buying and immediately selling back, at any size, returns 98.01% of the amount spent.
- [ ] The Reveal locks trading, switches base values to Now, and keeps each premium where the player left it.
- [ ] The score equals cash plus the cash-out value of every position after fees and impact.
- [ ] "Play again" and a new tab each start a fresh H$10,000 session.
- [ ] Layouts work at 375 px and 1440 px, pass WCAG AA contrast, and respect reduced-motion settings.
- [ ] "Play money, no real value" and "Not affiliated with the artists shown" are visible on every screen.
- [ ] With the leaderboard on, Now data never reaches the browser before the Reveal.

**Out of scope for the prototype**

Accounts and logins, real money, live multiplayer trading, daily data updates, native apps, and working nomination, claim and opt-out flows. Those are described in Sections 8–9 but not built.

## 13. Production architecture

The live product is a small trading core (market engine, limits and ledger) fed by a daily Hype Index pipeline and watched by a trust-and-safety layer. Everything else is standard consumer-app infrastructure.

&#91;embedded content: Production components · dashed boxes are outside providers\]

The index pipeline feeds base values into the market engine; surveillance reads every trade and can halt any artist. Notifications and the analytics warehouse read from all three groups and are left out of the drawing.

**Components**

| Component | Responsibility |
| --- | --- |
| Client apps | iOS, Android and web; all pricing shown comes from the server |
| API layer | Authentication, rate limiting, request routing |
| Market engine | Prices quotes, applies the curve, enforces caps, limits and halts, and executes trades |
| Ledger | Double-entry, append-only record of every balance and position change |
| Accounts and identity | Sign-up, age verification, one person per account; identity verification for any real-money route |
| Listing service | Nominations, reviews, claims, opt-outs, delistings and the opt-out registry |
| Hype Index pipeline | Ingests provider stats daily, smooths them, computes R and B, and publishes versioned base values |
| Surveillance | Detects coordinated buying, linked accounts and stat anomalies; opens halts and reviews |
| Notifications | Release, milestone, insider and price-move alerts |
| Admin console | Listing review, halts, parameter changes and audit views |
| Analytics warehouse | Event stream for metrics, balance tuning and experiments |

**Engineering requirements**

- **Atomic trades.** Quote, limit checks, fee, ledger entries and position update commit in one transaction or not at all.
- **One writer per artist.** Trades on the same artist are serialized, so shares outstanding can't race. Different artists trade in parallel.
- **Deterministic replay.** Every trade records the base value and shares outstanding it executed against. Replaying the trade log reproduces every balance, for audits, disputes and simulation.
- **Versioned base values.** Each index update is an event with its inputs, and trades reference the version they used.
- **Parameters as data.** Depth, fee, cap, limit, thresholds and weights live in a versioned config the admin console can change, with an audit trail.
- **Quote honesty.** A quote is valid for a few seconds. If the price moves past the player's tolerance before execution, the trade is rejected, not filled at a worse price.
- **Initial sizing.** The live beta should handle 100,000 players, 5,000 listed artists and 50 trades per second at peak, with quotes under 300 ms at the 95th percentile. These are starting targets, not measured needs.

## 14. Money and monetization options

HypeWave launches on play money. Whether and how real money enters is the operator's decision, and each route below carries different rules, costs and risks. This section lays out the options without prescribing one.

**Routes**

| Route | How it works | What it needs | Main risk |
| --- | --- | --- | --- |
| Free to play | Play money only; revenue from subscriptions, sponsorship and data | Standard consumer-app compliance | Limited revenue per player |
| Prizes and sweepstakes | Free entry; top scouts win prizes each month | State-by-state sweepstakes review; no purchase necessary | Being classed as gambling if structured wrong |
| Real money on a regulated exchange | Contracts on an artist's Hype Index, listed by a regulated derivatives exchange | An exchange license or partner, clearing, identity and anti-money-laundering checks, market surveillance | Regulatory approval, industry opposition and the funding gap below |
| Platform partnership | A streaming or ticketing platform embeds HypeWave, supplies first-party data and funds perks | Data and brand agreements | Conflicts with the platform's own charts and recommendations |

For the exchange route, two contract shapes fit a continuous game. **Dated contracts** settle to an artist's Hype Index on a set date. **Perpetual-style contracts** never expire and are periodically marked to the index; US-regulated venues began offering perpetual-style futures in 2025 ([Coinbase Derivatives, July 2025](https://www.pillsburylaw.com/en/news-and-insights/cftc-perpetual-futures-btc-eth-crypto-derivatives.html)). Either would need to pass the regulatory review in Section 15.

**Revenue levers (any route)**

- **Trading fees**, on real-money routes.
- **Premium tier:** deeper stat history, advanced alerts and custom watchlists.
- **Sponsorship:** labeled release-week campaigns. The sponsor, and the sponsored artist's insiders, can't trade that listing during the campaign.
- **Data and insights:** aggregated crowd sentiment on emerging artists for labels, promoters and bookers. Never individual player data.
- **Artist tools:** audience insights for claimed artists, and an optional revenue share that rewards artists for claiming their listing.

**The real-money funding gap**

In play money, gains are simply created. With real money, someone has to pay them.

- Trades between players fund themselves. While base value holds still, the money in an artist's curve is exactly what it would cost to buy every share back.
- When base value rises, every holder's position gains but no new money came in. The operator is effectively on the other side of every stat-driven gain, and profits when base values fall.
- Players who scout well will pick risers more often than fallers, so the operator should expect to pay out on balance.

Options for covering the gap:

- Fee reserves sized to expected index moves.
- Caps on total open positions per artist.
- Contracts that settle between buyers and sellers, which needs a sell side such as the calls and puts in Section 4.
- A sponsor- or partner-funded prize pool instead of cash-out.

## 15. Legal, regulatory and ethical considerations

Play money with no prizes keeps HypeWave's legal exposure low. Real money, prizes and new categories each add obligations that need counsel before launch. This section flags the issues so an operator can plan for them; it is not legal advice.

**Using real artists' names and data**

- **Right of publicity.** Many US states restrict commercial use of a person's name or likeness, and the rules vary by state. Using names factually, with no photos, no implied endorsement, a clear opt-out and a disclaimer lowers the risk. Hollywood Stock Exchange has run a play-money market on real actors for decades (Section 19).
- **Trademarks.** Band names are often trademarks. Use them only to identify the artist, and never suggest affiliation.
- **Data licensing.** Production stats must come from licensed providers or platform agreements. Platform terms generally forbid scraping.

**Play money, prizes and gambling**

- HypeCash must never be sold, redeemed or transferable. Once play money can be bought or cashed out, gambling and social-casino rules can apply.
- Prizes turn the game into a promotion. Sweepstakes need a free way to enter and state-by-state review.

**Real-money routes**

- **Regulator.** Contracts on a Hype Index would most likely be regulated by the CFTC and listed by a registered exchange. Structuring "shares" as a claim on an artist's earnings would instead make them securities, the route Fantex took (Section 19).
- **Public-interest limits.** CFTC rules bar registered entities from listing event contracts that involve terrorism, assassination, war, gaming or activity unlawful under state or federal law. They also bar "similar" contracts the Commission finds contrary to the public interest, reviewed over 90 days ([17 CFR 40.11](https://www.law.cornell.edu/cfr/text/17/40.11)). HypeWave prices audience size, never arrests, trials, health or death.
- **Industry lobbying is a real threat.** Federal law excludes "motion picture box office receipts (or any index, measure, value, or data related to such receipts)" from the definition of a commodity ([7 U.S.C. 1a(9)](https://www.law.cornell.edu/uscode/text/7/1a)). That exclusion came after studios opposed box office futures (Section 19). Music and talent industries could push for something similar, so artist goodwill (claiming, opt-out, revenue share) is a strategic asset.
- **Insider trading and manipulation.** Regulated venues must police both. The disclosure feed and surveillance in Section 8 are the foundation; blackout windows or bans for insiders can switch on as required.
- **Players.** Identity checks, anti-money-laundering controls, 18+ everywhere and 21+ where required, and responsible-play tools such as deposit limits, cool-offs and self-exclusion.

**Ethics and artist welfare**

- **No profit from tragedy.** The compassion halt settles positions at the pre-news price (Section 8).
- **No harassment channel.** Players can't message artists through HypeWave. Moderation removes abuse aimed at artists over price moves.
- **Professional data only.** The index uses audience stats, never relationships, health or private life.
- **Consent paths.** Opt-out within 7 days, a claim flow with real benefits, and no minors.
- **Honest framing.** Every screen says what HypeWave is: play money, not investment advice, not affiliated with the artists shown.

## 16. Risks and mitigations

The biggest risks are outside the product: artists and their industry pushing back, and regulators refusing a real-money version. Inside the product, the biggest risk is manipulation of small artists.

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Artist and industry pushback | Real people are traded without being asked | Opt-out honored within 7 days; a claim flow with benefits; no photos; the compassion halt; an optional revenue share |
| Regulators block a real-money version | It closes the main monetization route | Launch on play money; price audience data only; exclude crime, health and death; get counsel before any money route |
| Stat manipulation | Holders profit directly from bought streams or followers | Platform-reported stats only; a multi-platform index; smoothing; divergence halts; voided trades |
| Coordinated pumps | Group chats can inflate a small artist's premium | Buy limits and stake caps; one person, one account; "concentrated" labels; surveillance |
| Insider information | Artists and teams know release dates and deals first | Public insider feed; blackouts ready to switch on |
| Harassment of artists | Losing players may blame the artist | No messaging to artists; moderation; clear framing |
| Profit from tragedy | A death or illness spikes streams | Compassion halt at the pre-news price |
| Data provider dependence | A feed change or price hike breaks the index | Multiple providers; weights rescale when a stat is missing |
| Casino perception | Damages the brand and the regulatory case | No leverage, no celebration of trading itself, plain language, play money first |
| Thin markets feel dead | Few trades means little movement | Base values move with stats even with zero trades; seeded catalog; the time-capsule demo |
| Hindsight in the prototype | Players remember recent hits | An outcome mix that includes famous artists who were flat or down |

## 17. Roadmap and phases

HypeWave ships in six gated phases: this spec, the prototype, a balance lab, a live play-money beta, a money route and expansion. The prototype is the next build.

&#91;embedded content: Roadmap · 6 phases, 5 gates · durations are estimates\]

Durations are rough estimates for a small team, and each assumes the phase before it finished cleanly. The balance lab also produces the strongest pitch exhibit: a simulated pump-and-dump group losing money under HypeWave's rules.

## 18. Open questions and decision log

The decisions below were made on September 30, 2026 and shape everything above. The open questions need answers before or during the prototype build.

**Decisions**

| Decision | Choice | Why |
| --- | --- | --- |
| First category | Music only; other public figures later (Section 4) | Clean public data and the clearest hook |
| Instruments | Buy and sell only; calls and puts later if regulation allows | Simple to learn; avoids leverage and bets against people |
| Currency | Play money for the prototype and beta | Proves the fun and the fairness before any legal lift |
| Pricing | Base value from real stats × hype multiplier; continuous, no seasons or expiry | Being right pays; pumps unwind; prices never need resetting |
| Whale limits | Stake cap plus a rolling 30-day buy limit; selling never restricted | Stops cornering without trapping anyone in a position |
| Artists trading themselves | Allowed, with public disclosure | Betting on yourself is part of the appeal; transparency keeps it fair |
| Listings | Nominations above an attention threshold that starts high and steps down; opt-out, claiming and 18+ | Keeps the catalog clean and gives artists control |
| Prototype win condition | Time-capsule Reveal on real stats from two dates | Proves that spotting early pays, using real data |
| Artist visuals | Generated avatars, no photos | Safer for a public demo; distinctive look |
| Prototype stack | Next.js on Vercel; Supabase only for an optional leaderboard | Nothing needs to persist between sessions |
| Stat fraud | Rely on platform filtering, plus index smoothing and divergence checks | The platforms already fight fake streams; HypeWave covers the gap |

**Directions considered and rejected**

- **Crypto tokens or blockchain.** They add cost and stigma and bring no benefit to a game.
- **A fixed global supply of shares.** It would make one artist's gain another's loss for no reason.
- **Prices set only by trading.** Being right wouldn't pay unless the crowd followed, and prices would collapse when new buyers stopped.
- **Seasons with expiring contracts.** More machinery than a continuous game needs. Dated contracts stay available as a real-money option (Section 14).
- **User-posted creation bonds for listings.** Replaced by nominations plus the attention threshold.

**Open questions**

- [ ] Which data source supplies monthly listeners on both prototype dates: a provider trial or hand collection?
- [ ] Is a leaderboard in the prototype worth adding Supabase and server-side scoring?
- [ ] Do the default depth, fee, cap and limit feel right in playtests, or do small artists move too much or too little?
- [ ] How should starting premiums be set when history is missing?
- [ ] What weights and conversion factors should the production Hype Index use? Validate against a year of provider data.
- [ ] Should depth grow with trading activity at scale, and by what rule?
- [ ] What exact settlement price applies on delisting and compassion halts in a real-money setting?
- [ ] Should claimed artists get a revenue share, and from which revenue?
- [ ] Which money route (Section 14) does the operator pursue, and when?

## 19. Appendix: precedents and default parameters

**Precedents**

Each earlier attempt at trading on people or entertainment failed or stalled for a specific reason. HypeWave's design answers each one.

| Precedent | Years | What it was | What happened | HypeWave's answer |
| --- | --- | --- | --- | --- |
| [friend.tech](https://www.dlnews.com/articles/defi/socialfi-rose-in-popularity-last-year-before-falling/) | 2023–2024 | Crypto app selling "keys" to people's chats, priced on a bonding curve, with a 10% fee per sale | Launched August 2023; monthly revenue fell about 90% from its September peak by December as new buyers dried up | Prices anchored to real stats, a 1% fee, and limits on any one account |
| [BitClout](https://en.wikipedia.org/wiki/BitClout) | 2021 | Crypto "creator coins" tied to public figures | Pre-created about 15,000 profiles scraped from Twitter without consent; drew a cease-and-desist and public objections | Nominations, opt-out within 7 days, claiming and no photos |
| [Fantex](https://en.wikipedia.org/wiki/Fantex) | 2013–2016 | SEC-registered securities tied to athletes' future brand earnings | About six offerings raising $25.8 million; closed to individual investors in August 2016 | A game about audience, not a claim on anyone's income |
| Box office futures ([CFTC](https://www.cftc.gov/PressRoom/PressReleases/5846-10), [The Ringer](https://www.theringer.com/2018/11/15/movies/box-office-futures-dodd-frank-mpaa-recession)) | 2010 | Real-money futures on film grosses from Cantor Futures Exchange and Trend Exchange | Approved by the CFTC in June 2010, then banned by the Dodd-Frank Act in July 2010 after studio lobbying | Play money first; artist goodwill as a strategic asset |
| [Hollywood Stock Exchange](https://en.wikipedia.org/wiki/Hollywood_Stock_Exchange) | Long-running | Play-money market in actors, directors and films; Cantor Fitzgerald bought it in 2001 | A durable play-money game whose players predicted awards well; the real-money spin-off was blocked by the ban above | Proof that the play-money version can last |

**Default parameters**

Every value here is a starting point to tune in playtests and simulation. Production stores them as versioned config (Section 13).

| Parameter | Default | Section |
| --- | --- | --- |
| Starting balance (prototype) | H$10,000 | 12 |
| Base value constant k | 0.01 | 6 |
| Stats exponent α | 0.5 | 6 |
| Depth D | 25,000 shares, every artist | 6 |
| Trading fee | 1% on each buy and each sell | 6 |
| Stake cap | The greater of 5% of shares outstanding or 2,500 shares | 8 |
| Buy limit | 1,250 shares per artist per rolling 30 days | 8 |
| Index smoothing | 7-day trailing average | 7 |
| Daily base-value halt | A move of more than 20% | 7, 8 |
| Review halt length | Up to 24 hours | 8 |
| Insider disclosure delay | Within 15 minutes | 8 |
| Delisting sell-only window | 7 days | 8 |
| Attention threshold | 50,000, then 10,000, then 2,000 monthly-listener equivalents | 9 |
| Nominations to enter review | 25 unique players | 9 |
| Direct-add level | 5× the current threshold | 9 |
| Opt-out turnaround | 7 days | 9 |
| Time-capsule gap (prototype) | 6 months | 12 |
| Starting premium (prototype) | Half of prior six-month listener growth, from 0% to 40% | 12 |
| Dataset mix (prototype) | 10 Arena, 12 Mainstream, 14 Breakout, 14 Underground | 12 |

**Sources**

Pages opened while writing this document, as of September 30, 2026:

- [17 CFR 40.11](https://www.law.cornell.edu/cfr/text/17/40.11): prohibited event contracts and the 90-day public-interest review.
- [7 U.S.C. 1a](https://www.law.cornell.edu/uscode/text/7/1a): the box office exclusion from the definition of a commodity.
- [CFTC press release 5846-10](https://www.cftc.gov/PressRoom/PressReleases/5846-10): approval of Cantor's box office futures contract, June 28, 2010.
- [The Ringer on box office futures](https://www.theringer.com/2018/11/15/movies/box-office-futures-dodd-frank-mpaa-recession): approval, lobbying and the Dodd-Frank ban.
- [Hollywood Stock Exchange (Wikipedia)](https://en.wikipedia.org/wiki/Hollywood_Stock_Exchange).
- [Fantex (Wikipedia)](https://en.wikipedia.org/wiki/Fantex).
- [BitClout (Wikipedia)](https://en.wikipedia.org/wiki/BitClout).
- [DL News on friend.tech](https://www.dlnews.com/articles/defi/socialfi-rose-in-popularity-last-year-before-falling/).
- [Spotify Web API: Get Artist](https://developer.spotify.com/documentation/web-api/reference/get-an-artist): the fields returned and their deprecation.
- [Pillsbury on CFTC-regulated perpetual futures](https://www.pillsburylaw.com/en/news-and-insights/cftc-perpetual-futures-btc-eth-crypto-derivatives.html): Coinbase Derivatives listing, July 21, 2025.
- [Shacknews on Robinhood's confetti](https://www.shacknews.com/article/123629/robinhood-removes-confetti-feature-due-to-criticism-over-gamification-of-investing): removal in March 2021.
