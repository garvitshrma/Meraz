import { preload } from "react-dom";
import RoadJump from "@/components/RoadJump";
import { boothModel, site, streetModel } from "@/data/site";

// Home: just the 3D road scene. Its auto ride ends at the site's pages (no NavBar here).
export default function Home() {
  // Start the opening shot's downloads from the HTML, before any JavaScript runs. Must match what RoadJump loads
  // first (GLTFLoader and ImageBitmapLoader both fetch in cors mode, hence crossOrigin on all of them).
  for (const n of ["jump", "env-road", "walk", "barricade"]) preload(`/models/${n}.glb`, { as: "fetch", crossOrigin: "anonymous" });
  preload("/sky.jpg", { as: "fetch", crossOrigin: "anonymous" });
  return (
    <>
      <h1 className="sr-only">{site.name}</h1>
      {/* The contact page's phone (~8 MB) and stool: fetched at idle priority while the visitor is here, so they are cached by then. */}
      <link rel="prefetch" href="/models/telephone.glb" crossOrigin="anonymous" />
      <link rel="prefetch" href="/models/stool.glb" crossOrigin="anonymous" />
      {/* And the events page's street and booth (0.7 + 1.3 MB). */}
      <link rel="prefetch" href={streetModel} crossOrigin="anonymous" />
      <link rel="prefetch" href={boothModel} crossOrigin="anonymous" />
      <RoadJump />
    </>
  );
}
