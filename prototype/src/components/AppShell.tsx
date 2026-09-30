"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { dataset } from "@/lib/data";
import { longDate, money } from "@/lib/format";
import { useSession } from "@/lib/store";
import { Logo } from "./Logo";

const NAV = [
  { href: "/market", label: "Market", icon: IconGrid },
  { href: "/portfolio", label: "Portfolio", icon: IconPie },
  { href: "/how-it-works", label: "How it works", icon: IconInfo },
];

// Full-screen moments with no chrome
const BARE = ["/", "/reveal"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.resolve(useSession.persist.rehydrate()).then(() => setHydrated(true));
  }, []);

  const bare = BARE.includes(pathname);

  return (
    <MotionConfig reducedMotion="user">
      {hydrated ? (
        bare ? (
          children
        ) : (
          <div className="flex min-h-dvh flex-col">
            <TopBar pathname={pathname} />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-28 md:pb-12">{children}</main>
            <Footer />
            <BottomNav pathname={pathname} />
          </div>
        )
      ) : (
        <div className="grid min-h-dvh place-items-center">
          <Logo className="h-8 animate-pulse" />
        </div>
      )}
    </MotionConfig>
  );
}

function TopBar({ pathname }: { pathname: string }) {
  const cash = useSession((s) => s.cash);
  const phase = useSession((s) => s.phase);
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/" aria-label="HypeWave home">
          <Logo className="h-6" />
        </Link>
        <nav className="ml-4 hidden gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                pathname.startsWith(n.href) ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-line px-2.5 py-1 text-xs text-muted sm:inline">
            {longDate(phase === "trading" ? dataset.thenDate : dataset.nowDate)}
          </span>
          <span className="nums rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold" aria-label="Cash">
            {money(cash, { cents: false })}
          </span>
        </div>
      </div>
      {dataset.sample && (
        <p className="border-t border-line/60 bg-violet/10 px-4 py-1 text-center text-[11px] text-muted">
          Sample build: artists and stats are fictional placeholders.
        </p>
      )}
    </header>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line/60 bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {NAV.map((n) => {
          const active = pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${active ? "text-ink" : "text-muted"}`}
            >
              <n.icon active={active} />
              {n.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-24 text-[11px] leading-relaxed text-muted md:pb-6">
      Play money, no real value. Not investment advice. Not affiliated with the artists shown.
    </footer>
  );
}

type IconProps = { active: boolean };

function IconGrid({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {[3, 13].flatMap((x) =>
        [3, 13].map((y) => (
          <rect key={`${x}${y}`} x={x} y={y} width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} />
        )),
      )}
    </svg>
  );
}

function IconPie({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.5V12h8.5A8.5 8.5 0 0 0 12 3.5Z" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconInfo({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" fill={active ? "currentColor" : "none"} />
      <path d="M12 11v5M12 8h.01" stroke={active ? "var(--color-bg)" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
