"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "@phosphor-icons/react";

// A medal in the site's retro style: a turmeric seal with a scalloped edge, slowly turning, a pink face with the
// arrow and "TOP" on it, and a hard ink shadow. It rises into view once the page is scrolled and rides the scroll
// back to the top. Kept above a phone's home bar and out of the print.
const TEETH = 20;
const SEAL = Array.from({ length: TEETH * 2 }, (_, i) => {
  const r = i % 2 ? 43.5 : 48.5;
  const a = (i / (TEETH * 2)) * Math.PI * 2;
  return `${i ? "L" : "M"}${(50 + r * Math.sin(a)).toFixed(2)} ${(50 - r * Math.cos(a)).toFixed(2)}`;
}).join("") + "Z";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 size-16 rounded-full text-cream drop-shadow-[3px_4px_0_var(--color-ink)] transition-[opacity,translate,scale,filter] duration-300 hover:-translate-y-1 hover:scale-105 hover:drop-shadow-[3px_8px_0_var(--color-ink)] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-0.5 active:scale-95 motion-reduce:transition-none sm:bottom-8 sm:right-8 sm:size-[4.5rem] print:hidden ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full animate-roll" style={{ animationDuration: "30s" }}>
        <path d={SEAL} fill="#f2c14e" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="2.5 3.5" />
      </svg>
      <span aria-hidden="true" className="absolute inset-[16%] grid place-items-center rounded-full border-[3px] border-ink bg-rani-deep">
        <span className="flex flex-col items-center leading-none">
          <ArrowUp size={20} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          <span className="-mt-px font-display text-[0.65rem] font-bold tracking-widest sm:text-xs">TOP</span>
        </span>
      </span>
    </button>
  );
}
