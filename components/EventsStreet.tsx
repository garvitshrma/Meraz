"use client";

// Events page: Spider-Man (the home page's runner) walks into a night mela, a street of festival stalls, with the
// camera behind him. Scrolling takes him to five stalls in turn, right and left: at each he turns to face it and the
// camera swings round past his shoulder onto the stall's back wall, where that category's page hangs. The pages are
// real HTML (CSS3DRenderer), so their carousels and register links work as on the old panels.
// The pages sit in a layer under the WebGL canvas, and each wall is drawn into the canvas as a transparent hole: a
// page shows exactly where its wall is visible, and the stall's poles, the counter and Spider-Man still pass in front.
// Around the street, the mela: giant wheels turning and lit up, near and far on both sides, fireworks going up past
// them, under a full moon. These, and his idling, run in a frame loop while the scene is on screen.
// Reduced motion (or a failed load) gets the category panels instead.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { X } from "@phosphor-icons/react";
import { eventCategories, type EventCategory } from "@/data/events";
import { boothModel, streetModel, wheelModel } from "@/data/site";
import EventsPanels, { Carousel, CategoryContent, tones } from "./EventsPanels";
import { getLenis, jumpScroll } from "./ScrollFx";
import { matte, soldier, strideSpeed } from "./rig";
import { HAZE, fireworkShows, glowDot, nightSky, type Show } from "./night";

gsap.registerPlugin(ScrollTrigger);

// The street (events.glb, a festival-stalls scene cut down at build time from 97 MB to 0.7 MB) is modelled at 1/S life size, so
// scaled by S it is in metres. Its stone path runs along +x from the fox statues at the entrance; walking down it the
// left-hand stalls are on -z, the right-hand ones on +z. Everything below is in model units, measured by raycasting.
const S = 4.5;
// The stalls, in walking order, one per category in eventCategories' order, alternating right (+z) and left, packed
// side by side from the entrance; the path and its lanterns end just past them. Left: two of the street's own stalls
// (all its others, and every shop sign and ware, were cut out at build time), at the middle of the back curtain (x)
// and its face (z, just in front of the cloth). Right (no z): booth.glb's booths, x their middles.
const STALLS: { x: number; z?: number }[] = [{ x: -1.12 }, { x: -1.16, z: -0.588 }, { x: -0.56 }, { x: -0.63, z: -0.667 }, { x: -0.03 }];
// A street stall's page covers its curtain from just above the counter to the curtain's top, w wide (the narrowest
// booth less its poles).
const WALL = { w: 0.33, bottom: 0.19, top: 0.33 };
// booth.glb (a market booth, its grey floor slab cut at build time): counter at the front (its -x), bamboo back wall
// at x 1.40, a shelf on it at 1.22 up, in its own metres. Scaled by scale it fits the street's booth spacing; its
// middle stands out metres from the path's middle, turned to face the path. Its page hangs on the back wall above
// the shelf: middle at page (just off the bamboo), h tall, as wide as a street stall's page is for its height.
const BOOTH = { scale: 0.82, out: 2.25, page: new THREE.Vector3(1.38, 1.83, -0.05), h: 1.05 };
// His walk starts (and, coming back, turns round) at start, past the fox statues; top: the stones' top. At a stall he stands
// stand out from the middle towards it, aside further along than its middle (so the camera, swinging in to the page
// from behind him, passes beside him, not through him).
const PATH = { start: -2.7, top: 0.01, stand: 0.17, aside: 0.18 }; // aside: by the booth's pole, out of a narrow screen's view of the page
// Scroll: metres walked per screen, and screens spent turning (to a stall and away again) and holding on each page.
const PACE = { metres: 4, turn: 0.5, hold: 0.7, start: 0.15 };
// A stall button's trip, played in time: walking at pace times his natural pace, each turn taking turn seconds.
const TRIP = { pace: 1.6, turn: 0.9 };
const STRIDE = 0.7; // as on the home page: a long stride stretches the dhoti
// Chase camera, metres: behind him along the street, the way he is going (not along his zig-zag, which would swing
// it into the stall he just left), halfway from him to the path's middle, at height up: under the paper lanterns over the path (their
// bottoms are 1.76 m up). It looks ahead of him, at height aim.
const CHASE = { back: 2, up: 1.6, ahead: 3, aim: 1.3, fov: 45 };
// Facing a page: it fills fill.w of the screen's width, or fill.h of its height below the nav bar, whichever is
// smaller. A narrow screen would put the camera across the street, so it stops max metres out and widens its lens.
const HOLD = { fill: { w: 0.86, h: 0.8 }, max: 3 };
const COMPACT = 720; // pages narrower than this on screen (phones, portrait tablets) show a summary that opens the full page in a dialog
// Giant wheels (wheel.glb, a wheel with its ticket booth, its base slab cut at build time, turning by its own 21 s
// animation), height metres tall, in metres, both sides of the street and in view whichever way he walks: ahead, one
// near on the left and one far on the right; behind the entrance, one near on the right and one far on the left. Each
// is turned to face the street's middle at face, and starts t seconds into its turn.
const WHEEL = { height: 24, face: new THREE.Vector3(-5, 0, 0) };
const WHEELS = [
  { x: 24, z: -13, t: 0 },
  { x: 70, z: 24, t: 3 },
  { x: -32, z: 13, t: 7 },
  { x: -76, z: -24, t: 12 },
];
// Lit up: each wheel material glows with its own colour, glow times as bright (the rims and spokes most), and a ring
// of bulbs runs round each rim, every third one lit in turn, chase times a second.
const GLOW: Record<string, number> = { Wheel_1: 1.2, wheel_2: 1.2, Giant_Wheel: 0.9, boxes_13579: 0.55, Boxes_246810: 0.55, pillers: 0.3 };
const BULBS = { count: 48, size: 1.3, chase: 6, colours: [0xfff1c1, 0xff4fa3, 0x19d3c5, 0xffb627] };
// The full moon (see night.ts): el degrees up, straight down the street, size degrees across (big: a festival moon),
// in an aura aura times as wide.
const MOON = { el: 12, size: 4, tint: 0xe8e6da, aura: 4 };
// Fireworks (see night.ts), out past the wheels ahead and behind, so they burst over the stalls either way.
const SHOWS: Show[] = [
  { at: [95, -5, -50], scale: 1.1, speed: 2.3, gap: 1.5 },
  { at: [110, -5, 45], scale: 1.2, speed: 2.1, gap: 2.5 },
  { at: [80, -5, 5], scale: 1, speed: 2.4, gap: 1 },
  { at: [-95, -5, 50], scale: 1.1, speed: 2.3, gap: 2 },
  { at: [-110, -5, -45], scale: 1.2, speed: 2.2, gap: 3 },
  { at: [-80, -5, -5], scale: 1, speed: 2.5, gap: 1.5 },
];
// The paper lanterns over the path came lettered 御祭禮 in their texture; they are relettered in Hindi, the words
// spaced round each lantern so one faces every way, in the site's Devanagari face. The lantern's side is the texture's
// rows 0-300, upside down (row 0 is its foot): pink stripes, the old letters in a column at x 440-600 (covered with a
// clean strip of the same stripes from x 100), the new words across the middle at row y, size px tall.
const LANTERN = { words: ["मेला", "मेराज़", "उत्सव"], y: 150, size: 110, colour: "#2a0a12" };

