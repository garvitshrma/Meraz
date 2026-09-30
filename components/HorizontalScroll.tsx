"use client";

// Pins its section and turns vertical scroll into sideways travel along a row of cards.
// Without JS, or with reduced motion, it stays a plain swipeable row with snap points.
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll({ heading, children, label }: { heading: ReactNode; children: ReactNode; label: string }) {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pin.current;
    const row = track.current;
    if (!el || !row) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.dataset.pinned = "";
      const distance = () => Math.max(0, row.scrollWidth - el.clientWidth);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${Math.max(1, distance())}`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
      });
      tl.to(row, { x: () => -distance(), ease: "none" }, 0).fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

      // Keyboard users: tabbing to an off-screen card scrolls the page to where that card is in view.
      const onFocus = (e: FocusEvent) => {
        const item = (e.target as Element).closest("li");
        const st = tl.scrollTrigger;
        if (!item || !st || !distance()) return;
        const p = gsap.utils.clamp(0, 1, (item.offsetLeft + item.offsetWidth / 2 - el.clientWidth / 2) / distance());
        window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "instant" });
      };
      row.addEventListener("focusin", onFocus);
      return () => {
        row.removeEventListener("focusin", onFocus);
        delete el.dataset.pinned;
      };
    });
    return () => mm.revert();
  }, []);

  // GSAP wraps the pinned div in a spacer; the outer section keeps that out of React's way on unmount.
  return (
    <section>
      <div ref={pin} className="group flex min-h-svh flex-col justify-center overflow-x-clip py-16">
        <Container className="w-full">{heading}</Container>
        <div className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] group-data-[pinned]:snap-none group-data-[pinned]:overflow-visible">
          <ul ref={track} aria-label={label} className="flex w-max gap-6 px-4 pb-6 pt-2 sm:gap-8 sm:px-[max(1.5rem,calc(50vw-34.5rem))] [&>li]:snap-center">
            {children}
          </ul>
        </div>
        <Container className="hidden w-full group-data-[pinned]:block">
          <div className="h-3 border-[3px] border-ink bg-cream shadow-[3px_3px_0_var(--color-ink)]" aria-hidden="true">
            <div ref={bar} className="h-full origin-left bg-rani" />
          </div>
        </Container>
      </div>
    </section>
  );
}
