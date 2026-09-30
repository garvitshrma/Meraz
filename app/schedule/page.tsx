import type { Metadata } from "next";
import SplitFlapBoard from "@/components/SplitFlapBoard";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Schedule", description: "Day-wise timetable for MERAZ 7.0." };

export default function SchedulePage() {
  return (
    <>
      <PageHeader kicker="PLATFORM NO. 7 · 93.5 FM" hindi="समय-सारणी" title="Schedule" tone="teal">
        Three days, one timetable. Switch days on the board below.
      </PageHeader>
      <Container className="py-16">
        <SplitFlapBoard />
      </Container>
    </>
  );
}
