"use client";

// Home-page chrome, matching the reference site:
// - flip button top-left: opens the menu (remembers scroll, jumps to top), flips to a close button
// - opening slides the whole page away to reveal a full-screen menu with the five links
// - fixed REGISTER button bottom-right goes to /passes
import { useEffect, useRef, useState, type ReactNode } from "react";
import { List, X } from "@phosphor-icons/react";
import { navLinks } from "@/data/site";
import { TLink } from "./Transition";
import { getLenis } from "./ScrollFx";

export default function HomeShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const saved = useRef(0);

  function openNav() {
    saved.current = window.scrollY;
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    setOpen(true);
  }
  function closeNav() {
    setOpen(false);
    document.documentElement.style.overflow = "";
    getLenis()?.start();
    getLenis()?.scrollTo(saved.current, { immediate: true });
    window.scrollTo(0, saved.current);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeNav();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  return (
    <>
      {/* menu layer, revealed when the page slides away */}
      <nav aria-label="Main" inert={!open} className="fixed inset-0 z-0 overflow-hidden bg-ink text-cream">
        <div className="sunburst absolute -left-[40vmax] top-1/2 size-[120vmax] -translate-y-1/2 opacity-15 animate-spin-slow [--ray-a:#F4A300] [--ray-b:#1a1a1a]" aria-hidden="true" />
        <div className="record absolute -bottom-[18vmin] -left-[18vmin] size-[70vmin] md:left-[8vw] md:top-1/2 md:bottom-auto md:size-[46vmin] md:-translate-y-1/2" aria-hidden="true" />
        <ul className="relative flex h-full flex-col items-end justify-center gap-2 px-6 sm:px-[8vw] md:gap-4">
          {navLinks.map((l) => (
            <li key={l.href}>
              <TLink href={l.href} className="group flex items-baseline gap-4 text-right">
                <span className="font-mono text-xs text-turmeric/70 sm:text-sm">{l.freq} FM</span>
                <span className="font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-none transition-colors group-hover:text-marigold group-focus-visible:text-marigold">{l.label}</span>
                <span className="hidden font-deva text-2xl text-rani sm:inline">{l.hindi}</span>
              </TLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* flip button */}
      <button
        type="button"
        onClick={open ? closeNav : openNav}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flip-btn fixed left-3 top-3 z-[70] size-14 sm:left-5 sm:top-5"
        data-open={open}
      >
        <span className="flip-inner">
          <span className="flip-face bg-marigold">
            <List size={28} weight="bold" aria-hidden="true" />
          </span>
          <span className="flip-face flip-back bg-rani-deep text-cream">
            <X size={28} weight="bold" aria-hidden="true" />
          </span>
        </span>
      </button>

      {/* the page itself */}
      <div
        inert={open}
        className="relative z-10 min-h-[100dvh] bg-cream shadow-[-12px_0_0_var(--color-ink)] transition-transform duration-700 ease-[cubic-bezier(.7,0,.3,1)]"
        style={{ transform: open ? "translateX(110vw) rotate(4deg)" : undefined }}
      >
        {children}
        <TLink href="/passes" className="btn fixed bottom-4 right-4 z-40 bg-marigold text-lg sm:bottom-6 sm:right-6">
          REGISTER
        </TLink>
      </div>
    </>
  );
}
