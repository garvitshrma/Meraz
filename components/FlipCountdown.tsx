"use client";

import { useEffect, useState } from "react";

const units = [
  ["Days", "दिन"],
  ["Hours", "घंटे"],
  ["Mins", "मिनट"],
  ["Secs", "सेकंड"],
];

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
}

export default function FlipCountdown({ target }: { target: string }) {
  // null until mounted, so server and client render the same markup
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const vals = now === null ? null : split(new Date(target).getTime() - now);

  return (
    <div className="flex gap-2.5 sm:gap-5">
      <p className="sr-only">{vals ? `${vals[0]} days to go` : "Countdown to the fest"}</p>
      {units.map(([en, hi], i) => {
        const digits = vals ? String(vals[i]).padStart(2, "0") : "--";
        return (
          <div key={en} className="text-center" aria-hidden="true">
            <div className="flex gap-1 font-display text-[clamp(1.3rem,6.2vw,3rem)]">
              {digits.split("").map((d, j) => (
                <span key={j} className="flip-digit">
                  <span key={d} className="flip-card">
                    {d}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider sm:text-[11px] sm:tracking-widest">
              {en} · <span className="font-deva normal-case tracking-normal">{hi}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
