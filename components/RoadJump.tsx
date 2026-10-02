"use client";

// Road scene: the section pins; scrolling walks the runner toward the camera while it swings from his face
// round to his back, then scrubs him flip-jumping over a Delhi Police barricade, then walking on down the road.
// The "Flip jump" clip carries root motion (it travels a few metres forward), so the barricade sits where his
// hand lands mid-vault. Pedestrians walk the footpaths in real time while the section is on screen.
// Loading: three.js ships with the page (the scene is the page), the opening shot's few assets are preloaded from the
// HTML (app/page.tsx) and drawn as soon as they land, and the rest of the street streams in behind them.
import { useEffect, useRef } from "react";
import { ArrowDown } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import type { Object3D, SkinnedMesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { clone as cloneRig } from "three/addons/utils/SkeletonUtils.js";
import { navLinks } from "@/data/site";
import { TLink, useGo } from "./Transition";

gsap.registerPlugin(ScrollTrigger);

const ROAD_SCALE = 0.01; // road.glb is in centimetres
// Where the left hand rests mid-vault (t ≈ 0.5–0.7 s), measured from the clip: the barricade top goes here.
const HAND_PLANT = { y: 0.9, z: 1.95 };
const HAZE = 0x9ca1b1; // the sky panorama's colour at the horizon, so the far road fades into it
// The "MERAZ 7.0" sign: metres wide, centre height, behind his start. The opening shot tilts up by tilt (rise per
// metre, about 9 deg) so his head sits low in the frame and the sign, raised high, shows clear above it.
const TITLE = { width: 10, y: 4.7, z: -10, tilt: 0.16 }; // y: lowest that still clears his hair in the opening shot
// Scroll beats: [0, ORBIT] walk while the camera swings round, [ORBIT, LAND] the jump, [LAND, STOP] two steps on,
// [STOP, SIT] without stopping he curves round to the auto (which set off when he jumped and has pulled up just
// ahead), ducks in and slides onto the bench, turning to face forward as he settles, [SIT, 1] he sits still.
const ORBIT = 0.24;
const LAND = 0.52;
const STOP = 0.62;
const SIT = 0.93;
// Seated, the driver asks where to (a speech bubble from his head at ASK), then the site's pages come up as
// destinations at GO. The home page has no nav bar; these are its navigation.
const ASK = 0.95;
const GO = 0.97;
// Picking a destination: the auto pulls away (accel m/s^2, carrying him and his eye camera, the lens widening by up to
// fov degrees with speed) and after fade seconds the screen starts fading to white into the new page.
const RIDE = { accel: 6, fov: 10, fade: 0.9 };
const WALK_CYCLES = 3; // walk cycles (two steps each) during the swing
const WALK_ON_CYCLES = 1; // and after landing
const STRIDE = 0.7; // leg swing kept from the soldier walk: a long stride stretches the dhoti (and the saree)
const BLEND = 0.03; // share of the scroll spent blending walk into jump, jump into walk, and walk into standing
// Auto rickshaw: comes up from behind on his left (as seen from the chase camera, i.e. +x) once he jumps, and slows
// to a stop beside him as he stops. It slides; the model's wheels are part of one mesh and cannot turn.
// metres: height, line, start behind his jump spot (in frame at once), where it stops ahead of his last step (so he
// can curve round into it)
const AUTO = { height: 1.75, x: 1.8, behind: 4, ahead: 1.2 };
// The auto's rear bench, measured from auto.glb (metres, relative to the auto's centre): it sits behind the centre
// (z), its cushion about 0.5 m up, so seated hips are at hips. The side is open only ahead of the rear body panels,
// so he crosses in at entry, then slides back onto the bench. outside: how far out from the bench he stops.
const SEAT = { z: -0.75, hips: 0.62, entry: -0.35, outside: 1.0 };
// The driver (the old man, shrunk by scale and posed seated), measured from auto.glb the same way: hips on the
// front of the driver's seat (cushion top about 0.75 m) so his arms reach the handlebar grips (x either side) with the
// elbows bent; back straight, leaning forward by lean radians; shins sloping forward by shin (run per metre down), so
// his shoes rest on the floor.
const DRIVER = { scale: 0.93, z: 0.28, hips: 0.8, lean: 0.1, shin: 0.3, grip: { x: 0.33, y: 1.03, z: 0.66 } };
// Sitting: thighs swing forward and knees bend back by these angles (radians), on top of the standing pose; duck is
// the forward lean of his back as he passes under the roof edge.
const SIT_BEND = { thigh: 1.45, knee: 1.5, duck: 0.6 };
// Camera: as the jump starts it pushes in to (push times) its chase distance, aiming up at aim metres to keep the flip in
// frame. As he turns to the auto it moves behind his head (behind metres back, over metres up); as he steps in it cuts
// to his eyes. eye: how far ahead of the head bone the eye camera sits (clear of
// his face), lift: how far above it once seated (high enough to see over the driver's seat to the handlebar).
const CAMERA = { push: 0.55, aim: 1.1, eye: 0.25, lift: 0.3, eyeFov: 75, behind: 0.9, over: 0.2 }; // eyeFov: wide lens of his eye view
// Roadside props, scattered along both kerbs. front: yaw that turns the model's front to face +z.
// size: target height in metres (models come at mixed scales). weight: how often it is picked.
const PROPS = [
  { name: "house-1", front: 0, size: 4.3, weight: 3 },
  { name: "house-2", front: Math.PI, size: 5, weight: 3 }, // porch faces -z
  { name: "hut", front: 0, size: 2.2, weight: 2 },
  { name: "wall-1", front: -Math.PI / 2, size: 2.2, weight: 2 }, // long side along z, posters face +x
  { name: "wall-2", front: Math.PI / 2, size: 3, weight: 1 }, // posters face -x
];
const STREET = { from: -45, to: 75 }; // z range lined with props, past the fog both ways
const TREES = [
  { name: "tree-1", size: 5.5 },
  { name: "tree-2", size: 5.3 },
  { name: "tree-3", size: 7 },
];
// Footpath: the road model's kerb strip (about 1 m) plus a concrete strip of PAVE metres beyond it. Walking lanes
// sit at these offsets from the kerb's outer edge, 1.15 m apart; trees and standing people go along the outer edge.
const PAVE = 3.2;
const LANE_X = [-0.45, 0.7, 1.85]; // inner, middle, slow
const EDGE_X = PAVE - 0.5;
// Pedestrians (height in metres). Within a lane everyone walks at the lane's one speed in one direction (their steps
// sped up or slowed to match), so gaps never close and nobody collides; neighbouring lanes walk opposite ways.
// Old men keep their own slow lane: their walk is a third of the pace of the others.
const PEOPLE = { man: 1.75, oldman: 1.65, woman: 1.6 };
const LANES = [
  { side: 1, lane: 0, dir: -1, mix: ["man", "woman"], gap: [18, 30] },
  { side: 1, lane: 1, dir: 1, mix: ["man", "woman"], gap: [18, 30] },
  { side: 1, lane: 2, dir: -1, mix: ["oldman"], gap: [35, 50] },
  { side: -1, lane: 0, dir: 1, mix: ["man", "woman"], gap: [18, 30] },
  { side: -1, lane: 1, dir: -1, mix: ["man", "woman"], gap: [18, 30] },
  // no slow lane on the -x footpath: the stall stands on that part of it
] as const;
const WALKWAY = { from: -45, len: 110 }; // pedestrians loop over this z range; the ends are lost in the haze
// People with no skeleton (they cannot be animated) stand about on the footpath's outer edge, facing the road.
const STANDING = { "stand-1": 1.75, "stand-2": 1.58, "stand-3": 1.62 };
const STANDING_PER_SIDE = 4;
// Stall on the right-hand footpath (right as seen from the chase camera, i.e. -x) level with the barricade, on the
// footpath's outer part, clear of the two walking lanes. The keeper is a bust, standing behind the counter.
const STALL = { height: 2.6, keeper: 0.95, keeperBase: 0.75 };
const CREDITS = [
  ["Road", "ahmagh2e", "https://sketchfab.com/3d-models/road--avenue--street-7f657c3eceb343ceaf5e542c50dab27a"],
  ["Barricade", "InnoFrame", "https://sketchfab.com/3d-models/delhi-police-security-barricade-3d-model-f17ecc171f3441ceb0e9effd90f31c1f"],
  ["Runner", "As7 3d models", "https://sketchfab.com/3d-models/spiderman-india-pavitr-prabhakar-ed5f6c5ba8a94c98aee68b5b6ed1f29b"],
  ["House", "bhagathartworks", "https://sketchfab.com/3d-models/indian-house-old-3beb064c1ae841c5beb556b5aa267036"],
  ["House", "nayan pachori", "https://sketchfab.com/3d-models/indian-house-gameasset-3f2b22855bd14cbf877b1ab5f6689582"],
  ["Hut", "magann", "https://sketchfab.com/3d-models/old-hut-1b9c7573ea7b4661814296b20a83a6ae"],
  ["Wall", "saksham12x", "https://sketchfab.com/3d-models/indian-wall-for-hindi-kahaniya-465b9e3c9d2d4a4cbf24fd4fe447eb60"],
  ["Dhaba wall", "saksham12x", "https://sketchfab.com/3d-models/indian-dhaba-wall-02eeca6d50404e769aa9298ce80ca450"],
  ["Man", "pankhkhan", "https://sketchfab.com/3d-models/indian-man-with-red-clothes-23b1805e473d4e5cb3e439b576ca39a9"],
  ["Old man", "anandmohan662", "https://sketchfab.com/3d-models/indian-old-man-walking-e70a140ad4334c2e8648ac78d61545b3"],
  [
    "Woman",
    "Pixel_Monster (Sketchfab Standard licence)",
    "https://sketchfab.com/3d-models/indian-woman-in-saree-b5965a93b03440dea65160f7cbac1fc7",
  ],
  [
    "Man",
    "Gameyan Animations Studio",
    "https://sketchfab.com/3d-models/semi-cartoon-indian-human-3d-character-5720e7e45d21456db1b8d6bb430ccb8d",
  ],
  ["Woman", "dk8026854", "https://sketchfab.com/3d-models/saree-woman-3d-model-bf88ccd60916495b9e81588bf5e00d44"],
  ["Woman", "sam-30", "https://sketchfab.com/3d-models/traditional-indian-saree-model-528f28ebdf214c7d9278b7bdd16292ca"],
  ["Stall", "Cyril43", "https://sketchfab.com/3d-models/medieval-stall-4a5a40e78e4b481bafbb576303f992cd"],
  ["Stall keeper", "chitreshyadav", "https://sketchfab.com/3d-models/modi-ji-e14d0a18080b434c9c28e87c9db485ee"],
  ["Auto", "rSquare", "https://sketchfab.com/3d-models/auto-rickshaw-44776bcb34e04c1a8b9c18a70376304e"],
  ["Tree", "farhad.Guli", "https://sketchfab.com/3d-models/tree-7016d1d32fe748f0a8b3f5eb39374bc4"],
  ["Pine", "evolveduk", "https://sketchfab.com/3d-models/pine-tree-d45218a3fab349e5b1de040f29e7b6f9"],
  ["Birch", "evolveduk", "https://sketchfab.com/3d-models/birch-tree-aa842dffd9654d33b8b91170ce83c172"],
];

export default function RoadJump() {
  const pin = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const ride = useRef<((href: string) => void) | null>(null); // starts the ride to a page, once the scene can play it
  const goTo = useGo(); // stable while home is mounted

  useEffect(() => {
    const el = host.current!;
    // Held here, not read from the refs in the frame loop: navigating away detaches the refs a frame before cleanup.
    const sec = pin.current!;
    const tip = bubble.current!;
    let cleanup = () => {};
    let dead = false;

    (async () => {
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      const load = (n: string) => loader.loadAsync(`/models/${n}.glb`);
      const font = getComputedStyle(document.documentElement).getPropertyValue("--font-bungee").trim() || "Impact";
      // The opening shot needs only these (preloaded by app/page.tsx). Sky: "Kloofendal 48d Partly Cloudy (Pure Sky)"
      // from Poly Haven (CC0), tonemapped and cut to 2048x1024.
      const [road, barricade, man, walker, sky] = await Promise.all([
        load("road"),
        load("barricade"),
        load("jump"),
        load("walk"),
        // decoded off the main thread (an <img> would be decoded on the first frame); ImageBitmaps upload top row first,
        // so v is turned round in place of flipY
        new THREE.ImageBitmapLoader().loadAsync("/sky.jpg").then((bitmap) => {
          const t = new THREE.Texture(bitmap);
          t.flipY = false;
          t.repeat.y = -1;
          t.offset.y = 1;
          t.needsUpdate = true;
          return t;
        }),
        document.fonts.load(`300px ${font}`).catch(() => {}), // the title sign is drawn in it
      ]);
      // The street downloads while the first frame is built, without competing with it for bandwidth.
      const streetNames = [
        ...PROPS.map((p) => p.name),
        ...TREES.map((t) => t.name),
        ...Object.keys(PEOPLE),
        ...Object.keys(STANDING),
        "stall",
        "stall-keeper",
        "auto",
      ];
      const deva = getComputedStyle(document.documentElement).getPropertyValue("--font-yatra").trim() || "serif";
      const streetLoad = Promise.all([
        Promise.all(streetNames.map(load)),
        document.fonts.load(`100px ${deva}`, "चाय").catch(() => {}), // the stall banner's Hindi line
      ]);
      streetLoad.catch(() => {}); // reported where it is awaited
      if (dead) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight); // sized now: each resize reallocates the canvas (~0.15 s)
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      // Sky: the panorama on the inside of a sphere that follows the camera, not scene.background. As a background it
      // is first converted to a cube map, with shaders of its own, on the first frame (~0.4 s); as a mesh its shader
      // compiles with the rest. It is only ever magnified, so it needs no mipmaps (a slower upload).
      sky.colorSpace = THREE.SRGBColorSpace;
      sky.generateMipmaps = false;
      sky.minFilter = THREE.LinearFilter;
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(150, 48, 24).scale(-1, 1, 1), // seen from inside
        new THREE.MeshBasicMaterial({ map: sky, fog: false, depthWrite: false }),
      );
      dome.rotation.y = Math.PI; // lines its seam up where scene.background put it
      dome.renderOrder = -1; // drawn first, behind everything
      dome.frustumCulled = false;
      scene.fog = new THREE.Fog(HAZE, 18, 60);
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
      scene.add(dome);
      scene.add(new THREE.HemisphereLight(0xfff4dc, 0x6b4a2a, 2));
      const sun = new THREE.DirectionalLight(0xffe2a8, 2.5);
      sun.position.set(6, 10, 4);
      scene.add(sun);
      const q = () => new THREE.Quaternion();
      const v3 = () => new THREE.Vector3();
      let seed = 7;
      const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // seeded: the same street every visit

      // Every model's PBR material becomes Lambert, which is cheaper to compile (the road's and barricade's PBR shaders
      // were most of the first frame's wait) and to draw. With no environment to reflect, PBR adds little here: what
      // goes is the glossy highlight and metalness, which without an environment only darkened surfaces towards black.
      // Transparency, cut-outs (leaves), glow and baked shadow carry over. Shared materials stay shared.
      const matte = (root: Object3D) => {
        const made = new Map<THREE.Material, THREE.MeshLambertMaterial>();
        root.traverse((o) => {
          const mesh = o as THREE.Mesh;
          const m = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (!m?.isMeshStandardMaterial) return; // unlit (basic) materials are cheap already
          if (!made.has(m)) {
            const { color, map, normalMap, normalScale, aoMap, aoMapIntensity, emissive, emissiveMap, emissiveIntensity } = m;
            const { alphaMap, alphaTest, transparent, opacity, side, depthWrite, vertexColors, name } = m;
            made.set(m, new THREE.MeshLambertMaterial({ color, map, normalMap, normalScale, aoMap, aoMapIntensity, emissive,
              emissiveMap, emissiveIntensity, alphaMap, alphaTest, transparent, opacity, side, depthWrite, vertexColors, name }));
            m.dispose();
          }
          mesh.material = made.get(m)!;
        });
      };
      matte(road.scene);
      matte(barricade.scene);
      // Road: one tile, cloned along z to run past the fog.
      road.scene.scale.setScalar(ROAD_SCALE);
      const roadBox = new THREE.Box3().setFromObject(road.scene);
      const tileLen = roadBox.getSize(v3()).z;
      for (let i = -6; i < 6; i++) scene.add(road.scene.clone().translateZ(i * tileLen));
      const kerb = roadBox.max.x; // outer edge of the kerb strip
      const kerbTop = roadBox.max.y; // footpath height
      // Bare earth under everything, so gaps beside the road show ground instead of the sky panorama's lower half.
      const earth = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshLambertMaterial({ color: 0x9a8466 }));
      earth.rotation.x = -Math.PI / 2;
      earth.position.y = roadBox.min.y - 0.02; // just under the road
      scene.add(earth);
      // Concrete footpath beyond each kerb, level with its top.
      const concrete = new THREE.MeshLambertMaterial({ color: 0x8f8b84 });
      for (const side of [-1, 1]) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(PAVE, kerbTop - earth.position.y, 400), concrete);
        slab.position.set(side * (kerb + PAVE / 2), (kerbTop + earth.position.y) / 2, 0);
        scene.add(slab);
      }

      // Title: "MERAZ 7.0" painted in the site's display font (Bungee) with a retro block shadow, on a sign standing
      // over the road behind his start. It fills the opening face-on shot; once the camera swings round it is behind it.
      const sign = document.createElement("canvas");
      sign.width = 2048;
      sign.height = 512;
      const ctx = sign.getContext("2d")!;
      ctx.font = `300px ${font}`;
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      const runs = [
        ["MERAZ ", "#d7263d"], // vermillion
        ["7.0", "#0f7c7c"], // teal
      ] as const;
      const widths = runs.map(([t]) => ctx.measureText(t).width);
      const fit = Math.min(1, (sign.width * 0.9) / widths.reduce((a, b) => a + b));
      ctx.font = `${300 * fit}px ${font}`;
      const paint = (dx: number, dy: number, fill?: string) => {
        let x = (sign.width - widths.reduce((a, b) => a + b) * fit) / 2;
        runs.forEach(([t, colour], i) => {
          ctx.fillStyle = fill ?? colour;
          ctx.fillText(t, x + dx, sign.height / 2 + dy);
          if (!fill) ctx.strokeText(t, x, sign.height / 2);
          x += widths[i] * fit;
        });
      };
      for (let d = 18; d > 0; d -= 2) paint(d, d, "#1a1a1a"); // block shadow, down-right
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 10;
      paint(0, 0);
      const signTex = new THREE.CanvasTexture(sign);
      signTex.colorSpace = THREE.SRGBColorSpace;
      signTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const title = new THREE.Mesh(
        new THREE.PlaneGeometry(TITLE.width, (TITLE.width * sign.height) / sign.width),
        new THREE.MeshBasicMaterial({ map: signTex, transparent: true, fog: false }),
      );
      title.position.set(0, TITLE.y, TITLE.z);
      scene.add(title);

      // Scale a model to a height, centre it on x/z with its base on y=0, and wrap it so it turns about that centre.
      const ground = (o: Object3D, height: number) => {
        o.scale.multiplyScalar(height / new THREE.Box3().setFromObject(o).getSize(v3()).y);
        const b = new THREE.Box3().setFromObject(o);
        const m = b.getCenter(v3());
        o.position.sub(v3().set(m.x, b.min.y, m.z));
        return new THREE.Group().add(o);
      };

      // Barricade: already spans the road (x); scaled so its top meets the hand, centred on x/z, feet on y=0.
      const box = new THREE.Box3().setFromObject(barricade.scene);
      barricade.scene.scale.setScalar(HAND_PLANT.y / box.getSize(v3()).y);
      box.setFromObject(barricade.scene);
      const c = box.getCenter(v3());
      barricade.scene.position.set(-c.x, -box.min.y, -c.z);
      const gate = new THREE.Group().add(barricade.scene);
      scene.add(gate);

      // Bones are matched across rigs by name: "mixamorig:Hips_64", "mixamorigHips" and "Hips_01" all key as "Hips".
      const key = (n: string) => n.replace(/_\d+$/, "").replace(/^mixamorig:?/, "");
      const bone = (root: Object3D, n: string) => {
        let found: Object3D | undefined;
        root.traverse((o) => {
          if (!found && (o as THREE.Bone).isBone && key(o.name) === n) found = o;
        });
        return found!;
      };

      // Walk: the Walk clip from three.js's "Soldier" sample (same Mixamo bone names, walks in place), retargeted in
      // world space. The rigs' bones rest at different angles (thighs differ by 180 deg), so copying local rotations
      // twists the legs and drags the cloth. Instead, at every keyframe each soldier bone's turn away from its T-pose
      // is applied to the matching bone's bind pose on the target, then turned back into a local rotation. The target
      // rig must stand at the origin; it keeps its own facing.
      const sol = new Map<string, Object3D>();
      walker.scene.traverse((o) => sol.set(key(o.name), o));
      const sMixer = new THREE.AnimationMixer(walker.scene);
      const sClip = (n: string) => walker.animations.find((a) => a.name === n)!;
      const tpose = sMixer.clipAction(sClip("TPose")).play();
      sMixer.update(0);
      walker.scene.updateMatrixWorld(true);
      const sRestInv = new Map([...sol].map(([n, o]) => [n, o.getWorldQuaternion(q()).invert()]));
      const sRestPos = new Map([...sol].map(([n, o]) => [n, o.getWorldPosition(v3())]));
      tpose.stop();
      const sHips = sol.get("Hips")!;
      const legLen = (pos: (n: string) => THREE.Vector3) => {
        const [a, b, c] = ["LeftUpLeg", "LeftLeg", "LeftFoot"].map(pos);
        return a.distanceTo(b) + b.distanceTo(c);
      };
      const facesPlusZ = (pos: (n: string) => THREE.Vector3) => pos("LeftUpLeg").x > pos("RightUpLeg").x;
      const retarget = (rig: Object3D, clipName = "Walk") => {
        const src = sClip(clipName);
        sMixer.stopAllAction();
        const sAct = sMixer.clipAction(src).play();
        const times = src.tracks.find((t) => t.name.startsWith(sHips.name + "."))!.times;
        // Some clips stand turned: the soldier's Idle faces 44 deg off his Walk and T-pose. Turn the whole clip back so
        // its hips face like the T-pose; otherwise blending walk into idle swings the body round.
        const pelvisYaw = (pos: (n: string) => THREE.Vector3) => {
          const across = pos("LeftUpLeg").sub(pos("RightUpLeg"));
          return Math.atan2(across.z, across.x);
        };
        sAct.time = 0;
        sMixer.update(0);
        walker.scene.updateMatrixWorld(true);
        const off = pelvisYaw((n) => sol.get(n)!.getWorldPosition(v3())) - pelvisYaw((n) => sRestPos.get(n)!.clone());
        const face = q().setFromAxisAngle(v3().set(0, 1, 0), Math.atan2(Math.sin(off), Math.cos(off)));
        rig.updateMatrixWorld(true);
        const ours: Object3D[] = []; // mapped bones, parents before children
        rig.traverse((o) => (o as THREE.Bone).isBone && sol.has(key(o.name)) && ours.push(o));
        // Bind-pose rotation of each bone. Mesh compression folds a scale and offset into the inverse-bind
        // matrices, so only their rotation is trusted; lengths come from the live bones.
        const bind = new Map<Object3D, THREE.Quaternion>();
        rig.traverse((o) => {
          const skel = (o as SkinnedMesh).isSkinnedMesh ? (o as SkinnedMesh).skeleton : undefined;
          skel?.bones.forEach((b, i) => {
            if (bind.has(b)) return;
            const r = q();
            skel.boneInverses[i].clone().invert().decompose(v3(), r, v3());
            bind.set(b, r);
          });
        });
        const livePos = (n: string) => bone(rig, n).getWorldPosition(v3());
        const sPos = (n: string) => sRestPos.get(n)!.clone();
        const k = legLen(livePos) / legLen(sPos);
        // turn the soldier's motion to the target's facing
        const turn = q().setFromAxisAngle(v3().set(0, 1, 0), facesPlusZ(livePos) === facesPlusZ(sPos) ? 0 : Math.PI);
        const turnInv = turn.clone().invert();
        const hips = bone(rig, "Hips");
        const rotations = new Map(ours.map((b) => [b, new Float32Array(times.length * 4)]));
        const hipsPos = new Float32Array(times.length * 3);
        const hipsParentInv = hips.parent!.matrixWorld.clone().invert();
        const world = new Map<Object3D, THREE.Quaternion>();
        times.forEach((t, i) => {
          sAct.time = t;
          sMixer.update(0);
          walker.scene.updateMatrixWorld(true);
          for (const b of ours) {
            const n = key(b.name);
            const d = turn
              .clone()
              .multiply(face)
              .multiply(sol.get(n)!.getWorldQuaternion(q()))
              .multiply(sRestInv.get(n)!)
              .multiply(turnInv);
            if (/(UpLeg|Leg|Foot|ToeBase)$/.test(n)) d.slerp(q(), 1 - STRIDE); // shorter stride, less pull on the cloth
            const w = d.multiply(bind.get(b) ?? b.getWorldQuaternion(q()));
            world.set(b, w);
            const parent = world.get(b.parent!)?.clone() ?? b.parent!.getWorldQuaternion(q());
            parent
              .invert()
              .multiply(w)
              .toArray(rotations.get(b)!, i * 4);
          }
          sHips
            .getWorldPosition(v3())
            .applyQuaternion(face)
            .applyQuaternion(turn)
            .multiplyScalar(k)
            .applyMatrix4(hipsParentInv)
            .toArray(hipsPos, i * 3);
        });
        return new THREE.AnimationClip(clipName, -1, [
          ...ours.map((b) => new THREE.QuaternionKeyframeTrack(`${b.name}.quaternion`, times, rotations.get(b)!)),
          new THREE.VectorKeyframeTrack(`${hips.name}.position`, times, hipsPos),
        ]);
      };
      // Walking speed of an in-place walk, from the stride: the planted foot slides back over its range during
      // stance (~60% of a cycle). setTime poses the rig at a clip time.
      const strideSpeed = (rig: Object3D, setTime: (t: number) => void, duration: number) => {
        const foot = bone(rig, "LeftFoot");
        let lo = Infinity;
        let hi = -Infinity;
        for (let i = 0; i < 24; i++) {
          setTime((i / 24) * duration);
          const fz = foot.getWorldPosition(v3()).z;
          [lo, hi] = [Math.min(lo, fz), Math.max(hi, fz)];
        }
        return (hi - lo) / (0.6 * duration);
      };

      // Runner.
      const rig = man.scene;
      scene.add(rig);
      const hips = bone(rig, "Hips");
      const head = bone(rig, "Head");
      rig.traverse((o) => (o.frustumCulled = false)); // skinned bounds stay at the start pose; root motion carries him out
      // Compiling the opening shot's shaders is the slowest part of the first frame. Start it now, in parallel where the
      // browser can (KHR_parallel_shader_compile), while his clips are prepared below; the first frame waits for it.
      const compiling = renderer.compileAsync(scene, camera);
      const mixer = new THREE.AnimationMixer(rig);
      const clip = man.animations.find((a) => a.name === "Flip jump") ?? man.animations[0];
      const action = mixer.clipAction(clip).play(); // the flip jump

      // Find where the hips peak (apex): framing and the reduced-motion still use it.
      const p = v3();
      const hipsAt = (t: number) => (mixer.setTime(t), rig.updateMatrixWorld(true), hips.getWorldPosition(p).clone());
      let apex = hipsAt(0);
      let apexT = 0;
      for (let t = 0; t < clip.duration; t += clip.duration / 40) {
        const at = hipsAt(t);
        if (at.y > apex.y) [apex, apexT] = [at, t];
      }
      mixer.setTime(0);

      const walkClip = retarget(rig);
      const walk = mixer.clipAction(walkClip).play();
      const idleClip = retarget(rig, "Idle"); // standing, once he stops
      const idle = mixer.clipAction(idleClip).play();

      // Pose the clips by hand: each action gets its own time and weight, then the mixer applies them.
      const pose = (walkT: number, jumpT: number, jumpW: number, idleW = 0, idleT = 0) => {
        walk.time = walkT % walkClip.duration;
        action.time = Math.min(jumpT, clip.duration - 1e-3); // at exactly duration it wraps to 0
        idle.time = idleT % idleClip.duration;
        walk.setEffectiveWeight((1 - jumpW) * (1 - idleW));
        action.setEffectiveWeight(jumpW * (1 - idleW));
        idle.setEffectiveWeight(idleW);
        mixer.update(0);
      };

      const speed = strideSpeed(rig, (t) => pose(t, 0, 0), walkClip.duration);
      const walkTime = WALK_CYCLES * walkClip.duration;
      const walkDist = speed * walkTime;
      const walkOnTime = WALK_ON_CYCLES * walkClip.duration;
      // How far the jump carries the hips past the walk's hips, so walking on picks up where he lands.
      pose(0, clip.duration, 1);
      const landOffset = hips.getWorldPosition(p).z;
      pose(0, 0, 0);
      const landGap = landOffset - hips.getWorldPosition(p).z;
      // Where he stops: the auto pulls up level with this.
      rig.position.z = walkDist + landGap + speed * walkOnTime;
      pose(walkOnTime, clip.duration, 0);
      const stopZ = hips.getWorldPosition(p).z;
      rig.position.z = 0;
      pose(0, 0, 0, 1);
      const standHips = hips.getWorldPosition(p).y;
      pose(0, 0, 0);

      // Sitting, layered on whatever the mixer posed: thighs forward, knees back, about his left-right axis (world x,
      // as he faces +z once seated). Parents first, so each knee bends from its already-raised thigh.
      const sitBones = (["LeftUpLeg", "RightUpLeg", "LeftLeg", "RightLeg"] as const).map(
        (n) => [bone(rig, n), n.endsWith("UpLeg") ? -SIT_BEND.thigh : SIT_BEND.knee] as const,
      );
      const yAxis = v3().set(0, 1, 0);
      const sideAxis = v3();
      const spine = bone(rig, "Spine");
      const turnBone = (b: Object3D, angle: number) => {
        const w = b.getWorldQuaternion(q()).premultiply(q().setFromAxisAngle(sideAxis, angle));
        b.quaternion.copy(b.parent!.getWorldQuaternion(q()).invert().multiply(w));
        b.updateMatrixWorld(true);
      };
      const sitDown = (s: number, lean: number) => {
        sideAxis.set(1, 0, 0).applyAxisAngle(yAxis, rig.rotation.y); // his left-right axis, whichever way he faces
        if (s <= 0 && lean <= 0) return;
        rig.updateMatrixWorld(true);
        for (const [b, angle] of sitBones) turnBone(b, angle * s);
        turnBone(spine, SIT_BEND.duck * lean); // lean forward, head down
      };

      gate.position.set(apex.x, 0, walkDist + HAND_PLANT.z);

      // Re-letter the barricade: it ships with "DELHI POLICE" modelled as text on both faces of its sloped front panel
      // (the compressor merged the two into one mesh). The text is hidden and a painted "BHILAI POLICE" sign laid on
      // each face. The text spans the barricade's width (x), so its plane holds the x axis; its slope comes from a
      // line fit through the vertices seen side-on (y-z).
      gate.updateMatrixWorld(true);
      const letters: THREE.Mesh[] = [];
      barricade.scene.traverse((o) => /^Text/.test(o.name) && (o as THREE.Mesh).isMesh && letters.push(o as THREE.Mesh));
      for (const t of letters) {
        const pos = t.geometry.getAttribute("position");
        const pts = Array.from({ length: pos.count }, (_, i) => v3().fromBufferAttribute(pos, i).applyMatrix4(t.matrixWorld));
        const mid = pts.reduce((s, x) => s.add(x), v3()).divideScalar(pts.length);
        let [yy, zz, yz] = [0, 0, 0];
        for (const x of pts) [yy, zz, yz] = [yy + (x.y - mid.y) ** 2, zz + (x.z - mid.z) ** 2, yz + (x.y - mid.y) * (x.z - mid.z)];
        const slope = 0.5 * Math.atan2(2 * yz, yy - zz); // direction of the text's "up" in the y-z plane
        const up = v3().set(0, Math.cos(slope), Math.sin(slope));
        if (up.y < 0) up.negate();
        const [x0, x1] = [Math.min(...pts.map((x) => x.x)), Math.max(...pts.map((x) => x.x))];
        const along = pts.map((x) => x.clone().sub(mid).dot(up));
        const [v0, v1] = [Math.min(...along), Math.max(...along)];
        const [w, h] = [x1 - x0, v1 - v0];
        const centre = mid
          .clone()
          .setX((x0 + x1) / 2)
          .addScaledVector(up, (v0 + v1) / 2);
        const art = document.createElement("canvas");
        art.width = 1024;
        art.height = Math.round((1024 * h) / w);
        const g2 = art.getContext("2d")!;
        g2.fillStyle = "#" + (t.material as THREE.MeshStandardMaterial).color.getHexString();
        g2.textAlign = "center";
        g2.textBaseline = "middle";
        g2.font = `bold ${art.height}px "Arial Black", Impact, sans-serif`;
        g2.font = `bold ${art.height * Math.min(1, (art.width * 0.98) / g2.measureText("BHILAI POLICE").width)}px "Arial Black", Impact, sans-serif`;
        g2.fillText("BHILAI POLICE", art.width / 2, art.height / 2);
        const tex = new THREE.CanvasTexture(art);
        tex.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshLambertMaterial({ map: tex, transparent: true });
        for (const normal of [v3().set(1, 0, 0).cross(up), v3().set(-1, 0, 0).cross(up)]) {
          const decal = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
          decal.matrix.makeBasis(up.clone().cross(normal), up, normal); // plane x right, y up, z out of the face
          decal.matrix.setPosition(centre.clone().addScaledVector(normal, 0.01)); // just proud of the panel
          decal.matrix.decompose(decal.position, decal.quaternion, decal.scale);
          gate.attach(decal);
        }
        t.visible = false;
      }

      const walkers: { g: Object3D; mixer: THREE.AnimationMixer; z0: number; v: number }[] = [];
      let auto: Object3D | undefined;
      let driverHead: Object3D | undefined;
      let clock = 0;
      const stroll = (dt: number) => {
        clock += dt;
        for (const w of walkers) {
          w.g.position.z = WALKWAY.from + ((((w.z0 + w.v * clock) % WALKWAY.len) + WALKWAY.len) % WALKWAY.len);
          w.mixer.update(dt);
        }
      };
      stroll(0);

      // First he walks toward the camera while it swings from a close-up of his face, round his side, out to a
      // chase position behind him. Then the jump clip plays (blending in from the walk), then he blends back into
      // the walk for two steps and stands. The camera rides behind the hips; x and height stay fixed so the flip does not
      // sway it. Narrow screens pull it back (zoom).
      const lerp = THREE.MathUtils.lerp;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const f = v3();
      let zoom = 1;
      let rideFrom = -1; // performance.now() when a destination was picked
      let rideZ = 0; // how far the auto has gone since
      let rideV = 0;
      const draw = (scrolled: number) => {
        const at = rideFrom < 0 ? scrolled : 1; // once riding, he stays seated whatever the scroll does
        const w = at / ORBIT; // walk progress, keeps running through the blend
        const clamp01 = (x: number) => THREE.MathUtils.clamp(x, 0, 1);
        const jump = clamp01((at - ORBIT) / (LAND - ORBIT));
        const on = clamp01((at - LAND) / (STOP - LAND)); // the two steps after landing
        const back = clamp01((at - LAND) / BLEND); // jump -> walk
        // Boarding, as people get into an auto: no stop. He walks on along a curve that bends him round, a little at
        // a time, until he faces the auto's open side; then ducks into the sitting pose, slides in and back onto the
        // middle of the bench (so his head stays under the roof and his legs fold away), turning forward as he settles.
        const ease = (t: number) => t * t * (3 - 2 * t);
        const board = clamp01((at - STOP) / (SIT - STOP));
        const arc = clamp01(board / 0.45); // walking the curve to the opening
        const arrive = ease(clamp01((board - 0.4) / 0.08)); // walk -> standing as he reaches it
        const sit = ease(clamp01((board - 0.45) / 0.12)); // drop into the sitting pose before reaching the opening
        const slide = ease(clamp01((board - 0.52) / 0.33)); // slide in through the opening and back onto the bench
        const duck = Math.sin(Math.PI * slide); // lean lowest while passing under the roof edge
        const forward = ease(clamp01((board - 0.68) / 0.32)); // turns slowly to face forward as he settles onto the bench
        const autoZ = stopZ + AUTO.ahead + rideZ;
        const bob = 0.012 * Math.sin(rideZ * 3) * Math.min(rideV / 3, 1); // the road under a moving auto
        const seat = v3().set(apex.x + AUTO.x, 0, autoZ + SEAT.z); // middle of the bench
        const door = v3().set(seat.x - SEAT.outside, 0, autoZ + SEAT.entry); // where he arrives outside the opening
        // The curve: a cubic from his last step (heading +z) to the opening (heading +x), relative to his last step.
        const end = v3().set(door.x - apex.x, 0, door.z - stopZ);
        const bend = 0.55 * Math.min(end.x, end.z);
        const curve = (t: number) => {
          const [b, cc, d] = [3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3]; // control points (0,0) (0,bend) (end.x-bend,end.z) end
          return v3().set(cc * (end.x - bend) + d * end.x, 0, b * bend + (cc + d) * end.z);
        };
        const along = curve(arc);
        const heading = curve(Math.min(arc + 0.01, 1)).sub(curve(Math.max(arc - 0.01, 0))); // direction of travel
        const arcLen = Array.from({ length: 8 }, (_, i) => curve((i + 1) / 8).distanceTo(curve(i / 8))).reduce((s, d) => s + d);
        rig.rotation.y = (arc < 1 ? Math.atan2(heading.x, heading.z) : Math.PI / 2) - (Math.PI / 2) * forward;
        rig.position.set(
          along.x + SEAT.outside * slide,
          (SEAT.hips - standHips) * sit + bob,
          Math.min(w, 1) * walkDist + back * landGap + speed * on * walkOnTime + along.z + (seat.z - door.z) * slide,
        );
        pose(
          on > 0 ? on * walkOnTime + (arc * arcLen) / speed : w * walkTime,
          jump * clip.duration,
          clamp01((at - ORBIT) / BLEND) * (1 - back),
          arrive,
          Math.max(0, at - STOP) * 20, // idle sways on once he has stopped walking
        );
        sitDown(sit, duck);
        // Pin him to the middle of the bench as he slides on (turning about the rig's origin would shift him).
        if (slide > 0) {
          const hp = hips.getWorldPosition(v3());
          rig.position.x += (seat.x - hp.x) * slide;
          rig.position.z += (seat.z - hp.z) * slide;
          rig.updateMatrixWorld(true);
        }
        // The auto sets off from behind when he jumps and slows into its stop just ahead of him as he lands his steps.
        const drive = clamp01((at - ORBIT) / (STOP - ORBIT));
        if (auto) {
          auto.visible = at > ORBIT;
          auto.position.z = lerp(walkDist - AUTO.behind, autoZ, 1 - (1 - drive) ** 2);
          auto.position.y = bob;
        }
        const o = Math.min(w, 1);
        const u = o * o * (3 - 2 * o); // ease in and out of the swing
        const z = hips.getWorldPosition(p).z;
        head.getWorldPosition(f);
        // Swing round a pivot that slides from his face to the chase line along the road; the jump pushes it in.
        const push = ease(clamp01((at - ORBIT) / 0.06));
        const x = lerp(f.x, apex.x, u);
        const pz = lerp(f.z, z, u);
        const r = lerp(1.4 * zoom, 7 * zoom, u) * lerp(1, CAMERA.push, push);
        const a = Math.PI * u; // 0 = in front of him (he faces +z), PI = behind
        // sideways reach stays inside the kerb so the swing never passes through a house
        camera.position.set(
          x + Math.min(r * Math.sin(a), kerb - 0.5),
          lerp(f.y, 1 + 1.2 * zoom * lerp(1, CAMERA.push, push), u),
          pz + r * Math.cos(a),
        );
        const aim = v3().set(x, lerp(f.y + 1.4 * zoom * TITLE.tilt, lerp(0.8, CAMERA.aim, push), u), pz + 1.5 * u);
        // Boarding camera: as he curves round to the auto it moves in just behind his head, looking where he looks; as he
        // takes his first step in (starts to sit) it cuts into his eyes, wide lens, and stays there: in through the
        // open side, onto the bench, then over the driver down the road.
        const facing = v3().set(Math.sin(rig.rotation.y), 0, Math.cos(rig.rotation.y));
        const behind = ease(clamp01(board / 0.3));
        const eyes = ease(clamp01((board - 0.45) / 0.05));
        const nape = f
          .clone()
          .addScaledVector(facing, -CAMERA.behind)
          .setY(f.y + CAMERA.over);
        const gaze = f
          .clone()
          .addScaledVector(facing, 3)
          .setY(f.y - 0.3);
        // Eyes ride on his hips, not his head: ducking tips the head into the bench and the auto's side. Hips to eyes is
        // about 0.5 m standing or seated; lift raises the view once seated, to see over the driver to the handlebar.
        const hp = hips.getWorldPosition(v3());
        const eye = hp.addScaledVector(facing, CAMERA.eye).setY(hp.y + 0.5 + CAMERA.lift * sit);
        eye.x = lerp(eye.x, seat.x, forward); // once he faces forward, look from the middle of the auto, down its centre line
        const ahead = eye
          .clone()
          .addScaledVector(facing, 5)
          .setY(eye.y - 0.4);
        ahead.x = lerp(ahead.x, seat.x, forward);
        camera.position.lerp(nape, behind).lerp(eye, eyes);
        aim.lerp(gaze, behind).lerp(ahead, eyes);
        rig.visible = eyes < 0.05; // the eye camera sits inside him: hide him as soon as it cuts in
        // wider in his eyes, to take in the auto and the road ahead; wider still as the ride picks up speed
        const fov = lerp(40, CAMERA.eyeFov, eyes) + RIDE.fov * Math.min(rideV / 10, 1);
        if (camera.fov !== fov) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }
        camera.lookAt(aim);
        dome.position.copy(camera.position);
        renderer.render(scene, camera);
        // Driver's question and the destinations: shown by data attributes on the section, styled in the markup.
        // Reduced motion never scrolls, so its destinations stay up; once riding, the question and destinations go.
        const riding = rideFrom >= 0;
        const [ask, go] = riding ? [false, false] : [!reduce && at >= ASK, reduce || at >= GO];
        if (sec.hasAttribute("data-ask") !== ask) sec.toggleAttribute("data-ask", ask);
        if (sec.hasAttribute("data-go") !== go) sec.toggleAttribute("data-go", go);
        const moved = reduce || at > 0.02; // the scroll hint goes once scrolling starts (reduced motion has none)
        if (sec.hasAttribute("data-moved") !== moved) sec.toggleAttribute("data-moved", moved);
        if (ask && driverHead) {
          const s = driverHead.getWorldPosition(v3()).project(camera); // the bubble's tail points at the top of his head
          tip.style.setProperty("--x", `${((s.x + 1) / 2) * el.clientWidth}px`);
          tip.style.setProperty("--y", `${((1 - s.y) / 2) * el.clientHeight}px`);
        }
      };

      let progress = 0;
      const resize = () => {
        const size = renderer.getSize(new THREE.Vector2());
        if (size.x !== el.clientWidth || size.y !== el.clientHeight) renderer.setSize(el.clientWidth, el.clientHeight);
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        zoom = Math.max(1, 0.8 / camera.aspect);
        // shrink the title sign if the opening shot is too narrow to show all of it
        const seen = 2 * (1.4 * zoom - TITLE.z) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
        title.scale.setScalar(Math.min(1, (0.9 * seen) / TITLE.width));
        draw(progress);
      };
      // Upload the textures while the shaders compile, rather than in the first frame.
      scene.traverse((o) => {
        for (const m of [(o as THREE.Mesh).material ?? []].flat())
          for (const v of Object.values(m)) if ((v as THREE.Texture | null)?.isTexture) renderer.initTexture(v);
      });
      await Promise.all([compiling, renderer.compileAsync(gate, camera, scene)]); // with the lettering added since
      if (dead) {
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      if (reduce) progress = ORBIT + (LAND - ORBIT) * (apexT / clip.duration); // still frame mid-flip over the barricade
      resize();
      // Pin the section and scrub the beats across 6 screens of scrolling; the frame loop draws them.
      const st = reduce
        ? null
        : ScrollTrigger.create({
            trigger: pin.current,
            start: "top top",
            end: "+=600%",
            pin: true,
            scrub: true,
            onUpdate: (self) => (progress = self.progress),
          });
      // Pedestrians need a frame loop; run it only while the section is on screen (and never for reduced motion).
      let last = 0;
      const io = new IntersectionObserver(([e]) => {
        last = performance.now();
        renderer.setAnimationLoop(
          e.isIntersecting && !reduce
            ? (now) => {
                stroll(Math.min((now - last) / 1000, 0.1));
                last = now;
                if (rideFrom >= 0) {
                  const t = (now - rideFrom) / 1000;
                  [rideZ, rideV] = [0.5 * RIDE.accel * t * t, RIDE.accel * t];
                }
                draw(progress);
              }
            : null,
        );
      });
      io.observe(el);
      // The ride needs the frame loop, so reduced motion leaves ride unset and the links navigate as usual.
      let rideTimer = 0;
      if (!reduce)
        ride.current = (href) => {
          if (rideFrom >= 0) return;
          rideFrom = performance.now();
          rideTimer = window.setTimeout(() => goTo(href, "white"), RIDE.fade * 1000);
        };

      cleanup = () => {
        ride.current = null;
        clearTimeout(rideTimer);
        io.disconnect();
        renderer.setAnimationLoop(null);
        st?.kill(true);
        ro.disconnect();
        mixer.stopAllAction();
        walkers.forEach((w) => w.mixer.stopAllAction());
        sMixer.stopAllAction();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            [o.material].flat().forEach((m) => m.dispose());
          }
        });
        signTex.dispose();
        sky.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };

      // The street: everything else, added in one go once it has landed (shaders compiled off the main path first).
      const [streetModels] = await streetLoad;
      if (dead) return;
      const model = (n: string) => streetModels[streetNames.indexOf(n)];
      for (const m of streetModels) matte(m.scene);
      // The street's ~20 shader programs take about a second to compile. Start them now, from the models as loaded
      // (clones share their materials), so they compile while the street is laid out below rather than after.
      const streetCompiling = Promise.all(streetModels.map((m) => renderer.compileAsync(m.scene, camera, scene)));
      const street = new THREE.Group();
      // Roadside: props laid along both footpaths in a seeded random order, end to end with fronts on one line.
      const kinds = PROPS.map((p) => ({ ...p, model: ground(model(p.name).scene, p.size) }));
      const total = PROPS.reduce((s, p) => s + p.weight, 0);
      const pick = () => {
        let r = rand() * total;
        return kinds.find((k) => (r -= k.weight) < 0) ?? kinds[0];
      };
      for (const side of [-1, 1]) {
        for (let z = STREET.from; z < STREET.to;) {
          const k = pick();
          const g = k.model.clone();
          g.rotation.y = k.front - (side * Math.PI) / 2; // front toward the road
          const size = new THREE.Box3().setFromObject(g).getSize(v3());
          g.position.set(side * (kerb + PAVE + size.x / 2), 0, z + size.z / 2);
          street.add(g);
          z += size.z;
        }
      }

      // Trees: at random spots along the footpath's outer edge, random turn and size.
      const trees = TREES.map((t) => ground(model(t.name).scene, t.size));
      const edgeTaken: number[][] = [[], []]; // z of everything on each outer edge, so standing people keep clear
      const edgeTrees: { t: Object3D; side: number; z: number }[] = [];
      for (const side of [-1, 1]) {
        for (let z = STREET.from + rand() * 10; z < STREET.to; z += 9 + rand() * 14) {
          const t = trees[Math.floor(rand() * trees.length)].clone();
          edgeTaken[(side + 1) / 2].push(z);
          edgeTrees.push({ t, side, z });
          t.position.set(side * (kerb + EDGE_X), kerbTop, z);
          t.rotation.y = rand() * Math.PI * 2;
          t.scale.setScalar(0.85 + rand() * 0.3);
          street.add(t);
        }
      }

      // Stall: counter facing the road (it faces +x as modelled), back against the house line, level with the barricade.
      const stall = ground(model("stall").scene, STALL.height);
      const stallSize = new THREE.Box3().setFromObject(stall).getSize(v3());
      const depth = stallSize.x;
      stall.position.set(-(kerb + PAVE - depth / 2), kerbTop, gate.position.z);
      street.add(stall);
      // clear the trees from its spot, and keep standing people off it
      const stallZ = stall.position.z;
      for (const { t, side, z } of edgeTrees) if (side < 0 && Math.abs(z - stallZ) < stallSize.z / 2 + 1.5) street.remove(t);
      edgeTaken[0].push(stallZ - stallSize.z / 2, stallZ, stallZ + stallSize.z / 2);
      // Banner on the front of the counter, below the keeper, facing the road: a painted board in the site's retro style.
      const board = document.createElement("canvas");
      board.width = 1024;
      board.height = 300;
      const bc = board.getContext("2d")!;
      bc.fillStyle = "#f2c14e"; // turmeric
      bc.fillRect(0, 0, board.width, board.height);
      bc.strokeStyle = "#1a1a1a";
      bc.lineWidth = 16;
      bc.strokeRect(8, 8, board.width - 16, board.height - 16);
      bc.textAlign = "center";
      bc.textBaseline = "middle";
      bc.font = `120px ${font}`;
      bc.font = `${120 * Math.min(1, 900 / bc.measureText("CHAI KI TAPRI").width)}px ${font}`;
      bc.fillStyle = "#1a1a1a";
      bc.fillText("CHAI KI TAPRI", board.width / 2 + 6, 112 + 6); // block shadow
      bc.fillStyle = "#d7263d"; // vermillion
      bc.fillText("CHAI KI TAPRI", board.width / 2, 112);
      bc.font = `72px ${deva}`;
      bc.fillStyle = "#1a1a1a";
      bc.fillText("चाय की टपरी", board.width / 2, 222);
      const boardTex = new THREE.CanvasTexture(board);
      boardTex.colorSpace = THREE.SRGBColorSpace;
      const bannerW = stallSize.z * 0.85;
      const banner = new THREE.Mesh(
        new THREE.PlaneGeometry(bannerW, (bannerW * board.height) / board.width),
        new THREE.MeshLambertMaterial({ map: boardTex, side: THREE.DoubleSide }),
      );
      banner.rotation.y = Math.PI / 2; // plane faces +z; turn it to the road (+x)
      banner.position.set(stall.position.x + stallSize.x / 2 + 0.03, kerbTop + 0.55, stallZ);
      street.add(banner);
      const keeper = ground(model("stall-keeper").scene, STALL.keeper);
      keeper.rotation.y = Math.PI / 2; // faces +z as modelled; turn him to the road (+x)
      keeper.position.set(stall.position.x - depth * 0.2, kerbTop + STALL.keeperBase, stall.position.z);
      street.add(keeper);

      auto = ground(model("auto").scene, AUTO.height); // faces +z as modelled, the way he walks
      auto.position.x = apex.x + AUTO.x;
      street.add(auto);

      // Pedestrians. Man and old man walk with their own clips, root motion stripped so the lane sets the pace; the
      // woman's own clip is an idle, so she borrows the soldier walk like the runner.
      const types = Object.fromEntries(
        Object.entries(PEOPLE).map(([who, height]) => {
          const g = ground(model(who).scene, height);
          g.updateMatrixWorld(true);
          const m = new THREE.AnimationMixer(g);
          let walkOf: THREE.AnimationClip;
          let pace: number;
          let yaw: number;
          if (who === "woman") {
            walkOf = retarget(g);
            const a = m.clipAction(walkOf).play();
            pace = strideSpeed(g, (t) => ((a.time = t), m.update(0)), walkOf.duration);
            yaw = facesPlusZ((n) => bone(g, n).getWorldPosition(v3())) ? 0 : Math.PI;
          } else {
            walkOf = model(who).animations[0];
            m.clipAction(walkOf).play();
            const hz = (t: number) => (m.setTime(t), bone(g, "Hips").getWorldPosition(v3()).z);
            const travel = hz(walkOf.duration - 1e-3) - hz(0);
            pace = Math.abs(travel) / walkOf.duration;
            yaw = travel > 0 ? 0 : Math.PI;
            // strip the forward drift from the hips track so he walks in place
            const track = walkOf.tracks.find((t) => t.name.endsWith(".position") && key(t.name.slice(0, -9)) === "Hips")!;
            const [v, tt] = [track.values, track.times];
            const n = tt.length;
            for (let i = 0; i < n; i++)
              for (let a = 0; a < 3; a++) v[i * 3 + a] -= ((v[(n - 1) * 3 + a] - v[a]) * (tt[i] - tt[0])) / (tt[n - 1] - tt[0]);
          }
          // Set the feet on the ground mid-walk: the bind pose the model was grounded in stands at another height.
          const a = m.clipAction(walkOf).play();
          let low = Infinity;
          for (let i = 0; i < 6; i++) {
            a.time = (i / 6) * walkOf.duration;
            m.update(0);
            g.updateMatrixWorld(true);
            low = Math.min(low, new THREE.Box3().setFromObject(g, true).min.y);
          }
          g.children[0].position.y -= low;
          m.stopAllAction();
          return [who, { model: g, clip: walkOf, pace, yaw }];
        }),
      );
      for (const lane of LANES) {
        const speed = lane.mix.reduce((s, who) => s + types[who].pace, 0) / lane.mix.length; // the lane's one speed
        const [gapMin, gapMax] = lane.gap;
        // random gaps; the one across the wrap is kept at least gapMin too
        for (let z = rand() * gapMin; z < WALKWAY.len - gapMin; z += gapMin + rand() * (gapMax - gapMin)) {
          const t = types[lane.mix[Math.floor(rand() * lane.mix.length)]];
          const g = cloneRig(t.model);
          g.position.set(lane.side * (kerb + LANE_X[lane.lane]), kerbTop, 0);
          g.rotation.y = t.yaw + (lane.dir > 0 ? 0 : Math.PI);
          const m = new THREE.AnimationMixer(g);
          m.clipAction(t.clip).play().timeScale = speed / t.pace; // steps match the lane speed, so feet do not slide
          m.setTime(rand() * t.clip.duration); // out of step with each other
          walkers.push({ g, mixer: m, z0: z, v: lane.dir * speed });
          street.add(g);
        }
      }
      // Driver: a copy of the old man (the walking man's texture shows white seams up close), held mid-stride, then
      // posed seated by pointing each limb bone (at its child bone) along a direction: back leant forward, thighs along
      // the seat, shins down, arms reaching to the grips.
      const driver = cloneRig(types.oldman.model);
      driver.rotation.y = types.oldman.yaw; // face +z, the way the auto drives
      driver.scale.setScalar(DRIVER.scale);
      auto.add(driver);
      auto.updateMatrixWorld(true);
      const pointBone = (n: string, child: string, dir: THREE.Vector3) => {
        const b = bone(driver, n);
        const from = bone(driver, child).getWorldPosition(v3()).sub(b.getWorldPosition(v3())).normalize();
        const w = b.getWorldQuaternion(q()).premultiply(q().setFromUnitVectors(from, dir.clone().normalize()));
        b.quaternion.copy(b.parent!.getWorldQuaternion(q()).invert().multiply(w));
        b.updateMatrixWorld(true);
      };
      const dHips = bone(driver, "Hips");
      driver.position.add(auto.localToWorld(v3().set(0, DRIVER.hips, DRIVER.z)).sub(dHips.getWorldPosition(v3())));
      driver.updateMatrixWorld(true);
      // Straighten each link of the back (the walk pose curls it), then hold the head up, looking down the road.
      const lean = v3().set(0, Math.cos(DRIVER.lean), Math.sin(DRIVER.lean));
      for (const [n, child] of [["Spine", "Spine1"], ["Spine1", "Spine2"], ["Spine2", "Neck"]]) pointBone(n, child, lean);
      for (const [n, child] of [["Neck", "Head"], ["Head", "HeadTop_End"]]) pointBone(n, child, v3().set(0, 1, 0.1));
      for (const s of ["Left", "Right"]) {
        const side = Math.sign(bone(driver, `${s}UpLeg`).getWorldPosition(v3()).x - dHips.getWorldPosition(v3()).x);
        pointBone(`${s}UpLeg`, `${s}Leg`, v3().set(side * 0.15, 0, 1)); // knees a little apart
        pointBone(`${s}Leg`, `${s}Foot`, v3().set(0, -1, DRIVER.shin));
        // Arm: two-bone reach, elbow bent down and out, so the wrist lands on the grip (or as near as the arm allows).
        const [arm, fore, hand] = [`${s}Arm`, `${s}ForeArm`, `${s}Hand`].map((n) => bone(driver, n).getWorldPosition(v3()));
        const [a, b] = [arm.distanceTo(fore), fore.distanceTo(hand)];
        const grip = auto.localToWorld(v3().set(side * DRIVER.grip.x, DRIVER.grip.y, DRIVER.grip.z));
        const toGrip = grip.clone().sub(arm);
        const d = Math.min(toGrip.length(), (a + b) * 0.999);
        const reach = toGrip.normalize();
        const out = v3().set(side * 0.5, -1, 0);
        const bendDir = out.sub(reach.clone().multiplyScalar(out.dot(reach))).normalize();
        const elbow = Math.acos(THREE.MathUtils.clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
        pointBone(`${s}Arm`, `${s}ForeArm`, reach.clone().multiplyScalar(Math.cos(elbow)).addScaledVector(bendDir, Math.sin(elbow)));
        pointBone(`${s}ForeArm`, `${s}Hand`, grip.sub(bone(driver, `${s}ForeArm`).getWorldPosition(v3())));
      }
      driverHead = bone(driver, "HeadTop_End");

      // Standing people: random spots on the outer edges, at least 1.5 m from trees and each other, facing the road.
      const standing = Object.entries(STANDING).map(([n, height]) => ground(model(n).scene, height));
      for (const side of [-1, 1]) {
        const taken = edgeTaken[(side + 1) / 2];
        for (let placed = 0, tries = 0; placed < STANDING_PER_SIDE && tries < 50; tries++) {
          const z = WALKWAY.from + rand() * WALKWAY.len;
          if (taken.some((t) => Math.abs(t - z) < 1.5)) continue;
          taken.push(z);
          const s = standing[Math.floor(rand() * standing.length)].clone();
          s.position.set(side * (kerb + EDGE_X), kerbTop, z);
          s.rotation.y = (-side * Math.PI) / 2 + (rand() - 0.5) * 0.8; // roughly toward the road
          street.add(s);
          placed++;
        }
      }
      await Promise.all([streetCompiling, renderer.compileAsync(street, camera, scene)]); // and the banner's
      if (dead) return;
      scene.add(street);
      stroll(0);
      draw(progress); // place the auto and walkers now; without the frame loop (reduced motion) nothing else would
    })().catch((e) => console.error("RoadJump:", e));

    return () => {
      dead = true;
      cleanup();
    };
  }, []);

  return (
    // GSAP wraps the pinned section in a spacer; this outer div is what React removes on unmount.
    <div>
      <section ref={pin} aria-label="Flip over the barricade" className="group relative h-[100dvh] overflow-hidden bg-cream">
        <div
          ref={host}
          role="img"
          aria-label="A runner flip-jumps over a Delhi Police barricade on a city road"
          className="absolute inset-0"
        />
        {/* The driver's question, pinned above his head by the frame loop (--x, --y); kept clear of the screen top. */}
        <div
          ref={bubble}
          aria-hidden="true"
          className="pointer-events-none absolute left-[var(--x,50%)] top-[max(var(--y,40%),6.5rem)] z-[2] origin-bottom-left -translate-x-6 -translate-y-[calc(100%_+_1.25rem)] scale-0 opacity-0 transition-[scale,opacity] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-data-[ask]:scale-100 group-data-[ask]:opacity-100"
        >
          <p className="relative whitespace-nowrap border-4 border-ink bg-cream px-4 py-2 font-display text-lg shadow-[5px_5px_0_var(--color-ink)] sm:text-2xl">
            Bhaiya! Where to go?
            {/* tail, pointing down at his head */}
            <span className="absolute -bottom-[14px] left-4 size-5 rotate-45 border-b-4 border-r-4 border-ink bg-cream" />
          </p>
        </div>
        {/* Destinations: the nav links as signboards, coming up one after another. */}
        <nav aria-label="Main" className="absolute inset-x-3 bottom-14 z-[2] sm:bottom-16">
          <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {navLinks.map((l, i) => (
              <li
                key={l.href}
                style={{ transitionDelay: `${i * 70}ms` }}
                className="invisible translate-y-6 opacity-0 transition-all duration-300 group-data-[go]:visible group-data-[go]:translate-y-0 group-data-[go]:opacity-100"
              >
                <TLink
                  href={l.href}
                  onClick={(e) => {
                    // a plain click rides there; modifier clicks (new tab etc.) and no scene fall through to the link
                    if (!ride.current || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    ride.current(l.href);
                  }}
                  className="flex min-h-12 flex-col items-center border-4 border-ink bg-marigold px-4 py-1.5 shadow-[4px_4px_0_var(--color-ink)] transition-[translate,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none sm:px-6"
                >
                  <span className="font-display text-base sm:text-xl">{l.label}</span>
                  <span className="font-deva text-sm text-rani-deep" aria-hidden="true">
                    {l.hindi}
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        {/* Scroll hint: up from the first paint (before the scene loads), gone once scrolling starts. */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2 border-4 border-ink bg-ink px-4 py-2 font-mono text-sm font-bold tracking-widest text-turmeric shadow-[4px_4px_0_var(--color-marigold)] transition-opacity duration-300 group-data-[moved]:opacity-0"
        >
          SCROLL
          <ArrowDown size={18} weight="bold" className="motion-safe:animate-bounce" />
        </p>
        {/* CC BY 4.0 requires credit */}
        <p className="absolute bottom-2 left-3 right-3 z-[1] font-mono text-[10px] text-ink/70">
          Models (CC BY 4.0 unless noted):{" "}
          {CREDITS.map(([what, who, href], i) => (
            <span key={href}>
              {i > 0 && " · "}
              <a className="underline" href={href}>
                {what}
              </a>{" "}
              by {who}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
