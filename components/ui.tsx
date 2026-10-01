// Shared server-safe building blocks.
import type { ReactNode } from "react";

// Poster banner at the top of every inner page.
export function PageHeader({ hindi, title, children, tone = "marigold" }: { hindi: string; title: string; children?: ReactNode; tone?: "marigold" | "teal" | "rani" }) {
  const rays = { marigold: "[--ray-a:#F4A300] [--ray-b:#F2C14E]", teal: "[--ray-a:#0F7C7C] [--ray-b:#0a5f5f]", rani: "[--ray-a:#E0218A] [--ray-b:#D7263D]" }[tone];
  return (
    <section className="relative overflow-hidden border-b-4 border-ink pb-12 pt-24 sm:pt-28">
      <div className={`sunburst absolute left-1/2 top-full size-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow ${rays}`} aria-hidden="true" />
      <div className="halftone absolute inset-0 text-ink/15" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="painted font-deva text-3xl text-cream sm:text-4xl">{hindi}</p>
        <h1 className="painted font-display text-[clamp(3rem,11vw,7.5rem)] leading-[.9] text-cream misprint">{title}</h1>
        {children && <div className="mt-5 max-w-2xl bg-cream/90 p-4 text-lg text-ink shadow-[5px_5px_0_var(--color-ink)]">{children}</div>}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
