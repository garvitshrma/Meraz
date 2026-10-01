"use client";

// Site-wide top navigation: logo (home) + the five reference links. Collapses to a dropdown on phones.
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { navLinks } from "@/data/site";
import { TLink } from "./Transition";

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-ink bg-cream print:hidden">
      <nav aria-label="Main">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <TLink href="/" aria-label="Meraz 7.0 home" className="flex items-baseline gap-1.5 font-display text-xl leading-none sm:text-2xl">
            MERAZ <span className="bg-rani-deep px-1.5 py-0.5 text-sm text-cream">7.0</span>
            <span className="ml-1 hidden font-deva text-lg text-rani-deep lg:inline">मेराज़</span>
          </TLink>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <TLink
                  href={l.href}
                  aria-current={current(l.href)}
                  className="block border-2 border-transparent px-3 py-2 font-display text-sm transition-colors hover:border-ink hover:bg-marigold aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-turmeric lg:text-base"
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
            className="grid size-11 place-items-center border-[3px] border-ink bg-marigold shadow-[3px_3px_0_var(--color-ink)] md:hidden"
          >
            {open ? <X size={24} weight="bold" aria-hidden="true" /> : <List size={24} weight="bold" aria-hidden="true" />}
          </button>
        </div>
        {/* truck-art stripe */}
        <div className="h-1.5 bg-[repeating-linear-gradient(90deg,#d7263d_0_24px,#f4a300_24px_48px,#0f7c7c_48px_72px,#e0218a_72px_96px)]" aria-hidden="true" />

        {open && (
          <ul id="mobile-menu" className="border-t-4 border-ink bg-cream px-4 pb-4 md:hidden">
            {navLinks.map((l) => (
              <li key={l.href} className="border-b-2 border-dashed border-ink/30 last:border-0">
                <TLink href={l.href} aria-current={current(l.href)} className="flex min-h-12 items-baseline gap-3 py-2 aria-[current=page]:text-rani-deep">
                  <span className="font-mono text-xs text-teal-deep" aria-hidden="true">{l.freq} FM</span>
                  <span className="font-display text-2xl">{l.label}</span>
                  <span className="font-deva text-lg text-rani-deep" aria-hidden="true">{l.hindi}</span>
                </TLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
