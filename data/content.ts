// About, sponsors, passes, contacts and timeline.
// Structure and live links match meraz.iitbhilai.ac.in; copy is rewritten for the Retro India theme.

export const about = {
  text: "Meraz 7.0, the pulsating heart of IIT Bhilai, is where technology, art and imagination unite to create an unforgettable celebration of innovation and culture. Evolving with each edition, Meraz has grown into a grand stage for talent, collaboration and creative exploration. At its core, Meraz is a tribute to curiosity and expression: a space where minds ignite, ideas take shape, and every participant becomes part of something larger than themselves. From cutting-edge tech showcases and coding battles to captivating performances, fashion artistry and culinary flair, Meraz embraces every shade of human creativity. More than an event, it is an experience that bridges disciplines, builds friendships and inspires new possibilities. Whether you come to compete, perform or simply be inspired, Meraz invites you to discover your potential and paint your own story on its vibrant canvas.",
  theme:
    "This year, Meraz 7.0 rewinds the tape to Retro India: the age of hand-painted cinema posters, truck art that said Horn OK Please, transistor radios on every windowsill and one television that brought the whole mohalla together. The theme celebrates the warmth and wild colour of India between the seventies and the nineties, when every festival felt like a blockbuster release. As the reels start to roll, watch creativity, technology and nostalgia come together in a show that is pure paisa vasool.",
  stats: [
    { value: "100+", label: "Events" },
    { value: "1000+", label: "Participants" },
    { value: "1000+", label: "Online audience" },
  ] as const,
};

// false: every sponsor frame shows the "coming soon" image and caption instead of the logo and name (the logos below are
// kept for when the Meraz 7.0 sponsors are confirmed; set true then).
export const SPONSORS_REVEALED = false;
export type SponsorTier = { tier: string; hindi: string; level: "title" | "platinum" | "gold"; sponsors: { name: string; logo: string; dark?: boolean }[] }; // dark: a light logo, shown on a dark ground
export const sponsorTiers: SponsorTier[] = [
  { tier: "Title Sponsor", hindi: "मुख्य प्रायोजक", level: "title", sponsors: [{ name: "SBI", logo: "/sponsors/sbi.jpg" }] },
  { tier: "Co-Title Sponsor", hindi: "सह-प्रायोजक", level: "title", sponsors: [{ name: "CBI", logo: "/sponsors/cbi.png" }] },
  {
    tier: "Platinum Sponsors",
    hindi: "प्लैटिनम",
    level: "platinum",
    sponsors: [
      { name: "PNB", logo: "/sponsors/pnb.webp" },
      { name: "Steel Intech", logo: "/sponsors/steel-intech.jpg" },
      { name: "Riveria", logo: "/sponsors/riveria.jpg" },
      { name: "Blued Studio", logo: "/sponsors/blued-studio.webp", dark: true },
      { name: "Carro Rental", logo: "/sponsors/carro-rental.png" },
    ],
  },
  {
    tier: "Gold Sponsors",
    hindi: "गोल्ड",
    level: "gold",
    sponsors: [
      { name: "Union Bank of India", logo: "/sponsors/union-bank.jpg" },
      { name: "Bhatia", logo: "/sponsors/bhatia.jpg" },
      { name: "Herbalife International", logo: "/sponsors/herbalife.jpg" },
      { name: "Festee", logo: "/sponsors/festee.png" },
      { name: "Manish Sports", logo: "/sponsors/manish-sports.png" },
      { name: "Safexpress", logo: "/sponsors/safexpress.png" },
      { name: "CDO Securities", logo: "/sponsors/cdo-securities.jpg" },
      { name: "Swiggy", logo: "/sponsors/swiggy.jpg" },
    ],
  },
];

