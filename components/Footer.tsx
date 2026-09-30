import Link from "next/link";
import { site, stations } from "@/data/site";
import HornSign from "./HornSign";

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-ink text-cream">
      <div className="truck-border h-4" aria-hidden="true" />
      <div className="zigzag h-3 [--zz:var(--color-marigold)]" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <HornSign />

        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1fr_1.4fr]">
          <div>
            <h2 className="font-display text-lg text-turmeric">Sections</h2>
            <ul className="mt-3 grid grid-cols-2 gap-1 font-mono text-sm">
              {stations.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-marigold">
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={site.registerUrl} target="_blank" rel="noopener noreferrer" className="text-marigold hover:underline">
                  Register ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-lg text-turmeric">Contact</h2>
            <address className="mt-3 space-y-1 font-mono text-sm not-italic">
              <p>{site.venue}</p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-marigold">
                  {site.email}
                </a>
              </p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-marigold">
                  {site.phone}
                </a>
              </p>
            </address>
            <h2 className="mt-6 font-display text-lg text-turmeric">Socials</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block border-2 border-cream px-3 py-1 font-mono text-xs hover:bg-cream hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden border-4 border-marigold">
            <iframe
              title={`Map of ${site.venueShort}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-64 w-full grayscale-[.4] sepia-[.3]"
            />
          </div>
        </div>

        <p className="mt-14 text-center font-mono text-xs text-cream/60">
          © {new Date().getFullYear()} {site.name} · {site.college} · Made with chai in Bhilai · Try ↑↑↓↓←→←→BA
        </p>
      </div>
      {/* room for the cassette on mobile */}
      <div className="h-16 sm:h-0" />
    </footer>
  );
}
