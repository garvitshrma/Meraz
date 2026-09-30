import Link from "next/link";
import { site } from "@/data/site";
import FlipCountdown from "./FlipCountdown";

// Hand-painted cinema-poster hero. Layers with data-depth move at different speeds (see ScrollFx).
export default function Hero() {
  return (
    <section data-parallax aria-labelledby="hero-title" className="relative min-h-[100svh] overflow-hidden border-b-4 border-ink bg-marigold pt-16">
      {/* rays */}
      <div data-depth="0.5" className="absolute inset-0" aria-hidden="true">
        <div className="sunburst absolute left-1/2 top-[45%] size-[250vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
      </div>
      {/* sun */}
      <div data-depth="0.3" className="absolute right-[-18vw] top-[10%] sm:right-[4vw]" aria-hidden="true">
        <div className="relative size-[70vw] max-h-[520px] max-w-[520px] rounded-full border-[6px] border-ink bg-vermillion">
          <div className="halftone absolute inset-0 rounded-full text-ink/30" />
          <div className="absolute inset-[12%] rounded-full border-4 border-dashed border-turmeric/70" />
        </div>
      </div>
      {/* skyline */}
      <div data-depth="0.12" className="absolute inset-x-0 bottom-0" aria-hidden="true">
        <Skyline />
      </div>
      {/* bunting */}
      <Bunting />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-4 pb-40 pt-10 sm:px-6 sm:pb-48">
        <p className="w-fit bg-ink px-3 py-1 font-mono text-[11px] font-bold tracking-[.25em] text-turmeric sm:text-xs">
          {site.college.toUpperCase()} PRESENTS · TECHNO-CULTURAL FEST
        </p>
        <p className="mt-4 font-deva text-4xl text-rani sm:text-6xl [text-shadow:2px_2px_0_#1a1a1a]">मेराज़ ७.०</p>
        <h1 id="hero-title" className="painted -rotate-2 font-display text-[clamp(4.2rem,19vw,13rem)] leading-[.82] text-cream misprint">
          MERAZ
          <span className="ml-2 inline-block rotate-3 text-turmeric sm:ml-4">7.0</span>
        </h1>
        <p className="mt-4 max-w-xl font-poster text-3xl leading-tight sm:text-5xl">{site.tagline}</p>
        <p className="mt-1 font-deva text-xl text-teal-deep sm:text-2xl">{site.hindiTagline}</p>

        {/* poster credits */}
        <p className="mt-5 max-w-lg border-y-2 border-ink py-2 font-mono text-[11px] font-bold uppercase leading-relaxed tracking-wider">
          Story · Screenplay · Direction: The Students of {site.college} · Music: You · Dance: Everyone · In Full Colour, 70mm Dreams
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-6">
          <div>
            <p className="mb-2 inline-block -rotate-2 bg-rani px-3 py-1 font-display text-lg text-cream shadow-[4px_4px_0_var(--color-ink)]">
              {site.dateLabel}
            </p>
            <FlipCountdown target={site.startDate} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href={site.registerUrl} target="_blank" rel="noopener noreferrer" className="btn bg-rani text-cream">
            Book Your Ticket ↗
          </a>
          <Link href="/events" className="btn bg-cream">
            Now Showing: Events
          </Link>
        </div>

        <div className="absolute bottom-40 right-4 hidden size-28 rotate-12 place-content-center rounded-full border-4 border-double border-ink bg-cream text-center font-display text-sm leading-tight shadow-[5px_5px_0_var(--color-ink)] md:grid" aria-hidden="true">
          CERTIFIED
          <span className="text-2xl text-vermillion">U/F</span>
          <span className="font-mono text-[9px]">UNLIMITED FUN</span>
        </div>
      </div>
    </section>
  );
}

function Bunting() {
  const colours = ["#E0218A", "#0F7C7C", "#F3E6C8", "#D7263D", "#F2C14E"];
  return (
    <svg className="absolute inset-x-0 top-14 h-10 w-full" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 4 Q600 30 1200 4" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {Array.from({ length: 30 }, (_, i) => {
        const x = i * 40 + 6;
        const y = 4 + Math.sin((x / 1200) * Math.PI) * 13;
        return <path key={i} d={`M${x} ${y} l28 0 l-14 22z`} fill={colours[i % colours.length]} stroke="#1a1a1a" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

// Original skyline: domes, a clock tower, a water tank, a radio mast and palms.
function Skyline() {
  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice" className="block h-[28vh] min-h-40 w-full">
      <g fill="#0a5f5f" stroke="#1a1a1a" strokeWidth="3">
        <rect x="-5" y="170" width="1210" height="60" />
        <rect x="40" y="110" width="120" height="70" />
        <path d="M40 110 Q100 40 160 110z" />
        <rect x="96" y="30" width="8" height="30" />
        <rect x="190" y="130" width="70" height="50" />
        <rect x="280" y="60" width="44" height="120" />
        <path d="M274 60h56l-28-30z" />
        <circle cx="302" cy="90" r="14" fill="#F3E6C8" />
        <rect x="350" y="120" width="160" height="60" />
        <path d="M380 120 Q430 60 480 120z" />
        <path d="M350 120 Q365 95 380 120zM480 120 Q495 95 510 120z" />
        <rect x="540" y="140" width="90" height="40" />
        <rect x="660" y="70" width="12" height="110" />
        <rect x="640" y="50" width="52" height="30" rx="6" />
        <rect x="720" y="125" width="130" height="55" />
        <rect x="880" y="20" width="6" height="160" />
        <path d="M858 180 883 20l25 160" fill="none" />
        <rect x="930" y="110" width="110" height="70" />
        <path d="M930 110 Q985 50 1040 110z" />
        <rect x="1070" y="135" width="140" height="45" />
      </g>
      <g fill="#1a1a1a">
        {[70, 120, 220, 390, 440, 560, 600, 750, 800, 960, 1000, 1100, 1150].map((x) => (
          <rect key={x} x={x} y="150" width="10" height="16" fill="#F2C14E" />
        ))}
        <path d="M600 180c6-40 4-70-2-90m2 0c-20-8-34 0-40 8m40-8c18-10 32-4 40 4m-40-4c-8-18-24-22-34-18m34 18c10-16 24-18 34-12" stroke="#1a1a1a" strokeWidth="5" fill="none" />
        <path d="M1150 180c4-30 2-56-2-70m2 0c-16-6-28 0-32 6m32-6c14-8 26-4 32 4" stroke="#1a1a1a" strokeWidth="5" fill="none" />
        <circle cx="883" cy="20" r="6" fill="#D7263D" />
      </g>
    </svg>
  );
}
