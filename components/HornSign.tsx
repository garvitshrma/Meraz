"use client";

import { useRef } from "react";

// Truck-art sign. Tap it 7 times to trigger the Konami dance (for phones without arrow keys).
export default function HornSign() {
  const taps = useRef(0);
  return (
    <div
      onClick={() => ++taps.current % 7 === 0 && dispatchEvent(new Event("meraz:konami"))}
      className="relative mx-auto max-w-3xl -rotate-1 border-[6px] border-double border-turmeric bg-rani px-4 py-8 text-center shadow-[8px_8px_0_var(--color-teal)] sm:px-10"
    >
      <Flower className="absolute left-3 top-3" />
      <Flower className="absolute right-3 top-3" />
      <Flower className="absolute bottom-3 left-3" />
      <Flower className="absolute bottom-3 right-3" />
      <p className="font-deva text-2xl text-turmeric sm:text-3xl">फिर मिलेंगे</p>
      <p className="painted font-display text-[clamp(2.4rem,9vw,5.5rem)] leading-[.95] text-cream misprint">
        HORN
        <span className="mx-3 inline-block -rotate-6 bg-turmeric px-2 text-ink [-webkit-text-stroke:0]">OK</span>
        PLEASE
      </p>
      <p className="mt-3 font-mono text-sm font-bold tracking-[.25em] text-cream">USE DIPPER AT NIGHT · TA TA · BYE BYE</p>
    </div>
  );
}

function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`size-7 sm:size-9 ${className}`} aria-hidden="true">
      {[0, 45, 90, 135].map((a) => (
        <ellipse key={a} cx="20" cy="20" rx="6" ry="17" fill="#F4A300" stroke="#1a1a1a" strokeWidth="1.5" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="6" fill="#0F7C7C" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
}
