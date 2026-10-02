import { preload } from "react-dom";
import RoadJump from "@/components/RoadJump";
import { site } from "@/data/site";

// Home: just the 3D road jump. Navigation lives in the site-wide NavBar.
export default function Home() {
  // Start the opening shot's downloads from the HTML, before any JavaScript runs. Must match what RoadJump loads
  // first (GLTFLoader fetches in cors mode, TextureLoader sets crossOrigin, hence crossOrigin on both).
  for (const n of ["jump", "road", "walk", "barricade"]) preload(`/models/${n}.glb`, { as: "fetch", crossOrigin: "anonymous" });
  preload("/sky.jpg", { as: "image", crossOrigin: "anonymous" });
  return (
    <>
      <h1 className="sr-only">{site.name}</h1>
      <RoadJump />
    </>
  );
}
