// The Contact page's wall, painted Warli fashion over red ochre: telephone wires strung across it with birds come to
// sit on them, and a red pillar postbox. Ink outlines kept off true by a "wobble" filter so they read hand-drawn; the
// birds bob, so they go without it (a filter re-run every frame costs more than it gives).
const INK = "#1d1b4b";
const CREAM = "#f6efe1";

function Wobble({ id }: { id: string }) {
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="5" />
      <feDisplacementMap in="SourceGraphic" scale="3" />
    </filter>
  );
}

// Three wires from the crossarm of a pole at either side, each a quadratic sag: its ends at y = 28 and its control
// point's y below the middle. With the control point midway across, x runs evenly in t, so a bird at x sits at the
// curve's y there.
const WIRES = [
  { x0: 48, x1: 1392, c: 190 },
  { x0: 70, x1: 1370, c: 232 },
  { x0: 92, x1: 1348, c: 160 },
];
const sag = ({ x0, x1, c }: (typeof WIRES)[number], x: number) => {
  const t = (x - x0) / (x1 - x0);
  return (1 - t) ** 2 * 28 + 2 * t * (1 - t) * c + t * t * 28;
};
// [wire, x, facing right]: where the birds have settled
const BIRDS = [
  [0, 260, false], [0, 300, true], [2, 520, false], [1, 760, true], [0, 1010, false], [2, 1150, true], [1, 1220, false],
] as const;

export function Wires({ id, className }: { id: string; className: string }) {
  return (
    <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMin slice" aria-hidden="true" className={className}>
      <Wobble id={id} />
      <g filter={`url(#${id})`} stroke={INK} strokeLinejoin="round" strokeLinecap="round">
        {[70, 1370].map((x) => (
          <g key={x}>
            <rect x={x - 6} y="-10" width="12" height="240" fill="#5b3a22" strokeWidth="2" />
            <rect x={x - 32} y="30" width="64" height="8" fill="#5b3a22" strokeWidth="2" />
            {[-22, 0, 22].map((d) => (
              <circle key={d} cx={x + d} cy="28" r="4" fill={CREAM} strokeWidth="1.4" />
            ))}
          </g>
        ))}
        {WIRES.map(({ x0, x1, c }) => (
          <path key={c} d={`M${x0} 28Q720 ${c} ${x1} 28`} fill="none" strokeWidth="1.8" />
        ))}
      </g>
      {/* the birds: rice-paste white, feet on the wire, each bobbing in its own time */}
      {BIRDS.map(([w, x, right], i) => (
        <g key={x} transform={`translate(${x} ${sag(WIRES[w], x).toFixed(1)}) scale(${right ? -1.4 : 1.4} 1.4)`}>
          <g className="origin-bottom animate-sway [transform-box:fill-box]" style={{ animationDelay: `${-i * 0.6}s` }} fill={CREAM} stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
            <path d="M0 0C-8-2-12-10-8-16C-4-22 4-20 8-14L20-8 10-6C8-2 4 0 0 0Z" />
            <circle cx="-8" cy="-19" r="4.5" />
            <path d="M-12.5-19.5l-5 1.5 5 1.5Z" fill="#f2c14e" />
            <circle cx="-9" cy="-20" r="1" fill={INK} stroke="none" />
            <path d="M-2 0v3M2 0v3" fill="none" />
          </g>
        </g>
      ))}
    </svg>
  );
}

