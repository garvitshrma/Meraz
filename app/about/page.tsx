import type { Metadata } from "next";
import { CalendarStar, GlobeHemisphereEast, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui";
import { about } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "About", description: "About Meraz 7.0 and this year's Retro India theme." };

const icons = { calendar: CalendarStar, users: UsersThree, globe: GlobeHemisphereEast };

// Same sections as the reference About page: title, logo, about text, theme quote, theme titles, stats.
export default function AboutPage() {
  return (
    <div className="pb-24">
      <header className="border-b-4 border-ink bg-ink py-4 pt-20 text-center sm:pt-6">
        <p className="font-display text-2xl tracking-[.2em] text-turmeric">{site.name}</p>
      </header>

      {/* logo */}
      <section className="relative overflow-hidden border-b-4 border-ink py-16" aria-label="Meraz 7.0 logo">
        <div className="sunburst absolute left-1/2 top-1/2 size-[200vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow" aria-hidden="true" />
        <div className="relative text-center">
          <p className="painted font-deva text-[clamp(2.5rem,8vw,4.5rem)] leading-none text-cream" aria-hidden="true">
            मेराज़ ७.०
          </p>
          <p className="painted -rotate-2 font-display text-[clamp(4rem,15vw,10rem)] leading-[.85] text-cream misprint">
            MERAZ <span className="text-turmeric">7.0</span>
          </p>
        </div>
      </section>

      {/* about text, with two spinning records like the reference's gears */}
      <section className="relative py-20">
        <div className="record absolute -left-24 top-10 hidden size-56 lg:block" aria-hidden="true" />
        <div className="record absolute -right-20 bottom-10 hidden size-44 lg:block" aria-hidden="true" />
        <Container>
          <div className="relative mx-auto max-w-3xl border-4 border-ink bg-cream p-6 shadow-[10px_10px_0_var(--color-ink)] sm:p-10" data-reveal>
            <h1 className="-mt-12 mb-6 w-fit bg-rani-deep px-4 py-1 font-display text-3xl text-cream shadow-[4px_4px_0_var(--color-ink)] sm:-mt-16 sm:text-4xl">About</h1>
            <p className="text-lg leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-none first-letter:text-vermillion-deep">{about.text}</p>
          </div>
        </Container>
      </section>

      {/* theme quote + theme titles */}
      <section className="border-y-4 border-ink bg-teal-deep py-20 text-cream">
        <Container className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:items-center">
          <blockquote className="relative border-l-8 border-turmeric pl-6 font-poster text-xl leading-relaxed sm:text-2xl" data-reveal>
            <span className="absolute -left-2 -top-10 font-display text-8xl leading-none text-turmeric" aria-hidden="true">
              “
            </span>
            {about.theme}
          </blockquote>
          <div className="text-center" data-reveal>
            <h2 className="font-mono text-sm font-bold tracking-[.4em] text-turmeric">THEME</h2>
            <p className="painted mt-3 -rotate-2 font-display text-[clamp(3rem,9vw,5.5rem)] leading-[.9] text-cream misprint">RETRO INDIA</p>
            <p className="mt-4 inline-block rotate-1 border-4 border-ink bg-marigold px-4 py-2 font-deva text-3xl text-ink shadow-[5px_5px_0_var(--color-ink)]">{site.hindiTagline}</p>
          </div>
        </Container>
      </section>

      {/* stats */}
      <section className="py-20" aria-label="Meraz in numbers">
        <Container>
          <ul className="grid gap-10 sm:grid-cols-3">
            {about.stats.map((s) => {
              const Icon = icons[s.icon];
              return (
                <li key={s.label} className="grid justify-items-center text-center" data-reveal>
                  <span className="grid size-28 place-items-center rounded-full border-4 border-ink bg-marigold shadow-[6px_6px_0_var(--color-ink)] [background-image:repeating-conic-gradient(#f4a300_0_10deg,#f2c14e_10deg_20deg)]">
                    <span className="grid size-16 place-items-center rounded-full border-4 border-ink bg-cream">
                      <Icon size={32} weight="bold" aria-hidden="true" />
                    </span>
                  </span>
                  <p className="mt-4 font-display text-5xl tabular-nums">{s.value}</p>
                  <p className="font-mono text-sm font-bold uppercase tracking-widest">{s.label}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </div>
  );
}
