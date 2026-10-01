"use client";

// Home-page preloader, like the gear + percentage loader on the reference site.
// Progress is real: fonts, the page load, and the aftermovie download (warms the cache for the TV section).
// Server-rendered so it covers the page before JS runs; hidden by CSS on repeat visits and for reduced motion.
import { useEffect, useState } from "react";
import { getLenis } from "./ScrollFx";

const bars = ["#F3E6C8", "#F2C14E", "#0F7C7C", "#F4A300", "#E0218A", "#D7263D", "#1A1A1A"];

export default function Loader({ video }: { video: string }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return setGone(true);

    root.style.overflow = "hidden";
    getLenis()?.stop();
    let target = 0;
    const bump = (n: number) => (target = Math.min(100, target + n));
    document.fonts.ready.then(() => bump(30));
    if (document.readyState === "complete") bump(30);
    else addEventListener("load", () => bump(30), { once: true });
    fetch(video)
      .then((r) => r.blob())
      .catch(() => null)
      .then(() => bump(40));
    const cap = setTimeout(() => (target = 100), 9000); // never hold visitors hostage on a slow connection

    let shown = 0;
    let raf = 0;
    const tick = () => {
      shown = Math.min(target, shown + Math.max(0.4, (target - shown) * 0.08));
      setPct(Math.floor(shown));
      if (shown >= 100) {
        setDone(true);
        try {
          sessionStorage.setItem("meraz-seen", "1");
        } catch {}
        root.dataset.seen = "1"; // CSS then hides the loader instantly on later visits to home
        setTimeout(() => {
          setGone(true);
          root.style.overflow = "";
          getLenis()?.start();
        }, 900);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
      root.style.overflow = "";
      getLenis()?.start();
    };
  }, [video]);

  if (gone) return null;
  return (
    <div className={`crt-loader ${done ? "crt-done" : ""}`} role="progressbar" aria-label="Loading Meraz 7.0" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="crt-screen">
        <div className="absolute inset-0 flex opacity-80">
          {bars.map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <div className="crt-static absolute inset-0 opacity-40 mix-blend-hard-light" />
        <div className="absolute inset-0 grid place-content-center gap-4 text-center">
          <div className="mx-auto grid aspect-square w-40 place-items-center rounded-full border-[6px] border-ink bg-cream sm:w-56">
            <div>
              <p className="bg-ink px-3 py-1 font-display text-2xl text-turmeric sm:text-3xl">MERAZ</p>
              <p className="mt-1 font-deva text-lg text-ink">चैनल ७</p>
            </div>
          </div>
          <div className="mx-auto w-[min(80vw,420px)] bg-ink/85 p-3">
            <p className="font-mono text-sm font-bold tracking-[.3em] text-turmeric">TUNING… {pct}%</p>
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className={`h-3 flex-1 ${i < pct / 5 ? "bg-turmeric" : "bg-cream/15"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
