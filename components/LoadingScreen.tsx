// The loading screen: the boombox picture (public/loading.jpg, 1920x1080), over the home scene until it has loaded and
// over every page change but the home page's ride (see Transition). Landscape screens show all of it, the room round
// it drawn on (see Landscape); portrait ones are rebuilt from cuts of it (see Portrait).

const SRC = "/loading.jpg";
type Rect = readonly [x: number, y: number, w: number, h: number];

// Cuts of the picture, in its pixels.
const COLUMN: Rect = [200, 0, 1260, 980]; // boombox, chai and table top, with the wall and posters behind them
const LEGS: Rect[] = [[200, 980, 145, 100], [1305, 980, 155, 100]]; // the table's legs, below its apron
const MUSAFIR: Rect = [1508, 20, 400, 602]; // the "chal musafir" poster
const FLORAL: Rect = [1610, 630, 310, 450]; // a corner of the flowered painting
const WALL: Rect = [0, 0, 230, 560]; // the plain wall left of the boombox
const PLASTER = "#c9bca8"; // the wall's own colour, where no cut covers it

// A cut drawn at x, y, s times its size (or w by h, stretched), turned tilt degrees about its centre.
function Cut({ from: [sx, sy, sw, sh], x, y, s = 1, w = sw * s, h = sh * s, tilt = 0, filter, mask }: {
  from: Rect; x: number; y: number; s?: number; w?: number; h?: number; tilt?: number; filter?: string; mask?: string;
}) {
  return (
    <g transform={tilt ? `rotate(${tilt} ${x + w / 2} ${y + h / 2})` : undefined} filter={filter} mask={mask}>
      <svg x={x} y={y} width={w} height={h} viewBox={`${sx} ${sy} ${sw} ${sh}`} preserveAspectRatio="none">
        <image href={SRC} width={1920} height={1080} />
      </svg>
    </g>
  );
}

// The two records on the radio, in the picture's pixels: centre x, y and radius (to just inside the disc's rim). Each
// is cut out as a circle and turns on its spindle (animate-record, 33 rpm).
const RECORDS = [[456, 586.5, 130], [875.5, 581, 125]] as const;
function Records({ id, dx = 0, dy = 0 }: { id: string; dx?: number; dy?: number }) {
  return (
    <>
      <defs>
        {RECORDS.map(([cx, cy, r], i) => (
          <clipPath key={i} id={`${id}-${i}`}>
            <circle cx={cx + dx} cy={cy + dy} r={r} />
          </clipPath>
        ))}
      </defs>
      {RECORDS.map(([cx, cy, r], i) => (
        <g key={i} clipPath={`url(#${id}-${i})`}>
          {/* turned about the spindle, given in the page's own units (the box of a cut is the whole picture's) */}
          <g className="motion-safe:animate-record" style={{ transformBox: "view-box", transformOrigin: `${cx + dx}px ${cy + dy}px` }}>
            <Cut from={[cx - r, cy - r, 2 * r, 2 * r]} x={cx - r + dx} y={cy - r + dy} />
          </g>
        </g>
      ))}
    </>
  );
}

// Mottled plaster: the wall's colour, blotched by noise, under everything the cuts leave bare.
function Plaster({ id, x, y, w, h, fill = PLASTER }: { id: string; x: number; y: number; w: number; h: number; fill?: string }) {
  return (
    <>
      <filter id={id} x={x} y={y} width={w} height={h} filterUnits="userSpaceOnUse">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="4" seed="7" />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.24  0.8 0 0 0 -0.35" />
      </filter>
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      <rect x={x} y={y} width={w} height={h} filter={`url(#${id})`} />
    </>
  );
}

