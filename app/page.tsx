import { preload } from "react-dom";
import RoadJump from "@/components/RoadJump";
import { site } from "@/data/site";

// Home: just the 3D road scene. Its auto ride ends at the site's pages (no NavBar here).
export default function Home() {
  // Start the opening shot's downloads from the HTML, before any JavaScript runs. Must match what RoadJump loads
  // first (GLTFLoader and ImageBitmapLoader both fetch in cors mode, hence crossOrigin on all of them).
  for (const n of ["jump", "road", "walk", "barricade"]) preload(`/models/${n}.glb`, { as: "fetch", crossOrigin: "anonymous" });
  preload("/sky.jpg", { as: "fetch", crossOrigin: "anonymous" });
  return (
    <>
      <h1 className="sr-only">{site.name}</h1>
      <RoadJump />
    </>
  );
}
