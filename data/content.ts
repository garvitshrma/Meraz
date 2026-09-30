// Pro-Nite artists, sponsors, team, gallery slides and FAQs.
// Everything here is PLACEHOLDER: replace with real names, links and photos.

export type Artist = { name: string; genre: string; night: string; hindi: string; revealed: boolean };
export const artists: Artist[] = [
  { name: "The Midnight Qawwals", genre: "Sufi Rock", night: "Night 1 · 19 Feb", hindi: "सूफ़ी रॉक", revealed: true },
  { name: "DJ Transistor", genre: "Retro EDM", night: "Night 2 · 20 Feb", hindi: "ईडीएम", revealed: true },
  { name: "Superstar TBA", genre: "Bollywood Live", night: "Night 3 · 21 Feb", hindi: "बॉलीवुड", revealed: false },
];

export type Sponsor = { name: string; tier: string; href: string };
export const sponsors: Sponsor[] = [
  { name: "Sitara Softworks", tier: "Title Sponsor", href: "#" },
  { name: "Kite & Co.", tier: "Co-Sponsor", href: "#" },
  { name: "Transistor Labs", tier: "Tech Partner", href: "#" },
  { name: "Neon Dhaba", tier: "Food Partner", href: "#" },
  { name: "Monsoon Media", tier: "Media Partner", href: "#" },
  { name: "Chakra Motors", tier: "Travel Partner", href: "#" },
  { name: "Rangoli Paints", tier: "Art Partner", href: "#" },
  { name: "Paanwala Ventures", tier: "Refreshment Partner", href: "#" },
];

// photo: put images in /public/team and set e.g. photo: "/team/aditi.jpg"
export type Member = { name: string; role: string; photo?: string };
export const team: Member[] = [
  { name: "Aditi Rao", role: "Fest Convenor" },
  { name: "Rohan Mehta", role: "Co-Convenor" },
  { name: "Sana Qureshi", role: "Cultural Head" },
  { name: "Karan Iyer", role: "Technical Head" },
  { name: "Meera Nair", role: "Design Head" },
  { name: "Vikram Singh", role: "Sponsorship Head" },
  { name: "Ishita Das", role: "Marketing Head" },
  { name: "Arjun Patel", role: "Web Head" },
  { name: "Neha Joshi", role: "Hospitality Head" },
  { name: "Farhan Ali", role: "Events Head" },
  { name: "Priya Verma", role: "Media Head" },
  { name: "Dev Kulkarni", role: "Security Head" },
];

// src: put images in /public/gallery and set e.g. src: "/gallery/2025-1.jpg"
export type Slide = { title: string; year: string; caption: string; pattern: "rays" | "stripes" | "dots" | "checks"; a: string; b: string; src?: string };
export const slides: Slide[] = [
  { title: "Opening Night", year: "2025", caption: "10,000 voices, one countdown.", pattern: "rays", a: "#F4A300", b: "#E0218A" },
  { title: "Nukkad Natak", year: "2025", caption: "Street theatre on the central lawn.", pattern: "stripes", a: "#0F7C7C", b: "#F2C14E" },
  { title: "Robo Dangal", year: "2024", caption: "Two bots, one ring, zero mercy.", pattern: "checks", a: "#1A1A1A", b: "#D7263D" },
  { title: "Star Night", year: "2024", caption: "The crowd that lit up Bhilai.", pattern: "dots", a: "#E0218A", b: "#F3E6C8" },
  { title: "Fashion Walk", year: "2023", caption: "Bell-bottoms, reborn.", pattern: "rays", a: "#D7263D", b: "#F2C14E" },
  { title: "Hackathon", year: "2023", caption: "4 AM, still shipping.", pattern: "stripes", a: "#1A1A1A", b: "#0F7C7C" },
];

export const faqs = [
  { q: "Who can attend MERAZ 7.0?", a: "Students from any college with a valid college ID and a fest pass. Some events are open to the public: check the event page." },
  { q: "How do I register?", a: "Hit the Register button anywhere on the site. Event registration and fest passes are both handled on the registration portal." },
  { q: "Is accommodation available?", a: "Yes, limited on-campus accommodation is available for outstation participants. Request it while registering." },
  { q: "Are Pro-Nites free?", a: "Pro-Nite entry is included with the fest pass. Carry your pass and college ID." },
  { q: "How do I reach IIT Bhilai?", a: "The nearest railway station is Durg Junction and the nearest airport is Raipur. Shuttle buses will run from Durg station during the fest." },
  { q: "Can I participate in multiple events?", a: "Absolutely, as long as the timings don't clash. Check the schedule board." },
  { q: "Will I get a certificate?", a: "All participants get e-certificates. Winners get printed certificates and prizes." },
  { q: "Who do I contact for help?", a: "Reach us through the Contact page or at the help desk near the main gate during the fest." },
];
