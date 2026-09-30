"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { site, stations } from "@/data/site";
import { ArrowUpRight, Radio, X } from "@phosphor-icons/react";
import { useSound } from "@/lib/sound";

const SWEEP = 270; // degrees of knob travel
const last = stations.length - 1;
const angleFor = (i: number) => -SWEEP / 2 + (i / last) * SWEEP;
const indexFor = (a: number) => Math.round(((a + SWEEP / 2) / SWEEP) * last);

export default function RadioNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { crackle } = useSound();
  const dialog = useRef<HTMLDialogElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const current = Math.max(0, stations.findIndex((s) => (s.href === "/" ? pathname === "/" : pathname.startsWith(s.href))));
  const [angle, setAngle] = useState(angleFor(current));
  const [staticKey, setStaticKey] = useState(0);
  const tuned = indexFor(angle);

  useEffect(() => setAngle(angleFor(current)), [current]);

  function tune(i: number) {
    setAngle(angleFor(i));
    dialog.current?.close();
    if (i === current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return router.push(stations[i].href);
    crackle();
    setStaticKey((k) => k + 1);
    setTimeout(() => router.push(stations[i].href), 250);
  }

  function angleFrom(e: PointerEvent) {
    const r = knob.current!.getBoundingClientRect();
    let a = (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI + 90;
    if (a > 180) a -= 360;
    return Math.max(-SWEEP / 2, Math.min(SWEEP / 2, a));
  }

  function onKey(e: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (step) setAngle(angleFor(Math.max(0, Math.min(last, tuned + step))));
    else if (e.key === "Home") setAngle(angleFor(0));
    else if (e.key === "End") setAngle(angleFor(last));
    else if (e.key === "Enter" || e.key === " ") tune(tuned);
    else return;
    e.preventDefault();
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 border-b-[3px] border-ink bg-cream/90 px-4 py-2.5 backdrop-blur-sm sm:px-6">
        <Link href="/" className="flex items-baseline gap-1.5 font-display text-xl leading-none sm:text-2xl" aria-label="MERAZ 7.0 home">
          MERAZ <span className="bg-rani px-1.5 py-0.5 text-sm text-cream">7.0</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={site.registerUrl} target="_blank" rel="noopener noreferrer" className="btn hidden bg-marigold !py-2 !text-sm sm:inline-flex">
            Register
          </a>
          <button
            type="button"
            onClick={() => dialog.current?.showModal()}
            aria-haspopup="dialog"
            className="btn bg-ink !py-2 !text-sm text-turmeric !shadow-[4px_4px_0_var(--color-rani)]"
          >
            <Radio weight="bold" size={18} aria-hidden="true" /> Tune in
          </button>
        </div>
      </header>

      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-label="Site navigation radio"
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-[min(94vw,760px)] max-h-[92svh] overflow-y-auto overscroll-contain bg-transparent p-0 text-ink"
      >
        <div className="rounded-[28px] border-4 border-ink bg-[#6b3f1f] p-3 shadow-[10px_10px_0_var(--color-ink)] sm:p-5">
          <div className="rounded-[18px] border-4 border-ink bg-cream p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs tracking-widest">MERAZ BROADCASTING · AM/FM</p>
                <p className="font-deva text-lg text-rani">रेडियो मेराज़</p>
              </div>
              <button type="button" onClick={() => dialog.current?.close()} className="btn size-11 justify-center bg-cream !p-0" aria-label="Close navigation">
                <X weight="bold" aria-hidden="true" />
              </button>
            </div>

            {/* LCD + frequency scale */}
            <div className="mt-4 rounded-lg border-[3px] border-ink bg-ink p-3 font-mono text-turmeric">
              <p className="text-center text-lg tracking-widest sm:text-2xl" aria-live="polite">
                {stations[tuned].freq} FM · {stations[tuned].label.toUpperCase()}
              </p>
              <div className="relative mx-3 mt-3 h-10 border-t-2 border-turmeric/60" aria-hidden="true">
                {stations.map((s, i) => (
                  <span
                    key={s.href}
                    className={`absolute top-0 -translate-x-1/2 text-center text-[9px] leading-tight sm:text-[11px] ${i === tuned ? "text-cream" : "text-turmeric/60"}`}
                    style={{ left: `${(i / last) * 100}%` }}
                  >
                    |<br />
                    {s.freq.split(".")[0]}
                  </span>
                ))}
                <span
                  className="absolute -top-3 h-12 w-[3px] bg-vermillion transition-[left] duration-150"
                  style={{ left: `${((angle + SWEEP / 2) / SWEEP) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              {/* Knob */}
              <div className="flex flex-col items-center">
                <div
                  ref={knob}
                  role="slider"
                  tabIndex={0}
                  aria-label="Tuning dial. Use arrow keys to choose a section, Enter to go."
                  aria-valuemin={0}
                  aria-valuemax={last}
                  aria-valuenow={tuned}
                  aria-valuetext={`${stations[tuned].freq} FM, ${stations[tuned].label}`}
                  onKeyDown={onKey}
                  onPointerDown={(e) => {
                    dragging.current = true;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setAngle(angleFrom(e));
                  }}
                  onPointerMove={(e) => dragging.current && setAngle(angleFrom(e))}
                  onPointerUp={() => {
                    dragging.current = false;
                    tune(tuned);
                  }}
                  className="relative grid size-36 touch-none select-none place-items-center rounded-full border-4 border-ink bg-[conic-gradient(from_0deg,#2a2a2a,#555,#2a2a2a,#555,#2a2a2a)] shadow-[6px_6px_0_var(--color-ink)] sm:size-40"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span className="absolute top-2 h-6 w-2 rounded-full bg-marigold" />
                  <span className="size-16 rounded-full border-4 border-ink bg-rani" />
                </div>
                <p className="mt-3 font-mono text-xs">DRAG · CLICK · ARROW KEYS</p>
              </div>

              {/* Accessible fallback menu */}
              <nav aria-label="All sections">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {stations.map((s, i) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        onClick={() => dialog.current?.close()}
                        aria-current={i === current ? "page" : undefined}
                        className="group flex min-h-11 items-center gap-2 font-display text-base hover:text-rani aria-[current=page]:text-rani"
                      >
                        <span className="font-mono text-xs text-teal-deep">{s.freq}</span>
                        {s.label}
                      </Link>
                    </li>
                  ))}
                  <li className="col-span-2 mt-2">
                    <a href={site.registerUrl} target="_blank" rel="noopener noreferrer" className="btn w-full justify-center bg-marigold">
                      Register <ArrowUpRight weight="bold" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          {/* speaker grille */}
          <div className="mt-3 h-6 rounded-md bg-[radial-gradient(#2a1608_1.5px,transparent_2px)] bg-[size:8px_8px]" aria-hidden="true" />
        </div>
      </dialog>

      {staticKey > 0 && <div key={staticKey} className="tv-static pointer-events-none fixed inset-0 z-[250]" aria-hidden="true" />}
    </>
  );
}
