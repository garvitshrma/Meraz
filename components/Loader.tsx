"use client";

// Animation is pure CSS (globals.css) so it plays before JS loads.
// JS only removes it when finished or clicked. Hidden for reduced-motion and repeat visits.
import { useState } from "react";

const bars = ["#F3E6C8", "#F2C14E", "#0F7C7C", "#F4A300", "#E0218A", "#D7263D", "#1A1A1A"];

export default function Loader() {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <div
      className="crt-loader"
      aria-hidden="true"
      onClick={() => setGone(true)}
      onAnimationEnd={(e) => e.target === e.currentTarget && setGone(true)}
    >
      <div className="crt-screen">
        <div className="crt-layer crt-static" />
        <div className="crt-layer crt-testcard">
          <div className="absolute inset-0 flex">
            {bars.map((c) => (
              <div key={c} className="flex-1" style={{ background: c }} />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-[14%] h-[10%] bg-[repeating-linear-gradient(90deg,#1a1a1a_0_8%,#f3e6c8_8%_16%)]" />
          <div className="absolute left-1/2 top-1/2 grid aspect-square w-[46%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-ink bg-cream bg-[linear-gradient(#1a1a1a33_1px,transparent_1px),linear-gradient(90deg,#1a1a1a33_1px,transparent_1px)] bg-[size:12.5%_12.5%]">
            <div className="text-center">
              <div className="bg-ink px-3 py-1 font-display text-[clamp(1rem,4vw,2.2rem)] text-turmeric">MERAZ</div>
              <div className="mt-1 font-mono text-[clamp(.6rem,1.8vw,.9rem)] font-bold text-ink">परीक्षण संकेत · TEST SIGNAL</div>
            </div>
          </div>
        </div>
        <div className="crt-layer crt-title">
          <strong>MERAZ 7.0</strong>
          <span className="mt-2 font-mono text-sm tracking-[.3em] text-cream/70">चैनल ७ · NOW SHOWING</span>
        </div>
      </div>
      <span className="absolute bottom-6 font-mono text-xs tracking-widest text-cream/50">CLICK TO SKIP</span>
    </div>
  );
}
