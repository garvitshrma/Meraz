"use client";

// A "scroll" tag at the foot of the screen on every inner page (home has its own, in the road scene), painted like the
// site's buttons. Up when a page opens; gone once the visitor scrolls, or if the page has nothing below the screen.
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowDown } from "@phosphor-icons/react";

export default function ScrollHint() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname === "/") return;
    const more = () => document.documentElement.scrollHeight - innerHeight > 80;
    setShow(scrollY < 40 && more());
    const off = () => scrollY > 40 && setShow(false);
    addEventListener("scroll", off, { passive: true });
    return () => removeEventListener("scroll", off);
  }, [pathname]);

  if (pathname === "/") return null;
  return (
    <p
      aria-hidden="true"
      className={`btn pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 bg-ink !px-4 !py-1.5 !text-sm tracking-widest text-turmeric transition-opacity duration-500 print:hidden ${show ? "opacity-100" : "opacity-0"}`}
    >
      SCROLL
      <ArrowDown size={16} weight="bold" className="motion-safe:animate-bounce" />
    </p>
  );
}
