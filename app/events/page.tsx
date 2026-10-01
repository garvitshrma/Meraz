import type { Metadata } from "next";
import EventsPanels from "@/components/EventsPanels";

export const metadata: Metadata = { title: "Events", description: "Culturals, Sci-Tech, Informals & Varchasva, E-Cell and FinTech events at Meraz 7.0." };

export default function EventsPage() {
  return <EventsPanels />;
}
