import type { Metadata } from "next";
import SlideProjector from "@/components/SlideProjector";
import { Container, PageHeader } from "@/components/ui";
import { slides } from "@/data/content";

export const metadata: Metadata = { title: "Gallery", description: "Moments from past editions of MERAZ." };

export default function GalleryPage() {
  return (
    <>
      <PageHeader kicker="FROM THE ARCHIVES · 103.7 FM" hindi="झलकियाँ" title="Gallery" tone="teal">
        Lights off, projector on. Use the buttons or arrow keys.
      </PageHeader>
      <Container className="py-16">
        <SlideProjector slides={slides} />
      </Container>
    </>
  );
}
