import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Register", description: "Get your MERAZ 7.0 fest pass and register for events." };

const steps = ["Sign up on the registration portal", "Buy a fest pass", "Add the events you want", "Show your pass at the gate"];

export default function RegisterPage() {
  return (
    <>
      <PageHeader kicker="RESERVATION COUNTER" hindi="आरक्षण खिड़की" title="Register" tone="rani">
        One window for fest passes, event entries and accommodation.
      </PageHeader>
      <Container className="py-16">
        <div className="mx-auto max-w-3xl border-4 border-ink bg-cream shadow-[10px_10px_0_var(--color-ink)]">
          <div className="flex items-center justify-between bg-ink px-5 py-3 font-mono text-turmeric">
            <span>WINDOW NO. 7</span>
            <span className="animate-pulse">● BOOKING OPEN</span>
          </div>
          <ol className="divide-y-2 divide-dashed divide-ink/30">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-4 px-5 py-4 text-lg">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold font-display">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="border-t-4 border-ink p-6 text-center">
            <a href={site.registerUrl} target="_blank" rel="noopener noreferrer" className="btn bg-rani text-xl text-cream">
              Go to registration portal ↗
            </a>
            <p className="mt-3 font-mono text-xs">Opens in a new tab</p>
          </div>
        </div>
      </Container>
    </>
  );
}
