import Hero from "@/components/Hero";
import TvSection from "@/components/TvSection";
import HomeShell from "@/components/HomeShell";
import Loader from "@/components/Loader";
import { site } from "@/data/site";

// Same structure as meraz.iitbhilai.ac.in: preloader, frame-zoom hero, aftermovie TV, menu + REGISTER.
export default function Home() {
  return (
    <>
      <Loader video={site.aftermovie} />
      <HomeShell>
        <Hero />
        <TvSection src={site.aftermovie} />
      </HomeShell>
    </>
  );
}
