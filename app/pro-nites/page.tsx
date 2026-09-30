import type { Metadata } from "next";
import PosterReveal from "@/components/PosterReveal";
import { Container, PageHeader, RegisterStrip } from "@/components/ui";
import { artists } from "@/data/content";
import { events } from "@/data/events";

export const metadata: Metadata = { title: "Pro-Nites", description: "Headliners and star nights at MERAZ 7.0." };

export default function ProNitesPage() {
  const nights = events.filter((e) => e.category === "Pro-Nites");
  return (
    <>
      <PageHeader kicker="HOUSEFULL · 95.0 FM" hindi="सितारों की रातें" title="Pro-Nites" tone="rani">
        Three nights of live music. Entry with the fest pass.
      </PageHeader>
      <Container className="py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((a, i) => (
            <div key={a.name}>
              <PosterReveal artist={a} index={i} />
              {nights[i] && (
                <div className="mt-6">
                  <h2 className="font-poster text-2xl">{nights[i].title}</h2>
                  <p className="font-mono text-sm">
                    Day {nights[i].day} · {nights[i].time} · {nights[i].venue}
                  </p>
                  <p className="mt-2">{nights[i].description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
      <RegisterStrip />
    </>
  );
}
