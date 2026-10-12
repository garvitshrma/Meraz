"use client";

// Page transitions: the loading screen (the boombox, see LoadingScreen) fades in, the route changes, and it stays up
// until the new page has fully rendered (its fonts, its images, and anything it holds the screen for: see useHold),
// its meter running to 100%, then fades off the new page. Leaving the home page, its auto ride runs while the next
// page's files load (see RoadJump), then hands over a copy of its last frame, which glitches (see Glitch) for
// GLITCH_MS while the loading screen comes up under it. A page
// loaded afresh (opened, refreshed) shows the loading screen from its first paint the same way, until it has fully
// rendered; home has its own (see RoadJump), which also waits for its scene.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

const SHOW_MS = 500; // the loading screen fades in, then the route changes
const GLITCH_MS = 1200; // the glitch, over the loading screen fading in under it
const CAP_MS = 15000; // the most a page change waits on the new page before lifting the screen anyway, and on the
// route before loading the page afresh instead (a client navigation that failed or stalled never changes the path)
const ROUTE = 0.3; // the meter's share for fetching the route; the new page's loading takes the rest
// go(href, shot): shot, a picture of the screen as it is, to glitch out of
const GoCtx = createContext<(href: string, shot?: HTMLCanvasElement) => void>(() => {});
export const useGo = () => useContext(GoCtx);

// A page that needs more than its route to show (a 3D scene) holds a page change's loading screen up until it has
// drawn. hold(n), from its mount effect: step() once for each of n parts as it lands, moving the meter on; done() once
// drawn, or failed, or unmounted (it can be called again). Outside a page change it does nothing.
type Holder = (n: number) => { step: () => void; done: () => void };
const HoldCtx = createContext<Holder>(() => ({ step() {}, done() {} }));
export const useHold = () => useContext(HoldCtx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const fresh = pathname !== "/"; // as first rendered (on the server too): a page loaded afresh, up from the first paint
  const [closed, setClosed] = useState(fresh);
  const [glitch, setGlitch] = useState<HTMLCanvasElement | null>(null);
  const pending = useRef(fresh); // a change on its way, until the screen lifts
  const screen = useRef<HTMLDivElement>(null);
  const creep = useRef(0);
  const routeCap = useRef(0);
  // where a change is: fetching, or the page loading (set from the start, so a fresh page's holds count)
  const phase = useRef<"route" | "page" | null>(fresh ? "page" : null);
  const holds = useRef<{ n: number; k: number; done: boolean }[]>([]);
  const settled = useRef(false); // the new page's fonts and images are in
  const finish = useRef(() => {});

  // The loading screen's meter: fetching the route can't be measured, so it creeps toward ROUTE meanwhile; then the
  // new page's holds move it on, and its being fully rendered takes it to 100.
  const meter = (f: number) => {
    const el = screen.current;
    if (!el) return;
    el.style.setProperty("--load", String(f));
    const pct = el.querySelector("[data-load-pct]");
    if (pct) pct.textContent = String(Math.round(f * 100));
  };

  const go = useCallback(
    (href: string, shot?: HTMLCanvasElement) => {
      if (href === pathname) return;
      // the same page at another hash or query: no page change for the screen to wait on
      if (new URL(href, location.href).pathname === pathname) return router.push(href);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return router.push(href);
      pending.current = true;
      setClosed(true);
      phase.current = "route";
      holds.current = [];
      let f = 0;
      meter(f);
      clearInterval(creep.current);
      creep.current = window.setInterval(() => meter((f += (ROUTE - f) * 0.12)), 100);
      if (shot) {
        setGlitch(shot);
        setTimeout(() => setGlitch(null), GLITCH_MS);
      }
      setTimeout(() => router.push(href), shot ? GLITCH_MS : SHOW_MS);
      clearTimeout(routeCap.current);
      routeCap.current = window.setTimeout(() => phase.current === "route" && location.assign(href), CAP_MS);
    },
    [pathname, router],
  );

  useEffect(() => {
    // pending is cleared when the screen lifts, not here, so a rerun (React's dev double mount) sets it up again
    if (!pending.current) return;
    clearInterval(creep.current);
    clearTimeout(routeCap.current);
    // Home puts up the same screen while its scene loads, with its own meter: hand straight over to it.
    if (pathname === "/") {
      pending.current = false;
      phase.current = null;
      return setClosed(false);
    }
    phase.current = "page";
    settled.current = false;
    let lift = 0;
    finish.current = () => {
      if (phase.current !== "page" || !settled.current || holds.current.some((h) => !h.done)) return;
      pending.current = false;
      phase.current = null;
      meter(1);
      lift = window.setTimeout(() => setClosed(false), 400); // long enough to see it reach 100
    };
    // The new page's fonts and the images it loads now (lazy ones load as they scroll in), after a frame to lay it out.
    const frame = requestAnimationFrame(() => {
      const images = [...document.querySelectorAll<HTMLImageElement>("main img")].filter((i) => !i.complete && i.loading !== "lazy");
      Promise.all([document.fonts.ready, ...images.map((i) => i.decode().catch(() => {}))]).then(() => {
        settled.current = true;
        finish.current();
      });
    });
    const cap = window.setTimeout(() => {
      settled.current = true;
      holds.current.forEach((h) => (h.done = true));
      finish.current();
    }, CAP_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(cap);
      clearTimeout(lift);
    };
  }, [pathname]);

  const hold = useCallback<Holder>((n) => {
    if (!phase.current) return { step() {}, done() {} };
    const h = { n, k: 0, done: false };
    holds.current.push(h);
    const update = () => {
      if (!phase.current) return; // lifted already (or capped): the meter has reached 100
      const all = holds.current;
      meter(ROUTE + (1 - ROUTE) * 0.95 * (all.reduce((a, x) => a + (x.done ? 1 : Math.min(1, x.k / x.n)), 0) / all.length));
      finish.current();
    };
    return {
      step: () => {
        h.k++;
        update();
      },
      done: () => {
        if (h.done) return;
        h.done = true;
        update();
      },
    };
  }, []);

  useEffect(() => () => clearInterval(creep.current), []);

  return (
    <GoCtx.Provider value={go}>
      <HoldCtx.Provider value={hold}>{children}</HoldCtx.Provider>
      {/* without scripts nothing would lift it */}
      <noscript>
        <style>{"[data-page-screen] { display: none }"}</style>
      </noscript>
      {/* data-up while the screen shows: the page's entrances wait for it (see .animate-elephant) */}
      <div ref={screen} data-page-screen data-up={closed || undefined} className={`fixed inset-0 z-[260] ${closed ? "" : "pointer-events-none"}`}>
        <LoadingScreen id="go-" className={closed ? "" : "invisible opacity-0"} />
        {glitch && <Glitch shot={glitch} />}
      </div>
    </GoCtx.Provider>
  );
}

