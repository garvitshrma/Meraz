# MERAZ 7.0 · Retro India

Official website for MERAZ 7.0, the annual techno-cultural fest of IIT Bhilai.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Motion (Framer Motion) · Lenis

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Deploy

Import the repo on Vercel. `vercel.json` sets the framework to Next.js; no env vars needed.

## Editing content (no coding needed)

| What | File |
|------|------|
| Fest name, dates, venue, tagline, register link, email, phone, socials | `data/site.ts` |
| Events (also drives the schedule board, workshops page, event pages) | `data/events.ts` |
| Pro-Nite artists, sponsors, team, gallery slides, FAQs | `data/content.ts` |
| Team photos | put in `public/team/`, set `photo: "/team/name.jpg"` |
| Gallery photos | put in `public/gallery/`, set `src: "/gallery/file.jpg"` |

## Placeholders to replace

- `data/site.ts`: tagline, `startDate` (countdown), `dateLabel`, venue, `registerUrl`, email, phone, `url` (production domain), all social links
- `components/EventTicket.tsx`: `dayDate` array (the date printed on tickets for Day 1/2/3)
- `data/events.ts`: every event's title, time, venue, prize, rules, coordinator name and phone
- `data/content.ts`: artist names (Night 3 is set to `revealed: false`), sponsor names/links/tiers, team names/roles/photos, gallery slides/photos, FAQ answers (travel info especially)
- Home page stats (`3 / 50+ / 20K+ / 7th`) and marquee text in `app/page.tsx`

## Signature bits

- CRT TV loader (pure CSS, once per session, off for reduced motion)
- Radio-dial navigation: drag/click/arrow keys, with a plain link list in the same dialog
- Cinema-ticket events with category filter, railway split-flap schedule board
- Pro-Nite poster: "Coming Soon" stamp, then poster peels off
- Matchbox sponsors, draggable corkboard team, slide-projector gallery
- Cassette music toggle: synthesised tanpura drone (Web Audio, no files), muted by default
- Easter eggs: Konami code (↑↑↓↓←→←→BA), or tap the footer "Horn OK Please" sign 7 times on mobile. Vinyl cursor on desktop.
