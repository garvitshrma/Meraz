import Hero from "@/components/Hero";
import TvSection from "@/components/TvSection";
import Loader from "@/components/Loader";
import { TLink } from "@/components/Transition";
import { site } from "@/data/site";

// Same structure as meraz.iitbhilai.ac.in: preloader, frame-zoom hero, aftermovie TV, fixed REGISTER.
// Navigation lives in the site-wide NavBar.
export default function Home() {
  return (
    <>
      <Loader video={site.aftermovie} />
      <Hero />
      <TvSection src={site.aftermovie} />
      <TLink href="/passes" className="btn fixed bottom-4 right-4 z-40 bg-marigold text-lg sm:bottom-6 sm:right-6">
        REGISTER
      </TLink>
    </>
  );
}
