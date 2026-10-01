"use client";

// Home hero. Same mechanic as the reference (scroll zooms through an ornate frame into a painted scene,
// then the logo appears), re-skinned: the frame is a single-screen cinema, the scene a Retro India street,
// and a kite drifts across instead of the blimp.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", scrub: true, pin: true } })
        .to(".hero-curtain-l", { xPercent: -100, ease: "none", duration: 0.3 }, 0)
        .to(".hero-curtain-r", { xPercent: 100, ease: "none", duration: 0.3 }, 0)
        .to(".hero-frame", { scale: 9, ease: "power2.in", duration: 1 }, 0.15)
        .to(".hero-frame", { autoAlpha: 0, duration: 0.12 }, 1.03)
        .fromTo(".hero-scene", { scale: 1.3 }, { scale: 1, ease: "none", duration: 1.15 }, 0)
        .to(".hero-kite", { x: "-45vw", y: "-8vh", rotate: -14, ease: "none", duration: 1.4 }, 0)
        .fromTo(".hero-logo", { autoAlpha: 0, scale: 0.8, y: 40 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.35 }, 0.95);
    }, root);
    return () => ctx.revert();
  }, []);

  // GSAP wraps the pinned section in a spacer; this outer div is what React removes on unmount.
  return (
    <div>
      <section ref={root} aria-labelledby="hero-title" className="relative h-[100dvh] overflow-hidden bg-marigold">
        {/* painted scene */}
        <div className="hero-scene absolute inset-0" aria-hidden="true">
          <div className="sunburst absolute left-1/2 top-[45%] size-[250vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
          <div className="absolute right-[6vw] top-[14%] size-[38vmin] rounded-full border-[6px] border-ink bg-vermillion">
            <div className="halftone absolute inset-0 rounded-full text-ink/30" />
          </div>
          <Bunting />
          <div className="hero-kite absolute right-[34vw] top-[30%] w-[12vmin] min-w-14">
            <Kite />
          </div>
          <div className="absolute inset-x-0 bottom-0">
            <Skyline />
          </div>
        </div>

        {/* logo, revealed after the zoom */}
        <div className="hero-logo absolute inset-0 z-[2] grid place-content-center px-4 text-center motion-safe:opacity-0">
          <p className="painted font-deva text-[clamp(2.5rem,8vw,5rem)] leading-none text-cream" aria-hidden="true">
            मेराज़ ७.०
          </p>
          <h1 id="hero-title" className="painted -rotate-2 font-display text-[clamp(4rem,16vw,12rem)] leading-[.85] text-cream misprint">
            MERAZ <span className="text-turmeric">7.0</span>
          </h1>
          <p className="mx-auto mt-3 w-fit bg-ink px-3 py-1 font-mono text-xs font-bold tracking-[.3em] text-turmeric sm:text-sm">
            {site.theme.toUpperCase()} · {site.college.toUpperCase()}
          </p>
        </div>

        {/* cinema facade with the screen cut out; scaled up to zoom "through" the screen */}
        <div className="hero-frame absolute inset-x-0 bottom-0 top-[4.6rem] z-[3] motion-reduce:hidden" aria-hidden="true">
          <div className="facade absolute inset-0" />
          <div className="absolute left-1/2 top-1/2 h-[var(--hole-h)] w-[var(--hole-w)] -translate-x-1/2 -translate-y-1/2">
            {/* marquee sign */}
            <div className="absolute bottom-full left-1/2 mb-[4vmin] w-max -translate-x-1/2 border-4 border-ink bg-turmeric px-5 py-2 text-center shadow-[6px_6px_0_var(--color-ink)]">
              <p className="font-deva text-[clamp(1rem,2.6vw,1.8rem)] leading-none text-rani-deep">मेराज़ टॉकीज़</p>
              <p className="font-display text-[clamp(1.2rem,3.4vw,2.6rem)] leading-none">MERAZ TALKIES</p>
            </div>
            {/* bulb ring round the screen */}
            <div className="bulbs absolute -inset-[18px]" />
            <div className="absolute -inset-[4px] border-4 border-ink" />
            {/* curtains + pelmet inside the screen */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="hero-curtain-l curtain-panel absolute inset-y-0 left-0 w-[30%]" />
              <div className="hero-curtain-r curtain-panel absolute inset-y-0 right-0 w-[30%]" />
              <div className="pelmet absolute inset-x-0 top-0 h-[12%]" />
            </div>
            {/* now-showing posters either side (desktop) */}
            <Poster className="right-full mr-[5vw] rotate-[-4deg]" top="MERAZ" mid="7.0" bottom="HOUSEFULL" tone="bg-rani-deep" />
            <Poster className="left-full ml-[5vw] rotate-[3deg]" top="3 DIN" mid="फ़ुल" bottom="MASTI" tone="bg-teal-deep" />
            {/* ticket window */}
            <div className="absolute left-1/2 top-full mt-[5vmin] -translate-x-1/2 whitespace-nowrap border-4 border-ink bg-cream px-4 py-1 font-mono text-xs font-bold tracking-[.25em] shadow-[5px_5px_0_var(--color-ink)] sm:text-sm">
              BOOKING OPEN · टिकट खिड़की
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Poster({ className, top, mid, bottom, tone }: { className: string; top: string; mid: string; bottom: string; tone: string }) {
  return (
    <div className={`absolute top-1/2 hidden w-[12vw] -translate-y-1/2 border-4 border-ink p-2 text-center text-cream shadow-[6px_6px_0_var(--color-ink)] lg:block ${tone} ${className}`}>
      <div className="halftone absolute inset-0 text-ink/20" />
      <p className="relative font-mono text-[0.8vw] font-bold tracking-widest">NOW SHOWING</p>
      <p className="painted relative font-display text-[2.4vw] leading-none">{top}</p>
      <p className="relative font-deva text-[3vw] leading-none text-turmeric">{mid}</p>
      <p className="relative mt-1 bg-ink font-display text-[1vw]">{bottom}</p>
    </div>
  );
}

function Bunting() {
  const colours = ["#E0218A", "#0F7C7C", "#F3E6C8", "#D7263D", "#F2C14E"];
  return (
    <svg className="absolute inset-x-0 top-0 h-12 w-full" viewBox="0 0 1200 40" preserveAspectRatio="none">
      <path d="M0 4 Q600 30 1200 4" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {Array.from({ length: 30 }, (_, i) => {
        const x = i * 40 + 6;
        // rounded: Node and the browser disagree in the last float digit, which breaks hydration
        const y = (4 + Math.sin((x / 1200) * Math.PI) * 13).toFixed(2);
        return <path key={i} d={`M${x} ${y} l28 0 l-14 22z`} fill={colours[i % colours.length]} stroke="#1a1a1a" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

function Kite() {
  return (
    <svg viewBox="0 0 60 110" className="drop-shadow-[3px_3px_0_#1a1a1a]">
      <path d="M30 2 56 34 30 70 4 34z" fill="#E0218A" stroke="#1a1a1a" strokeWidth="2.5" />
      <path d="M30 2v68M4 34h52" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M30 2 56 34H30z" fill="#F2C14E" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M30 70q-8 10 2 18t-4 20" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M26 82l6-3-1 6zM24 96l7-2-2 6z" fill="#0F7C7C" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
}

// Original skyline: domes, a clock tower, a water tank, a radio mast and palms.
function Skyline() {
  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice" className="block h-[30vh] min-h-40 w-full">
      <g fill="#0a5f5f" stroke="#1a1a1a" strokeWidth="3">
        <rect x="-5" y="170" width="1210" height="60" />
        <rect x="40" y="110" width="120" height="70" />
        <path d="M40 110 Q100 40 160 110z" />
        <rect x="96" y="30" width="8" height="30" />
        <rect x="190" y="130" width="70" height="50" />
        <rect x="280" y="60" width="44" height="120" />
        <path d="M274 60h56l-28-30z" />
        <circle cx="302" cy="90" r="14" fill="#F3E6C8" />
        <rect x="350" y="120" width="160" height="60" />
        <path d="M380 120 Q430 60 480 120z" />
        <path d="M350 120 Q365 95 380 120zM480 120 Q495 95 510 120z" />
        <rect x="540" y="140" width="90" height="40" />
        <rect x="660" y="70" width="12" height="110" />
        <rect x="640" y="50" width="52" height="30" rx="6" />
        <rect x="720" y="125" width="130" height="55" />
        <rect x="880" y="20" width="6" height="160" />
        <path d="M858 180 883 20l25 160" fill="none" />
        <rect x="930" y="110" width="110" height="70" />
        <path d="M930 110 Q985 50 1040 110z" />
        <rect x="1070" y="135" width="140" height="45" />
      </g>
      <g fill="#1a1a1a">
        {[70, 120, 220, 390, 440, 560, 600, 750, 800, 960, 1000, 1100, 1150].map((x) => (
          <rect key={x} x={x} y="150" width="10" height="16" fill="#F2C14E" />
        ))}
        <path d="M600 180c6-40 4-70-2-90m2 0c-20-8-34 0-40 8m40-8c18-10 32-4 40 4m-40-4c-8-18-24-22-34-18m34 18c10-16 24-18 34-12" stroke="#1a1a1a" strokeWidth="5" fill="none" />
        <path d="M1150 180c4-30 2-56-2-70m2 0c-16-6-28 0-32 6m32-6c14-8 26-4 32 4" stroke="#1a1a1a" strokeWidth="5" fill="none" />
        <circle cx="883" cy="20" r="6" fill="#D7263D" />
      </g>
    </svg>
  );
}
