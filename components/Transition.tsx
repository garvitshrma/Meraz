"use client";

// Page transitions: cinema curtains close, the route changes, curtains open.
// Same flow as the shutter transition on meraz.iitbhilai.ac.in, re-skinned. The home page's auto ride uses "white"
// instead: the screen fades to white, the route changes, the white fades off the new page.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

type Look = "curtain" | "white";
const WHITE_MS = 1000; // fade to white, and back off the new page
const GoCtx = createContext<(href: string, look?: Look) => void>(() => {});
export const useGo = () => useContext(GoCtx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [closed, setClosed] = useState<Look | false>(false);
  const pending = useRef(false);

  const go = useCallback(
    (href: string, look: Look = "curtain") => {
      if (href === pathname) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return router.push(href);
      pending.current = true;
      setClosed(look);
      setTimeout(() => router.push(href), look === "white" ? WHITE_MS : 650);
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    const t = setTimeout(() => setClosed(false), 250);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <GoCtx.Provider value={go}>
      {children}
      <div aria-hidden="true" className={`fixed inset-0 z-[260] ${closed ? "" : "pointer-events-none"}`}>
        <div className={`curtain left-0 ${closed === "curtain" ? "translate-x-0" : "-translate-x-full"}`} />
        <div className={`curtain right-0 ${closed === "curtain" ? "translate-x-0" : "translate-x-full"}`} />
        <div
          className={`absolute inset-0 bg-white transition-opacity ease-in-out ${closed === "white" ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDuration: `${WHITE_MS}ms` }}
        />
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-double border-turmeric bg-ink px-6 py-3 text-center transition-opacity duration-300 ${closed === "curtain" ? "opacity-100 delay-300" : "opacity-0"}`}>
          <p className="font-deva text-2xl text-turmeric">मध्यांतर</p>
          <p className="font-display text-xl text-cream">INTERVAL</p>
        </div>
      </div>
    </GoCtx.Provider>
  );
}

// Link that plays the curtain transition. Modifier-clicks (new tab etc.) behave like a normal link.
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
