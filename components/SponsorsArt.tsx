// The Sponsors page's own art, laid over its Canva design in the design's palette (pink, teal, yellow): kathputli
// puppets dangling down the sides, petals drifting down the teal, a mandala turning behind the title sponsors, tassels
// hanging off the ribbons. All decoration, hidden from screen readers; the motion stops under reduced motion.
const INK = "#1d1b4b";
const PINK = "#ff2e88";
const YELLOW = "#ffd23f";
const TEAL = "#0f8b8d";

// ---------- A kathputli, the Rajasthani string puppet ----------
// A carved wooden face under a turban (or a veil), big painted eyes, a moustache (or a nath), arms out on their strings,
// and the flared skirt set with mirrors that ends in tassels. It hangs from its strings and swings.
export function Kathputli({ she = false, className, delay = 0 }: { she?: boolean; className: string; delay?: number }) {
  const cloth = she ? PINK : "#e8742a";
  const trim = she ? YELLOW : PINK;
  return (
    <svg viewBox="0 0 120 420" aria-hidden="true" overflow="visible" className={className}>
      <g className="origin-top animate-swing [transform-box:view-box]" style={{ animationDelay: `${delay}s`, transformOrigin: "60px 0" }}>
        {/* the strings, from the bar above to the head and both hands */}
        <path d="M60 0V96M20 0L14 196M100 0L106 196" stroke="#f6efe1" strokeWidth="1" opacity=".8" />
        <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
          {/* arms, out and down to the hands */}
          <path d="M44 160L14 196M76 160L106 196" stroke={cloth} strokeWidth="9" />
          <circle cx="14" cy="198" r="6" fill="#f2c08a" />
          <circle cx="106" cy="198" r="6" fill="#f2c08a" />
          {/* the skirt: flared, a band of mirrors, a scalloped hem with tassels */}
          <path d="M42 196L8 340H112L78 196Z" fill={cloth} />
          <path d="M16 304H104" stroke={trim} strokeWidth="10" />
          {[24, 40, 56, 72, 88].map((x) => (
            <circle key={x} cx={x + 4} cy="304" r="3.4" fill="#e8eef2" strokeWidth="1" />
          ))}
          <path d="M8 340q8 10 16 0q8 10 16 0q8 10 16 0q8 10 16 0q8 10 16 0q8 10 16 0q8 10 16 0" fill={trim} />
          {[16, 32, 48, 64, 80, 96].map((x) => (
            <g key={x}>
              <path d={`M${x} 346V372`} stroke={YELLOW} strokeWidth="1.4" />
              <path d={`M${x - 4} 372h8l-2 12h-4Z`} fill={PINK} strokeWidth="1.2" />
            </g>
          ))}
          {/* the bodice and its sash */}
          <path d="M42 150H78L80 198H40Z" fill={she ? "#1f6fb2" : YELLOW} />
          <path d="M42 156L78 190" stroke={trim} strokeWidth="5" />
          {/* her veil, behind her face, over her head and shoulders */}
          {she && <path d="M36 128C34 96 46 88 60 88S86 96 84 128L90 170H30Z" fill={PINK} />}
          {she && <path d="M36 128C34 96 46 88 60 88S86 96 84 128" fill="none" stroke={YELLOW} strokeWidth="3" strokeDasharray="1 5" />}
          {/* the face: wood, painted */}
          <ellipse cx="60" cy="122" rx="18" ry="24" fill="#f2c08a" />
          <path d="M48 116q5-5 10 0q-5 3-10 0ZM62 116q5-5 10 0q-5 3-10 0Z" fill="#fff" />
          <circle cx="53" cy="116" r="2" fill={INK} />
          <circle cx="67" cy="116" r="2" fill={INK} />
          <path d="M46 109q7-5 13 0M61 109q7-5 13 0" fill="none" strokeWidth="2.2" />
          <circle cx="60" cy="104" r="2.2" fill="#d7263d" stroke="none" />
          {she ? (
            <>
              <path d="M54 134q6 4 12 0" fill="none" stroke="#d7263d" strokeWidth="2.4" />
              <circle cx="66" cy="126" r="3" fill="none" stroke={YELLOW} strokeWidth="1.4" />
            </>
          ) : (
            <>
              <path d="M48 132q6-6 12 0q6-6 12 0q-6 6-12 2q-6 4-12-2Z" fill={INK} />
              {/* the turban, wound high, its plume */}
              <path d="M38 108C34 86 48 78 60 78S88 86 82 108Z" fill="#d7263d" />
              <path d="M40 98L80 88M42 104L82 94" stroke={YELLOW} strokeWidth="2.4" />
              <path d="M76 82C84 70 92 66 96 70C90 74 84 80 80 88Z" fill={YELLOW} />
            </>
          )}
        </g>
      </g>
    </svg>
  );
}

