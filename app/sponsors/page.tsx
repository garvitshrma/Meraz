import type { Metadata } from "next";
import { Matchbox } from "@/components/Matchbox";
import { Container, PageHeader } from "@/components/ui";
import { sponsors } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Sponsors", description: "The partners who make MERAZ 7.0 happen." };

export default function SponsorsPage() {
  return (
    <>
      <PageHeader kicker="BROUGHT TO YOU BY · 99.1 FM" hindi="प्रायोजक" title="Sponsors" tone="teal">
        Every great show needs a banner. These are ours.
      </PageHeader>
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {sponsors.map((s, i) => (
            <Matchbox key={s.name} sponsor={s} index={i} />
          ))}
        </div>
        <div className="mt-16 border-4 border-dashed border-ink p-8 text-center">
          <p className="font-display text-2xl">Want your label here?</p>
          <p className="mt-2">Write to us for the sponsorship brochure.</p>
          <a href={`mailto:${site.email}?subject=Sponsorship%20-%20MERAZ%207.0`} className="btn mt-5 bg-marigold">
            Become a sponsor
          </a>
        </div>
      </Container>
    </>
  );
}
