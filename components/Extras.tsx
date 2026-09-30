"use client";

// Small global client pieces: cassette music toggle, vinyl cursor, Konami easter egg, smooth scroll + GSAP.
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound } from "@/lib/sound";

gsap.registerPlugin(ScrollTrigger);
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Cassette() {
  const { on, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Pause ambient music" : "Play ambient music"}
      data-on={on}
      className="fixed bottom-3 right-3 z-50 w-[4.5rem] rotate-[-4deg] transition-transform hover:rotate-0 sm:bottom-5 sm:right-5 sm:w-32"
    >
      <svg viewBox="0 0 120 78" className="drop-shadow-[4px_4px_0_#1a1a1a]" aria-hidden="true">
        <rect x="2" y="2" width="116" height="74" rx="6" fill="#1a1a1a" />
        <rect x="9" y="8" width="102" height="44" rx="3" fill="#F3E6C8" />
        <rect x="9" y="8" width="102" height="10" fill="#E0218A" />
        <text x="60" y="16" textAnchor="middle" fontSize="7" fill="#F3E6C8" fontFamily="monospace" fontWeight="bold">
          MERAZ MIX · SIDE A
        </text>
        <rect x="30" y="24" width="60" height="22" rx="11" fill="#1a1a1a" />
        <rect x="52" y="28" width="16" height="14" fill="#6b3f1f" />
        {[40, 80].map((cx) => (
          <g key={cx} className="reel">
            <circle cx={cx} cy="35" r="8" fill="#F3E6C8" />
            <circle cx={cx} cy="35" r="3" fill="#1a1a1a" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <rect key={a} x={cx - 1} y="28" width="2" height="4" fill="#1a1a1a" transform={`rotate(${a} ${cx} 35)`} />
            ))}
          </g>
        ))}
        <path d="M24 76 30 58h60l6 18" fill="#F4A300" />
        <text x="60" y="70" textAnchor="middle" fontSize="7" fill="#1a1a1a" fontFamily="monospace" fontWeight="bold">
          {on ? "▶ PLAYING" : "■ MUTED"}
        </text>
      </svg>
    </button>
  );
}

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || reducedMotion()) return;
    setOn(true);
    document.documentElement.classList.add("vinyl-cursor");
    const move = (e: globalThis.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.dataset.hover = (e.target as Element).closest?.("a,button,summary,[role=slider],label") ? "1" : "";
    };
    addEventListener("pointermove", move);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.classList.remove("vinyl-cursor");
    };
  }, []);
  return on ? (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="vinyl" />
    </div>
  ) : null;
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function Konami() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let pos = 0;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      pos = e.key.toLowerCase() === KONAMI[pos].toLowerCase() ? pos + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        setOpen(true);
      }
    };
    const onEgg = () => setOpen(true); // fired by tapping the footer sign 7 times (touch devices)
    addEventListener("keydown", onKey);
    addEventListener("meraz:konami", onEgg);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("meraz:konami", onEgg);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 7000);
    return () => clearTimeout(t);
  }, [open]);
  if (!open) return null;
  return (
    <div role="dialog" aria-label="Secret dance mode" className="fixed inset-0 z-[400] grid place-items-center overflow-hidden bg-ink" onClick={() => setOpen(false)}>
      <div className="disco absolute left-1/2 top-1/2 size-[250vmax] -translate-x-1/2 -translate-y-1/2 opacity-80" aria-hidden="true" />
      <div className="scanlines absolute inset-0" aria-hidden="true" />
      <p className="absolute left-4 top-4 font-mono text-lg text-cream">PLAY ▶ 00:0{7}:00</p>
      <div className="relative text-center">
        <p className="glitch font-display text-[clamp(3rem,15vw,10rem)] leading-none text-cream painted" data-text="NAACHO!">
          NAACHO!
        </p>
        <p className="font-deva text-[clamp(2rem,8vw,5rem)] text-turmeric painted">नाचो!</p>
        <div className="mt-6 flex justify-center gap-3 sm:gap-6" aria-hidden="true">
          {["#F3E6C8", "#F2C14E", "#E0218A", "#0F7C7C", "#F3E6C8"].map((c, i) => (
            <svg key={i} className="dancer w-12 sm:w-20" viewBox="0 0 40 80" fill={c} stroke="#1a1a1a" strokeWidth="2">
              <circle cx="20" cy="10" r="7" />
              <path d="M20 17v30M20 25 6 8M20 25l14-17M20 47 10 76M20 47l10 29" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
            </svg>
          ))}
        </div>
      </div>
      <button type="button" className="btn absolute bottom-6 bg-cream text-sm" onClick={() => setOpen(false)}>
        Band karo (close)
      </button>
    </div>
  );
}

export function ScrollFx() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const l = new Lenis({ lerp: 0.12 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }),
      });
      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.depth) * 40,
          ease: "none",
          scrollTrigger: { trigger: el.closest("[data-parallax]") ?? el, start: "top top", end: "bottom top", scrub: true },
        });
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathname]);

  return null;
}