export type Pass = { name: string; title: string; discountCategories: { type: string; discounts: string[] }[]; formLink: string };
export const passes: Pass[] = [
  {
    name: "Access Pass",
    title: "Single-Day Entry Pass: A single-day access pass for students to attend MERAZ events on any one day of the fest, excluding Pronites. A valid student ID card is mandatory for entry.",
    discountCategories: [
      {
        type: "Pricing",
        discounts: ["Individual price: ₹99", "Group price: ₹99/person", "No group concession"],
      },
    ],
    formLink: "https://script.google.com/a/macros/iitbhilai.ac.in/s/AKfycbyNIKZ9qv5jyLxOxxDYCFA5z89O3lncR0jhphYQiVQLDNSGYdTCAz7E2xJF2FSkxaHG/exec",
  },
  {
    name: "Pronites Pass Day 2",
    title: "Full Day-2 Access + Day 2 Pronite: Enjoy all MERAZ events on Day 2 as an audience member, including the much-awaited Day 2 Pronite with JYOTIRMAYEE & D.J. PRERAK.",
    discountCategories: [
      {
        type: "Pricing",
        discounts: ["Individual price: ₹299", "Group price (10+ people): ₹249/person", "Save ₹50 per person in a group of 10 or more."],
      },
    ],
    formLink: "https://script.google.com/a/macros/iitbhilai.ac.in/s/AKfycbyNIKZ9qv5jyLxOxxDYCFA5z89O3lncR0jhphYQiVQLDNSGYdTCAz7E2xJF2FSkxaHG/exec",
  },
  {
    name: "Pronites Pass Day 3",
    title: "Full Day-3 Access + Day 3 Pronite: Experience all MERAZ events on Day 3 as an audience member, along with access to the spectacular Day 3 Pronite with NAKASH AZIZ & QAFILA- THE BAND.",
    discountCategories: [
      {
        type: "Pricing",
        discounts: ["Individual price: ₹499", "Group price (10+ people): ₹449/person", "Save ₹50 per person in a group of 10 or more."],
      },
    ],
    formLink: "https://script.google.com/a/macros/iitbhilai.ac.in/s/AKfycbyNIKZ9qv5jyLxOxxDYCFA5z89O3lncR0jhphYQiVQLDNSGYdTCAz7E2xJF2FSkxaHG/exec",
  },
  {
    name: "Accommodation Pass",
    title: "3-Day Complete Experience: Make the most of MERAZ with three-day accommodation, food, access to all events, and entry to all Pronites throughout the fest.",
    discountCategories: [
      {
        type: "Pricing",
        discounts: ["Individual price: ₹3,499", "Group price (10+ people): ₹2,999/person", "Save ₹500 per person in a group of 10 or more."],
      },
    ],
    formLink: "https://script.google.com/a/macros/iitbhilai.ac.in/s/AKfycbyNIKZ9qv5jyLxOxxDYCFA5z89O3lncR0jhphYQiVQLDNSGYdTCAz7E2xJF2FSkxaHG/exec",
  },
];

export type ContactCard = { title: string; kind: "mail" | "phone"; details: { label: string; value?: string }[] };
export const contacts: ContactCard[] = [
  {
    title: "Email & Address",
    kind: "mail",
    details: [{ label: "Email", value: "meraz@iitbhilai.ac.in" }, { label: "Indian Institute of Technology, Bhilai" }, { label: "Durg, Chhattisgarh" }, { label: "India - 491002" }],
  },
  { title: "Fest Head", kind: "phone", details: [{ label: "Fest Head - Arush Ranjan", value: "+91 7780070550" }] },
  { title: "Fest Convener", kind: "phone", details: [{ label: "Fest Convener - Kumar Utkarsh", value: "+91 7667416430" }] },
  { title: "Finance", kind: "phone", details: [{ label: "Convener - Varshitha", value: "+91 6281521833" }, { label: "Convener - Ankan Mondal", value: "+91 9064825588" }] },
  { title: "Cultural", kind: "phone", details: [{ label: "Convener - Andiyappan Rohan", value: "+91 6303011550" }, { label: "Convener - Tancia Boro", value: "+91 7002108549" }] },
  { title: "Management", kind: "phone", details: [{ label: "Convener - Banotu Santhosh", value: "+91 7013751880" }] },
  { title: "Sci-Tech", kind: "phone", details: [{ label: "Convener - Aditya Girish Seoker", value: "+91 9511629108" }, { label: "Convener - Kanad Bajpai", value: "+91 9302860795" }] },
  { title: "Outreach", kind: "phone", details: [{ label: "Convener - Stuti Jain", value: "+91 7440779990" }, { label: "Convener - Lanka Devi Satwika", value: "+91 9177926758" }] },
  { title: "Sports & Informals", kind: "phone", details: [{ label: "Convener - Shubham Jha", value: "+91 8797717222" }, { label: "Convener - Harsh Vardhan Singh", value: "+91 8400281102" }] },
  { title: "Media & Design", kind: "phone", details: [{ label: "Convener - Manjot Singh", value: "+91 7003603365" }, { label: "Convener - Amit Patel", value: "+91 8602275578" }] },
];

