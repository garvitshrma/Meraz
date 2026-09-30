"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Artist } from "@/data/content";

// A "Coming Soon" stamp slams onto the poster, then the poster peels away to reveal the artist.
// Artists with revealed: false keep the stamp and never peel.
export default function PosterReveal({ artist, index }: { artist: Artist; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "stamped" | "peeled">("idle");

  useEffect(() => {
    if (!inView) return;
    if (reduced) return setPhase(artist.revealed ? "peeled" : "stamped");
    const a = setTimeout(() => setPhase("stamped"), 300 + index * 250);
    const b = artist.revealed ? setTimeout(() => setPhase("peeled"), 1900 + index * 250) : undefined;
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [inView, reduced, artist.revealed, index]);

  const tones = ["[--ray-a:#E0218A] [--ray-b:#D7263D]", "[--ray-a:#0F7C7C] [--ray-b:#0a5f5f]", "[--ray-a:#F4A300] [--ray-b:#D7263D]"];

  return (
    <div ref={ref} className="relative aspect-[3/4] overflow-hidden border-4 border-ink bg-ink shadow-[8px_8px_0_var(--color-ink)]">
      {/* revealed artist */}
      <div className={`sunburst absolute inset-0 ${tones[index % 3]}`} aria-hidden="true" />
      <div className="halftone absolute inset-0 text-ink/25" aria-hidden="true" />
      <div className="relative flex h-full flex-col items-center justify-end p-5 text-center text-cream">
        <Silhouette variant={index} />
        <p className="mt-2 font-deva text-2xl text-turmeric">{artist.hindi}</p>
        <h3 className="painted font-display text-3xl leading-none sm:text-4xl">{artist.revealed ? artist.name : "???"}</h3>
        <p className="mt-2 bg-ink px-3 py-1 font-mono text-xs font-bold tracking-widest">
          {artist.genre.toUpperCase()} · {artist.night.toUpperCase()}
        </p>
      </div>

      {/* poster cover */}
      <motion.div
        aria-hidden={phase === "peeled"}
        initial={false}
        animate={phase === "peeled" ? { rotate: -100, y: 60, opacity: 0 } : { rotate: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.6, 0, 0.8, 0.4] }}
        style={{ transformOrigin: "0% 0%" }}
        className="paper absolute inset-0 flex flex-col items-center justify-center border-4 border-ink p-6 text-center"
      >
        <p className="font-mono text-xs font-bold tracking-[.3em]">PRO-NITE {index + 1}</p>
        <p className="font-deva text-3xl text-rani">जल्द आ रहा है</p>
        <p className="font-poster text-6xl leading-none text-ink/80">?</p>
        <p className="mt-2 font-display text-xl">{artist.night}</p>
        <div className="absolute bottom-0 right-0 size-12 bg-[linear-gradient(135deg,transparent_50%,#c9b27f_50%)] shadow-[-3px_-3px_6px_rgb(0_0_0/.25)]" />
        <motion.div
          initial={false}
          animate={phase === "idle" ? { scale: 3, opacity: 0, rotate: -30 } : { scale: 1, opacity: 1, rotate: -14 }}
          transition={{ type: "spring", stiffness: 520, damping: 17 }}
          className="absolute left-1/2 top-1/2 -ml-[45%] -mt-10 w-[90%] border-[5px] border-double border-vermillion px-2 py-3 font-display text-[clamp(1.5rem,5vw,2.25rem)] leading-none text-vermillion mix-blend-multiply"
        >
          COMING SOON
        </motion.div>
      </motion.div>
    </div>
  );
}

function Silhouette({ variant }: { variant: number }) {
  // Three simple original figures: singer with mic, DJ with headphones, performer with arms up.
  const paths = [
    "M60 20a16 16 0 1 1 0 32 16 16 0 0 1 0-32Zm-30 120c0-40 12-70 30-70s30 30 30 70ZM78 60l22-22 6 6-22 22Z",
    "M60 22a16 16 0 1 1 0 32 16 16 0 0 1 0-32ZM38 38a24 24 0 0 1 44 0h-6a18 18 0 0 0-32 0ZM34 36h8v14h-8Zm44 0h8v14h-8ZM20 140c0-36 16-66 40-66s40 30 40 66ZM10 110h100v10H10Z",
    "M60 34a14 14 0 1 1 0 28 14 14 0 0 1 0-28Zm-28 106c0-36 10-66 28-66s28 30 28 66ZM40 80 14 26l8-4 26 52Zm40 0 26-54 8 4-26 52Z",
  ];
  return (
    <svg viewBox="0 0 120 140" className="w-2/3 max-w-52 drop-shadow-[4px_4px_0_#F2C14E]" aria-hidden="true">
      <path d={paths[variant % 3]} fill="#1a1a1a" />
    </svg>
  );
}
