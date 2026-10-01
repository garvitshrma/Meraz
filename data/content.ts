// About, sponsors, passes, contacts and timeline.
// Structure and live links match meraz.iitbhilai.ac.in; copy is rewritten for the Retro India theme.

export const about = {
  text: "Meraz 7.0, the pulsating heart of IIT Bhilai, is where technology, art and imagination unite to create an unforgettable celebration of innovation and culture. Evolving with each edition, Meraz has grown into a grand stage for talent, collaboration and creative exploration. At its core, Meraz is a tribute to curiosity and expression: a space where minds ignite, ideas take shape, and every participant becomes part of something larger than themselves. From cutting-edge tech showcases and coding battles to captivating performances, fashion artistry and culinary flair, Meraz embraces every shade of human creativity. More than an event, it is an experience that bridges disciplines, builds friendships and inspires new possibilities. Whether you come to compete, perform or simply be inspired, Meraz invites you to discover your potential and paint your own story on its vibrant canvas.",
  theme:
    "This year, Meraz 7.0 rewinds the tape to Retro India: the age of hand-painted cinema posters, truck art that said Horn OK Please, transistor radios on every windowsill and one television that brought the whole mohalla together. The theme celebrates the warmth and wild colour of India between the seventies and the nineties, when every festival felt like a blockbuster release. As the reels start to roll, watch creativity, technology and nostalgia come together in a show that is pure paisa vasool.",
  stats: [
    { value: "100+", label: "Events", icon: "calendar" },
    { value: "1000+", label: "Participants", icon: "users" },
    { value: "1000+", label: "Online audience", icon: "globe" },
  ] as const,
};

export type SponsorTier = { tier: string; hindi: string; level: "title" | "platinum" | "gold"; sponsors: { name: string; logo: string }[] };
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
      { name: "Blued Studio", logo: "/sponsors/blued-studio.png" },
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
    name: "Student Pass",
    title: "Entry into the institute and Pronites access",
    discountCategories: [
      {
        type: "Student pass discounts",
        discounts: ["Group of 3 to 6: ₹460 per person", "Group of 7 to 9: ₹430 per person", "Group of 10 or more: ₹400 per person"],
      },
    ],
    formLink: "https://docs.google.com/forms/d/e/1FAIpQLSfdVhh3Q6OzyE30O9fRm_IIwoPyY_9eBbRDjkgtQ7wUNrX7LQ/viewform",
  },
  {
    name: "Access Pass",
    title: "Entry to the institute but no Pronite access",
    discountCategories: [
      {
        type: "Access pass for single day",
        discounts: ["₹150 per head", "Groups of 3 to 5: ₹140 (1 day) per head", "Groups of 6 to 9: ₹120 (1 day) per head", "Groups of 10 or more: ₹100 (1 day) per head"],
      },
      {
        type: "Access pass for two days",
        discounts: ["₹200 per head", "Group of 3 to 5: ₹180 (2 days) per head", "Group of 6 to 9: ₹160 (2 days) per head", "Group of 10 or more: ₹150 (2 days) per head"],
      },
    ],
    formLink: "https://docs.google.com/forms/d/e/1FAIpQLScybemGe99maALEORbUyXp0rlujs_4lPr2Kbwpny2Kd0yRhoA/viewform?usp=send_form",
  },
];

export type ContactCard = { title: string; kind: "mail" | "phone"; details: { label: string; value?: string }[] };
export const contacts: ContactCard[] = [
  {
    title: "Email & Address",
    kind: "mail",
    details: [{ label: "Email", value: "meraz@iitbhilai.ac.in" }, { label: "Indian Institute of Technology, Bhilai" }, { label: "Durg, Chhattisgarh" }, { label: "India - 491002" }],
  },
  { title: "Fest Head", kind: "phone", details: [{ label: "Fest Head - Gaurav Yogi", value: "+91 6376910782" }] },
  { title: "Fest Convenor", kind: "phone", details: [{ label: "Fest Convenor - Gajanand Kumawat", value: "+91 8769976268" }] },
  { title: "Finance", kind: "phone", details: [{ label: "Convenor - Jiya Mehta", value: "+91 7990195809" }, { label: "Convenor - Vikas Choudhary", value: "+91 9257617826" }] },
  { title: "Sci-Tech", kind: "phone", details: [{ label: "Convenor - Prashant Asati", value: "+91 8237436265" }] },
  { title: "Sports & Informals", kind: "phone", details: [{ label: "Convenor - Devansh Tejwani", value: "+91 7030429299" }, { label: "Convenor - Tanishq Gupta", value: "+91 8955947415" }] },
  { title: "Media & Design", kind: "phone", details: [{ label: "Convener - Kabeer More", value: "+91 9156057574" }, { label: "Convener - Harshal Singh", value: "+91 9414258313" }] },
  { title: "Cultural", kind: "phone", details: [{ label: "Convenor - Purva Jivani", value: "+91 9898040800" }, { label: "Convenor - Lakshay Gupta", value: "+91 9911118016" }] },
  { title: "Outreach", kind: "phone", details: [{ label: "Convenor - Ashtha Priya", value: "+91 6204411316" }, { label: "Convenor - Aditya Yadav", value: "+91 7470380899" }] },
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
