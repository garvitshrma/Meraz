"use client";

// "A glimpse into last year's Meraz": same as the reference. The aftermovie plays inside a TV that is pinned
// and scrubs from 1.72x down to 1x while you scroll; the video plays only while visible. Here the TV is an
// old wooden set with a crochet doily, knobs and an antenna.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TvSection({ src }: { src: string }) {
  const pin = useRef<HTMLDivElement>(null);
  const tv = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current!;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();
    const ctx = gsap.context(() => {
      gsap.fromTo(tv.current, { scale: 1.72 }, { scale: 1, ease: "none", scrollTrigger: { trigger: pin.current, start: "top top", end: "+=200%", scrub: true, pin: true } });
    });
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section aria-labelledby="tv-title" className="relative bg-ink">
      <div ref={pin} className="wallpaper relative grid h-[100dvh] place-items-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(242_193_78/.28),transparent_60%)]" aria-hidden="true" />
        <div className="relative z-[2] grid justify-items-center gap-20 sm:gap-24">
          <h2 id="tv-title" className="text-center">
            <span className="block font-poster text-[clamp(1.4rem,3.5vw,2.4rem)] leading-tight text-cream">A glimpse into last year’s Meraz</span>
            <span className="painted block font-display text-[clamp(2rem,6vw,4rem)] leading-none text-turmeric">Meraz’24 Aftermovie</span>
          </h2>

          <div ref={tv} className="relative w-[min(88vw,760px)]">
            {/* antenna */}
            <div className="absolute -top-16 left-1/2 h-16 w-24 -translate-x-1/2" aria-hidden="true">
              <span className="absolute bottom-0 left-1/2 h-20 w-1 origin-bottom -translate-x-1/2 -rotate-[28deg] bg-ink" />
              <span className="absolute bottom-0 left-1/2 h-20 w-1 origin-bottom -translate-x-1/2 rotate-[28deg] bg-ink" />
              <span className="absolute -bottom-1 left-1/2 h-4 w-10 -translate-x-1/2 rounded-t-full border-2 border-ink bg-[#6b3f1f]" />
            </div>
            {/* doily */}
            <div className="absolute -top-3 left-[18%] h-5 w-[38%] rounded-b-full bg-[radial-gradient(circle,#f3e6c8_2px,transparent_2.5px)] bg-[size:8px_8px] opacity-90" aria-hidden="true" />
            {/* cabinet */}
            <div className="grid grid-cols-[1fr_auto] gap-3 rounded-[28px] border-4 border-ink bg-[#6b3f1f] bg-[repeating-linear-gradient(90deg,rgb(0_0_0/.12)_0_3px,transparent_3px_14px)] p-3 shadow-[10px_10px_0_#0b0b0b] sm:gap-5 sm:p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[30px/40px] border-[6px] border-ink bg-ink">
                <video ref={video} src={src} muted loop playsInline preload="auto" aria-label="Meraz 2024 aftermovie" className="absolute inset-0 size-full object-cover sepia-[.2]" />
                <div className="pointer-events-none absolute inset-0 scanlines" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse,transparent_60%,rgb(14_14_14/.6))]" aria-hidden="true" />
              </div>
              <div className="flex w-12 flex-col items-center justify-between py-2 sm:w-20" aria-hidden="true">
                <span className="grid size-9 place-items-center rounded-full border-4 border-ink bg-turmeric sm:size-14">
                  <span className="h-1/2 w-1 bg-ink" />
                </span>
                <span className="grid size-9 place-items-center rounded-full border-4 border-ink bg-cream sm:size-14">
                  <span className="h-1/2 w-1 rotate-45 bg-ink" />
                </span>
                <span className="h-16 w-full rounded bg-[radial-gradient(#2a1608_1.5px,transparent_2px)] bg-[size:6px_6px] sm:h-24" />
                <span className="font-display text-[10px] text-turmeric sm:text-xs">MERAZ</span>
              </div>
            </div>
            {/* legs */}
            <div className="mx-auto flex w-3/4 justify-between" aria-hidden="true">
              <span className="h-8 w-3 -skew-x-12 bg-ink" />
              <span className="h-8 w-3 skew-x-12 bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
