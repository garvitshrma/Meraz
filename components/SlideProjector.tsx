"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Slide } from "@/data/content";
import { useSound } from "@/lib/sound";

const patterns: Record<Slide["pattern"], (a: string, b: string) => string> = {
  rays: (a, b) => `repeating-conic-gradient(from 0deg at 50% 110%, ${a} 0 8deg, ${b} 8deg 16deg)`,
  stripes: (a, b) => `repeating-linear-gradient(-45deg, ${a} 0 28px, ${b} 28px 56px)`,
  dots: (a, b) => `radial-gradient(${b} 22%, transparent 24%) 0 0/40px 40px, ${a}`,
  checks: (a, b) => `repeating-conic-gradient(${a} 0 25%, ${b} 0 50%) 0 0/60px 60px`,
};

// Old slide projector: a lamp cone lights a framed slide; changing slides drops the old one with a click-clack.
export default function SlideProjector({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const { clack } = useSound();
  const s = slides[i];
  const go = (d: number) => {
    clack();
    setI((i + d + slides.length) % slides.length);
  };

  return (
    <div
      className="mx-auto max-w-4xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Fest gallery"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
    >
      {/* screen */}
      <div className="relative rounded-md border-4 border-ink bg-[#fffaf0] p-3 shadow-[0_0_60px_rgb(255_240_200/.35),8px_8px_0_var(--color-ink)] sm:p-5">
        <div className="relative aspect-[4/3] overflow-hidden border-[14px] border-[#e9e2d2] bg-ink outline-2 outline-ink sm:aspect-[16/10]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={i}
              initial={{ y: "-100%", opacity: 0.4 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.4 }}
              transition={{ duration: 0.28, ease: [0.7, 0, 0.3, 1] }}
              className="absolute inset-0"
            >
              {s.src ? (
                <Image src={s.src} alt={`${s.title}, ${s.year}`} fill sizes="(min-width: 900px) 860px, 95vw" className="object-cover sepia-[.25]" />
              ) : (
                <div className="absolute inset-0" style={{ background: patterns[s.pattern](s.a, s.b) }} aria-hidden="true" />
              )}
              <div className="halftone absolute inset-0 text-ink/20" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 text-cream sm:p-6">
                <span className="font-mono text-xs tracking-widest text-turmeric">MERAZ {s.year}</span>
                <span className="block font-display text-2xl leading-tight sm:text-4xl">{s.title}</span>
                <span className="block font-poster text-lg sm:text-xl">{s.caption}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          {/* lamp flicker + vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse,transparent_55%,rgb(0_0_0/.55))]" aria-hidden="true" />
          <motion.div
            key={`flash-${i}`}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 bg-[#fff7e0]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* projector body */}
      <div className="relative mx-auto mt-6 flex max-w-xl items-center justify-between gap-3 rounded-2xl border-4 border-ink bg-teal-deep px-4 py-3 text-cream shadow-[6px_6px_0_var(--color-ink)]">
        <button type="button" onClick={() => go(-1)} className="btn bg-marigold !px-4 !py-2 text-ink" aria-label="Previous slide">
          ◀
        </button>
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full border-4 border-ink bg-[radial-gradient(circle,#fff7e0,#F2C14E_45%,#1a1a1a_70%)]" aria-hidden="true" />
          <p className="font-mono text-sm font-bold tracking-widest" aria-live="polite">
            SLIDE {String(i + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
          </p>
        </div>
        <button type="button" onClick={() => go(1)} className="btn bg-marigold !px-4 !py-2 text-ink" aria-label="Next slide">
          ▶
        </button>
      </div>
    </div>
  );
}
