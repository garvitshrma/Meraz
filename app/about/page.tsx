import type { Metadata } from "next";
import ScrollCue from "@/components/ScrollCue";
import { Container } from "@/components/ui";
import { about, modelCredits } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "About", description: "About Meraz 7.0 and this year's theme, The Great Indian Reverie." };

// From the About design (Figma "rough"): its four 16:9 panels as sections. The artwork is cut out of the panels into
// public/about (the panels' flat sand background keyed out, the text they carried painted out); the text is the
// page's own, in the design's body face (Arbutus Slab); its calligraphic headings stay pictures of the design's.

// Hero, in the design's pixels (1920 x 1080): the street seen through the wall's doorway, and the elephant that walks
// into it from behind the wall, seen only through the doorway (left, top, right edges of the opening).
const DOOR = { left: 762, top: 372, right: 1147 };
const ELEPHANT = { x: 761, y: 429, w: 366 };
const pc = (v: number, of: number) => `${(v / of) * 100}%`;

export default function AboutPage() {
  return (
    <div className="bg-sand text-maroon">
      <h1 className="sr-only">About {site.name}</h1>

      {/* Hero: the picture covers the screen, about the doorway */}
      <section aria-label="An elephant walks through the Meraz gate" className="relative h-svh overflow-hidden">
        <div className="absolute left-1/2 top-1/2 aspect-video w-[max(100%,calc(100svh*16/9))] -translate-x-1/2 -translate-y-1/2">
          <img src="/about/street.webp" alt="" width={1920} height={1080} className="absolute inset-0 size-full" />
          <div className="absolute inset-0" style={{ clipPath: `inset(${pc(DOOR.top, 1080)} ${pc(1920 - DOOR.right, 1920)} 0 ${pc(DOOR.left, 1920)})` }}>
            <img
              src="/about/elephant.webp"
              alt=""
              width={366}
              height={576}
              className="absolute animate-elephant"
              style={{ left: pc(ELEPHANT.x, 1920), top: pc(ELEPHANT.y, 1080), width: pc(ELEPHANT.w, 1920) }}
            />
          </div>
          <img src="/about/wall.webp" alt="" width={1920} height={1080} className="absolute inset-0 size-full" />
        </div>
        <ScrollCue after=".animate-elephant" />
      </section>

      {/* About: the lady with the lotus and the 7.0 to the left of the text, the lettering and the lady with the bird to
          its right; on a phone, the lettering above, the ladies side by side below */}
      <section aria-labelledby="about-title" className="px-4 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[110rem] grid-cols-2 items-center gap-x-6 gap-y-8 [grid-template-areas:'meraz_meraz'_'text_text'_'lotus_bird'_'seven_seven'] lg:grid-cols-[1fr_1.35fr_1fr] lg:gap-x-10 lg:[grid-template-areas:'lotus_text_meraz'_'seven_text_bird']">
          <img src="/about/meraz.webp" alt="Meraz" width={744} height={262} className="mx-auto w-full max-w-md [grid-area:meraz] lg:max-w-none lg:self-start" />
          <div className="text-center [grid-area:text]">
            <h2 id="about-title">
              <img src="/about/about-title.webp" alt="About" width={213} height={56} className="mx-auto h-[clamp(2.4rem,3.6vw,3.6rem)] w-auto" />
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-slab text-[clamp(1.05rem,1.55vw,1.65rem)] leading-snug">{about.text}</p>
          </div>
          <img src="/about/lady-lotus.webp" alt="" width={471} height={602} loading="lazy" className="w-full max-w-sm justify-self-center [grid-area:lotus] lg:self-start" />
          <img src="/about/lady-bird.webp" alt="" width={659} height={531} loading="lazy" className="w-full max-w-md justify-self-center [grid-area:bird] lg:self-end" />
          <img src="/about/seven.webp" alt="7.0" width={443} height={262} loading="lazy" className="mx-auto w-2/3 max-w-xs [grid-area:seven] lg:w-full lg:max-w-sm lg:self-end" />
        </div>
      </section>

      {/* Theme: the paragraph in the red cartouche between the two titles, three motifs each side; on a phone the
          cartouche is a plain rounded panel and the motifs two rows below */}
      <section aria-labelledby="theme-title" className="px-4 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[110rem] items-center gap-8 [grid-template-areas:'title'_'card'_'retro'_'left'_'right'] lg:grid-cols-[1fr_4fr_1fr] lg:gap-x-10 lg:[grid-template-areas:'left_title_right'_'left_card_right'_'left_retro_right']">
          <h2 id="theme-title" className="[grid-area:title]">
            <img src="/about/theme-title.webp" alt="Theme" width={445} height={110} loading="lazy" className="mx-auto h-[clamp(3rem,5.5vw,6rem)] w-auto" />
          </h2>
          <p className="rounded-[2rem] bg-brick px-6 py-8 text-center font-slab text-[clamp(1rem,1.3vw,1.4rem)] leading-snug text-sand [grid-area:card] sm:px-10 lg:rounded-none lg:bg-transparent lg:bg-[url(/about/cartouche.webp)] lg:bg-[length:100%_100%] lg:px-[13%] lg:py-[5%]">
            {about.theme}
          </p>
          <p className="mx-auto max-w-3xl text-balance text-center font-display text-[clamp(2rem,5.2vw,4.75rem)] font-bold uppercase leading-[.95] tracking-wide text-[#0d2a40] [grid-area:retro] [text-shadow:3px_3px_0_#b5651d]">
            The Great Indian Reverie
          </p>
          {[0, 3].map((from) => (
            <ul key={from} aria-hidden="true" className={`grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-12 ${from ? "[grid-area:right]" : "[grid-area:left]"}`}>
              {[1, 2, 3].map((k) => (
                <li key={k}>
                  <img src={`/about/icon-${from + k}.webp`} alt="" loading="lazy" className="mx-auto w-full max-w-[12rem]" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* Numbers: in three framed arches, between the peacocks, above the lotus on the waves */}
      <section aria-label={`${site.name} in numbers`} className="relative overflow-hidden pt-14 lg:pt-20">
        <img src="/about/peacock-left.webp" alt="" width={330} height={1012} loading="lazy" className="absolute bottom-0 left-0 h-[60%] w-auto sm:h-full" />
        <img src="/about/peacock-right.webp" alt="" width={330} height={1013} loading="lazy" className="absolute bottom-0 right-0 h-[60%] w-auto sm:h-full" />
        {/* as the design lays them out: three frames ~212 px wide at 1920, the text sized by the frame (cqw), not the
            screen, so it stays inside the arch at any width */}
        <ul className="relative mx-auto grid w-[calc(100%-1rem)] max-w-[58rem] grid-cols-3 gap-[5%] sm:w-[72%] sm:gap-[12%] lg:w-[56%]">
          {about.stats.map((s) => (
            <li key={s.label} className="@container relative aspect-[212/268] w-full bg-[url(/about/stat-frame.webp)] bg-[length:100%_100%]">
              <p className="absolute inset-x-[12%] bottom-[14%] top-[38%] grid content-center text-center font-slab leading-none">
                <span className="text-[19cqw]">{s.value}</span>
                <span className="mt-[4cqw] text-[max(9.5cqw,.65rem)] leading-tight">{s.label}</span>
              </p>
            </li>
          ))}
        </ul>
        <img src="/about/lotus.webp" alt="" width={1340} height={660} loading="lazy" className="relative mx-auto mt-10 w-[70%] max-w-6xl" />
      </section>

      {/* 3D model credits for the home road scene (CC BY 4.0 needs them on the site) */}
      {/* <section id="credits" className="scroll-mt-24 border-t-4 border-ink py-12" aria-labelledby="credits-title">
        <Container>
          <h2 id="credits-title" className="font-mono text-sm font-bold tracking-[.3em]">
            3D MODEL CREDITS
          </h2>
          <p className="mt-2 font-mono text-xs text-ink/70">Home page road scene. CC BY 4.0 unless noted.</p>
          <ul className="mt-4 grid gap-x-8 gap-y-2 font-mono text-sm sm:grid-cols-2 lg:grid-cols-3">
            {modelCredits.map(([what, who, href]) => (
              <li key={href}>
                <a className="underline decoration-2 underline-offset-4 hover:text-rani-deep" href={href}>
                  {what}
                </a>{" "}
                by {who}
              </li>
            ))}
          </ul>
        </Container>
      </section> */}
    </div>
  );
}
