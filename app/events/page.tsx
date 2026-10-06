import type { Metadata } from "next";
import { preload } from "react-dom";
import EventsStreet from "@/components/EventsStreet";
import { melaModel } from "@/data/site";

export const metadata: Metadata = { title: "Events", description: "Culturals, Sci-Tech, Informals & Varchasva, E-Cell and FinTech events at Meraz 7.0." };

export default function EventsPage() {
  for (const url of [melaModel, "/models/jump.glb", "/models/walk.glb", "/sky.jpg"]) preload(url, { as: "fetch", crossOrigin: "anonymous" }); // GLTFLoader fetches in cors mode
  return <EventsStreet />;
}