const aspect = WALL.w / (WALL.top - WALL.bottom);
const smooth = (t: number, a = 0, b = 1) => THREE.MathUtils.smoothstep(t, a, b);
const turnTo = (a: number, b: number, t: number) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t; // the short way round

// heading: the way he faces, chase: the way the chase camera looks (down the street or back up it), both as angles
// of (sin, 0, cos).
type Frame = { pos: THREE.Vector3; heading: number; chase: number; walked: number; walking: number; stall: number; push: number };

export default function EventsStreet() {
  const pin = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const bar = useRef<HTMLElement>(null);
  const jumps = useRef<(HTMLButtonElement | null)[]>([]);
  const goTo = useRef<((k: number) => void) | null>(null); // walks him to stall k, once the scene can
  const [walls, setWalls] = useState<HTMLDivElement[]>([]);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState<EventCategory | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setFallback(true);
    const el = host.current!;
    const under = layer.current!;
    const sec = pin.current!;
    // The pages' elements: CSS3DRenderer places them, React renders into them (portals below).
    const pages = STALLS.map(() => {
      const d = document.createElement("div");
      d.inert = true;
      return d;
    });
    setWalls(pages);
    let cleanup = () => {};
    let dead = false;

    (async () => {
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      // The sky and the fireworks' shell don't hold up the first frame.
      const skyLoad = new THREE.ImageBitmapLoader().loadAsync("/sky.jpg"); // decoded off the main thread
      skyLoad.catch(() => {}); // reported where it is used
      const shellLoad = fetch("/models/fireworks.bin").then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)));
      shellLoad.catch(() => {}); // reported where it is used
      const [street, booth, wheel, man, walker] = await Promise.all(
        [streetModel, boothModel, wheelModel, "/models/jump.glb", "/models/walk.glb"].map((url) => loader.loadAsync(url)),
      );
      if (dead) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.domElement.style.cssText = "position:absolute;inset:0;pointer-events:none"; // clicks go to the pages under it
      el.appendChild(renderer.domElement);
      const css = new CSS3DRenderer();
      under.appendChild(css.domElement);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(HAZE);
      scene.fog = new THREE.Fog(HAZE, 30, 150); // the far wheels show, hazy
      const { dome, dispose: disposeSky } = nightSky(skyLoad, MOON, Math.PI / 2, () => dead); // the moon down the street (+x)
      const lamp = new THREE.DirectionalLight(0xffd9a0, 1.4); // the stalls' bulbs, roughly
      lamp.position.set(2, 8, 3);
      const flash = new THREE.PointLight(0xffffff, 0, 0, 0); // each firework's burst, in its colour, all over the mela
      scene.add(dome, new THREE.HemisphereLight(0x8a9ad0, 0x3a2a20, 1.6), lamp, flash);
      matte(street.scene);
      matte(booth.scene);
      street.scene.scale.setScalar(S);
      scene.add(street.scene);
      // The street's ground is a small patch; the same earth runs on under the entrance and off into the fog.
      let ground: THREE.Material | undefined;
      street.scene.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (m?.name === "Material.043") ground = m;
      });
      const earth = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), ground ?? new THREE.MeshLambertMaterial({ color: 0x3a2412 }));
      earth.rotation.x = -Math.PI / 2;
      earth.position.y = -0.012 * S; // just under the street's own ground
      scene.add(earth);

      // Giant wheels (see WHEELS), lit (see GLOW, BULBS).
      matte(wheel.scene);
      wheel.scene.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshLambertMaterial | undefined;
        if (m?.isMeshLambertMaterial) m.emissive.copy(m.color).multiplyScalar(GLOW[m.name] ?? 0.2);
      });
      const sparkTex = glowDot();
      const turn = wheel.animations[0];
      const wheelBox = new THREE.Box3().setFromObject(wheel.scene);
      const wheelScale = WHEEL.height / wheelBox.getSize(new THREE.Vector3()).y;
      const bulbColours = BULBS.colours.map((c) => new THREE.Color(c));
      const wheels = WHEELS.map((w) => {
        const g = new THREE.Group();
        const model = wheel.scene.clone();
        model.scale.setScalar(wheelScale);
        model.position.y = -wheelBox.min.y * wheelScale; // its base on the ground
        g.add(model);
        g.position.set(w.x, -0.012 * S, w.z);
        g.rotation.y = Math.atan2(-(WHEEL.face.z - w.z), WHEEL.face.x - w.x); // its disc (local x) to face the street
        scene.add(g);
        g.updateMatrixWorld(true);
        // The bulbs ride on the turning hub: a ring round the rim, placed at rest in the world, then into the hub's space.
        let hub: THREE.Object3D | undefined;
        let rim: THREE.Object3D | undefined;
        model.traverse((o) => {
          if (o.name === "polySurface17") hub = o;
          if (((o as THREE.Mesh).material as THREE.Material | undefined)?.name === "Wheel_1") rim = o;
        });
        const ring = new THREE.Box3().setFromObject(rim ?? model);
        const centre = ring.getCenter(new THREE.Vector3());
        const r = ring.getSize(new THREE.Vector3()).y / 2;
        const across = new THREE.Vector3(1, 0, 0).applyQuaternion(g.quaternion).cross(new THREE.Vector3(0, 1, 0)).normalize();
        const pos = new Float32Array(BULBS.count * 3);
        for (let i = 0; i < BULBS.count; i++) {
          const a = (i / BULBS.count) * Math.PI * 2;
          const p = centre.clone().addScaledVector(across, r * Math.cos(a)).setY(centre.y + r * Math.sin(a));
          (hub ? hub.worldToLocal(p) : p).toArray(pos, i * 3);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(BULBS.count * 3), 3).setUsage(THREE.DynamicDrawUsage));
        const bulbs = new THREE.Points(
          geo,
          new THREE.PointsMaterial({ size: BULBS.size, map: sparkTex, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
        );
        bulbs.frustumCulled = false;
        (hub ?? model).add(bulbs);
        const mixer = new THREE.AnimationMixer(model);
        if (turn) mixer.clipAction(turn).play().time = w.t;
        return { mixer, bulbs };
      });
      let lit = -1; // which third of the bulbs is lit
      const chaseBulbs = (time: number) => {
        const now = Math.floor(time * BULBS.chase) % 3;
        if (now === lit) return;
        lit = now;
        for (const { bulbs } of wheels) {
          const col = bulbs.geometry.attributes.color as THREE.BufferAttribute;
          for (let i = 0; i < BULBS.count; i++) {
            const c = bulbColours[i % bulbColours.length];
            const b = i % 3 === now ? 1 : 0.3;
            col.setXYZ(i, c.r * b, c.g * b, c.b * b);
          }
          col.needsUpdate = true;
        }
      };
      chaseBulbs(0);

      // Fireworks (see SHOWS), once the shell's file lands.
      const shows = fireworkShows(SHOWS, sparkTex, flash);
      scene.add(shows.sparks);
      shellLoad.then((buf) => !dead && shows.build(buf)).catch((e) => console.error("EventsStreet fireworks:", e));

      // The lanterns, relettered in Hindi (see LANTERN), once the face has loaded.
      street.scene.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshLambertMaterial | undefined;
        const img = m?.map?.image as (CanvasImageSource & { width: number; height: number }) | undefined;
        if (m?.name !== "Material.002" || !img || m.userData.hindi) return;
        m.userData.hindi = true;
        const deva = getComputedStyle(document.documentElement).getPropertyValue("--font-yatra").trim() || "serif";
        document.fonts
          .load(`${LANTERN.size}px ${deva}`, LANTERN.words.join(""))
          .catch(() => {})
          .then(() => {
            if (dead) return;
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const g = canvas.getContext("2d")!;
            const k = canvas.width / 1024; // the layout above is for the 1024 px texture
            g.drawImage(img, 0, 0, canvas.width, canvas.height);
            g.drawImage(img, 100 * k, 0, 160 * k, 330 * k, 440 * k, 0, 160 * k, 330 * k); // the old letters, covered
            g.font = `${LANTERN.size * k}px ${deva}`;
            g.fillStyle = LANTERN.colour;
            g.textAlign = "center";
            g.textBaseline = "middle";
            LANTERN.words.forEach((word, i) => {
              g.save();
              g.translate(((i * 2 + 1) / (LANTERN.words.length * 2)) * canvas.width, LANTERN.y * k); // spread round it
              g.scale(1, -1); // upside down, as the texture is
              g.fillText(word, 0, 0);
              g.restore();
            });
            const tex = new THREE.CanvasTexture(canvas);
            tex.flipY = false; // as glTF textures are
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            m.map!.dispose();
            m.map = tex;
            if (m.emissiveMap) m.emissiveMap = tex;
            m.needsUpdate = true;
          });
      });
      const camera = new THREE.PerspectiveCamera(CHASE.fov, 1, 0.1, 300);

      // The walls: a page, and its hole in the canvas, the same size in the same place, facing the path. A street
      // stall's is on its curtain; booth.glb's booths (on the right) are placed here, each with its page on its back wall.
      const hole = new THREE.MeshBasicMaterial({ color: 0, opacity: 0, blending: THREE.NoBlending, fog: false });
      const stalls = STALLS.map((s, i) => {
        let centre: THREE.Vector3;
        let h: number; // the page's height, metres; its width is h * aspect
        if (s.z === undefined) {
          const b = booth.scene.clone();
          b.scale.setScalar(BOOTH.scale);
          b.rotation.y = -Math.PI / 2; // its front (-x) to the path (-z)
          b.position.set(s.x * S, -0.01 * S, BOOTH.out); // on the street's ground
          scene.add(b);
          b.updateMatrixWorld(true);
          centre = b.localToWorld(BOOTH.page.clone());
          h = BOOTH.h * BOOTH.scale;
        } else {
          centre = new THREE.Vector3(s.x, (WALL.top + WALL.bottom) / 2, s.z).multiplyScalar(S);
          h = (WALL.top - WALL.bottom) * S;
        }
        const side = Math.sign(centre.z);
        const page = new CSS3DObject(pages[i]);
        const mask = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), hole);
        for (const o of [page, mask]) {
          o.position.copy(centre);
          o.rotation.y = side > 0 ? Math.PI : 0; // both face +z as made
        }
        scene.add(page, mask);
        return {
          centre,
          normal: new THREE.Vector3(0, 0, -side),
          page,
          h,
          hold: { dist: 1, fov: CHASE.fov }, // set by resize
          stand: new THREE.Vector3(s.x + PATH.aside, PATH.top, side * PATH.stand).multiplyScalar(S),
          face: side > 0 ? 0 : Math.PI, // heading: he faces (sin, 0, cos)
        };
      });

      // Spider-Man, walking and standing on the soldier's clips (see rig.ts). He faces +z at heading 0.
      const rig = man.scene;
      scene.add(rig);
      rig.traverse((o) => (o.frustumCulled = false)); // skinned bounds stay at the rest pose
      const { retarget, mixer: sMixer } = soldier(walker, STRIDE);
      const mixer = new THREE.AnimationMixer(rig);
      const walkClip = retarget(rig);
      const idleClip = retarget(rig, "Idle");
      const walk = mixer.clipAction(walkClip).play();
      const idle = mixer.clipAction(idleClip).play();
      const pose = (walkT: number, walking: number, idleT: number) => {
        walk.time = walkT % walkClip.duration;
        idle.time = idleT % idleClip.duration;
        walk.setEffectiveWeight(walking);
        idle.setEffectiveWeight(1 - walking);
        mixer.update(0);
      };
      const speed = strideSpeed(rig, (t) => pose(t, 1, 0), walkClip.duration); // feet stay planted at this pace

      // A leg of a walk, as phases posing him and the camera at t (0 … 1) through each: from frame s (where he stands,
      // or walks, maybe facing a stall's page) turn towards to (the camera pulling back from the page and swinging round
      // to chase, the way he now goes along the street), walk straight there, and, if to is stall k's spot, turn to face
      // it (the camera pushing in to its page). len: screens of scroll; secs: the same played in time, for the buttons.
      type Phase = { len: number; secs: number; at: (t: number) => Frame };
      const DOWN = Math.PI / 2; // down the street, +x; back up it is -DOWN
      const leg = (s: Frame, to: THREE.Vector3, k: number, chase: number): Phase[] => {
        const a = s.pos.clone();
        const dist = a.distanceTo(to);
        const way = dist > 0.01 ? Math.atan2(to.x - a.x, to.z - a.z) : s.heading;
        const w1 = s.walked + dist;
        const out: Phase[] = [
          {
            len: s.stall < 0 && s.chase === chase ? PACE.start : PACE.turn,
            secs: TRIP.turn,
            at: (t) => ({
              pos: a,
              heading: turnTo(s.heading, way, smooth(t, 0.4, 1)),
              // a U-turn swings the camera round him on the path's side (towards -z from the right-hand stalls)
              chase: turnTo(s.chase, chase, smooth(t, 0.2, 1)),
              walked: s.walked,
              walking: s.walking * (1 - smooth(t, 0, 0.3)),
              stall: s.stall,
              push: s.push * (1 - smooth(t, 0, 0.6)),
            }),
          },
          {
            len: dist / PACE.metres,
            secs: dist / (speed * TRIP.pace),
            // easing into and out of the walk over its first and last half metre
            at: (t) => ({ pos: a.clone().lerp(to, t), heading: way, chase, walked: s.walked + dist * t, walking: Math.min(1, (dist * t) / 0.5, (dist * (1 - t)) / 0.5), stall: -1, push: 0 }),
          },
        ];
        if (k >= 0) {
          const face = stalls[k].face;
          out.push({ len: PACE.turn, secs: TRIP.turn, at: (t) => ({ pos: to, heading: turnTo(way, face, smooth(t, 0, 0.6)), chase, walked: w1, walking: 0, stall: k, push: smooth(t, 0.4, 1) }) });
        }
        return out.filter((ph) => ph.len > 0); // a leg from where he already stands has no walk
      };
      // The scroll route, a loop: from the entrance to each stall in turn (holding on its page), a U-turn at the last,
      // back past the others (holding on each again) to the entrance, and a U-turn there to face down the street, as at
      // the start. Scrolling past its end carries on from its start (see the ScrollTrigger below).
      const start = new THREE.Vector3(PATH.start, PATH.top, 0).multiplyScalar(S);
      const phases: Phase[] = [];
      const holds: { k: number; chase: number; u: number }[] = []; // each hold on a page, mid-way, in screens of scroll
      let at: Frame = { pos: start, heading: DOWN, chase: DOWN, walked: 0, walking: 0, stall: -1, push: 0 };
      const stops = [...stalls.keys(), ...[...stalls.keys()].reverse().slice(1), -1];
      for (const [i, k] of stops.entries()) {
        const chase = i < stalls.length ? DOWN : -DOWN;
        phases.push(...leg(at, k < 0 ? start : stalls[k].stand, k, chase));
        at = phases[phases.length - 1].at(1);
        if (k < 0) break;
        const still = at;
        holds.push({ k, chase, u: phases.reduce((n, ph) => n + ph.len, 0) + PACE.hold / 2 });
        phases.push({ len: PACE.hold, secs: 0, at: () => still });
      }
      const back = at;
      phases.push({ len: PACE.turn, secs: 0, at: (t) => ({ ...back, heading: turnTo(back.heading, DOWN, smooth(t)), chase: turnTo(back.chase, DOWN, smooth(t)) }) });
      const screens = phases.reduce((n, ph) => n + ph.len, 0);
      const playAt = (list: Phase[], u: number, unit: "len" | "secs") => {
        for (const ph of list) {
          if (u <= ph[unit]) return ph.at(ph[unit] > 0 ? u / ph[unit] : 1);
          u -= ph[unit];
        }
        return list[list.length - 1].at(1);
      };

      let zoom = 1; // narrow screens chase from further back, as on the home page: else he fills the screen
      let progress = 0;
      let idleT = 0; // the idle's clock, run by the frame loop
      let shown: Frame = phases[0].at(0); // the frame on screen
      let looped = false;
      let trip: { phases: Phase[]; t0: number; k: number; chase: number } | null = null; // a stall button's walk, playing
      let active = -1;
      const fwd = new THREE.Vector3();
      const aim = new THREE.Vector3();
      // Places him and the camera for frame f; the frame loop poses and draws.
      const draw = (f: Frame) => {
        shown = f;
        rig.position.copy(f.pos);
        rig.rotation.y = f.heading;
        fwd.set(Math.sin(f.chase), 0, Math.cos(f.chase));
        camera.position.copy(f.pos).addScaledVector(fwd, -CHASE.back * zoom).setY(CHASE.up);
        camera.position.z /= 2;
        aim.copy(f.pos).addScaledVector(fwd, CHASE.ahead).setY(CHASE.aim);
        let fov = CHASE.fov;
        const p = f.stall < 0 ? 0 : f.push;
        if (p > 0) {
          const s = stalls[f.stall];
          camera.position.lerp(s.centre.clone().addScaledVector(s.normal, s.hold.dist), p);
          aim.lerp(s.centre, p);
          fov = THREE.MathUtils.lerp(CHASE.fov, s.hold.fov, p);
        }
        if (camera.fov !== fov) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }
        camera.lookAt(aim);
        // Only the page being looked at takes clicks and focus; its button is marked as the current one.
        const now = p > 0.6 ? f.stall : -1;
        if (now !== active) {
          pages.forEach((d, i) => (d.inert = i !== now));
          jumps.current.forEach((b, i) => b?.setAttribute("aria-current", String(i === now)));
          active = now;
        }
        const moved = progress > 0.005 || trip !== null || looped; // the title goes once he sets off
        if (sec.hasAttribute("data-moved") !== moved) sec.toggleAttribute("data-moved", moved);
      };
      // The frame loop, while the scene is on screen: his idle, the wheels, their bulbs, the fireworks; then the scene,
      // with the sky on the camera.
      let clock = 0;
      let then = 0;
      const frame = (now: number) => {
        const dt = Math.min((now - then) / 1000, 0.1);
        then = now;
        clock += dt;
        idleT += dt;
        pose(shown.walked / speed, shown.walking, idleT);
        for (const w of wheels) w.mixer.update(dt);
        chaseBulbs(clock);
        shows.update(dt);
        dome.position.copy(camera.position);
        renderer.render(scene, camera);
        css.render(scene, camera);
      };
      const io = new IntersectionObserver(([e]) => {
        then = performance.now();
        renderer.setAnimationLoop(e.isIntersecting ? frame : null);
      });
      io.observe(el);

      const resize = () => {
        const [w, h] = [el.clientWidth, el.clientHeight];
        renderer.setSize(w, h);
        css.setSize(w, h);
        camera.aspect = w / h;
        zoom = Math.max(1, 0.8 / camera.aspect);
        // The fixed nav bar (the layout's first header) covers the top and the stall buttons the bottom: centre every
        // shot in the space between.
        const nav = document.querySelector("header")?.offsetHeight ?? 0;
        const foot = h - (bar.current?.offsetTop ?? h);
        camera.setViewOffset(w, h, 0, (foot - nav) / 2, w, h);
        // Each page is laid out at the size it will have on screen, so its text is drawn 1:1, sharp.
        const pw = Math.round(Math.min(HOLD.fill.w * w, HOLD.fill.h * (h - nav - foot) * aspect));
        const ph = Math.round(pw / aspect);
        const tan = Math.tan(THREE.MathUtils.degToRad(CHASE.fov / 2));
        for (const s of stalls) {
          s.page.element.style.width = `${pw}px`;
          s.page.element.style.height = `${ph}px`;
          s.page.scale.setScalar(s.h / ph);
          // Far enough back for the page to fill ph of the screen's h, at the chase lens; or nearer, with a wider one.
          const dist = (s.h * h) / (2 * ph * tan);
          s.hold = dist <= HOLD.max ? { dist, fov: CHASE.fov } : { dist: HOLD.max, fov: 2 * THREE.MathUtils.radToDeg(Math.atan((s.h * h) / (2 * ph * HOLD.max))) };
        }
        setCompact(pw < COMPACT);
        camera.updateProjectionMatrix();
        draw(shown);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();
      sec.toggleAttribute("data-ready", true);

      // Moves the scroll at once (progress is set to where it lands first).
      const jump = (y: number) => {
        y = Math.max(st.start, y);
        progress = (y - st.start) / (st.end - st.start);
        jumpScroll(y);
      };
      // Pin and scrub: one screen of scrolling per screen in the phases. While a trip plays, scrolling is held off.
      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: `+=${screens * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          progress = self.progress;
          if (trip) return;
          draw(playAt(phases, progress * screens, "len"));
          // The loop ends as it starts: at its end, jump back a loop's length (keeping any overshoot) and walk on.
          if (self.scroll() >= self.end - 1) {
            looped = true;
            jump(self.scroll() - (self.end - self.start));
          }
        },
      });

      // The stall buttons: from wherever he is, straight to stall k and its page, played in time with no scrolling.
      // At the end the scroll jumps to that page's hold, where the scroll route shows the same frame, so scrolling
      // carries on from there.
      let raf = 0;
      const step = (now: number) => {
        if (!trip) return;
        const t = (now - trip.t0) / 1000;
        const total = trip.phases.reduce((n, ph) => n + ph.secs, 0);
        draw(playAt(trip.phases, Math.min(t, total), "secs"));
        if (t < total) {
          raf = requestAnimationFrame(step);
          return;
        }
        const { k, chase } = trip;
        const hold = holds.find((h) => h.k === k && h.chase === chase) ?? holds.find((h) => h.k === k)!;
        trip = null;
        getLenis()?.start();
        jump(st.start + (hold.u / screens) * (st.end - st.start));
      };
      goTo.current = (k) => {
        if (shown.stall === k && shown.push === 1) return; // already there
        cancelAnimationFrame(raf);
        getLenis()?.stop();
        const dx = stalls[k].stand.x - shown.pos.x;
        const chase = Math.abs(dx) < 0.01 ? shown.chase : dx > 0 ? DOWN : -DOWN; // facing the way he goes
        trip = { phases: leg(shown, stalls[k].stand, k, chase), t0: performance.now(), k, chase };
        raf = requestAnimationFrame(step);
      };

      cleanup = () => {
        renderer.setAnimationLoop(null);
        io.disconnect();
        cancelAnimationFrame(raf);
        if (trip) getLenis()?.start();
        goTo.current = null;
        st.kill(true);
        ro.disconnect();
        mixer.stopAllAction();
        sMixer.stopAllAction();
        for (const w of wheels) {
          w.mixer.stopAllAction();
          w.bulbs.geometry.dispose();
          w.bulbs.material.dispose();
        }
        shows.dispose();
        sparkTex.dispose();
        disposeSky();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            [o.material].flat().forEach((m) => {
              for (const v of Object.values(m)) if ((v as THREE.Texture | null)?.isTexture) (v as THREE.Texture).dispose();
              m.dispose();
            });
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
        css.domElement.remove();
      };
    })().catch((e) => {
      console.error("EventsStreet:", e);
      if (!dead) setFallback(true);
    });

    return () => {
      dead = true;
      cleanup();
    };
  }, []);

  if (fallback) return <EventsPanels />;

  const show = (cat: EventCategory) => {
    setOpen(cat);
    getLenis()?.stop();
    dialog.current?.showModal();
  };
  const tone = (cat: EventCategory) => tones[eventCategories.indexOf(cat) + 1]; // the panels' colours (0 is their title)

  return (
    // GSAP wraps the pinned section in a spacer; this outer div is what React removes on unmount.
    <div>
      <section ref={pin} aria-label="The mela: one stall per event category" className="group relative h-[100dvh] overflow-hidden" style={{ background: "#141a2e" }}>
        <div ref={layer} className="absolute inset-0" />
        <div ref={host} className="absolute inset-0" style={{ pointerEvents: "none" }} />
        <div className="pointer-events-none absolute left-4 top-24 transition-opacity duration-500 group-data-[moved]:opacity-0 md:left-8">
          <p className="painted font-deva text-[clamp(1.8rem,5vw,3rem)] leading-none text-cream" aria-hidden="true">
            कार्यक्रम
          </p>
          <h1 className="painted font-display text-[clamp(2.8rem,9vw,6rem)] leading-[.85] text-cream misprint">EVENTS</h1>
          <p className="mt-4 w-fit bg-ink px-3 py-1 font-mono text-sm font-bold tracking-widest text-turmeric">
            <span className="group-data-[ready]:hidden">SETTING UP THE STALLS…</span>
            <span className="hidden group-data-[ready]:inline">SCROLL TO WALK THE MELA</span>
          </p>
        </div>
        {/* A button per stall: he walks straight there and the camera turns to its page, no scrolling. Laid out (not
            shown) before the scene is ready, so the scene can measure the space it takes. */}
        <nav ref={bar} aria-label="Go to a stall" className="invisible absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2 px-4 py-3 group-data-[ready]:visible">
          {eventCategories.map((c, i) => (
            <button
              key={c.id}
              ref={(b) => {
                jumps.current[i] = b;
              }}
              type="button"
              onClick={() => goTo.current?.(i)}
              aria-current="false"
              className={`btn whitespace-nowrap !px-3 !py-2 !text-xs md:!text-sm ${tone(c)} aria-[current=true]:outline aria-[current=true]:outline-4 aria-[current=true]:outline-offset-2 aria-[current=true]:outline-turmeric`}
            >
              {c.title}
            </button>
          ))}
        </nav>
      </section>
      {walls.map((w, i) => createPortal(<StallPage cat={eventCategories[i]} tone={tone(eventCategories[i])} compact={compact} onOpen={show} />, w, String(i)))}
      {/* Narrow screens: a stall's page in full, over the scene. */}
      <dialog
        ref={dialog}
        data-lenis-prevent
        onClose={() => {
          setOpen(null);
          getLenis()?.start();
        }}
        aria-label={open?.heading}
        className={`m-auto max-h-[88dvh] w-[min(94vw,40rem)] overflow-y-auto border-4 border-ink p-5 pt-14 backdrop:bg-ink/70 ${open ? tone(open) : ""}`}
      >
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="btn absolute right-3 top-3 size-11 justify-center bg-cream !p-0 text-ink">
          <X weight="bold" aria-hidden="true" />
        </button>
        {open && <CategoryContent cat={open} />}
      </dialog>
    </div>
  );
}

// A category's page, as it hangs on its stall's back wall: the panel's heading and blurb beside its carousel of
// tickets; on a small screen a summary that opens the full page.
function StallPage({ cat, tone, compact, onOpen }: { cat: EventCategory; tone: string; compact: boolean; onOpen: (c: EventCategory) => void }) {
  return (
    <div className={`relative flex h-full w-full overflow-hidden border-4 border-ink ${tone}`}>
      <div className="halftone pointer-events-none absolute inset-0 text-ink/10" aria-hidden="true" />
      {compact ? (
        <div className="relative flex flex-1 flex-col items-center justify-center gap-2 p-3 text-center">
          <p className="font-deva text-lg leading-none">{cat.hindi}</p>
          <h2 className="painted font-display text-xl leading-none text-cream">{cat.heading}</h2>
          <button type="button" onClick={() => onOpen(cat)} className="btn bg-cream !px-3 !py-1.5 !text-sm text-ink">
            See {cat.subEvents.length} events
          </button>
        </div>
      ) : (
        <div className="relative grid flex-1 grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-6 p-6 lg:gap-10 lg:p-8">
          <div>
            <p className="font-deva text-2xl leading-none lg:text-3xl">{cat.hindi}</p>
            <h2 className="painted mt-2 font-display text-[clamp(1.8rem,3.6vw,3.25rem)] leading-none text-cream">{cat.heading}</h2>
            <p className="mt-3 text-base lg:text-lg">{cat.description}</p>
          </div>
          {/* clipped: the side tickets would otherwise swing out over the blurb */}
          <div className="-m-2 overflow-hidden p-2">
            <Carousel items={cat.subEvents} category={cat.title} />
          </div>
        </div>
      )}
    </div>
  );
}
