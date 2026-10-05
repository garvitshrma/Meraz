import type { Metadata } from "next";
import { preload } from "react-dom";
import PhoneDial from "@/components/PhoneDial";
import { contacts } from "@/data/content";

export const metadata: Metadata = { title: "Contact", description: "Contact the Meraz team at IIT Bhilai." };

// The rotary phone with a contact card in each dial hole (address plus the Meraz 7.0 conveners). The cards are drawn
// in 3D, so the same contacts are listed for screen readers, with the phone numbers and email as links.
export default function ContactPage() {
  for (const n of ["telephone", "stool"]) preload(`/models/${n}.glb`, { as: "fetch", crossOrigin: "anonymous" }); // GLTFLoader fetches in cors mode
  return (
    <>
      <h1 className="sr-only">Contact Us</h1>
      <PhoneDial />
      <ul className="sr-only">
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
