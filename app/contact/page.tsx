import type { Metadata } from "next";
import { preload } from "react-dom";
import { Pigeons, Postbox, Wires } from "@/components/ContactArt";
import PhoneDial from "@/components/PhoneDial";
import BackToTop from "@/components/BackToTop";
import { contacts } from "@/data/content";

// The page's text is almost all names and numbers (the cards are drawn in 3D), which Chrome misreads as Indonesian
// and offers to translate; there is nothing here to translate.
export const metadata: Metadata = { title: "Contact", description: "Contact the Meraz team at IIT Bhilai.", other: { google: "notranslate" } };

// First a wall painted Warli fashion, red ochre with white figures, telephone wires strung across it with birds on
// them: the title, the couple on the PCO phone (public/contact/pco.webp, cut from contact.jpeg at the project root),
// the postbox with the email and address, and the ten contacts as buttons, five above and five below. Then the rotary telephone with a contact card in each dial hole (the
// Meraz 7.0 conveners). Nothing can follow the phone: its scroll tour loops. The cards are drawn in 3D, so the same
// contacts are listed for screen readers, with the phone numbers and email as links.
const post = contacts.find((c) => c.kind === "mail")!;
const email = post.details.find((d) => d.value)!.value!;
// the fest head and the fest convener, whose numbers sit by the email as well as on their own buttons
const reach = contacts.filter((c) => c.title === "Fest Head" || c.title === "Fest Convener").flatMap((c) => c.details);

// Five of the contacts as buttons, each carrying its number on the dial (contact j sits in hole 0, then 9, 8 … 1) and
// taking the tour to that hole: PhoneDial handles the click, the #booth link is the fallback.
const digit = (j: number) => (j ? 10 - j : 0);
function DialRow({ from }: { from: number }) {
  return (
    <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {contacts.slice(from, from + 5).map((c, k) => (
        <li key={c.title}>
          <a
            href="#booth"
            data-dial={from + k}
            className="btn group min-h-11 bg-cream !py-1 !pl-1.5 !pr-4 !text-xs tracking-wide text-geru focus-visible:outline-cream sm:!text-sm"
          >
            <span className="grid size-8 place-items-center rounded-full border-2 border-ink bg-geru text-base text-cream shadow-[inset_0_0_0_2px_var(--color-turmeric)] transition-colors group-hover:bg-rani-deep" aria-hidden="true">
              {digit(from + k)}
            </span>
            {c.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ContactPage() {
  for (const n of ["telephone", "stool"]) preload(`/models/${n}.glb`, { as: "fetch", crossOrigin: "anonymous" }); // GLTFLoader fetches in cors mode
  return (
    <>
      <section aria-labelledby="contact-title" className="warli relative overflow-hidden bg-geru text-cream">
        {/* top: clear of the fixed header, the wires strung from under it */}
        <Pigeons />
        <Wires id="wires" className="pointer-events-none absolute inset-x-0 top-[4.5rem] h-[clamp(7rem,14vw,13rem)] w-full" />
        <nav aria-label="Contacts" className="relative mx-auto max-w-7xl px-4 pt-[clamp(10rem,15vw,14.5rem)] sm:px-8">
          <DialRow from={0} />
        </nav>
        <div className="relative mx-auto grid max-w-7xl items-center gap-x-12 gap-y-10 px-4 pb-10 pt-10 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p lang="hi" className="font-deva text-[clamp(1.6rem,3vw,2.6rem)] leading-none text-turmeric">
              संपर्क करें
            </p>
            <h1 id="contact-title" className="mt-2 whitespace-nowrap font-poster text-[clamp(3.25rem,6.8vw,6.5rem)] leading-[.85]">
              Contact Us
            </h1>
            <p className="mt-5 max-w-md text-lg text-cream/90">Write to us, or pick a number and ring the team.</p>
  
            {/* the drawing has empty margin round the box: the row is nudged left so the box itself lines up with the heading */}
            <div className="-ml-2 mt-10 flex items-center gap-4 sm:-ml-3 sm:gap-6">
              <Postbox id="postbox" className="w-24 shrink-0 sm:w-32" />
              <address className="min-w-0 not-italic leading-relaxed">
                <p className="font-display text-sm tracking-widest text-turmeric">Write to us</p>
                <a href={`mailto:${email}`} className="text-lg font-bold underline decoration-2 underline-offset-4 hover:text-turmeric">
                  {email}
                </a>
                {reach.map((d) => (
                  <p key={d.label} className="text-cream/90">
                    {d.label}:{" "}
                    <a href={`tel:${d.value!.replace(/\s/g, "")}`} className="whitespace-nowrap font-bold underline decoration-2 underline-offset-4 hover:text-turmeric">
                      {d.value}
                    </a>
                  </p>
                ))}
                {post.details
                  .filter((d) => !d.value)
                  .map((d) => (
                    <p key={d.label} className="text-cream/90">
                      {d.label}
                    </p>
                  ))}
              </address>
            </div>
          </div>
  
          <img
            src="/contact/pco.webp"
            alt="A woman and a man talk on the two receivers of a pink phone at an STD-ISD-PCO booth"
            width={1000}
            height={941}
            className="mx-auto w-full max-w-[40rem]"
          />
        </div>
        <nav aria-label="More contacts" className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-8">
          <DialRow from={5} />
        </nav>
        <div aria-hidden="true" className="warli-border h-7" />
      </section>
  
      <PhoneDial />
      <BackToTop />
      <ul className="sr-only" translate="no">
        {contacts.map((c) => (
          <li key={c.title}>
            <h2>{c.title}</h2>
            {c.details.map((d) => (
              <p key={d.label}>
                {d.label}
                {d.value && (
                  <>
                    {": "}
                    <a href={c.kind === "mail" ? `mailto:${d.value}` : `tel:${d.value.replace(/\s/g, "")}`}>{d.value}</a>
                  </>
                )}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}
