import type { Metadata } from "next";
import PassCards from "@/components/PassCards";
import { Container } from "@/components/ui";
import { passes } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Passes", description: "Student and Access passes for Meraz 7.0." };

export default function PassesPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden pb-24 pt-24 sm:pt-28">
      <div className="sunburst absolute left-1/2 top-0 size-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow opacity-60" aria-hidden="true" />
      <Container className="relative">
        <h1 className="text-center">
          <span className="block font-poster text-[clamp(1.8rem,5vw,3rem)] leading-none">grab your</span>
          <span className="painted block font-display text-[clamp(3.5rem,13vw,8rem)] leading-[.9] text-cream misprint">PASSES</span>
        </h1>
        <ul className="mx-auto mt-8 max-w-2xl space-y-2 border-4 border-ink bg-cream p-5 text-center shadow-[6px_6px_0_var(--color-ink)]">
          <li>
            <strong>Entry to the campus requires a valid Access/Student Pass.</strong>
          </li>
          <li>
            For any queries/issues contact{" "}
            <a href={`tel:${site.passQueryPhone.replace(/\s/g, "")}`} className="font-bold underline">
              {site.passQueryPhone}
            </a>
          </li>
        </ul>
        <div className="mt-12">
          <PassCards passes={passes} />
        </div>
      </Container>
    </div>
  );
}
