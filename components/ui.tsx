// Shared server-safe building blocks.
import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";

export function SectionHeading({ kicker, hindi, title, children }: { kicker?: string; hindi?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10" data-reveal>
      {kicker && <p className="font-mono text-xs font-bold tracking-[.3em] text-teal-deep">{kicker}</p>}
      {hindi && <p className="font-deva text-2xl text-rani sm:text-3xl">{hindi}</p>}
      <h2 className="font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[.95] misprint">{title}</h2>
      {children && <div className="mt-4 max-w-2xl text-lg text-pretty">{children}</div>}
    </div>
  );
}

// Poster banner at the top of every inner page.
export function PageHeader({ kicker, hindi, title, children, tone = "marigold" }: { kicker: string; hindi: string; title: string; children?: ReactNode; tone?: "marigold" | "teal" | "rani" }) {
  const rays = { marigold: "[--ray-a:#F4A300] [--ray-b:#F2C14E]", teal: "[--ray-a:#0F7C7C] [--ray-b:#0a5f5f]", rani: "[--ray-a:#E0218A] [--ray-b:#D7263D]" }[tone];
  const text = tone === "marigold" ? "text-ink" : "text-cream";
  return (
    <section className={`relative overflow-hidden border-b-4 border-ink pb-14 pt-28 ${text}`}>
      <div className={`sunburst absolute left-1/2 top-full size-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow ${rays}`} aria-hidden="true" />
      <div className="halftone absolute inset-0 text-ink/15" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="w-fit bg-ink px-2 py-1 font-mono text-xs font-bold tracking-[.3em] text-turmeric">{kicker}</p>
        {hindi && <p className="painted mt-2 font-deva text-3xl text-cream sm:text-4xl">{hindi}</p>}
        <h1 className="painted font-display text-[clamp(3rem,11vw,7.5rem)] leading-[.9] text-cream misprint">{title}</h1>
        {children && <div className="mt-5 max-w-2xl bg-cream/90 p-4 text-lg text-ink shadow-[5px_5px_0_var(--color-ink)]">{children}</div>}
      </div>
    </section>
  );
}

export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = items.join("  ★  ") + "  ★  ";
  return (
    <div className={`overflow-hidden border-y-4 border-ink py-3 ${className}`} aria-hidden="true">
      <div className="flex w-max animate-marquee whitespace-pre font-display text-xl sm:text-2xl">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function RegisterStrip() {
  return (
    <section className="py-16">
      <Container>
        <div className="relative overflow-hidden border-4 border-ink bg-marigold p-8 shadow-[10px_10px_0_var(--color-ink)] sm:p-12" data-reveal>
          <div className="halftone absolute inset-0 text-ink/15" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-xs font-bold tracking-[.3em]">RESERVATION COUNTER · आरक्षण खिड़की</p>
              <p className="font-display text-[clamp(2rem,6vw,3.8rem)] leading-none">Booking khula hai!</p>
              <p className="mt-2 text-lg">Passes, event entries and accommodation, all at one window.</p>
            </div>
            <a href={site.registerUrl} target="_blank" rel="noopener noreferrer" className="btn shrink-0 bg-rani-deep text-xl text-cream">
              Register <ArrowUpRight weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
