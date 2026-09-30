"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { categoryStyle, type FestEvent } from "@/data/events";

const dayDate = ["", "19 FEB", "20 FEB", "21 FEB"]; // PLACEHOLDER: match fest dates

export default function EventTicket({ event, serial }: { event: FestEvent; serial: number }) {
  return (
    <motion.div initial="rest" whileHover="hover" animate="rest" variants={{ rest: { rotate: 0, y: 0 }, hover: { rotate: -1.5, y: -6 } }} className="h-full">
      <Link
        href={`/events/${event.slug}`}
        className="group relative flex h-full overflow-hidden rounded-md border-[3px] border-ink bg-cream shadow-[6px_6px_0_var(--color-ink)] focus-visible:outline-offset-4"
      >
        <div className="halftone pointer-events-none absolute inset-0 text-ink/[.06]" aria-hidden="true" />
        {/* main part */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className={`flex items-center justify-between px-4 py-2 font-display text-sm ${categoryStyle[event.category]}`}>
            <span>{event.category}</span>
            <span className="font-mono text-xs">ADMIT ONE</span>
          </div>
          <div className="flex flex-1 flex-col p-4">
            {event.hindi && <p className="font-deva text-lg text-rani-deep">{event.hindi}</p>}
            <h3 className="font-poster text-2xl leading-tight group-hover:underline">{event.title}</h3>
            <p className="mt-1 text-sm">{event.tagline}</p>
            <dl className="mt-auto grid grid-cols-3 gap-2 border-t-2 border-dashed border-ink/40 pt-3 font-mono text-[11px] uppercase">
              <div>
                <dt className="text-ink/60">Screen</dt>
                <dd className="font-bold">{event.venue}</dd>
              </div>
              <div>
                <dt className="text-ink/60">Show</dt>
                <dd className="font-bold">
                  {dayDate[event.day]} {event.time}
                </dd>
              </div>
              <div>
                <dt className="text-ink/60">{event.prize ? "Prize" : "Row"}</dt>
                <dd className="font-bold">{event.prize ?? `Day ${event.day}`}</dd>
              </div>
            </dl>
          </div>
        </div>
        {/* perforation */}
        <div className="relative w-0 border-l-[3px] border-dashed border-ink" aria-hidden="true">
          <span className="absolute -left-[11px] -top-3 size-5 rounded-full border-[3px] border-ink bg-cream" />
          <span className="absolute -bottom-3 -left-[11px] size-5 rounded-full border-[3px] border-ink bg-cream" />
        </div>
        {/* stub: tears slightly on hover */}
        <motion.div
          variants={{ rest: { rotate: 0, x: 0 }, hover: { rotate: 5, x: 5 } }}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
          style={{ transformOrigin: "0% 0%" }}
          className="flex w-14 shrink-0 items-center justify-center bg-turmeric sm:w-16"
          aria-hidden="true"
        >
          <span className="rotate-90 whitespace-nowrap font-mono text-xs font-bold tracking-widest">No. {String(70123 + serial * 137).padStart(6, "0")}</span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
