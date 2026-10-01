"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import type { TimelineDay } from "@/data/content";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-";
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
            {ch === " " ? "\u00a0" : ch}
          </span>
        ))}
      </span>
      <span className="sr-only">{text.trim()}</span>
    </>
  );
}

// Timeline as a railway split-flap departure board. Day tabs switch the board; rows re-flap on change.
export default function SplitFlapBoard({ days }: { days: TimelineDay[] }) {
  const [day, setDay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (inView) setRun((r) => r + 1);
  }, [inView, day]);
  const d = days[day];

  return (
    <div ref={ref} className="rounded-xl border-4 border-ink bg-[#0e0e0e] p-3 text-turmeric shadow-[8px_8px_0_var(--color-ink)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-turmeric/30 pb-4">
        <div>
          <p className="font-deva text-2xl text-cream">प्रस्थान</p>
          <p className="font-display text-2xl sm:text-3xl">DEPARTURES</p>
          <p className="mt-1 font-mono text-xs tracking-widest text-cream/70">
            {d.date.toUpperCase()} / {d.time}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Choose day">
          {days.map((x, i) => (
            <button
              key={x.date}
              type="button"
              aria-pressed={day === i}
              onClick={() => setDay(i)}
              className="min-h-11 border-2 border-turmeric px-3 py-1 font-mono text-sm font-bold aria-pressed:bg-turmeric aria-pressed:text-ink"
            >
              DAY {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-x-auto" data-lenis-prevent-wheel>
        <table className="mt-4 w-full border-separate border-spacing-y-2 font-mono text-[10px] sm:text-sm xl:text-base">
          <caption className="sr-only">{d.date} schedule</caption>
          <thead>
            <tr className="text-left text-[10px] tracking-widest text-cream/60 sm:text-xs">
              <th scope="col" className="pr-2 font-normal">TIME</th>
              <th scope="col" className="pr-2 font-normal">EVENT</th>
              <th scope="col" className="hidden font-normal md:table-cell">PLATFORM</th>
            </tr>
          </thead>
          <tbody>
            {d.events.map((e, r) => (
              <tr key={e.title}>
                <td className="pr-2">
                  <Flaps text={fit(e.time, 8)} delay={r * 90} run={run} />
                </td>
                <td className="pr-2">
                  <Flaps text={fit(e.title, 20)} delay={r * 90 + 100} run={run} />
                </td>
                <td className="hidden md:table-cell">
                  <Flaps text={fit(e.location, 17)} delay={r * 90 + 200} run={run} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[10px] tracking-widest text-cream/60">YATRIGAN KRIPYA DHYAN DEIN · PASSENGERS PLEASE NOTE: TIMINGS MAY CHANGE</p>
    </div>
  );
}
