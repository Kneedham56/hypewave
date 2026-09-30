import { Card, PageTitle } from "@/components/ui";
import { MARKET, SESSION } from "@/lib/config";

export const metadata = { title: "How it works · HypeWave" };

const n = (x: number) => x.toLocaleString("en-US");

export default function HowItWorks() {
  return (
    <div className="max-w-2xl">
      <PageTitle sub="Everything that moves a price, in plain words.">How it works</PageTitle>

      <div className="space-y-4">
        <Section title="Every price has two parts">
          <p>
            <b className="text-ink">Stats value</b> comes from the artist&apos;s real monthly listeners. It grows with the square
            root of their audience, so an artist who grows 16× sees their stats value rise 4×. It only moves when their real
            numbers move.
          </p>
          <p>
            <b className="text-ink">Hype premium</b> comes from players. Every share bought nudges it up and every share sold
            nudges it down. It shows how far the crowd has priced an artist above their stats.
          </p>
          <p className="rounded-xl bg-surface-2 px-3 py-2 font-display text-ink">Price = stats value × (1 + hype premium)</p>
        </Section>

        <Section title="Big orders move the price">
          <p>
            Prices move as you trade, so a big buy pays a little more for each share than the last. Smaller artists move
            more, because their shares are cheaper. The trade preview always shows your price impact before you confirm.
          </p>
          <p>
            Every buy and every sell has a {MARKET.feeRate * 100}% fee. Buying and selling back straight away returns about
            98% of what you spent, so churning loses.
          </p>
        </Section>

        <Section title="Limits keep it fair">
          <p>
            <b className="text-ink">Buy limit:</b> you can buy up to {n(MARKET.buyLimitShares)} shares of any one artist per
            30 days (in this demo, per session). Selling doesn&apos;t give that room back.
          </p>
          <p>
            <b className="text-ink">Stake cap:</b> nobody can hold more than {n(MARKET.stakeCapFloor)} shares of an artist, or{" "}
            {MARKET.stakeCapPct * 100}% of all their shares once that&apos;s bigger.
          </p>
          <p>
            <b className="text-ink">Selling is never limited.</b> If you see trouble coming, you can always get out.
          </p>
        </Section>

        <Section title="The time capsule">
          <p>
            You start six months in the past with {SESSION.currency}
            {n(SESSION.startingCash)}. Build a portfolio from what you can see then: listener counts, six-month trends and
            hype premiums.
          </p>
          <p>
            When you hit Reveal, every artist&apos;s stats jump to today. Your score is what you&apos;d get if you sold everything
            at the new prices, after fees and price impact. Pumping a small artist yourself won&apos;t inflate it.
          </p>
        </Section>

        <Section title="The fine print">
          <p>
            HypeCash is play money. It can&apos;t be bought, sold or cashed out. This is a prototype, not investment advice, and
            it isn&apos;t affiliated with any artist. In this sample build, the artists and their numbers are fictional.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted">{children}</div>
    </Card>
  );
}
