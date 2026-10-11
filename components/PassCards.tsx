"use client";

// The passes as Meraz Express tickets (public/passes/ticket.webp, cut from passes.png: 961 x 348, its printed pass
// name painted out). The pass's name is printed where the ticket had it, its button is the Buy Now link, and its
// details are printed on the blank body. Large screens: the tickets side by side, as before: click one and it slides
// open while the other slides shut to its stub, the little train riding over to the open one. Smaller: stacked, the
// details on a slip under each (on the ticket they'd be too small to read). Positions are in % of the ticket.
import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Pass } from "@/data/content";

// Side by side, in the row's width (100cqw) less the 1rem gap: the open ticket, whole (2.7615 times as wide as high),
// and the shut one's stub (the 205 px left of its perforation, 0.589 of its height) fill it.
const ROW = "calc((100cqw - 1rem) * 0.29846)"; // its height
const OPEN = "((100cqw - 1rem) * 0.8242)"; // the open ticket's width
const STUB = "((100cqw - 1rem) * 0.17578)"; // the shut one's

function Details({ p }: { p: Pass }) {
  return (
    <>
      <p className="font-poster text-[1.25em] leading-tight">{p.title}</p>
      <div className="mt-[0.6em] grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] gap-x-[1.5em] gap-y-[0.8em]">
        {p.discountCategories.map((c) => (
          <div key={c.type}>
            <p className="font-bold uppercase tracking-wider">{c.type}</p>
            <ul className="mt-[0.3em] space-y-[0.15em]">
              {c.discounts.map((d) => (
                <li key={d} className="flex gap-[0.5em]">
                  <span className="mt-[0.45em] size-[0.4em] shrink-0 rotate-45 bg-current" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

// A ticket, its name and Buy Now button on it, and its details when given a class for them (there being room).
function Ticket({ p, details, className = "", fontSize }: { p: Pass; details?: string; className?: string; fontSize: string }) {
  return (
    <div className={`relative aspect-[961/348] font-mono text-[#3d2a14] ${className}`} style={{ fontSize }}>
      <img src="/passes/ticket.webp" alt="" width={961} height={348} className="absolute inset-0 size-full" />
      <h2 className="absolute left-[58.2%] top-[90.8%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[1.22em] font-bold uppercase tracking-[0.12em]">
        {p.name}
      </h2>
      <a
        href={p.formLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buy ${p.name} (opens a form)`}
        className="absolute left-[29.1%] top-[81.3%] aspect-square w-[7.9%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-95"
      />
      {details !== undefined && (
        <div className={`absolute bottom-[30%] left-[24.5%] right-[4%] top-[18%] overflow-hidden leading-snug ${details}`}>
          <Details p={p} />
        </div>
      )}
    </div>
  );
}

export default function PassCards({ passes }: { passes: Pass[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="@container mx-auto max-w-6xl">
      {/* large screens: side by side, sliding */}
      <div className="relative hidden gap-4 lg:flex" style={{ height: ROW }}>
        <img
          src="/passes/train.webp"
          alt=""
          width={88}
          height={66}
          className="absolute bottom-full transition-[left] duration-500"
          style={{ left: `calc(${active ? `${STUB} + 1rem + ` : ""}${OPEN} * 0.184)`, width: `calc(${OPEN} * 0.092)` }}
        />
        {passes.map((p, i) => {
          const on = i === active;
          return (
            <article
              key={p.name}
              aria-label={p.name}
              className={`relative overflow-hidden drop-shadow-[0_14px_18px_rgb(0_0_0/0.3)] transition-[flex-grow] duration-500 ${on ? "grow" : "grow-0"}`}
              style={{ flexBasis: `calc${STUB}` }}
            >
              {/* the whole ticket, its left edge pinned: the article's width shows as much of it as it is open */}
              <div inert={!on} className="h-full" style={{ width: `calc${OPEN}` }}>
                <Ticket
                  p={p}
                  details={`transition-opacity duration-300 ${on ? "delay-300" : "opacity-0"}`} // in once it has slid open
                  className="size-full"
                  fontSize={`calc(${OPEN} * 0.0155)`}
                />
              </div>
              {!on && (
                <button type="button" onClick={() => setActive(i)} aria-expanded={false} aria-label={`Open the ${p.name}`} className="absolute inset-0 cursor-pointer">
                  <span
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-[#903e3c]/90 py-1 text-center font-mono font-bold uppercase tracking-widest text-cream"
                    style={{ fontSize: `calc(${OPEN} * 0.014)` }}
                  >
                    {p.name}
                  </span>
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* smaller: stacked, the details on a slip under each */}
      <ul className="grid gap-16 lg:hidden">
        {passes.map((p, i) => (
          <li key={p.name} className="@container">
            <article aria-label={p.name} className="relative drop-shadow-[0_14px_18px_rgb(0_0_0/0.3)]">
              {i === 0 && <img src="/passes/train.webp" alt="" width={88} height={66} className="absolute bottom-full left-[18.4%] w-[9.2%]" />}
              <Ticket p={p} fontSize="1.55cqw" />
            </article>
            <div className="mt-4 border-4 border-[#903e3c] bg-[#dacb89] p-4 font-mono text-base leading-snug text-[#3d2a14]">
              <Details p={p} />
              <a href={p.formLink} target="_blank" rel="noopener noreferrer" className="btn mt-5 w-fit bg-[#903e3c] text-cream">
                Buy Now <ArrowUpRight weight="bold" aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
