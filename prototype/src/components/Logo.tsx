export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 28" className={className} role="img" aria-label="HypeWave">
      <defs>
        <linearGradient id="logo-wave" x1="0" x2="1">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="0.55" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#ff4d8d" />
        </linearGradient>
      </defs>
      <path
        d="M2 14c3.5 0 3.5-9 7-9s3.5 18 7 18 3.5-12 7-12 3.5 6 7 6"
        fill="none"
        stroke="url(#logo-wave)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <text x="38" y="20.5" fill="currentColor" fontFamily="var(--font-space-grotesk)" fontWeight="700" fontSize="19" letterSpacing="-0.5">
        HypeWave
      </text>
    </svg>
  );
}
