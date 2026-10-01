# MERAZ 7.0 · Retro India

Official website for MERAZ 7.0, the annual techno-cultural fest of IIT Bhilai.

Features, pages and buttons match the current site at [meraz.iitbhilai.ac.in](https://meraz.iitbhilai.ac.in); only the theme changes from Steampunk to Retro India.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Lenis

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Deploy

Import the repo on Vercel. `vercel.json` sets the framework to Next.js; no env vars needed.

## Feature map (reference → Retro India)

| Reference site | This site |
|---|---|
| Gear loader with % progress, then smoke intro | CRT TV loader with real % progress (fonts, page, aftermovie), CRT switch-off reveal |
| Scroll zoom through an ornate frame into a city, blimp, logo | Scroll zoom through a single-screen cinema ("Meraz Talkies") into a painted street, kite, logo |
| Aftermovie in a pinned TV, scales 1.72 → 1, plays when visible | Same, inside an old wooden TV set |
| Flip button: page slides away, full-screen menu with 3D gear | Same flip button and slide, menu with a spinning record |
| Fixed REGISTER button → /passes | Same |
| Shutter transition between pages | Cinema curtains ("Interval") |
| Back to Home on inner pages | Same |
| About: text, theme, 3 stats | Same sections, Retro India copy |
| Events: category tabs, 3D carousel, IIT / non-IIT register rules | Same, tickets as carousel cards |
| Sponsors by tier | Same sponsors and logos, as matchbox labels |
| Passes carousel with Buy Now forms | Same passes and forms, as railway tickets |
| Contact: 9 cards | Same cards as postcards; phone numbers and email are tappable |
| /timeline (unlinked) with Download Full Schedule | Split-flap departure board; the button opens print / Save as PDF |

## Editing content

| What | File |
|---|---|
| Name, tagline, aftermovie path, pass query phone, menu links | `data/site.ts` |
| Event categories, sub-events and registration links | `data/events.ts` |
| About text, stats, sponsors, passes, contacts, timeline | `data/content.ts` |
| Sponsor logos | `public/sponsors/` |
| Aftermovie | `public/aftermovie.mp4` |

## To update for Meraz 7.0

- Event registration links in `data/events.ts` are last year's (Meraz 6.0) Google Forms / Unstop links.
- Pass prices and Buy Now forms in `data/content.ts` are Meraz 6.0's.
- Sponsors, contacts and the timeline (placeholder dates March 15-17) are carried over from the current site.
- Tagline in `data/site.ts` is a placeholder.
