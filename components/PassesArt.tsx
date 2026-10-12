// The Passes page's mela, drawn in the manner of its tiger and dancer: dark ink outlines over flat, loud colour.
// Plants carry a "wobble" filter that pushes every line a little off true so they read hand-drawn; the pieces that
// move (bells, smoke) go without it, as a filter re-run every frame costs more than it gives.
const INK = "#1d1b4b";
const GREENS = ["#2f8f46", "#55b04a", "#1f6b3a"];

function Wobble({ id }: { id: string }) {
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
      <feDisplacementMap in="SourceGraphic" scale="3.5" />
    </filter>
  );
}

// A heart-shaped leaf on its stalk, hanging from (0,0) along +y.
const LEAF = "M0 14C-6 6-22 10-20 24C-18 38-6 48 0 58C6 48 18 38 20 24C22 10 6 6 0 14Z";

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} rx="5" ry="9" cy="-8" transform={`rotate(${a})`} fill="#e0218a" stroke={INK} strokeWidth="1.5" />
      ))}
      <circle r="4" fill="#f4a300" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

// [x, y, angle, size]: where the leaves leave the two vines, alternately to either side; big leaves on the main vine,
// small ones between them and on the second vine twining round it
const CREEPER_LEAVES = [
  [72, 40, -60, 1], [94, 95, 55, 1], [86, 150, -50, 1], [62, 212, 60, 1], [58, 268, -65, 1], [78, 330, 50, 1],
  [100, 392, -55, 1], [96, 450, 60, 1], [78, 510, -50, 1], [68, 568, 55, 1], [70, 618, -40, 1],
  [84, 68, 40, 0.7], [90, 122, -35, 0.7], [72, 182, 45, 0.7], [60, 240, -40, 0.7], [68, 300, 35, 0.7],
  [90, 362, -45, 0.7], [100, 420, 40, 0.7], [88, 482, -35, 0.7], [72, 540, 45, 0.7], [68, 594, -30, 0.7],
  [78, 45, 50, 0.8], [66, 110, -55, 0.8], [54, 165, 60, 0.8], [82, 232, -50, 0.8], [96, 292, 55, 0.8],
  [74, 352, -60, 0.8], [52, 420, 50, 0.8], [48, 482, -55, 0.8], [62, 540, 45, 0.8],
];

