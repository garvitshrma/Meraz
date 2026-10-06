// Cuts the events page's carnival down for the web: Main_Events_Model.glb (265 MB, 2.6 M triangles, 107 MB of
// textures) becomes public/models/mela.glb (~16 MB). Nothing here is part of the Next build; run it by hand whenever
// the source model changes, then bump melaModel's ?v= in data/site.ts so visitors do not keep the old one.
//
//   npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp
//   node --max-old-space-size=12288 tools/build-mela.mjs Main_Events_Model.glb public/models/mela.glb
//
// What it does, and why:
//  - dedup + prune: the model carries the same stall, tree and prop meshes many times over, and textures twice.
//  - weld: joins vertices the exporter split, so the simplifier has something to collapse.
//  - simplify, per mesh, EXCEPT the ground: everything else goes to ~22% of its triangles. The ground is one big
//    rolling surface, and simplifying it leaves normals that the scene's night light turns into dark shards.
//  - textureCompress: 146 textures to WebP, capped at CAP px. This is the single biggest win (107 MB -> 4 MB).
//  - meshopt: quantises and entropy-codes what is left. The page's GLTFLoader already has the matching decoder.
//
// Node names and all four animations survive, which matters: EventsStreet.tsx finds the giant wheel, the
// merry-go-round, the fairgoers, the lanterns and the stall signs by name.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, prune, weld, simplifyPrimitive, textureCompress, meshopt, getSceneVertexCount, VertexCountMethod } from "@gltf-transform/functions";
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";
import { statSync } from "node:fs";

const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) throw new Error("usage: build-mela.mjs <in.glb> <out.glb>");
const RATIO = 0.12; // triangles kept, where the error budget allows
const ERROR = 0.025; // how far a simplified surface may stray, as a share of the mesh's size
const CAP = 512; // longest side of any texture, px
const MB = (n) => (n / 1048576).toFixed(1) + " MB";

await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });

const doc = await io.read(IN);
const root = doc.getRoot();
const scene = root.getDefaultScene() ?? root.listScenes()[0];
const verts = () => getSceneVertexCount(scene, VertexCountMethod.RENDER);
console.log(`in:  ${MB(statSync(IN).size)}  verts ${verts().toLocaleString()}  meshes ${root.listMeshes().length}  textures ${root.listTextures().length}`);

await doc.transform(dedup(), prune({ keepLeaves: false, keepAttributes: false, keepIndices: false, keepSolidTextures: false }), weld());

// Every mesh under the node called "ground" keeps all of its detail; see the note above.
const spared = new Set();
const mark = (node, under) => {
  const mine = under || node.getName() === "ground";
  if (mine && node.getMesh()) spared.add(node.getMesh());
  for (const child of node.listChildren()) mark(child, mine);
};
for (const n of scene.listChildren()) mark(n, false);

let cut = 0;
for (const mesh of root.listMeshes()) {
  if (spared.has(mesh)) continue;
  for (const prim of mesh.listPrimitives()) {
    simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio: RATIO, error: ERROR, lockBorder: false });
    cut++;
  }
}
await doc.transform(prune({ keepLeaves: false, keepSolidTextures: false }));
console.log(`simplified ${cut} primitives (${spared.size} ground meshes left alone) -> verts ${verts().toLocaleString()}`);

await doc.transform(
  textureCompress({ encoder: sharp, targetFormat: "webp", resize: [CAP, CAP], quality: 78, effort: 6 }),
  dedup(),
  meshopt({ encoder: MeshoptEncoder, level: "high", quantizePosition: 12, quantizeNormal: 8, quantizeTexcoord: 10, quantizeGeneric: 10 }),
);
await io.write(OUT, doc);
console.log(`out: ${MB(statSync(OUT).size)}  animations ${root.listAnimations().map((a) => a.getName()).join(", ")}`);
