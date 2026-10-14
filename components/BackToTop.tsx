"use client";

import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-8 right-8 z-50 flex size-12 items-center justify-center rounded-full bg-rani-deep text-cream shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in"
      aria-label="Back to top"
    >
      <span className="font-display text-xl">↑</span>
    </a>
  );
}