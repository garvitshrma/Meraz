import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Hero from "@/components/Hero";
import EventTicket from "@/components/EventTicket";
import HorizontalScroll from "@/components/HorizontalScroll";
import SplitFlapBoard from "@/components/SplitFlapBoard";
import PosterReveal from "@/components/PosterReveal";
import SlideProjector from "@/components/SlideProjector";
import Corkboard from "@/components/Corkboard";
import { Matchbox } from "@/components/Matchbox";
import { Container, Marquee, RegisterStrip, SectionHeading } from "@/components/ui";
import { events, prizePool } from "@/data/events";
import { artists, slides, sponsors, team } from "@/data/content";
import { site } from "@/data/site";

const featured = ["hackathon", "nukkad-natak", "robo-dangal", "retro-walk"];
// Featured shows lead the horizontal reel, topped up with the rest to a fixed length.
const reel = [...events.filter((e) => featured.includes(e.slug)), ...events.filter((e) => !featured.includes(e.slug))].slice(0, 8);
const stats = [
  ["3", "days"],
  [String(events.length), "events"],
  [prizePool(), "prize pool"],
  ["7th", "edition"],
];

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee
        className="-rotate-1 bg-ink text-turmeric"
        items={["3 din", `${events.length} events`, `${artists.length} pro-nites`, `${prizePool()} in prizes`, "मेराज़ ७.०", "Horn OK Please"]}
      />

      {/* About: faded magazine spread */}
      <section className="pb-28 pt-24">
        <Container className="grid items-center gap-14 md:grid-cols-[1.2fr_1fr]">
          <div data-reveal>
            <p className="font-mono text-xs font-bold tracking-[.3em] text-teal-deep">ISSUE NO. 07 · SPECIAL EDITION</p>
            <p className="font-deva text-3xl text-rani">एक ज़माना था</p>
            <h2 className="font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[.95] misprint">Once upon a time in Bhilai</h2>
            <div className="mt-6 max-w-[62ch] space-y-4 text-lg leading-relaxed [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:font-display [&>p:first-child]:first-letter:text-6xl [&>p:first-child]:first-letter:leading-none [&>p:first-child]:first-letter:text-vermillion-deep">
              <p>
                Back when songs came on cassettes and the whole mohalla gathered around one TV, every big day felt like a festival. MERAZ 7.0 brings that feeling back: three days
                of code and couplets, robots and rangoli, and pro-nites under the Chhattisgarh sky.
              </p>
              <p>
                {site.college}’s techno-cultural fest returns for its seventh edition with a Retro India theme. Dust off the bell-bottoms and rewind the tape. The show is about to
                begin.
              </p>
            </div>
            <p className="mt-8 max-w-md border-y-2 border-ink py-2 font-mono text-[11px] font-bold uppercase leading-relaxed tracking-wider">
              Story, screenplay, direction: the students of {site.college}. Music by you, dance by everyone.
            </p>
          </div>
          <div className="relative md:-mt-10" data-reveal>
            <div className="relative rotate-2 border-4 border-ink bg-teal-deep p-7 text-cream shadow-[10px_10px_0_var(--color-ink)]">
              <div className="halftone absolute inset-0 text-cream/10" aria-hidden="true" />
              <dl className="relative grid grid-cols-2 gap-x-6 gap-y-8">
                {stats.map(([n, l]) => (
                  <div key={l} className="flex flex-col-reverse">
                    <dt className="font-mono text-xs font-bold uppercase tracking-widest">{l}</dt>
                    <dd className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none text-turmeric tabular-nums">{n}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="absolute -bottom-7 -left-3 -rotate-6 bg-marigold px-3 py-1 font-display text-lg shadow-[4px_4px_0_var(--color-ink)]">Sirf ₹0 mein padhiye</p>
          </div>
        </Container>
      </section>

      <HorizontalScroll
        label="Featured events"
        heading={
          <SectionHeading hindi="कार्यक्रम" title="Now showing">
            Every event is a show and you’re in the front row. Keep scrolling; there are {events.length - reel.length} more after these.
          </SectionHeading>
        }
      >
        {reel.map((e) => (
          <li key={e.slug} className="w-[min(82vw,26rem)] shrink-0">
            <EventTicket event={e} serial={events.indexOf(e)} />
          </li>
        ))}
        <li className="w-[min(70vw,18rem)] shrink-0">
          <Link
            href="/events"
            className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden border-[3px] border-ink bg-marigold p-6 shadow-[6px_6px_0_var(--color-ink)] transition-transform hover:-translate-y-1"
          >
            <div className="halftone pointer-events-none absolute inset-0 text-ink/15" aria-hidden="true" />
            <p className="relative font-mono text-xs font-bold tracking-[.3em]">INTERVAL · मध्यांतर</p>
            <p className="relative font-display text-5xl leading-none">+{events.length - reel.length} more shows</p>
            <span className="relative inline-flex items-center gap-2 font-display text-lg group-hover:underline">
              All events <ArrowRight weight="bold" aria-hidden="true" />
            </span>
          </Link>
        </li>
      </HorizontalScroll>

      <section className="pb-28 pt-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_2.4fr] lg:items-start [&>*]:min-w-0">
          <div className="lg:sticky lg:top-28" data-reveal>
            <p className="font-deva text-3xl text-rani">समय-सारणी</p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[.95] misprint">Schedule</h2>
            <p className="mt-4 max-w-xs text-lg">Three days on one departure board. Switch days, watch the flaps turn.</p>
            <Link href="/schedule" className="btn mt-6 bg-turmeric">
              Full timetable <ArrowRight weight="bold" aria-hidden="true" />
            </Link>
          </div>
          <SplitFlapBoard limit={6} />
        </Container>
      </section>

      <section className="pb-28 pt-16">
        <Container>
          <SectionHeading hindi="सितारों की रातें" title="Pro-nites" kicker="HOUSEFULL · 95.0 FM">
            Three nights, three headliners. One is still under wraps.
          </SectionHeading>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 [&>*:nth-child(2)]:lg:mt-20 [&>*:nth-child(3)]:lg:-mt-6">
            {artists.map((a, i) => (
              <PosterReveal key={a.name} artist={a} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-28 pt-16">
        <Container>
          <SectionHeading hindi="झलकियाँ" title="From the archives" />
          <SlideProjector slides={slides} />
        </Container>
      </section>

      <section className="pb-24 pt-16">
        <Container>
          <SectionHeading hindi="प्रायोजक" title="Brought to you by" />
          <div className="grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-4">
            {sponsors.map((s, i) => (
              <Matchbox key={s.name} sponsor={s} index={i} featured={i === 0} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 pt-16">
        <Container>
          <SectionHeading hindi="हमारी टोली" title="The crew">
            Drag them around. They’re used to it.
          </SectionHeading>
          <Corkboard members={team.slice(0, 8)} />
          <Link href="/team" className="btn mt-10 bg-cream">
            Meet all {team.length} <ArrowRight weight="bold" aria-hidden="true" />
          </Link>
        </Container>
      </section>

      <RegisterStrip />
    </>
  );
}
