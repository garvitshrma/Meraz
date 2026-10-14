"use client";

// Top navigation on every page but home: logo (home) + the five reference links. Collapses to a dropdown on phones.
// Painted truck-art fashion: each link a little arched panel in its own colour, the bar's ground a faint lattice, the
// stripe and a fringe of pennants under it, and a painted lorry (public/truck.webp) forever driving across the open
// stretch between the logo and the links.
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { navLinks } from "@/data/site";
import { TLink } from "./Transition";

// each link's panel, in turn (the current page's is ink)
const PAINT = [
  "bg-rani-deep text-cream",
  "bg-teal-deep text-cream",
  "bg-marigold text-ink",
  "bg-vermillion-deep text-cream",
  "bg-turmeric text-ink",
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (pathname.startsWith(href) ? "page" : undefined);
  if (pathname === "/") return null; // home is the road scene: its auto ride ends at the links as destinations

  return (
    <header className="nav-ground fixed inset-x-0 top-0 z-[15000] border-b-4 border-ink print:hidden">
      <nav aria-label="Main">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* the bird logo and the Meraz lettering (public/logo.webp, typolog.webp trimmed to their ink as nav-*.webp) */}
          <TLink href="/" aria-label="Meraz 7.0 home" className="flex shrink-0 items-center gap-2 font-display leading-none sm:gap-2.5">
            <img src="/nav-logo.webp" alt="" width={194} height={144} className="h-10 w-auto sm:h-11" />
            <img src="/nav-typolog.webp" alt="" width={324} height={112} className="h-7 w-auto sm:h-8" />
            <span className="bg-rani-deep px-1.5 py-0.5 text-sm text-cream">7.0</span>
          </TLink>

          {/* the lorry's lane: the open stretch between the logo and the links, its wheels on the stripe */}
          <div aria-hidden="true" className="@container pointer-events-none relative h-full min-w-0 flex-1 self-stretch overflow-hidden">
            <img src="/truck.webp" alt="" width={300} height={144} className="absolute bottom-0 left-0 h-6 w-auto animate-truck sm:h-9 lg:h-full" />
          </div>

          <ul className="hidden items-center gap-1.5 md:flex lg:gap-2">
            {navLinks.map((l, i) => (
              <li key={l.href}>
                <TLink
                  href={l.href}
                  aria-current={current(l.href)}
                  className={`block rounded-t-[0.9rem] rounded-b-sm border-2 border-ink px-3 py-1.5 font-display text-sm shadow-[inset_0_0_0_2px_var(--color-turmeric),inset_0_0_0_3px_var(--color-ink),3px_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:-rotate-2 aria-[current=page]:!bg-ink aria-[current=page]:!text-turmeric lg:px-4 lg:text-base ${PAINT[i % PAINT.length]}`}
                >
                  {l.label}
                </TLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="btn size-11 justify-center bg-marigold !p-0 text-ink md:hidden"
          >
            {open ? <X size={24} weight="bold" aria-hidden="true" /> : <List size={24} weight="bold" aria-hidden="true" />}
          </button>
        </div>
        {/* truck-art stripe */}
        <div className="h-1.5 bg-[repeating-linear-gradient(90deg,#d7263d_0_24px,#f4a300_24px_48px,#0f7c7c_48px_72px,#e0218a_72px_96px)]" aria-hidden="true" />

        {open && (
          <ul id="mobile-menu" className="nav-ground space-y-2 border-t-4 border-ink px-4 py-4 md:hidden">
            {navLinks.map((l, i) => (
              <li key={l.href}>
                <TLink
                  href={l.href}
                  aria-current={current(l.href)}
                  className={`flex min-h-12 items-baseline gap-3 rounded-t-xl rounded-b-sm border-2 border-ink px-3 py-2 shadow-[inset_0_0_0_2px_var(--color-turmeric),inset_0_0_0_3px_var(--color-ink),3px_3px_0_var(--color-ink)] aria-[current=page]:!bg-ink aria-[current=page]:!text-turmeric ${PAINT[i % PAINT.length]}`}
                >
                  <span className="font-mono text-xs opacity-80" aria-hidden="true">{l.freq} FM</span>
                  <span className="font-display text-2xl">{l.label}</span>
                  <span className="font-deva text-lg opacity-90" aria-hidden="true">{l.hindi}</span>
                </TLink>
              </li>
            ))}
          </ul>
        )}
        {/* the fringe of pennants hung under it all */}
        <div aria-hidden="true" className="jhalar pointer-events-none absolute inset-x-0 top-full h-4" />
      </nav>
    </header>
  );
}
