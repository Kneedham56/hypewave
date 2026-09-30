"use client";

import { forwardRef } from "react";
import { listeners, money, pct } from "@/lib/format";
import { positionReturn, type Position } from "@/lib/portfolio";

// 9:16 card sized for Stories. Plain SVG so it can be exported to PNG.
// System font fallbacks are listed because an SVG drawn to a canvas can't
// load the page's web fonts.

const FONT = "'Space Grotesk', 'Segoe UI', Arial, sans-serif";

export const ShareCard = forwardRef<SVGSVGElement, { best: Position | null; total: number; returnPct: number }>(
  function ShareCard({ best, total, returnPct }, ref) {
    const r = best ? positionReturn(best) : 0;
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="360" height="640" className="block h-auto w-full" role="img" aria-label="Your HypeWave results card">
        <defs>
          <linearGradient id="share-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1a1040" />
            <stop offset="0.55" stopColor="#0b0b10" />
            <stop offset="1" stopColor="#2a0d22" />
          </linearGradient>
          <linearGradient id="share-wave" x1="0" x2="1">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="0.55" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#ff4d8d" />
          </linearGradient>
        </defs>
        <rect width="360" height="640" rx="28" fill="url(#share-bg)" />
        <path d="M28 48c6 0 6-14 12-14s6 28 12 28 6-20 12-20 6 10 12 10" fill="none" stroke="url(#share-wave)" strokeWidth="4" strokeLinecap="round" />
        <text x="96" y="55" fill="#f4f4f8" fontFamily={FONT} fontWeight="700" fontSize="22">HypeWave</text>

        <text x="28" y="140" fill="#a0a0b8" fontFamily={FONT} fontSize="14" letterSpacing="2">MY BEST CALL</text>
        <text x="28" y="186" fill="#f4f4f8" fontFamily={FONT} fontWeight="700" fontSize={best && best.artist.name.length > 14 ? 30 : 38}>
          {best?.artist.name ?? "Sat this one out"}
        </text>
        {best && (
          <>
            <text x="28" y="226" fill="#a0a0b8" fontFamily={FONT} fontSize="16">
              Bought at {listeners(best.artist.listenersThen)} listeners.
            </text>
            <text x="28" y="250" fill="#a0a0b8" fontFamily={FONT} fontSize="16">
              Now {listeners(best.artist.listenersNow)}.
            </text>
            <text x="28" y="340" fill={r >= 0 ? "#b8ff3c" : "#ff5a5f"} fontFamily={FONT} fontWeight="700" fontSize="72">
              {pct(r)}
            </text>
          </>
        )}

        <line x1="28" x2="332" y1="430" y2="430" stroke="#2a2a3a" />
        <text x="28" y="470" fill="#a0a0b8" fontFamily={FONT} fontSize="14" letterSpacing="2">PORTFOLIO</text>
        <text x="28" y="512" fill="#f4f4f8" fontFamily={FONT} fontWeight="700" fontSize="34">{money(total, { cents: false })}</text>
        <text x="332" y="512" textAnchor="end" fill={returnPct >= 0 ? "#b8ff3c" : "#ff5a5f"} fontFamily={FONT} fontWeight="700" fontSize="24">
          {pct(returnPct)}
        </text>

        <text x="28" y="604" fill="#6b6b80" fontFamily={FONT} fontSize="12">Play money. Spot them before they blow up.</text>
      </svg>
    );
  },
);

/** Render an SVG element to a PNG and download it. */
export async function downloadSvgAsPng(svg: SVGSVGElement, filename: string, scale = 3) {
  const xml = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = svg.viewBox.baseVal.width * scale;
    canvas.height = svg.viewBox.baseVal.height * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = filename;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
