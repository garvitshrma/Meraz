import type { Metadata, Viewport } from "next";
import { Bungee, Courier_Prime, Rozha_One, Space_Grotesk, Yatra_One } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/data/site";
import { SoundProvider } from "@/lib/sound";
import Loader from "@/components/Loader";
import RadioNav from "@/components/RadioNav";
import Footer from "@/components/Footer";
import { Cassette, Cursor, Konami, ScrollFx } from "@/components/Extras";

const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const rozha = Rozha_One({ weight: "400", subsets: ["latin", "devanagari"], variable: "--font-rozha", display: "swap", preload: false });
const yatra = Yatra_One({ weight: "400", subsets: ["latin", "devanagari"], variable: "--font-yatra", display: "swap", preload: false });
const courier = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-courier", display: "swap", preload: false });

const description = `${site.name}, the annual techno-cultural fest of ${site.college}. Retro India edition: ${site.dateLabel}. ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Retro India · ${site.college}`, template: `%s · ${site.name}` },
  description,
  keywords: ["Meraz", "IIT Bhilai", "techno-cultural fest", "college fest", "Chhattisgarh", "Retro India"],
  openGraph: { type: "website", siteName: site.name, title: `${site.name} · Retro India`, description, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: `${site.name} · Retro India`, description },
};

export const viewport: Viewport = { themeColor: "#F3E6C8" };

// Runs before paint: marks JS as available and skips the CRT loader on repeat visits in a session.
const boot = `try{var d=document.documentElement;d.classList.add('js');if(sessionStorage.getItem('meraz-seen'))d.dataset.seen='1';sessionStorage.setItem('meraz-seen','1')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bungee.variable} ${grotesk.variable} ${rozha.variable} ${yatra.variable} ${courier.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SoundProvider>
          <Loader />
          <RadioNav />
          <main id="main">{children}</main>
          <Footer />
          <Cassette />
          <Konami />
          <Cursor />
          <ScrollFx />
        </SoundProvider>
      </body>
    </html>
  );
}