// The glitch: the shot redrawn every STEP ms on a canvas, each frame at random and rougher than the last. Its red,
// green and blue, each picked out alone, are added back together a little apart (red one way, blue the other);
// slices of it tear sideways, each with its own red and blue fringe; blocks of red and blue flash across; a light
// grain over all. In the last fifth it breaks up in bands onto the loading screen under it.
const STEP = 45;
function Glitch({ shot }: { shot: HTMLCanvasElement }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const [W, H] = [(cv.width = shot.width), (cv.height = shot.height)];
    const ctx = cv.getContext("2d")!;
    const src = shot.getContext("2d")!.getImageData(0, 0, W, H).data;
    const layer = (fill: (d: Uint8ClampedArray) => void, w = W, h = H) => {
      const c = document.createElement("canvas");
      [c.width, c.height] = [w, h];
      const img = new ImageData(w, h);
      fill(img.data);
      c.getContext("2d")!.putImageData(img, 0, 0);
      return c;
    };
    const [R, G, B] = [0, 1, 2].map((ch) =>
      layer((d) => {
        for (let i = 0; i < d.length; i += 4) [d[i + ch], d[i + 3]] = [src[i + ch], 255];
      }),
    );
    const grain = ctx.createPattern(
      layer((d) => {
        for (let i = 0; i < d.length; i += 4) {
          d[i] = d[i + 1] = d[i + 2] = Math.random() * 255;
          d[i + 3] = 255;
        }
      }, 160, 160),
      "repeat",
    )!;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const draw = (t: number) => {
      const k = Math.min(1, 0.25 + t * 1.2); // how rough
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const split = W * 0.012 * k;
      ctx.drawImage(R, -split * rnd(0.6, 1.6), rnd(-1, 1) * split * 0.2);
      ctx.drawImage(G, 0, 0);
      ctx.drawImage(B, split * rnd(0.6, 1.6), rnd(-1, 1) * split * 0.2);
      for (let i = Math.round(2 + 10 * k); i > 0; i--) {
        const h = H * rnd(0.004, 0.012 + 0.07 * k);
        const y = rnd(0, H - h);
        const dx = rnd(-1, 1) * W * 0.18 * k;
        const fringe = W * rnd(0.005, 0.03);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillRect(0, y, W, h);
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(R, 0, y, W, h, dx - fringe, y, W, h);
        ctx.drawImage(G, 0, y, W, h, dx, y, W, h);
        ctx.drawImage(B, 0, y, W, h, dx + fringe, y, W, h);
      }
      ctx.globalCompositeOperation = "screen";
      for (let i = Math.round(6 * k); i > 0; i--) {
        ctx.fillStyle = Math.random() < 0.5 ? "rgb(255 0 60 / 0.6)" : "rgb(0 90 255 / 0.6)";
        ctx.fillRect(rnd(-0.1, 0.9) * W, rnd(0, 1) * H, W * rnd(0.05, 0.4), H * rnd(0.004, 0.03));
      }
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = grain;
      ctx.save();
      ctx.translate(rnd(-160, 0), rnd(-160, 0));
      ctx.fillRect(0, 0, W + 160, H + 160);
      ctx.restore();
      ctx.globalAlpha = 1;
      if (t > 0.8) {
        ctx.globalCompositeOperation = "destination-out";
        for (let i = 8; i > 0; i--) ctx.fillRect(0, rnd(0, 1) * H, W, H * rnd(0.03, 0.15) * (t - 0.8) * 5);
      }
    };

    const start = performance.now();
    let shown = -1;
    let raf = 0;
    const frame = (now: number) => {
      const step = Math.floor((now - start) / STEP);
      if (step !== shown) draw(Math.min(1, ((shown = step) * STEP) / GLITCH_MS));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [shot]);
  return <canvas ref={ref} aria-hidden="true" className="glitch" />;
}

// Link that plays the page transition. Modifier-clicks (new tab etc.) behave like a normal link.
export function TLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const go = useGo();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href);
      }}
    />
  );
}
