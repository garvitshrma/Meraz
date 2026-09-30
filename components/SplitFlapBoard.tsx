"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { eventsByDay } from "@/data/events";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-";
const STATUS = ["ON TIME", "BOARDING", "ON TIME", "ON TIME", "DELAYED", "ON TIME"];
const fit = (s: string, n: number) => s.toUpperCase().replace(/[^A-Z0-9: -]/g, "").slice(0, n).padEnd(n, " ");

// Each cell scrambles through random characters, then settles left-to-right.
function Flaps({ text, delay, run }: { text: string; delay: number; run: number }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!run || matchMedia("(prefers-reduced-motion: reduce)").matches) return setOut(text);
    const start = performance.now();
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const t = performance.now() - start;
      let done = true;
      setOut(
        [...text]
          .map((ch, i) => {
            if (ch === " " || t > delay + i * 40) return ch;
            done = false;
            return CHARS[(Math.random() * CHARS.length) | 0];
          })
          .join(""),
      );
      if (!done) id = setTimeout(tick, 60);
    };
    tick();
    return () => clearTimeout(id);
  }, [text, delay, run]);
  return (
    <>
      <span aria-hidden="true" className="whitespace-nowrap">
        {[...out].map((ch, i) => (
          <span key={i} className="flap">
            {ch}
          </span>
        ))}
      </span>
      <span className="sr-only">{text.trim()}</span>
    </>
  );
}

export default function SplitFlapBoard({ limit }: { limit?: number }) {
  const [day, setDay] = useState<1 | 2 | 3>(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (inView) setRun((r) => r + 1);
  }, [inView, day]);
  const rows = eventsByDay(day).slice(0, limit);

  return (
    <div ref={ref} className="rounded-xl border-4 border-ink bg-[#0e0e0e] p-3 text-turmeric shadow-[8px_8px_0_var(--color-teal)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-turmeric/30 pb-4">
        <div>
          <p className="font-deva text-2xl text-cream">प्रस्थान</p>
          <p className="font-display text-2xl sm:text-3xl">DEPARTURES</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Choose day">
          {([1, 2, 3] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={day === d}
              onClick={() => setDay(d)}
              className="border-2 border-turmeric px-3 py-1 font-mono text-sm font-bold aria-pressed:bg-turmeric aria-pressed:text-ink"
            >
              DAY {d}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto" data-lenis-prevent-wheel>
        <table className="mt-4 w-full border-separate border-spacing-y-2 font-mono text-[11px] sm:text-base">
          <caption className="sr-only">Day {day} schedule</caption>
          <thead>
            <tr className="text-left text-[10px] tracking-widest text-cream/60 sm:text-xs">
              <th scope="col" className="pr-3 font-normal">TIME</th>
              <th scope="col" className="pr-3 font-normal">EVENT</th>
              <th scope="col" className="hidden pr-3 font-normal md:table-cell">PLATFORM</th>
              <th scope="col" className="font-normal">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e, r) => (
              <tr key={e.slug}>
                <td className="pr-3">
                  <Flaps text={e.time} delay={r * 90} run={run} />
                </td>
                <td className="pr-3">
                  <Flaps text={fit(e.title, 16)} delay={r * 90 + 100} run={run} />
                </td>
                <td className="hidden pr-3 md:table-cell">
                  <Flaps text={fit(e.venue, 14)} delay={r * 90 + 200} run={run} />
                </td>
                <td className={STATUS[r % STATUS.length] === "BOARDING" ? "text-marigold" : STATUS[r % STATUS.length] === "DELAYED" ? "text-rani" : ""}>
                  <Flaps text={fit(STATUS[r % STATUS.length], 8)} delay={r * 90 + 300} run={run} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[10px] tracking-widest text-cream/50">YATRIGAN KRIPYA DHYAN DEIN · PASSENGERS PLEASE NOTE: TIMINGS MAY CHANGE</p>
    </div>
  );
}
