"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Member } from "@/data/content";

const tints = ["#E0218A", "#0F7C7C", "#F4A300", "#D7263D", "#F2C14E", "#0a5f5f"];
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

// Polaroids and postage stamps pinned to a corkboard. Draggable with a mouse.
// On touch screens dragging is off so the page still scrolls normally.
export default function Corkboard({ members }: { members: Member[] }) {
  const board = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  useEffect(() => setDrag(matchMedia("(pointer: fine)").matches), []);

  return (
    <div ref={board} className="cork relative rounded-lg border-[10px] border-[#6b3f1f] p-5 shadow-[8px_8px_0_var(--color-ink)] sm:p-8">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((m, i) => {
          const stamp = i % 3 === 1;
          return (
            <motion.li
              key={m.name}
              drag={drag}
              dragConstraints={board}
              dragElastic={0.15}
              whileDrag={{ scale: 1.08, rotate: 0, zIndex: 20, boxShadow: "14px 18px 0 rgba(0,0,0,.35)" }}
              style={{ rotate: ((i * 37) % 13) - 6 }}
              className={`relative ${drag ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              <span className="absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full border-2 border-ink bg-vermillion shadow-[1px_2px_0_rgba(0,0,0,.4)]" aria-hidden="true" />
              <figure
                className={
                  stamp
                    ? "stamp-edge bg-cream p-3 drop-shadow-[4px_5px_0_rgba(0,0,0,.3)]"
                    : "bg-[#fbf6ea] p-2 pb-0 shadow-[4px_5px_0_rgba(0,0,0,.3)]"
                }
              >
                <div className="relative aspect-square overflow-hidden" style={{ background: tints[i % tints.length] }}>
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} fill sizes="(min-width:1024px) 20vw, 45vw" className="object-cover sepia-[.3]" draggable={false} />
                  ) : (
                    <>
                      <div className="halftone absolute inset-0 text-ink/25" aria-hidden="true" />
                      <span className="painted absolute inset-0 grid place-items-center font-display text-5xl text-cream" aria-hidden="true">
                        {initials(m.name)}
                      </span>
                    </>
                  )}
                </div>
                <figcaption className={`py-2 text-center ${stamp ? "" : "pb-3"}`}>
                  <span className="block font-poster text-lg leading-tight">{m.name}</span>
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-teal-deep">{m.role}</span>
                </figcaption>
              </figure>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
