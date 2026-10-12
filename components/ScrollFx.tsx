"use client";

// Smooth scrolling (Lenis, like ScrollSmoother on the reference site) + GSAP scroll reveals.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
export const getLenis = () => lenis;
// Moves the page's scroll at once, unsmoothed (even while Lenis is stopped): how the looping scenes wrap round.
export function jumpScroll(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "instant" });
}

// Glides the page's scroll to y over `duration` seconds, easing in and out. lerp: 0 is what makes Lenis keep to the
// duration: given none it falls back on its own lerp (the wheel's smoothing), which ignores the duration and races.
// When the looping scenes (the contact tour, the events walk) wrap round to their start. With a mouse, as soon as the
// scroll passes their end. On a touch screen a flick's momentum would carry past the wrap again and again, so there the
// scene stops on its last screen; once the scroll has come to rest there, the next swipe on (or further scroll) wraps.
// update(end, y) is called on every scroll with whether it is past the scene's end, and the scroll position.
export function loopGate(wrap: () => void) {
  const touch = matchMedia("(pointer: coarse)").matches;
  let armed = false;
  let restY = 0;
  let timer = 0;
  let fingerY = 0;
  const go = () => {
    if (!armed) return;
    armed = false;
    wrap();
  };
  const start = (e: TouchEvent) => (fingerY = e.touches[0].clientY);
  const move = (e: TouchEvent) => fingerY - e.touches[0].clientY > 30 && go(); // finger up: scrolling on
  const wheel = (e: WheelEvent) => e.deltaY > 0 && go();
  if (touch) {
    addEventListener("touchstart", start, { passive: true });
    addEventListener("touchmove", move, { passive: true });
    addEventListener("wheel", wheel, { passive: true });
  }
  return {
    update(end: boolean, y: number) {
      if (!touch) return end && wrap();
      clearTimeout(timer);
      if (!end) return void (armed = false);
      if (armed && y > restY + 10) return go();
      if (!armed) timer = window.setTimeout(() => ((armed = true), (restY = scrollY)), 350);
    },
    dispose() {
      clearTimeout(timer);
      removeEventListener("touchstart", start);
      removeEventListener("touchmove", move);
      removeEventListener("wheel", wheel);
    },
  };
}

export function glideScroll(y: number, duration: number) {
  if (lenis) lenis.scrollTo(y, { duration, easing: (t) => (1 - Math.cos(Math.PI * t)) / 2, lerp: 0 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.12 });
    lenis = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "back.out(1.4)" }),
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathname]);

  return null;
}
