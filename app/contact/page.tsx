import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the MERAZ 7.0 team." };

export default function ContactPage() {
  const rows = [
    ["EMAIL", <a key="e" href={`mailto:${site.email}`} className="underline">{site.email}</a>],
    ["PHONE", <a key="p" href={`tel:${site.phone.replace(/\s/g, "")}`} className="underline">{site.phone}</a>],
    ["ADDRESS", site.venue],
  ] as const;
  return (
    <>
      <PageHeader kicker="TRUNK CALL · 107.9 FM" hindi="संपर्क" title="Contact" tone="teal">
        Send a telegram. Or an email, that works too.
      </PageHeader>
      <Container className="grid gap-10 py-16 md:grid-cols-2">
        {/* telegram card */}
        <div className="-rotate-1 border-4 border-ink bg-[#cfe3f0] p-6 font-mono shadow-[8px_8px_0_var(--color-ink)]">
          <p className="border-b-2 border-ink pb-2 text-center text-lg font-bold tracking-[.3em]">TELEGRAM · तार</p>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs text-ink/70">TO</dt>
              <dd className="text-lg font-bold">TEAM {site.name} STOP</dd>
            </div>
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-ink/70">{k}</dt>
                <dd className="text-lg font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block border-2 border-ink bg-cream px-3 py-1 text-sm hover:bg-ink hover:text-cream">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden border-4 border-ink shadow-[8px_8px_0_var(--color-ink)]">
          <iframe
            title={`Map of ${site.venueShort}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-full min-h-80 w-full sepia-[.3]"
          />
        </div>
      </Container>
    </>
  );
}
