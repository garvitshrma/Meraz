import type { Metadata } from "next";
import Corkboard from "@/components/Corkboard";
import { Container, PageHeader } from "@/components/ui";
import { team } from "@/data/content";

export const metadata: Metadata = { title: "Team", description: "The people behind MERAZ 7.0." };

export default function TeamPage() {
  return (
    <>
      <PageHeader kicker="THE CREW · 101.4 FM" hindi="हमारी टोली" title="Team" tone="rani">
        The sleep-deprived people making it all happen. Drag the photos around the board.
      </PageHeader>
      <Container className="py-16">
        <Corkboard members={team} />
      </Container>
    </>
  );
}
