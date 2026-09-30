import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventTicket from "@/components/EventTicket";
import { Container, PageHeader } from "@/components/ui";
import { categoryStyle, events, getEvent } from "@/data/events";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = getEvent((await params).slug);
  return e ? { title: e.title, description: `${e.tagline} ${e.description}` } : {};
}

export default async function EventPage({ params }: Props) {
  const e = getEvent((await params).slug);
  if (!e) notFound();
  const related = events.filter((x) => x.category === e.category && x.slug !== e.slug).slice(0, 3);
  const facts = [
    ["Venue", e.venue],
    ["Day", `Day ${e.day}`],
    ["Time", e.time],
    ["Prize pool", e.prize],
    ["Team size", e.teamSize],
  ].filter(([, v]) => v);
  const tone = e.category === "Technical" ? "teal" : e.category === "Workshops" ? "marigold" : "rani";

  return (
    <>
      <PageHeader kicker={`${e.category.toUpperCase()} · TICKET`} hindi={e.hindi ?? ""} title={e.title} tone={tone}>
        {e.tagline}
      </PageHeader>
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-xl leading-relaxed">{e.description}</p>
          <h2 className="mt-10 font-display text-2xl">Rules</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-lg marker:font-display marker:text-vermillion">
            {e.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={site.registerUrl} target="_blank" rel="noopener noreferrer" className="btn bg-rani-deep text-cream">
              Register <ArrowUpRight weight="bold" aria-hidden="true" />
            </a>
            <Link href="/events" className="btn bg-cream">
              <ArrowLeft weight="bold" aria-hidden="true" /> All events
            </Link>
          </div>
        </div>
        <aside className="h-fit -rotate-1 border-4 border-ink bg-cream shadow-[8px_8px_0_var(--color-ink)]">
          <p className={`px-4 py-2 font-display ${categoryStyle[e.category]}`}>Show details</p>
          <dl className="divide-y-2 divide-dashed divide-ink/30 px-4 font-mono">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-ink/70">{k}</dt>
                <dd className="text-right font-bold">{v}</dd>
              </div>
            ))}
            <div className="py-3">
              <dt className="text-ink/70">Coordinator</dt>
              <dd className="font-bold">
                {e.contact.name} ·{" "}
                <a href={`tel:${e.contact.phone.replace(/\s/g, "")}`} className="underline">
                  {e.contact.phone}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </Container>
      {related.length > 0 && (
        <Container className="pb-8">
          <h2 className="mb-6 font-display text-3xl misprint">More {e.category}</h2>
          <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <EventTicket event={r} serial={events.indexOf(r)} />
              </li>
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