// ---------- Petals drifting down ----------
// Each is a column the height of the page, sliding from above to below it (so its fall spans the page however tall),
// the petal in it rocking from side to side as it falls.
const PETALS = [
  [4, 0, 28, "m"], [12, -9, 34, "r"], [19, -17, 26, "m"], [27, -4, 38, "y"], [36, -22, 30, "r"], [44, -12, 36, "m"],
  [53, -28, 29, "y"], [61, -6, 33, "r"], [70, -19, 27, "m"], [78, -14, 37, "y"], [86, -25, 31, "r"], [94, -2, 35, "m"],
] as const;
const PETAL = {
  m: { fill: "#f4a300", edge: "#d9480f" }, // marigold
  y: { fill: YELLOW, edge: "#f08c00" },
  r: { fill: PINK, edge: "#b8166f" }, // rose
};

export function Petals() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map(([x, delay, dur, kind], i) => (
        <div key={i} className="absolute top-0 h-full w-6 animate-fall" style={{ left: `${x}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>
          <svg viewBox="-12 -16 24 32" className="absolute bottom-0 w-[clamp(.8rem,1.4vw,1.4rem)] animate-flutter" style={{ animationDelay: `${-i * 0.7}s` }}>
            <path d="M0-14C10-8 10 6 0 14C-10 6-10-8 0-14Z" fill={PETAL[kind].fill} stroke={PETAL[kind].edge} strokeWidth="1.4" />
            <path d="M0-10V10" stroke={PETAL[kind].edge} strokeWidth="1" opacity=".6" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ---------- A mandala turning slowly behind a title sponsor ----------
export function Mandala({ className }: { className: string }) {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true" className={className}>
      <g className="origin-center animate-spin-slow [transform-box:fill-box]" fill="none" strokeLinejoin="round">
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M0-98C7-86 7-76 0-68C-7-76-7-86 0-98Z" transform={`rotate(${i * 15})`} fill={i % 2 ? PINK : YELLOW} />
        ))}
        <circle r="66" stroke={YELLOW} strokeWidth="2.5" strokeDasharray="2 5" strokeLinecap="round" />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M0-62C12-48 12-36 0-26C-12-36-12-48 0-62Z" transform={`rotate(${i * 22.5})`} stroke={PINK} strokeWidth="2" fill={TEAL} />
        ))}
        <circle r="24" stroke={YELLOW} strokeWidth="2" />
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cy="-16" r="4" transform={`rotate(${i * 45})`} fill={YELLOW} />
        ))}
        <circle r="8" fill={PINK} />
      </g>
    </svg>
  );
}

// ---------- A tassel with a little bell, hung from a ribbon's end ----------
export function Tassel({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <svg viewBox="0 0 20 80" aria-hidden="true" overflow="visible" className={className}>
      <g className="animate-swing [transform-box:view-box]" style={{ animationDelay: `${delay}s`, transformOrigin: "10px 0" }} stroke={INK} strokeWidth="1">
        <path d="M10 0V30" stroke={YELLOW} strokeWidth="1.6" />
        <circle cx="10" cy="22" r="3.2" fill={PINK} />
        <path d="M4 44C4 34 7 30 10 30S16 34 16 44Z" fill="#d9a521" />
        <path d="M2 44H18" strokeWidth="1.6" stroke="#a87b12" />
        <circle cx="10" cy="48" r="2.4" fill="#a87b12" />
        <path d="M6 52h8l2 26H4Z" fill={PINK} />
        <path d="M7 56V76M10 56V78M13 56V76" stroke="#b8166f" />
      </g>
    </svg>
  );
}