// Same placeholder timeline as the reference site's /timeline route. PLACEHOLDER dates.
export type TimelineDay = { date: string; time: string; events: { time: string; title: string; location: string }[] };
export const timeline: TimelineDay[] = [
  {
    date: "Day 1 - March 15",
    time: "9:00 AM - 6:00 PM",
    events: [
      { time: "9:00 AM", title: "Registration Opens", location: "Main Campus" },
      { time: "10:30 AM", title: "Inauguration Ceremony", location: "Auditorium" },
      { time: "12:00 PM", title: "Technical Events Begin", location: "Various Venues" },
      { time: "2:00 PM", title: "Cultural Events Kick-off", location: "Open Stage" },
    ],
  },
  {
    date: "Day 2 - March 16",
    time: "9:00 AM - 11:00 PM",
    events: [
      { time: "9:00 AM", title: "Workshop Sessions", location: "Seminar Halls" },
      { time: "12:00 PM", title: "Hackathon Continues", location: "Lab Complex" },
      { time: "6:00 PM", title: "Evening Performances", location: "Main Stage" },
      { time: "9:00 PM", title: "Celebrity Night", location: "Open Amphitheatre" },
    ],
  },
  {
    date: "Day 3 - March 17",
    time: "9:00 AM - 10:00 PM",
    events: [
      { time: "9:00 AM", title: "Finals Begin", location: "Various Venues" },
      { time: "3:00 PM", title: "Prize Distribution", location: "Auditorium" },
      { time: "6:00 PM", title: "Closing Ceremony", location: "Main Stage" },
      { time: "8:00 PM", title: "Grand Finale Performance", location: "Open Amphitheatre" },
    ],
  },
];

// Home road scene models: [what, author, link]. CC BY 4.0 unless noted, so the credit has to stay on the site.
export const modelCredits: [string, string, string][] = [
  ["Barricade", "InnoFrame", "https://sketchfab.com/3d-models/delhi-police-security-barricade-3d-model-f17ecc171f3441ceb0e9effd90f31c1f"],
  ["Runner", "As7 3d models", "https://sketchfab.com/3d-models/spiderman-india-pavitr-prabhakar-ed5f6c5ba8a94c98aee68b5b6ed1f29b"],
  ["Man", "pankhkhan", "https://sketchfab.com/3d-models/indian-man-with-red-clothes-23b1805e473d4e5cb3e439b576ca39a9"],
  ["Old man", "anandmohan662", "https://sketchfab.com/3d-models/indian-old-man-walking-e70a140ad4334c2e8648ac78d61545b3"],
  [
    "Woman",
    "Pixel_Monster (Sketchfab Standard licence)",
    "https://sketchfab.com/3d-models/indian-woman-in-saree-b5965a93b03440dea65160f7cbac1fc7",
  ],
  ["Stall", "Cyril43", "https://sketchfab.com/3d-models/medieval-stall-4a5a40e78e4b481bafbb576303f992cd"],
  ["Auto", "rSquare", "https://sketchfab.com/3d-models/auto-rickshaw-44776bcb34e04c1a8b9c18a70376304e"],
  ["Tree", "farhad.Guli", "https://sketchfab.com/3d-models/tree-7016d1d32fe748f0a8b3f5eb39374bc4"],
  ["Pine", "evolveduk", "https://sketchfab.com/3d-models/pine-tree-d45218a3fab349e5b1de040f29e7b6f9"],
  ["Birch", "evolveduk", "https://sketchfab.com/3d-models/birch-tree-aa842dffd9654d33b8b91170ce83c172"],
];
