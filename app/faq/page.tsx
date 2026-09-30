import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { faqs } from "@/data/content";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about MERAZ 7.0." };

const tones = ["bg-cream", "bg-turmeric", "bg-cream", "bg-[#f6c9dd]"];

// Native <details> accordions styled as comic panels.
export default function FaqPage() {
  return (
    <>
      <PageHeader kicker="POOCHHO · 105.2 FM" hindi="सवाल-जवाब" title="FAQ">
        Everything you wanted to ask, answered in panels.
      </PageHeader>
      <Container className="grid items-start gap-5 py-16 md:grid-cols-2">
        {faqs.map((f, i) => (
          <details key={f.q} className={`group border-4 border-ink p-5 shadow-[6px_6px_0_var(--color-ink)] ${tones[i % tones.length]} ${i % 2 ? "rotate-[.6deg]" : "-rotate-[.6deg]"}`}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="shrink-0 rounded-full border-2 border-ink bg-cream px-2 text-sm transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-4 rounded-2xl border-2 border-ink bg-cream p-4 text-lg">{f.a}</p>
          </details>
        ))}
      </Container>
    </>
  );
}