export function Creeper({ id, className }: { id: string; className: string }) {
  return (
    <svg viewBox="0 0 160 660" aria-hidden="true" className={className}>
      <Wobble id={id} />
      <g filter={`url(#${id})`} stroke={INK} strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 0C40 60 120 120 80 180S40 300 80 360 120 480 80 540 60 610 70 650" fill="none" strokeWidth="3.5" />
        <path d="M60 0C100 70 30 130 70 200S110 320 70 380 30 500 66 570" fill="none" strokeWidth="2.4" />
        {CREEPER_LEAVES.map(([x, y, a, k], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${k})`}>
            <path d={LEAF} fill={GREENS[i % 3]} strokeWidth="2.2" />
            <path d="M0 0V50" fill="none" strokeWidth="1.4" />
          </g>
        ))}
      </g>
      <g filter={`url(#${id})`}>
        {[[84, 250], [88, 480], [72, 640], [60, 130], [96, 360], [58, 560]].map(([x, y]) => (
          <Flower key={y} x={x} y={y} />
        ))}
      </g>
    </svg>
  );
}

// A genda (marigold) seen face on: three rings of ruffled petals, each shaded light at its heart to dark at its
// frilled edge, the darker heart showing through the middle, (the garland shades each ball round).
function Genda({ id, light, dark }: { id: string; light: string; dark: string }) {
  const rings = [
    { n: 18, rx: 4.4, ry: 6.4, cy: -8.2, turn: 0 },
    { n: 13, rx: 3.8, ry: 5.2, cy: -5.4, turn: 9 },
    { n: 9, rx: 3, ry: 3.8, cy: -2.6, turn: 20 },
  ];
  return (
    <symbol id={id} overflow="visible">
      <radialGradient id={`${id}-petal`} cx="50%" cy="85%" r="90%">
        <stop offset="0%" stopColor={light} />
        <stop offset="100%" stopColor={dark} />
      </radialGradient>
      <circle r="13" fill={dark} stroke="none" />
      {rings.map(({ n, rx, ry, cy, turn }) =>
        Array.from({ length: n }, (_, i) => (
          <ellipse
            key={`${n}-${i}`}
            rx={rx}
            ry={ry}
            cy={cy}
            transform={`rotate(${turn + (i * 360) / n})`}
            fill={`url(#${id}-petal)`}
            stroke={dark}
            strokeWidth=".7"
          />
        )),
      )}
      <circle r="2.2" fill={dark} stroke="none" />
    </symbol>
  );
}

// Marigold garlands swagged across the top, mango leaves and a swinging brass bell where each swag is tied. Swags are
// 360 wide on a 1440 board; the middle one dips at its centre so nothing hangs over the title. Sliced to the middle
// on narrow screens, so the marigolds keep their size.
const KNOTS = [-180, 180, 540, 900, 1260, 1620];
const BEADS = 18;

function swag(x0: number, x1: number) {
  const mx = (x0 + x1) / 2;
  return Array.from({ length: BEADS }, (_, i) => {
    const t = i / (BEADS - 1);
    const [a, b, c] = [(1 - t) ** 2, 2 * (1 - t) * t, t * t];
    return [a * x0 + b * mx + c * x1, a * 10 + b * 190 + c * 10];
  });
}

export function Garland({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 1440 170" preserveAspectRatio="xMidYMin slice" aria-hidden="true" className={className}>
      <defs>
        <Genda id="genda-orange" light="#ffb347" dark="#d9480f" />
        <Genda id="genda-yellow" light="#ffe066" dark="#f08c00" />
        {/* lit from the top left, as the rest of the page: each flower rounds off into shadow at its lower right */}
        <radialGradient id="genda-shade" cx="35%" cy="30%" r="75%">
          <stop offset="55%" stopColor="#7a2e00" stopOpacity="0" />
          <stop offset="100%" stopColor="#7a2e00" stopOpacity=".45" />
        </radialGradient>
      </defs>
      <g stroke={INK} strokeLinejoin="round">
        {KNOTS.slice(1).map((x1, s) =>
          swag(KNOTS[s], x1).map(([x, y], i) => (
            <g key={`${s}-${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              {/* turned so no two read alike; the round shading stays put, lit from the top left */}
              <use href={`#genda-${(i * 7 + s * 3) % 5 < 3 ? "orange" : "yellow"}`} transform={`rotate(${(i * 47 + s * 29) % 360})`} />
              <circle r="13.4" fill="url(#genda-shade)" stroke="none" />
            </g>
          )),
        )}
        {KNOTS.map((x, k) => (
          <g key={x} transform={`translate(${x} 10)`}>
            <path d="M0 0C8 10 8 34 0 46C-8 34-8 10 0 0Z" transform="rotate(-38)" fill={GREENS[0]} strokeWidth="1.6" />
            <path d="M0 0C8 10 8 34 0 46C-8 34-8 10 0 0Z" transform="rotate(38)" fill={GREENS[1]} strokeWidth="1.6" />
            {/* the bell swings from the knot */}
            <g className="origin-top animate-swing [transform-box:fill-box]" style={{ animationDelay: `${-k * 0.7}s` }}>
              <path d="M0 0V58" strokeWidth="1.6" />
              <path d="M-12 82C-12 66-7 58 0 58S12 66 12 82Z" fill="#d9a521" strokeWidth="1.8" />
              <path d="M-15 82H15" strokeWidth="2.4" />
              <circle cy="87" r="3.5" fill={INK} />
              <path d="M-3 92L0 112 3 92" fill="#e0218a" strokeWidth="1.2" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

// A rangoli of powder: rani petals, a turmeric ring set with dots, teal petals, a marigold heart. Laid flat (the
// caller squashes it) under the dancer's feet.
export function Rangoli({ className }: { className: string }) {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true" className={className}>
      <g stroke={INK} strokeWidth="1.6">
        {Array.from({ length: 16 }, (_, i) => (
          <ellipse key={i} rx="9" ry="19" cy="-78" transform={`rotate(${i * 22.5})`} fill="#e0218a" />
        ))}
        <circle r="62" fill="#f2c14e" />
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={i} r="3.4" cy="-52" transform={`rotate(${i * 15})`} fill="#fff6e0" strokeWidth="1" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} rx="12" ry="24" cy="-22" transform={`rotate(${i * 45})`} fill="#0f7c7c" />
        ))}
        <circle r="14" fill="#f4a300" />
        <circle r="5.5" fill="#e0218a" />
      </g>
    </svg>
  );
}

// The booking clerk's rubber stamp: the office round the rim, "happy journey" in the middle.
export function Stamp({ id, className }: { id: string; className: string }) {
  return (
    <svg viewBox="-60 -60 120 120" aria-hidden="true" className={className}>
      <path id={id} d="M-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" fill="none" />
      <g fill="none" stroke="currentColor">
        <circle r="56" strokeWidth="3.5" />
        <circle r="31" strokeWidth="1.6" />
      </g>
      <text fill="currentColor" fontSize="9" letterSpacing="1" fontWeight="700" style={{ fontFamily: "var(--font-courier)" }}>
        <textPath href={`#${id}`}>MERAZ 7.0 · BOOKING OFFICE · IIT BHILAI ·</textPath>
      </text>
      <text fill="currentColor" fontSize="11" textAnchor="middle" y="4" style={{ fontFamily: "var(--font-yatra)" }}>
        शुभ यात्रा
      </text>
    </svg>
  );
}

// The station at the foot of the page, side on: the booking office (ochre walls, a tiled roof with its clock gable,
// a teal canopy with a scalloped valance on iron columns), a bench and a pile of trunks on the platform, the
// nameboard; and the Meraz Express running slowly through it, right to left, its wheels turning, smoke rolling back
// off the chimney, painted Madhubani fashion (double outlines, sawtooth and dot borders, pairs of fish, a sun).
// A 1440 x 360 board, sliced about its middle on narrow screens: the board and the line stay in view.
const OCHRE = "#e9b44c";
const BRICK = "#b5501b";
const MAROON = "#7a061d";
const IRON = "#2b2b3a";
const BRASS = "#d9a521";
const CREAM = "#f3e6c8";
const RED = "#d7263d";
const YELLOW = "#f2c14e";

// The train runs RUN user units (from wholly off the right edge to wholly off the left) in RUN_S seconds; a wheel of
// radius r turns once every 2πr / (RUN / RUN_S) seconds so it rolls rather than skids. Keep RUN and RUN_S in step with
// the train-run keyframes in app/globals.css.
const RUN = 2160;
const RUN_S = 36;

function Wheel({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="animate-roll [transform-box:fill-box] origin-center" style={{ animationDuration: `${((2 * Math.PI * r) / (RUN / RUN_S)).toFixed(2)}s` }}>
        <circle r={r} fill={IRON} strokeWidth="2.2" />
        <circle r={r - 4} fill="none" stroke={RED} strokeWidth="2" />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d={`M${-(r - 5)} 0H${r - 5}`} transform={`rotate(${a})`} stroke={CREAM} strokeWidth="1.4" />
        ))}
        <circle r="4" fill={BRASS} strokeWidth="1.2" />
      </g>
    </g>
  );
}

// Madhubani pieces. A sawtooth border: triangles alternately yellow and green between two ink lines, from x0 to x1.
function Sawtooth({ x0, x1, y, h = 8 }: { x0: number; x1: number; y: number; h?: number }) {
  const n = Math.floor((x1 - x0) / h);
  return (
    <g strokeWidth="1">
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x0 + i * h} ${y + h}l${h / 2}-${h}l${h / 2} ${h}Z`} fill={i % 2 ? "#55b04a" : YELLOW} />
      ))}
      <path d={`M${x0} ${y}H${x0 + n * h}M${x0} ${y + h}H${x0 + n * h}`} strokeWidth="1.4" />
    </g>
  );
}

// A row of dots, every `gap` from x0 to x1.
function Dots({ x0, x1, y, gap = 7, fill = YELLOW }: { x0: number; x1: number; y: number; gap?: number; fill?: string }) {
  return (
    <g fill={fill} stroke="none">
      {Array.from({ length: Math.floor((x1 - x0) / gap) + 1 }, (_, i) => (
        <circle key={i} cx={x0 + i * gap} cy={y} r="1.6" />
      ))}
    </g>
  );
}

// The Madhubani fish, a token of good luck: double-outlined body, scales, a big eye, a fanned tail. Faces +x.
function Fish({ x, y, flip = false, size = 1 }: { x: number; y: number; flip?: boolean; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -size : size} ${size})`} strokeWidth="1.3">
      <path d="M-14 0L-25-10-22 0-25 10Z" fill="#55b04a" />
      <path d="M-22-6L-16 0-22 6" fill="none" />
      <path d="M-14 0C-6-12 10-12 19 0 10 12-6 12-14 0Z" fill={YELLOW} />
      <path d="M-9 0C-3-8 8-8 14 0 8 8-3 8-9 0Z" fill="#e0218a" />
      <path d="M-4-4a3 3 0 0 1 0 6M2-5a3 3 0 0 1 0 7M8-4a3 3 0 0 1 0 6" fill="none" stroke={YELLOW} strokeWidth="1.1" />
      <path d="M13-6q-3 6 0 12" fill="none" />
      <circle cx="15" cy="-1.5" r="2.4" fill={CREAM} />
      <circle cx="15.5" cy="-1.5" r="1" fill={INK} />
    </g>
  );
}

