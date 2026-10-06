"use client";

// Page transitions: a fort with its gate shut fades in, the route changes, the doors swing open onto the new page.
// Same flow as the shutter transition on meraz.iitbhilai.ac.in, re-skinned. The home page's auto ride uses "white"
// instead: the screen fades to white, the route changes, the white fades off the new page.
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

type Look = "gate" | "white";
const WHITE_MS = 1000; // fade to white, and back off the new page
const GoCtx = createContext<(href: string, look?: Look) => void>(() => {});
export const useGo = () => useContext(GoCtx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [closed, setClosed] = useState<Look | false>(false);
  const pending = useRef(false);

  const go = useCallback(
    (href: string, look: Look = "gate") => {
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
        <div className="gate" data-shut={closed === "gate" || undefined}>
          {/* Photos (credited in data/content.ts): Ram Pol, Kumbhalgarh by Shivam Chaturvedi, CC BY-SA 3.0; the doors
              from "Door of a gate to Amber Fort, Rajasthan" by Uhooep, CC BY-SA 4.0 */}
          <div className="gate-stage">
            <div className="gate-door gate-door-l">
              <img src="/gate/door-left.webp" alt="" decoding="async" />
            </div>
            <div className="gate-door gate-door-r">
              <img src="/gate/door-right.webp" alt="" decoding="async" />
            </div>
            <img src="/gate/fort.webp" alt="" decoding="async" className="gate-fort" />
          </div>
        </div>
        <div
          className={`absolute inset-0 bg-white transition-opacity ease-in-out ${closed === "white" ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDuration: `${WHITE_MS}ms` }}
        />
      </div>
    </GoCtx.Provider>
  );
}

// Link that plays the gate transition. Modifier-clicks (new tab etc.) behave like a normal link.
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