// Landscape: the whole picture, never cropped, with what is drawn round it filling the bands a screen of another shape
// leaves: plaster in the wall's own colours (grey-beige on the left, cream on the right), the plain wall enlarged on to
// the left, the flowered painting on to the right, and below, the picture's bottom strip mirrored (the table's legs and
// what shows between them run on down) to a floor. The picture's edges feather into it, except the "ishq" poster's
// top, cut off by the picture's, which stays a crisp paper edge. Drawn in the picture's pixels, out to an aspect of 1
// or 2.7.
const [L, R, T, B] = [-520, 2440, -460, 1560]; // the drawn room's edges
const LS_FLOOR = 1200;
function Landscape({ p }: { p: string }) {
  const fade = (id: string, x2: number, y2: number, stops: [number, number][]) => (
    <>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
        {stops.map(([o, a]) => <stop key={o} offset={o} stopColor="#fff" stopOpacity={a} />)}
      </linearGradient>
      <mask id={id} maskUnits="userSpaceOnUse" x={L} y={T} width={R - L} height={B - T}>
        <rect x={L} y={T} width={R - L} height={B - T} fill={`url(#${id}-g)`} />
      </mask>
    </>
  );
  return (
    <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full portrait:hidden">
      <defs>
        <linearGradient id={`${p}ll-wall`} x1="800" y1="0" x2="1250" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c1b7a3" />
          <stop offset="1" stopColor="#f4e5c6" />
        </linearGradient>
        {fade(`${p}ll-fx`, 1920, 0, [[0, 0], [0.07, 1], [0.965, 1], [1, 0]])}
        {fade(`${p}ll-fy`, 0, 1080, [[0, 0], [0.04, 1], [1, 1]])}
        {fade(`${p}ll-wallx`, 140, 0, [[0, 1], [1, 0]])}
        {fade(`${p}ll-flower`, 0, 700, [[0.8, 0], [1, 1]])}
        <linearGradient id={`${p}ll-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3d26" />
          <stop offset="1" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>
      <Plaster id={`${p}ll-grain`} x={L} y={T} w={R - L} h={B - T} fill={`url(#${p}ll-wall)`} />
      <Cut from={WALL} x={-420} y={1080 - WALL[3] * 2.4} s={2.4} mask={`url(#${p}ll-wallx)`} />
      <Cut from={FLORAL} x={1840} y={560} s={2} mask={`url(#${p}ll-flower)`} />
      <g mask={`url(#${p}ll-fy)`}>
        <Cut from={[0, 0, 1920, 1080]} x={0} y={0} mask={`url(#${p}ll-fx)`} />
      </g>
      <Cut from={[790, 0, 465, 60]} x={790} y={0} />
      <Records id={`${p}ll-disc`} />
      <g transform="matrix(1 0 0 -1 0 2160)">
        <Cut from={[0, 960, 1920, 120]} x={0} y={960} />
      </g>
      <rect x={L} y={LS_FLOOR} width={R - L} height={B - LS_FLOOR} fill={`url(#${p}ll-floor)`} />
      <rect x={L} y={LS_FLOOR - 5} width={R - L} height={10} fill="#1a1a1a" />
    </svg>
  );
}

// Portrait: the boombox, chai and table across the screen's width, a little below its middle, their legs drawn on
// down to a plank floor behind a skirting board; above, the "chal musafir" poster pasted whole over the posters the
// column carries (cut off at the picture's top), and the plain wall, enlarged; under the
// table, in its shadow, more wall and the flowered painting. Laid out on a 1260 x 2700 page cropped to the screen about
// its centre: a tall phone shows all of it, a short one (a browser's bars up, about 0.59 wide to high) loses ~280 off
// the top and bottom, so the poster starts below that.
const W = 1260;
const H = 2700;
const TOP = 940; // where the column's top edge sits: its boombox (y 560 in the picture) at 55% down the page
const FLOOR = 2240;
const SKIRT = 44; // the skirting board's height, standing on the floor
const BIG = 2.5; // the enlarged wall's scale
const BOARDS = Array.from({ length: 21 }, (_, i) => {
  const x = W / 2 + (i - 10) * 90; // seam at the wall
  return `M${x} ${FLOOR}L${W / 2 + (x - W / 2) * 1.6} ${H}`;
}).join("");
function Portrait({ p }: { p: string }) {
  const apron = TOP + COLUMN[3];
  const wallW = WALL[2] * BIG;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full landscape:hidden">
      <defs>
        <linearGradient id={`${p}ls-tone`} x1="500" y1="0" x2="1100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c1b7a3" />
          <stop offset="1" stopColor="#f4e5c6" />
        </linearGradient>
        {/* the column fades in at its top edge, and the enlarged wall out at its right one, into the plaster */}
        <linearGradient id={`${p}ls-down`} x1="0" y1={TOP} x2="0" y2={TOP + 110} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id={`${p}ls-column`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill={`url(#${p}ls-down)`} />
        </mask>
        <linearGradient id={`${p}ls-left`} x1={wallW - 160} y1="0" x2={wallW} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${p}ls-wall`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill={`url(#${p}ls-left)`} />
        </mask>
        <filter id={`${p}ls-pasted`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="6" dy="10" stdDeviation="10" floodColor="#1a1a1a" floodOpacity="0.45" />
        </filter>
        <linearGradient id={`${p}ls-under`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1a1a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1a1a1a" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`${p}ls-boards`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a5636" />
          <stop offset="1" stopColor="#5a3d26" />
        </linearGradient>
        <linearGradient id={`${p}ls-dusk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1a1a" stopOpacity="0.15" />
          <stop offset="1" stopColor="#1a1a1a" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <Plaster id={`${p}ls-grain`} x={0} y={0} w={W} h={H} fill={`url(#${p}ls-tone)`} />
      <Cut from={WALL} x={0} y={TOP + 110 - WALL[3] * BIG} s={BIG} mask={`url(#${p}ls-wall)`} />
      <Cut from={WALL} x={0} y={apron} s={BIG} mask={`url(#${p}ls-wall)`} />
      <Cut from={MUSAFIR} x={585} y={TOP + 60 - MUSAFIR[3] * 1.2} s={1.2} tilt={-2} filter={`url(#${p}ls-pasted)`} />
      {/* the column over the poster's lower edge, which the radio's handle and the posters it carries run up under */}
      <Cut from={COLUMN} x={0} y={TOP} mask={`url(#${p}ls-column)`} />
      {/* over the tips of the picture's own butterfly at the column's left edge: the wall just above them */}
      <Cut from={[COLUMN[0], 390, 26, 200]} x={0} y={TOP + 595} h={200} />
      <Records id={`${p}ls-disc`} dx={-COLUMN[0]} dy={TOP} />
      <Cut from={FLORAL} x={350} y={apron + 10} s={1.8} tilt={2} filter={`url(#${p}ls-pasted)`} />
      <rect y={apron} width={W} height={FLOOR - apron} fill={`url(#${p}ls-under)`} />
      <rect y={FLOOR - SKIRT} width={W} height={SKIRT} fill="#3a2817" />
      <rect y={FLOOR - SKIRT} width={W} height={5} fill="#7a5636" />
      {/* floorboards running away from the eye, their seams converging on a point high over the page's centre */}
      <rect y={FLOOR} width={W} height={H - FLOOR} fill={`url(#${p}ls-boards)`} />
      <path d={BOARDS} stroke="#2a1d14" strokeWidth="4" />
      <rect y={FLOOR} width={W} height={H - FLOOR} fill={`url(#${p}ls-dusk)`} />
      <rect y={FLOOR - 3} width={W} height={6} fill="#1a1a1a" />
      {LEGS.map((l) => (
        <Cut key={l[0]} from={l} x={l[0] - COLUMN[0]} y={apron} h={FLOOR - apron} />
      ))}
    </svg>
  );
}

// id: prefixes the SVGs' ids, so two copies (home's and the page change's) don't share them. className: where it sits
// and when it shows; it fades in and out.
export default function LoadingScreen({ id, className }: { id: string; className: string }) {
  return (
    <div role="status" className={`absolute inset-0 bg-ink transition-[opacity,visibility] duration-500 ${className}`}>
      <Landscape p={id} />
      <Portrait p={id} />
      {/* the meter: its owner sets --load (0 to 1) and the percentage as what it waits for lands */}
      <div className="absolute bottom-10 left-1/2 flex w-56 -translate-x-1/2 flex-col items-center gap-2 sm:w-72">
        <p className="font-mono text-sm font-bold tracking-widest text-turmeric drop-shadow-[2px_2px_0_var(--color-ink)]">
          LOADING{" "}
          <span aria-hidden="true">
            <span data-load-pct>0</span>%
          </span>
        </p>
        <div aria-hidden="true" className="h-4 w-full border-2 border-ink bg-cream shadow-[3px_3px_0_var(--color-ink)]">
          <div className="h-full origin-left bg-marigold transition-transform duration-300" style={{ transform: "scaleX(var(--load, 0))" }} />
        </div>
      </div>
    </div>
  );
}
