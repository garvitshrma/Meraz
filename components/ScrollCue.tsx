"use client";

// About's hero is one still picture once the elephant has walked in, with nothing to say the page goes on. When it has
// arrived (its walk ends: it waits out the page-change gate with it), and if no one has scrolled yet, the page moves a
// little way down, once, to show there's more below. Dropped at any touch, wheel or key first, and for reduced motion.
import { useEffect } from "react";
import { getLenis } from "./ScrollFx";

const NUDGE = 0.16; // of the screen's height
const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

export default function ScrollCue({ after }: { after: string }) {
  useEffect(() => {
    const walker = document.querySelector<HTMLElement>(after);
    let timer = 0;
    let touched = false;
    const stop = () => {
      touched = true;
      clearTimeout(timer);
    };
    const arrived = (e: AnimationEvent) => {
      if (e.animationName !== "elephant-walk" || touched || scrollY > 40) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setTimeout(() => {
        if (touched || scrollY > 40) return;
        const y = innerHeight * NUDGE;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { duration: 0.9, easing: ease });
        else scrollTo({ top: y, behavior: "smooth" });
      }, 600);
    };
    walker?.addEventListener("animationend", arrived);
    for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) addEventListener(t, stop, { passive: true });
    return () => {
      clearTimeout(timer);
      walker?.removeEventListener("animationend", arrived);
      for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) removeEventListener(t, stop);
    };
  }, [after]);

  return null;
}