// The Madhubani sun: a face with long almond eyes in a double ring, rays alternately rani and yellow.
function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth="1.2">
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M-4-17L0-27 4-17Z" transform={`rotate(${i * 30})`} fill={i % 2 ? "#e0218a" : YELLOW} />
      ))}
      <circle r="17" fill="#f4a300" />
      <circle r="13.5" fill="none" />
      <path d="M-9-3q4-4 8 0q-4 3-8 0ZM1-3q4-4 8 0q-4 3-8 0Z" fill={CREAM} />
      <circle cx="-5" cy="-3" r="1.3" fill={INK} />
      <circle cx="5" cy="-3" r="1.3" fill={INK} />
      <path d="M0-1V4M-5 8q5 4 10 0" fill="none" />
      <circle cx="0" cy="-9" r="1.6" fill={RED} stroke="none" />
    </g>
  );
}

const COLUMNS = [100, 230, 360, 490, 610];
const OPENINGS = [
  { x: 165, door: false },
  { x: 295, door: true },
  { x: 425, door: true },
  { x: 550, door: false },
];
// [x, y, r]: the engine's pony and driving wheels, the tender's, the coach's two bogies
const WHEELS = [
  [868, 325, 13], [894, 325, 13], [930, 314, 24], [985, 314, 24], [1040, 314, 24],
  [1110, 325, 13], [1160, 325, 13], [1232, 325, 13], [1264, 325, 13], [1382, 325, 13], [1414, 325, 13],
];
const roofLine = (y: number) => `M${135 - (y - 62) * 0.8} ${y}H${575 + (y - 62) * 0.8}`;

