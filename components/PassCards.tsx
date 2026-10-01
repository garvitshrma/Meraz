"use client";

// Pass carousel, same behaviour as the reference: click a card to make it active; the active card shows
// its details and a "Buy Now" link (opens the Google Form in a new tab). Styled as old railway tickets.
import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Pass } from "@/data/content";

const tones = ["bg-turmeric", "bg-[#f6c9dd]"];

export default function PassCards({ passes }: { passes: Pass[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-5 md:min-h-[30rem] md:flex-row">
      {passes.map((p, i) => {
        const on = i === active;
        return (
          <article
            key={p.name}
            className={`relative flex overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--color-ink)] max-md:flex-col md:transition-[flex-grow] md:duration-500 ${tones[i % tones.length]} ${on ? "md:grow" : "md:grow-0"} md:basis-[5.5rem]`}
          >
            <div className="halftone pointer-events-none absolute inset-0 text-ink/10" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-expanded={on}
              aria-controls={`pass-${i}`}
              className="relative flex min-h-16 shrink-0 items-center justify-between gap-3 bg-ink px-4 text-turmeric md:h-auto md:w-[5.5rem] md:flex-col md:justify-center md:px-0"
            >
              <span className="font-display text-xl md:[writing-mode:vertical-rl] md:rotate-180 md:text-2xl">{p.name}</span>
              <span className="font-mono text-[10px] font-bold tracking-widest md:[writing-mode:vertical-rl] md:rotate-180">MERAZ EXPRESS</span>
            </button>
            {on && (
              <div id={`pass-${i}`} className="relative flex min-w-0 flex-1 flex-col p-5 sm:p-8">
                <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-ink pb-3 font-mono text-xs font-bold tracking-widest">
                  <span>2ND CLASS · ADMIT ONE</span>
                  <span>No. {String(4210 + i * 77).padStart(6, "0")}</span>
                </div>
                <p className="mt-4 font-poster text-2xl leading-tight sm:text-3xl">{p.title}</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {p.discountCategories.map((c) => (
                    <div key={c.type}>
                      <p className="font-display text-base">{c.type}</p>
                      <ul className="mt-2 space-y-1.5 text-base">
                        {c.discounts.map((d) => (
                          <li key={d} className="flex gap-2">
                            <span className="mt-2 size-2 shrink-0 rotate-45 bg-ink" aria-hidden="true" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <a href={p.formLink} target="_blank" rel="noopener noreferrer" className="btn mt-8 w-fit bg-rani-deep text-cream">
                  Buy Now <ArrowUpRight weight="bold" aria-hidden="true" />
                </a>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
