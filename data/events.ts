// All events. The schedule board, workshops page and event pages are generated from this list.
// PLACEHOLDER content throughout: replace titles, venues, times, prizes and contacts.

export const categories = ["Technical", "Cultural", "Pro-Nites", "Workshops", "Gaming"] as const;
export type Category = (typeof categories)[number];

export type FestEvent = {
  slug: string;
  title: string;
  hindi?: string;
  category: Category;
  tagline: string;
  description: string;
  venue: string;
  day: 1 | 2 | 3;
  time: string; // 24h "HH:MM"
  prize?: string;
  teamSize?: string;
  rules: string[];
  contact: { name: string; phone: string };
};

// Ticket colours per category (background stripe + text on it).
export const categoryStyle: Record<Category, string> = {
  Technical: "bg-teal-deep text-cream",
  Cultural: "bg-rani-deep text-cream",
  "Pro-Nites": "bg-vermillion-deep text-cream",
  Workshops: "bg-marigold text-ink",
  Gaming: "bg-ink text-turmeric",
};

const c = (name: string) => ({ name, phone: "+91 00000 00000" });

export const events: FestEvent[] = [
  {
    slug: "inauguration",
    title: "Grand Opening Show",
    hindi: "शुभारंभ",
    category: "Cultural",
    tagline: "Lights. Camera. Meraz.",
    description:
      "The curtain rises on three days of madness. Band performances, a retro fashion walk and the lighting of the fest lamp.",
    venue: "Main Stage",
    day: 1,
    time: "10:00",
    rules: ["Open to all registered participants", "Seating on first-come basis"],
    contact: c("Cultural Secretary"),
  },
  {
    slug: "hackathon",
    title: "Hack-A-Thali",
    hindi: "हैकथॉन",
    category: "Technical",
    tagline: "24 hours. One thali of problems.",
    description:
      "A 24-hour build sprint with problem statements served like a thali: pick a dish, ship a solution, pitch to the judges.",
    venue: "Lecture Hall 1",
    day: 1,
    time: "12:00",
    prize: "₹1,00,000",
    teamSize: "2-4",
    rules: ["All code must be written during the event", "Any language or stack allowed", "Final pitch: 5 minutes"],
    contact: c("Tech Head"),
  },
  {
    slug: "robo-dangal",
    title: "Robo Dangal",
    hindi: "रोबो दंगल",
    category: "Technical",
    tagline: "Metal meets mitti.",
    description: "Build a bot, enter the akhada, push your opponent out of the ring. Last machine standing wins.",
    venue: "Sports Ground",
    day: 2,
    time: "11:00",
    prize: "₹50,000",
    teamSize: "1-4",
    rules: ["Max bot weight 8 kg", "No projectiles or liquids", "Wireless control only"],
    contact: c("Robotics Club"),
  },
  {
    slug: "code-express",
    title: "Code Express",
    hindi: "कोड एक्सप्रेस",
    category: "Technical",
    tagline: "Competitive coding, no halts.",
    description: "A three-hour ICPC-style contest. Every station you clear gets you closer to the terminus.",
    venue: "Computer Centre",
    day: 3,
    time: "10:00",
    prize: "₹30,000",
    teamSize: "1",
    rules: ["Individual participation", "C++, Java, Python allowed", "No internet except the judge"],
    contact: c("Coding Club"),
  },
  {
    slug: "nukkad-natak",
    title: "Nukkad Natak",
    hindi: "नुक्कड़ नाटक",
    category: "Cultural",
    tagline: "Street theatre, full volume.",
    description: "Teams take over the street with 15-minute plays on themes that matter. No stage, no mics, all heart.",
    venue: "Central Lawn",
    day: 1,
    time: "16:00",
    prize: "₹25,000",
    teamSize: "8-20",
    rules: ["Performance: 12-15 minutes", "No recorded music", "Hindi, English or regional languages"],
    contact: c("Dramatics Club"),
  },
  {
    slug: "antakshari",
    title: "Antakshari Nights",
    hindi: "अंताक्षरी",
    category: "Cultural",
    tagline: "Start with the last letter.",
    description: "The great Indian song-chain game, with rounds from every decade from the '60s to the '90s.",
    venue: "Open Air Theatre",
    day: 2,
    time: "18:00",
    prize: "₹15,000",
    teamSize: "3",
    rules: ["Hindi & regional film songs only", "Judges' decision final"],
    contact: c("Music Club"),
  },
  {
    slug: "retro-walk",
    title: "Disco Deewane Fashion Walk",
    hindi: "फैशन वॉक",
    category: "Cultural",
    tagline: "Bell-bottoms mandatory.",
    description: "A themed ramp walk celebrating the loud, glorious fashion of the '70s, '80s and '90s.",
    venue: "Main Stage",
    day: 3,
    time: "17:00",
    prize: "₹40,000",
    teamSize: "10-16",
    rules: ["Walk duration: 8-10 minutes", "Theme must be retro India"],
    contact: c("Fashion Club"),
  },
  {
    slug: "band-night",
    title: "Transistor Band Night",
    hindi: "बैंड नाइट",
    category: "Pro-Nites",
    tagline: "Live, loud, analogue.",
    description: "Headlining band plus the winners of the inter-college Battle of Bands.",
    venue: "Main Stage",
    day: 1,
    time: "20:00",
    rules: ["Entry with fest pass only", "No re-entry after 21:00"],
    contact: c("Pro-Nite Team"),
  },
  {
    slug: "edm-night",
    title: "VHS Rewind EDM Night",
    hindi: "ईडीएम नाइट",
    category: "Pro-Nites",
    tagline: "Bass from the future, visuals from the past.",
    description: "A headline DJ set with a full retro-visual light show.",
    venue: "Main Stage",
    day: 2,
    time: "21:00",
    rules: ["Entry with fest pass only", "ID card mandatory"],
    contact: c("Pro-Nite Team"),
  },
  {
    slug: "star-night",
    title: "Star Night",
    hindi: "स्टार नाइट",
    category: "Pro-Nites",
    tagline: "The finale. The superstar.",
    description: "The closing night with our biggest headliner. Announcement coming soon.",
    venue: "Main Stage",
    day: 3,
    time: "20:30",
    rules: ["Entry with fest pass only", "Gates open at 19:30"],
    contact: c("Pro-Nite Team"),
  },
  {
    slug: "drone-workshop",
    title: "Drone Building Workshop",
    hindi: "ड्रोन कार्यशाला",
    category: "Workshops",
    tagline: "Build one. Fly one. Keep one.",
    description: "A hands-on two-session workshop where you assemble and fly a quadcopter.",
    venue: "Workshop Block",
    day: 1,
    time: "14:00",
    teamSize: "1-2",
    rules: ["Kits provided", "Limited seats: register early", "Certificate on completion"],
    contact: c("Workshop Team"),
  },
  {
    slug: "genai-workshop",
    title: "Build With AI",
    hindi: "एआई कार्यशाला",
    category: "Workshops",
    tagline: "From prompt to product in 3 hours.",
    description: "Learn to build and ship a small AI-powered web app, guided by industry mentors.",
    venue: "Lecture Hall 2",
    day: 2,
    time: "10:00",
    teamSize: "1",
    rules: ["Bring your own laptop", "Basic programming knowledge needed"],
    contact: c("Workshop Team"),
  },
  {
    slug: "screen-printing",
    title: "Screen-Print Your Poster",
    hindi: "पोस्टर छपाई",
    category: "Workshops",
    tagline: "Ink, mesh and misregistration.",
    description: "Learn the old-school screen-printing process and take home a hand-pulled Meraz poster.",
    venue: "Design Studio",
    day: 3,
    time: "11:30",
    teamSize: "1",
    rules: ["All materials provided", "Wear clothes you can get inky"],
    contact: c("Fine Arts Club"),
  },
  {
    slug: "valorant-cup",
    title: "Valorant Cup",
    hindi: "गेमिंग कप",
    category: "Gaming",
    tagline: "Clutch or kick.",
    description: "A 5v5 knockout tournament across two days. Finals streamed live on the big screen.",
    venue: "Gaming Arena",
    day: 2,
    time: "13:00",
    prize: "₹60,000",
    teamSize: "5",
    rules: ["Bring your own peripherals", "Standard competitive map pool", "Check-in 30 min early"],
    contact: c("Gaming Club"),
  },
  {
    slug: "retro-arcade",
    title: "8-Bit Arcade Mela",
    hindi: "आर्केड मेला",
    category: "Gaming",
    tagline: "High scores, low resolution.",
    description: "Retro console and arcade stalls all day. Top the leaderboard, win the golden joystick.",
    venue: "SAC Foyer",
    day: 3,
    time: "12:00",
    prize: "Goodies",
    teamSize: "1",
    rules: ["Walk-in, no registration", "Leaderboard closes at 18:00"],
    contact: c("Gaming Club"),
  },
];

export const getEvent = (slug: string) => events.find((e) => e.slug === slug);
export const eventsByDay = (day: 1 | 2 | 3) =>
  events.filter((e) => e.day === day).sort((a, b) => a.time.localeCompare(b.time));

// Sum of all cash prizes, e.g. "₹3.2 Lakh". Updates itself when prizes change.
export const prizePool = () => {
  const total = events.reduce((sum, e) => sum + (Number(e.prize?.replace(/\D/g, "")) || 0), 0);
  return `₹${(total / 100000).toFixed(1).replace(/\.0$/, "")} Lakh`;
};
