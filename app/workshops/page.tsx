import type { Metadata } from "next";
import EventsGrid from "@/components/EventsGrid";
import { Container, PageHeader } from "@/components/ui";
import { events } from "@/data/events";

export const metadata: Metadata = { title: "Workshops", description: "Hands-on workshops at MERAZ 7.0." };

export default function WorkshopsPage() {
  return (
    <>
      <PageHeader kicker="LEARN SOMETHING · 97.3 FM" hindi="कार्यशाला" title="Workshops">
        Build a drone, ship an AI app, pull your own screen print. Seats are limited.
      </PageHeader>
      <Container className="py-16">
        <EventsGrid events={events.filter((e) => e.category === "Workshops")} filter={false} />
      </Container>
    </>
  );
}
