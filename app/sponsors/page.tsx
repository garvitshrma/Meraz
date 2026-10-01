import type { Metadata } from "next";
import { Crown, Lightning, Trophy } from "@phosphor-icons/react/dist/ssr";
import { Matchbox } from "@/components/Matchbox";
import { Container, PageHeader } from "@/components/ui";
import { sponsorTiers } from "@/data/content";

export const metadata: Metadata = { title: "Sponsors", description: "The partners powering Meraz." };

const icons = { title: Trophy, platinum: Crown, gold: Lightning };

// Same tiers and sponsors as the reference page, shown as vintage matchbox labels.
export default function SponsorsPage() {
  return (
    <>
      <PageHeader hindi="प्रायोजक" title="Our Sponsors" tone="teal">
        Powering excellence through partnership.
      </PageHeader>
      <Container className="space-y-16 py-16">
        {sponsorTiers.map((t, ti) => {
          const Icon = icons[t.level];
          const big = t.level === "title";
          return (
            <section key={t.tier} aria-labelledby={`tier-${ti}`} data-reveal>
              <h2 id={`tier-${ti}`} className="mx-auto mb-8 flex w-fit items-center gap-3 border-4 border-ink bg-marigold px-5 py-2 font-display text-xl shadow-[5px_5px_0_var(--color-ink)] sm:text-2xl">
                <Icon size={26} weight="bold" aria-hidden="true" />
                {t.tier}
                <span className="font-deva text-lg font-normal text-rani-deep">{t.hindi}</span>
              </h2>
              <ul className="flex flex-wrap justify-center gap-5 sm:gap-7">
                {t.sponsors.map((s, i) => (
                  <li key={s.name} className={big ? "w-full max-w-md" : "w-[calc(50%-0.7rem)] sm:w-52"}>
                    <Matchbox name={s.name} logo={s.logo} index={ti * 3 + i} big={big} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </Container>
    </>
  );
}
