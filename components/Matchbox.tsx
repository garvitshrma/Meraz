import type { Sponsor } from "@/data/content";

const looks = [
  { bg: "bg-vermillion", fg: "text-cream", accent: "#F2C14E" },
  { bg: "bg-teal-deep", fg: "text-cream", accent: "#F4A300" },
  { bg: "bg-marigold", fg: "text-ink", accent: "#E0218A" },
  { bg: "bg-rani", fg: "text-cream", accent: "#F2C14E" },
];

// Vintage matchbox-label sponsor tile. Pure CSS, no JS.
export function Matchbox({ sponsor, index }: { sponsor: Sponsor; index: number }) {
  const l = looks[index % looks.length];
  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block aspect-[5/3.3] rounded-sm border-[3px] border-ink p-2 shadow-[5px_5px_0_var(--color-ink)] transition-transform duration-200 hover:-rotate-2 hover:scale-[1.03] ${l.bg} ${l.fg}`}
    >
      <div className="flex h-full flex-col items-center justify-between border-2 border-current p-2 text-center outline-2 outline-offset-2 outline-current [outline-style:dashed]">
        <p className="font-mono text-[9px] font-bold tracking-[.25em] sm:text-[10px]">{sponsor.tier.toUpperCase()}</p>
        <Emblem variant={index} accent={l.accent} />
        <p className="font-display text-sm leading-tight sm:text-lg">{sponsor.name}</p>
        <p className="font-mono text-[8px] tracking-widest opacity-80 sm:text-[9px]">MADE IN BHARAT · 50 SPARKS</p>
      </div>
    </a>
  );
}

function Emblem({ variant, accent }: { variant: number; accent: string }) {
  const v = variant % 4;
  return (
    <svg viewBox="0 0 40 40" className="size-9 sm:size-12" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill={accent} stroke="#1a1a1a" strokeWidth="2" />
      {v === 0 && <path d="M20 5l4 11 11 0-9 7 3 11-9-7-9 7 3-11-9-7 11 0z" fill="#1a1a1a" />}
      {v === 1 &&
        [0, 30, 60, 90, 120, 150].map((a) => <rect key={a} x="19" y="4" width="2" height="32" fill="#1a1a1a" transform={`rotate(${a} 20 20)`} />)}
      {v === 2 && [0, 60, 120].map((a) => <ellipse key={a} cx="20" cy="20" rx="5" ry="14" fill="none" stroke="#1a1a1a" strokeWidth="2" transform={`rotate(${a} 20 20)`} />)}
      {v === 3 && <path d="M20 6 L30 30 L20 24 L10 30 Z" fill="#1a1a1a" />}
      <circle cx="20" cy="20" r="4" fill="#F3E6C8" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
}
