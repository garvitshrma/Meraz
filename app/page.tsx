import Link from "next/link";
import Hero from "@/components/Hero";
import EventsGrid from "@/components/EventsGrid";
import SplitFlapBoard from "@/components/SplitFlapBoard";
import PosterReveal from "@/components/PosterReveal";
import SlideProjector from "@/components/SlideProjector";
import Corkboard from "@/components/Corkboard";
import { Matchbox } from "@/components/Matchbox";
import { Container, Marquee, RegisterStrip, SectionHeading } from "@/components/ui";
import { events } from "@/data/events";
import { artists, slides, sponsors, team } from "@/data/content";
import { site } from "@/data/site";

const featured = ["hackathon", "nukkad-natak", "robo-dangal", "retro-walk", "valorant-cup", "drone-workshop"];

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee className="-rotate-1 bg-ink text-turmeric" items={["3 Din", "50+ Events", "3 Pro-Nites", "₹10 Lakh+ Prizes", "मेराज़ ७.०", "Retro India", "Horn OK Please"]} />

      {/* About: faded magazine spread */}
      <section className="py-24">
        <Container className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div data-reveal>
            <p className="font-mono text-xs font-bold tracking-[.3em] text-teal-deep">ISSUE NO. 07 · SPECIAL EDITION</p>
            <p className="font-deva text-3xl text-rani">एक ज़माना था</p>
            <h2 className="font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[.95] misprint">Once upon a time in Bhilai</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:font-display [&>p:first-child]:first-letter:text-6xl [&>p:first-child]:first-letter:leading-none [&>p:first-child]:first-letter:text-vermillion">
              <p>
                Back when songs came on cassettes and the whole mohalla gathered around one TV, every big day felt like a festival. MERAZ 7.0 brings that feeling back: three days
                of code and couplets, robots and rangoli, pro-nites and power cuts (just kidding).
              </p>
              <p>
                {site.college}&apos;s annual techno-cultural fest returns in its seventh edition with a Retro India theme. Dust off the bell-bottoms. Rewind the tape. The show is about to begin.
              </p>
            </div>
          </div>
          <div className="relative" data-reveal>
            <div className="rotate-2 border-4 border-ink bg-teal-deep p-6 text-cream shadow-[10px_10px_0_var(--color-ink)]">
              <div className="halftone absolute inset-0 text-cream/10" aria-hidden="true" />
              <dl className="relative grid grid-cols-2 gap-6 text-center">
                {[
                  ["3", "Days"],
                  ["50+", "Events"],
                  ["20K+", "Footfall"],
                  ["7th", "Edition"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className="block font-display text-5xl text-turmeric">{n}</span>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="absolute -bottom-6 -left-4 -rotate-6 bg-marigold px-3 py-1 font-display text-lg shadow-[4px_4px_0_var(--color-ink)]">Sirf ₹0 mein padhiye!</p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading kicker="NOW SHOWING · 91.2 FM" hindi="कार्यक्रम" title="Events">
            Grab a ticket. Every event is a show and you&apos;re in the front row.
          </SectionHeading>
          <EventsGrid events={events.filter((e) => featured.includes(e.slug))} filter={false} />
          <div className="mt-10" data-reveal>
            <Link href="/events" className="btn bg-marigold">
              See all {events.length} events →
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-teal-deep py-24 text-cream">
        <Container>
          <div className="mb-10" data-reveal>
            <p className="font-mono text-xs font-bold tracking-[.3em] text-turmeric">PLATFORM NO. 7 · 93.5 FM</p>
            <p className="font-deva text-3xl text-turmeric">समय-सारणी</p>
            <h2 className="font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[.95]">Schedule</h2>
          </div>
          <SplitFlapBoard limit={6} />
          <Link href="/schedule" className="btn mt-10 bg-turmeric text-ink">
            Full timetable →
          </Link>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading kicker="HOUSEFULL · 95.0 FM" hindi="सितारों की रातें" title="Pro-Nites">
            Three nights, three headliners. One is still under wraps.
          </SectionHeading>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((a, i) => (
              <PosterReveal key={a.name} artist={a} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <Marquee className="rotate-1 bg-rani text-cream" items={["Now Screening", "Memories 2023-2025", "Click Clack", "झलकियाँ", "Slide Show"]} />

      <section className="py-24">
        <Container>
          <SectionHeading kicker="FROM THE ARCHIVES · 103.7 FM" hindi="झलकियाँ" title="Gallery" />
          <SlideProjector slides={slides} />
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading kicker="BROUGHT TO YOU BY · 99.1 FM" hindi="प्रायोजक" title="Sponsors" />
          <div className="grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-4">
            {sponsors.map((s, i) => (
              <Matchbox key={s.name} sponsor={s} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading kicker="THE CREW · 101.4 FM" hindi="हमारी टोली" title="The Team">
            Drag them around. They&apos;re used to it.
          </SectionHeading>
          <Corkboard members={team.slice(0, 8)} />
          <Link href="/team" className="btn mt-10 bg-cream">
            Meet everyone →
          </Link>
        </Container>
      </section>

      <RegisterStrip />
    </>
  );
}
