"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { categories, type Category, type FestEvent } from "@/data/events";
import EventTicket from "./EventTicket";

// zigzag: two columns with the right column dropped, used on the home page.
export default function EventsGrid({ events, filter = true, zigzag = false }: { events: FestEvent[]; filter?: boolean; zigzag?: boolean }) {
  const [active, setActive] = useState<Category | "All">("All");
  const shown = active === "All" ? events : events.filter((e) => e.category === active);

  return (
    <div>
      {filter && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter events by category">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={active === c}
              onClick={() => setActive(c)}
              className="min-h-11 border-[3px] border-ink bg-cream px-4 py-1.5 font-display text-sm shadow-[3px_3px_0_var(--color-ink)] transition-colors hover:bg-turmeric aria-pressed:bg-ink aria-pressed:text-turmeric"
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <motion.ul layout className={`grid gap-7 sm:grid-cols-2 ${zigzag ? "sm:gap-x-12 lg:gap-x-20 sm:[&>li:nth-child(even)]:mt-16" : "lg:grid-cols-3"}`}>
        <AnimatePresence mode="popLayout">
          {shown.map((e) => (
            <motion.li
              key={e.slug}
              layout
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <EventTicket event={e} serial={events.indexOf(e)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {shown.length === 0 && (
        <p className="border-4 border-dashed border-ink p-8 text-center font-display text-xl">
          No {active} shows announced yet. Check back soon.
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {shown.length} events shown
      </p>
    </div>
  );
}
