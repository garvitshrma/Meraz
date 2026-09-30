import type { Metadata } from "next";
import EventsGrid from "@/components/EventsGrid";
import { Container, PageHeader } from "@/components/ui";
import { events } from "@/data/events";

export const metadata: Metadata = { title: "Events", description: "Technical, cultural, gaming, workshops and pro-nites at MERAZ 7.0." };

export default function EventsPage() {
  return (
    <>
      <PageHeader kicker="NOW SHOWING · 91.2 FM" hindi="कार्यक्रम" title="Events">
        {events.length} shows across three days. Pick a category, grab a ticket.
      </PageHeader>
      <Container className="py-16">
        <EventsGrid events={events} />
      </Container>
    </>
  );
}