// An Indian Post pillar box: a red drum shaded round, its domed cap, the slot under its hood, the lettering, and the
// plate with the collection times.
export function Postbox({ id, className }: { id: string; className: string }) {
  return (
    <svg viewBox="0 0 140 240" aria-hidden="true" className={className}>
      <Wobble id={id} />
      <linearGradient id={`${id}-drum`} x1="0" x2="1">
        <stop offset="0" stopColor="#8a0b1f" />
        <stop offset=".35" stopColor="#d7263d" />
        <stop offset=".55" stopColor="#e24a5c" />
        <stop offset="1" stopColor="#8a0b1f" />
      </linearGradient>
      <g filter={`url(#${id})`} stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="12" y="222" width="116" height="14" rx="2" fill="#2b2b3a" />
        <rect x="20" y="64" width="100" height="160" fill={`url(#${id}-drum)`} />
        <path d="M16 66Q70-6 124 66Z" fill={`url(#${id}-drum)`} />
        <rect x="12" y="60" width="116" height="10" rx="3" fill="#8a0b1f" />
        <circle cx="70" cy="22" r="5" fill="#8a0b1f" />
        <path d="M34 88H106L102 96H38Z" fill="#8a0b1f" />
        <rect x="40" y="96" width="60" height="6" rx="2" fill={INK} />
        <rect x="46" y="166" width="48" height="34" fill={CREAM} strokeWidth="1.8" />
        <path d="M52 176H88M52 184H84M52 192H80" strokeWidth="1.2" />
      </g>
      <g fill={CREAM} textAnchor="middle">
        <text x="70" y="126" fontSize="11" style={{ fontFamily: "var(--font-bungee)" }}>
          LETTER BOX
        </text>
        <text x="70" y="150" fontSize="15" style={{ fontFamily: "var(--font-yatra)" }}>
          पत्र पेटी
        </text>
      </g>
    </svg>
  );
}

// White pigeons flying across the wall, side on: a white body, grey-tipped wings flapping from the shoulder, a fanned
// tail. Each crosses at its own height, size and pace, some each way, bobbing as it goes.
function Pigeon() {
  return (
    <svg viewBox="-40 -30 80 50" overflow="visible" className="w-full">
      <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        {/* the far wing, behind the body, beating a half-beat later */}
        <g className="animate-flap [transform-box:view-box]" style={{ transformOrigin: "2px -2px", animationDelay: "-0.12s" }}>
          <path d="M2-2C-2-18 -12-26 -22-28C-16-18 -10-8 -4-2Z" fill="#d9dde2" />
        </g>
        <path d="M-34 4L-20-3-19 9Z" fill="#e8ecef" />
        <path d="M-34 4L-24 3M-33 6L-23 6" fill="none" strokeWidth="0.8" />
        {/* a plump body, the breast full and low */}
        <path d="M-22 2C-16-10 4-13 16-7C24-3 25 6 18 10C6 16-14 12-22 2Z" fill={CREAM} />
        <circle cx="20" cy="-8" r="7.5" fill={CREAM} />
        {/* the grey sheen round the neck */}
        <path d="M13-5C16-1 22-1 25-4" fill="none" stroke="#9aa5ad" strokeWidth="2.6" />
        <path d="M27-9l7 2.2-7 1.6Z" fill="#c9a227" />
        <circle cx="22" cy="-10" r="1.6" fill="#d7263d" stroke="none" />
        <circle cx="22" cy="-10" r="0.8" fill={INK} stroke="none" />
        {/* the near wing */}
        <g className="animate-flap [transform-box:view-box]" style={{ transformOrigin: "4px -2px" }}>
          <path d="M4-2C0-20 -14-30 -28-30C-26-26 -27-22 -22-20C-18-12 -10-6 -2 0Z" fill={CREAM} />
          <path d="M-28-30C-26-26 -27-22 -22-20" fill="none" stroke="#7d8790" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}

// [top %, width rem, seconds across, delay s, flies left]
const FLOCK = [
  [22, 4.8, 14, 0, false], [30, 3.6, 18, -6, false], [16, 3, 20, -12, true], [44, 4.2, 16, -3, true],
  [36, 2.8, 22, -15, false], [58, 3.9, 17, -9, false], [26, 2.4, 24, -19, true],
] as const;

export function Pigeons() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLOCK.map(([top, w, dur, delay, left], i) => (
        <div
          key={i}
          className={`absolute left-0 ${left ? "animate-fly-left" : "animate-fly-right"}`}
          style={{ top: `${top}%`, width: `${w}rem`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
        >
          <div className="animate-bob" style={{ animationDelay: `${-i * 0.9}s` }}>
            <div className={left ? "-scale-x-100" : ""}>
              <Pigeon />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
