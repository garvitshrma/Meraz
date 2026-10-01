import type { Metadata } from "next";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { Container, PageHeader } from "@/components/ui";
import { contacts } from "@/data/content";

export const metadata: Metadata = { title: "Contact", description: "Contact the Meraz team at IIT Bhilai." };

const tilts = ["-rotate-1", "rotate-1", "-rotate-[.5deg]", "rotate-[.6deg]"];

// Same nine contact cards as the reference, as old postcards. Phone numbers and email are tappable.
export default function ContactPage() {
  return (
    <>
      <PageHeader hindi="संपर्क" title="Contact Us" tone="rani" />
      <Container className="py-16">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c, i) => {
            const Icon = c.kind === "mail" ? EnvelopeSimple : Phone;
            return (
              <li
                key={c.title}
                data-reveal
                className={`relative border-4 border-ink bg-[#fbf3df] p-5 shadow-[6px_6px_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 ${tilts[i % tilts.length]}`}
              >
                {/* stamp + postmark */}
                <div className="absolute right-3 top-3 grid size-14 place-items-center border-2 border-dashed border-ink bg-marigold" aria-hidden="true">
                  <Icon size={26} weight="bold" />
                </div>
                <div className="absolute right-12 top-8 grid size-14 -rotate-12 place-items-center rounded-full border-2 border-rani-deep/70 font-mono text-[8px] font-bold leading-tight text-rani-deep/80" aria-hidden="true">
                  MERAZ
                  <br />
                  BHILAI
                </div>
                <h2 className="pr-24 font-display text-xl">{c.title}</h2>
                <div className="mt-4 space-y-3 border-t-2 border-dashed border-ink/40 pt-3">
                  {c.details.map((d) => (
                    <p key={d.label} className="font-mono text-sm">
                      <span className="block font-bold">{d.label}</span>
                      {d.value && (
                        <a href={c.kind === "mail" ? `mailto:${d.value}` : `tel:${d.value.replace(/\s/g, "")}`} className="mt-0.5 inline-block py-1 text-base underline decoration-2 underline-offset-4 hover:text-rani-deep">
                          {d.value}
                        </a>
                      )}
                    </p>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