export function Station({ id, className }: { id: string; className: string }) {
  return (
    <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true" className={className}>
      <Wobble id={id} />
      <g filter={`url(#${id})`} stroke={INK} strokeLinejoin="round" strokeLinecap="round">
        {/* the line: ballast, sleepers, the rail */}
        <rect x="-10" y="344" width="1460" height="20" fill="#8a7560" strokeWidth="2" />
        {Array.from({ length: 56 }, (_, i) => (
          <rect key={i} x={i * 26} y="339" width="16" height="7" fill="#5b4636" strokeWidth="1.2" />
        ))}
        <path d="M-10 338H1450" strokeWidth="4" />

        {/* the platform, its yellow edge line, its brick face */}
        <rect x="-10" y="270" width="1460" height="13" fill="#d8c39a" strokeWidth="2" />
        <rect x="-10" y="279" width="1460" height="4" fill={YELLOW} strokeWidth="1" />
        <rect x="-10" y="283" width="1460" height="20" fill="#a8865a" strokeWidth="2" />
        <path d={Array.from({ length: 49 }, (_, i) => `M${i * 30} 283V303`).join("")} strokeWidth="1" />

        {/* the booking office */}
        <rect x="110" y="110" width="490" height="160" fill={OCHRE} strokeWidth="2.5" />
        <polygon points="95,112 615,112 575,62 135,62" fill="#b84a2a" strokeWidth="2.5" />
        <path d={[75, 88, 100].map(roofLine).join("")} strokeWidth="1.2" />
        <polygon points="300,62 410,62 355,24" fill="#b84a2a" strokeWidth="2.5" />
        <circle cx="355" cy="50" r="11" fill={CREAM} strokeWidth="2" />
        <path d="M355 50V42M355 50L361 53" strokeWidth="1.6" />
        {OPENINGS.map(({ x, door }) => (
          <g key={x}>
            <path d={`M${x - 26} ${door ? 270 : 250}V211A26 26 0 0 1 ${x + 26} 211V${door ? 270 : 250}Z`} fill="#2a2550" strokeWidth="2.2" />
            {!door && <path d={`M${x} 186V250M${x - 26} 222H${x + 26}`} stroke={OCHRE} strokeWidth="2" />}
            {!door && <rect x={x - 32} y="250" width="64" height="6" fill={CREAM} strokeWidth="1.6" />}
          </g>
        ))}
        <rect x="110" y="258" width="490" height="12" fill={BRICK} strokeWidth="2" />
        {/* the canopy over the platform, scalloped along its edge, on iron columns with curled brackets */}
        {COLUMNS.map((x) => (
          <g key={x}>
            <rect x={x - 3} y="150" width="6" height="120" fill="#0a5f5f" strokeWidth="1.4" />
            <path d={`M${x - 3} 166q-14 0-16-14M${x + 3} 166q14 0 16-14`} fill="none" stroke="#0a5f5f" strokeWidth="2.4" />
          </g>
        ))}
        <polygon points="80,128 630,128 640,150 70,150" fill="#0f7c7c" strokeWidth="2.2" />
        {Array.from({ length: 41 }, (_, i) => (
          <path key={i} d={`M${71 + i * 14} 150a7 7 0 0 0 14 0`} fill="#0f7c7c" strokeWidth="1.4" />
        ))}

        {/* a bench, the trunks, a lamp post */}
        <path d="M140 252H222M146 252V270M216 252V270M140 244H222" fill="none" stroke="#6b3d1f" strokeWidth="4" />
        <rect x="508" y="246" width="66" height="24" rx="2" fill="#0f7c7c" strokeWidth="2" />
        <path d="M526 246V270M556 246V270" stroke={BRASS} strokeWidth="2.2" />
        <rect x="520" y="228" width="44" height="18" rx="2" fill="#b8166f" strokeWidth="2" />
        <path d="M40 270V150" strokeWidth="5" />
        <path d="M30 150H50L46 128H34Z" fill={YELLOW} strokeWidth="2" />
        <path d="M28 128H52L40 118Z" fill={IRON} strokeWidth="1.6" />

        {/* the nameboard */}
        <rect x="668" y="200" width="7" height="82" fill={IRON} strokeWidth="1.4" />
        <rect x="765" y="200" width="7" height="82" fill={IRON} strokeWidth="1.4" />
        <rect x="638" y="164" width="164" height="60" fill={YELLOW} strokeWidth="3" />
      </g>

      {/* lettering kept crisp, outside the wobble */}
      <g fill={INK} textAnchor="middle">
        <text x="720" y="191" fontSize="19" style={{ fontFamily: "var(--font-yatra)" }}>
          मेराज़
        </text>
        <text x="720" y="215" fontSize="16" style={{ fontFamily: "var(--font-bungee)" }}>
          MERAZ JN.
        </text>
      </g>
      <g stroke={INK} strokeWidth="1.6" fill={MAROON}>
        <rect x="258" y="160" width="74" height="16" />
        <rect x="380" y="160" width="90" height="16" />
      </g>
      <g fill={YELLOW} textAnchor="middle">
        <text x="295" y="172" fontSize="11" style={{ fontFamily: "var(--font-yatra)" }}>
          टिकट घर
        </text>
        <text x="425" y="172" fontSize="8.5" fontWeight="700" style={{ fontFamily: "var(--font-courier)" }}>
          WAITING ROOM
        </text>
      </g>

      {/* the Express, in front of the platform; it moves, so it goes without the wobble (a filter re-run every frame) */}
      <g className="animate-train-run" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
        {/* the coach: roof, maroon body, Madhubani borders, its windows, a pair of fish either side of its name */}
        <path d="M1188 200Q1316 178 1452 200Z" fill="#4a0412" strokeWidth="2.2" />
        <rect x="1190" y="198" width="270" height="102" rx="6" fill={MAROON} strokeWidth="2.4" />
        <Sawtooth x0={1222} x1={1456} y={208} />
        <Dots x0={1226} x1={1452} y={224} />
        <rect x="1196" y="206" width="20" height="82" fill="#5a0414" strokeWidth="1.6" />
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <rect x={1228 + i * 40} y="230" width="30" height="30" fill={YELLOW} strokeWidth="1.6" />
            <rect x={1230 + i * 40} y="232" width="26" height="26" fill={CREAM} strokeWidth="1.2" />
            <path d={`M${1239 + i * 40} 232V258M${1247 + i * 40} 232V258`} strokeWidth="1.2" />
          </g>
        ))}
        <path d="M1222 266H1456M1222 296H1456" strokeWidth="1.4" />
        <path d="M1222 269H1456M1222 293H1456" stroke={YELLOW} strokeWidth="1.4" />
        <Fish x={1248} y={281} />
        <Fish x={1432} y={281} flip />

        {/* the tender, its coal, the Madhubani sun on its side */}
        <rect x="1088" y="224" width="94" height="72" fill={IRON} strokeWidth="2.4" />
        <rect x="1093" y="229" width="84" height="62" fill="none" stroke={YELLOW} strokeWidth="1.2" />
        <Dots x0={1097} x1={1174} y={286} fill="#e0218a" />
        <path d="M1090 226q8-14 16-2q8-16 18-2q8-14 18 0q8-12 16 0q8-14 20 2Z" fill={INK} strokeWidth="1.4" />
        <Sun x={1135} y={258} />
        <path d="M1180 284H1192" strokeWidth="3" />

        {/* the engine: boiler painted between its brass bands, the cab bordered in dots and sawtooth */}
        <rect x="850" y="280" width="232" height="12" fill={IRON} strokeWidth="2" />
        <rect x="862" y="214" width="146" height="66" rx="8" fill={IRON} strokeWidth="2.4" />
        <Sawtooth x0={870} x1={1004} y={268} h={8} />
        <Dots x0={870} x1={1002} y={222} fill={YELLOW} />
        {/* the pair of fish facing each other, one between each pair of bands */}
        <Fish x={922} y={246} size={0.75} />
        <Fish x={958} y={246} size={0.75} flip />
        <path d="M900 214V280M940 214V280M980 214V280" stroke={BRASS} strokeWidth="3" />
        <path d="M884 214V186H880V178H906V186H902V214Z" fill={IRON} strokeWidth="2.2" />
        <path d="M882 190H904" stroke={YELLOW} strokeWidth="2" />
        <path d="M928 214Q928 196 945 196T962 214Z" fill={BRASS} strokeWidth="2" />
        <circle cx="874" cy="205" r="9" fill={YELLOW} strokeWidth="2" />
        <rect x="1004" y="190" width="76" height="102" fill={MAROON} strokeWidth="2.4" />
        <rect x="1009" y="195" width="66" height="92" fill="none" stroke={YELLOW} strokeWidth="1.2" />
        <Dots x0={1013} x1={1071} y={242} />
        <Sawtooth x0={1010} x1={1076} y={274} h={8} />
        <rect x="998" y="182" width="90" height="10" rx="3" fill={INK} strokeWidth="1.6" />
        <rect x="1022" y="205" width="40" height="30" fill={CREAM} strokeWidth="2" />
        <rect x="1020" y="250" width="46" height="18" fill={BRASS} strokeWidth="1.6" />
        <rect x="846" y="276" width="18" height="16" fill={RED} strokeWidth="1.8" />
        <rect x="836" y="280" width="10" height="8" fill={INK} strokeWidth="1" />
        <polygon points="852,292 880,292 880,330 836,330" fill={RED} strokeWidth="2" />
        <path d="M846 306h30M842 318h38" stroke={YELLOW} strokeWidth="2" strokeDasharray="2 4" />
        {WHEELS.map(([x, y, r]) => (
          <Wheel key={x} x={x} y={y} r={r} />
        ))}
        <path d="M930 320H1040" stroke="#c9c9c9" strokeWidth="4" />

        <g fill={INK} stroke="none" textAnchor="middle">
          <text x="1043" y="263" fontSize="10" style={{ fontFamily: "var(--font-bungee)" }}>
            7.0
          </text>
          <text x="1340" y="285" fontSize="11" fontWeight="700" letterSpacing="1.5" fill={CREAM} style={{ fontFamily: "var(--font-courier)" }}>
            MERAZ EXPRESS
          </text>
        </g>

        {/* smoke rolling back off the chimney */}
        {[0, -0.8, -1.6, -2.4].map((d) => (
          <circle
            key={d}
            cx="893"
            cy="168"
            r="14"
            fill={CREAM}
            strokeWidth="1.8"
            className="origin-center animate-puff [transform-box:fill-box]"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
