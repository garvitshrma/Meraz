"use client";

// Page transitions: the loading screen (the boombox, see LoadingScreen) fades in, the route changes, and it stays up
// until the new page has fully rendered (its fonts, its images, and anything it holds the screen for: see useHold),
// its meter running to 100%, then fades off the new page. Leaving the home page goes another way, its auto ride ending
// in "white": the screen fades to white, the route changes, the white fades off the new page. A page loaded afresh
// (opened, refreshed) shows the loading screen from its first paint the same way, until it has fully rendered; home
// has its own (see RoadJump), which also waits for its scene.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";

type Look = "loading" | "white";
const WHITE_MS = 1000; // fade to white, and back off the new page
const SHOW_MS = 500; // the loading screen fades in, then the route changes
const CAP_MS = 15000; // the most a page change waits on the new page before lifting the screen anyway
const ROUTE = 0.3; // the meter's share for fetching the route; the new page's loading takes the rest
const GoCtx = createContext<(href: string, look?: Look) => void>(() => {});
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
  const [closed, setClosed] = useState<Look | false>(fresh && "loading");
  const pending = useRef<Look | null>(fresh ? "loading" : null); // the look of a change on its way, until it lifts
  const screen = useRef<HTMLDivElement>(null);
  const creep = useRef(0);
  // where a "loading" change is: fetching, or the page loading (set from the start, so a fresh page's holds count)
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
    (href: string, look: Look = pathname === "/" ? "white" : "loading") => {
      if (href === pathname) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return router.push(href);
      pending.current = look;
      setClosed(look);
      if (look === "loading") {
        let f = 0;
        meter(f);
        phase.current = "route";
        holds.current = [];
        clearInterval(creep.current);
        creep.current = window.setInterval(() => meter((f += (ROUTE - f) * 0.12)), 100);
      }
      setTimeout(() => router.push(href), look === "white" ? WHITE_MS : SHOW_MS);
    },
    [pathname, router],
  );

  useEffect(() => {
    // pending is cleared when the screen lifts, not here, so a rerun (React's dev double mount) sets it up again
    const look = pending.current;
    if (!look) return;
    clearInterval(creep.current);
    if (look === "white") {
      const t = setTimeout(() => {
        pending.current = null;
        setClosed(false);
      }, 250);
      return () => clearTimeout(t);
    }
    // Home puts up the same screen while its scene loads, with its own meter: hand straight over to it.
    if (pathname === "/") {
      pending.current = phase.current = null;
      return setClosed(false);
    }
    phase.current = "page";
    settled.current = false;
    let lift = 0;
    finish.current = () => {
      if (phase.current !== "page" || !settled.current || holds.current.some((h) => !h.done)) return;
      pending.current = phase.current = null;
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
      {/* data-up while the loading screen shows: the page's entrances wait for it (see .animate-elephant) */}
      <div ref={screen} data-page-screen data-up={closed === "loading" || undefined} className={`fixed inset-0 z-[260] ${closed ? "" : "pointer-events-none"}`}>
        <LoadingScreen id="go-" className={closed === "loading" ? "" : "invisible opacity-0"} />
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-white transition-opacity ease-in-out ${closed === "white" ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDuration: `${WHITE_MS}ms` }}
        />
      </div>
    </GoCtx.Provider>
  );
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
