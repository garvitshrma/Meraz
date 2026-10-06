"use client";

// Contact page: an old rotary telephone with a contact card in each finger hole, over the printed number. The
// section pins; scrolling flies the camera from an isometric view of the whole phone in to the 0 hole, then round
// the dial hole by hole: 9, 8 … 1, and back out to the isometric view.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { contacts } from "@/data/content";
import { jumpScroll } from "./ScrollFx";

gsap.registerPlugin(ScrollTrigger);

const FOV = 18; // narrow, so the opening shot reads as near-isometric
// public/models/stool.glb: its seat's top in its own units, and the scale that makes the seat a little wider than the
// phone's base.
const STOOL = { top: 2.656, scale: 1 };
// The finger wheel in model space (public/models/telephone.glb): its plane (through centre, facing along normal) and
// each finger hole's opening as [x, y, radius] in that plane (x across, y up), for the numbers 1 … 9, 0. Measured from
// height renders looking straight into each hole: the largest circle that fits inside the hole's wall at card lift
// above the plane, so a card there sits dead centre with an even gap all round.
const DIAL = { centre: new THREE.Vector3(0.1553, 0.6951, 0.3999), normal: new THREE.Vector3(-0.006, 0.309, 0.951).normalize() };
const HOLES = [
  [0.1907, 0.1185, 0.0499], [0.1066, 0.1983, 0.0485], [0.0091, 0.2297, 0.0438], [-0.0908, 0.2002, 0.0483], [-0.1853, 0.1215, 0.0477],
  [-0.2312, 0.0181, 0.0488], [-0.22, -0.0838, 0.0458], [-0.1562, -0.1656, 0.0499], [-0.059, -0.2134, 0.0507], [0.0556, -0.2123, 0.0502],
];
// An unlit disc (reflections wash the text out) high in the hole, near its rim, a hair inside the wall.
const CARD = { lift: 0.018, gap: 0.0015 };
const ISO = new THREE.Vector3(1, 0.82, 1).normalize(); // the opening view's direction, from the phone to the camera
const FILL = 1; // the opening view fits the phone to this share of the screen below the nav bar
const CLOSE = 10; // camera distance from a hole, in card radii: every card fills the same share of the screen
// The text's pop-up, fully up: lift off the card, the share it grows by, and its shadow's offset, for a hole of radius 0.048
// (others in proportion).
const POP = { lift: 0.014, grow: 0.08, shadow: 0.0012 };

// A card in three layers, each a circle of the same size: the base (cream, darkening toward the rim as if shaded by
// the hole), the text's soft shadow, and the text itself, with a solid poster-style extrusion down and to the right.
// The text's title and details are centred, each line shrunk until it fits the circle's width.
const S = 1024; // a card's layout units, drawn at res pixels per unit
function layer(res: number, paint: (g: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S * res;
  const g = canvas.getContext("2d")!;
  g.scale(res, res);
  paint(g);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// The base is the same for every card, and smooth, so one small one does.
const cardBase = () =>
  layer(0.25, (g) => {
    g.fillStyle = "#f3e6c8"; // cream
    g.fillRect(0, 0, S, S);
    const rim = g.createRadialGradient(S / 2, S / 2, S * 0.36, S / 2, S / 2, S / 2);
    rim.addColorStop(0, "rgba(26,26,26,0)");
    rim.addColorStop(1, "rgba(26,26,26,0.55)");
    g.fillStyle = rim;
    g.fillRect(0, 0, S, S);
  });

function cardTextures(c: (typeof contacts)[number], fonts: { display: string; mono: string }) {
  const lines = [
    { text: c.title.toUpperCase(), font: fonts.display, weight: "400", size: 112, colour: "#b8166f", depth: 9, side: "#1a1a1a" }, // rani-deep on ink
    ...c.details.flatMap((d) => [
      { text: d.label, font: fonts.mono, weight: "700", size: 66, colour: "#1a1a1a", depth: 3, side: "#c9b088" },
      ...(d.value ? [{ text: d.value, font: fonts.mono, weight: "400", size: 76, colour: "#1a1a1a", depth: 3, side: "#c9b088" }] : []),
    ]),
  ];
  const gap = 1.25;
  const height = lines.reduce((h, l) => h + l.size * gap, 0);
  const scale = Math.min(1, (S * 0.7) / height); // tall cards shrink as a whole
  const r = S * 0.44;
  // Each line: where it goes and the font that fits there.
  let y = (S - height * scale) / 2;
  const measure = document.createElement("canvas").getContext("2d")!;
  const laid = lines.map((l) => {
    const lh = l.size * gap * scale;
    const mid = y + lh / 2;
    y += lh;
    const chord = 2 * Math.sqrt(Math.max(0, r * r - (mid - S / 2) ** 2)); // the circle's width at this line
    let size = l.size * scale;
    measure.font = `${l.weight} ${size}px ${l.font}`;
    const w = measure.measureText(l.text).width;
    if (w > chord) size *= chord / w;
    return { ...l, mid, font: `${l.weight} ${size}px ${l.font}`, depth: l.depth * scale };
  });
  const text = (g: CanvasRenderingContext2D, each: (l: (typeof laid)[number]) => void) => {
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (const l of laid) {
      g.font = l.font;
      each(l);
    }
  };

  // The shadow is a blur, so half resolution loses nothing; the text is drawn at twice, to stay sharp filling a
  // high-DPI screen.
  const shadow = layer(0.5, (g) => {
    g.filter = "blur(3.5px)"; // in canvas pixels: 7 layout units
    g.fillStyle = "#000";
    text(g, (l) => {
      for (let k = 0; k <= l.depth; k++) g.fillText(l.text, S / 2 + k, l.mid + k); // the extruded outline's shadow
    });
  });
  const face = layer(2, (g) =>
    text(g, (l) => {
      g.fillStyle = l.side;
      for (let k = Math.ceil(l.depth); k > 0; k--) g.fillText(l.text, S / 2 + k, l.mid + k);
      g.fillStyle = l.colour;
      g.fillText(l.text, S / 2, l.mid);
    }),
  );
  return { shadow, face };
}

export default function PhoneDial() {
  const pin = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = host.current!;
    const sec = pin.current!;
    const tally = meter.current!;
    let cleanup = () => {};
    let dead = false;

    (async () => {
      const css = getComputedStyle(document.documentElement);
      const fonts = { display: css.getPropertyValue("--font-bungee").trim() || "Impact", mono: css.getPropertyValue("--font-courier").trim() || "monospace" };
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      const [gltf, stool] = await Promise.all([
        loader.loadAsync("/models/telephone.glb"),
        loader.loadAsync("/models/stool.glb"),
        document.fonts.load(`80px ${fonts.display}`).catch(() => {}), // the cards are drawn in these
        document.fonts.load(`700 66px ${fonts.mono}`).catch(() => {}),
        document.fonts.load(`76px ${fonts.mono}`).catch(() => {}),
      ]);
      if (dead) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      // Reflections for the brass and the black lacquer; without them the phone renders almost black.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
      scene.environment = env;
      scene.environmentIntensity = 0.75; // a little softer than full: less glare off the polished brass
      const sun = new THREE.DirectionalLight(0xfff1d6, 2);
      sun.position.set(2, 4, 3);
      scene.add(sun, gltf.scene);
      // The phone stands on a wooden stool (its seat top level with the phone's base, y = 0); the stool runs off the
      // bottom of the screen. A soft dark patch on the seat grounds the phone.
      stool.scene.scale.setScalar(STOOL.scale);
      stool.scene.position.y = -STOOL.top * STOOL.scale;
      const contact = document.createElement("canvas");
      contact.width = contact.height = 128;
      const cg = contact.getContext("2d")!;
      const blot = cg.createRadialGradient(64, 64, 0, 64, 64, 64);
      blot.addColorStop(0, "rgba(0,0,0,0.6)");
      blot.addColorStop(1, "rgba(0,0,0,0)");
      cg.fillStyle = blot;
      cg.fillRect(0, 0, 128, 128);
      const shade = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(contact), transparent: true, depthWrite: false }));
      shade.rotation.x = -Math.PI / 2;
      shade.position.y = 0.003;
      scene.add(stool.scene, shade);
      // Sharp textures on the dial seen up close and at an angle, not just head-on.
      const aniso = renderer.capabilities.getMaxAnisotropy();
      gltf.scene.traverse((o) => {
        if (o instanceof THREE.Mesh)
          for (const m of [o.material].flat()) for (const v of Object.values(m)) if ((v as THREE.Texture | null)?.isTexture) (v as THREE.Texture).anisotropy = aniso;
      });
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 50);

      // The opening view is fitted to the phone's own outline: every 20th vertex (taken before the cards go in),
      // in the view's axes (x right, y up, z toward the camera), relative to the phone's middle.
      gltf.scene.updateMatrixWorld();
      const mid = new THREE.Box3().setFromObject(gltf.scene).getCenter(new THREE.Vector3());
      const vx = new THREE.Vector3(0, 1, 0).cross(ISO).normalize();
      const vy = ISO.clone().cross(vx);
      const outline: THREE.Vector3[] = [];
      gltf.scene.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        const p = o.geometry.attributes.position;
        const v = new THREE.Vector3();
        for (let k = 0; k < p.count; k += 20) {
          v.fromBufferAttribute(p, k).applyMatrix4(o.matrixWorld).sub(mid);
          outline.push(new THREE.Vector3(v.dot(vx), v.dot(vy), v.dot(ISO)));
        }
      });
      const [x0, x1, y0, y1] = [Math.min, Math.max, Math.min, Math.max].map((f, k) => f(...outline.map((p) => (k < 2 ? p.x : p.y))));
      const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2]; // the outline's middle on screen
      const iso = { look: mid.clone().addScaledVector(vx, cx).addScaledVector(vy, cy), dir: ISO, dist: 1 }; // dist set by resize

      // The holes in visiting order 0, 9, 8 … 1, each carrying the next contact card.
      const across = new THREE.Vector3(0, 1, 0).cross(DIAL.normal).normalize();
      const up = DIAL.normal.clone().cross(across);
      const base = cardBase();
      const cards = contacts.slice(0, 10).map((c, j) => {
        const [x, y, r] = HOLES[9 - j];
        const radius = r - CARD.gap;
        const disc = new THREE.CircleGeometry(radius, 96);
        const tex = cardTextures(c, fonts);
        const mesh = (map: THREE.Texture, over: boolean) => {
          map.anisotropy = aniso;
          return new THREE.Mesh(disc, new THREE.MeshBasicMaterial({ map, transparent: over, depthWrite: !over }));
        };
        // Local axes: x right and y up on screen when seen straight on, z out of the hole.
        const card = new THREE.Group();
        card.position.copy(DIAL.centre).addScaledVector(across, x).addScaledVector(up, y).addScaledVector(DIAL.normal, CARD.lift);
        card.lookAt(card.position.clone().add(DIAL.normal)); // face out of the dial, text upright
        const shadow = mesh(tex.shadow, true);
        const face = mesh(tex.face, true);
        [shadow.renderOrder, face.renderOrder] = [1, 2]; // shadow under text
        card.add(mesh(base, false), shadow, face);
        scene.add(card);
        return { shot: { look: card.position.clone(), dir: DIAL.normal, dist: CLOSE * radius }, radius, shadow, face }; // straight on, mid-screen
      });
      const holes = cards.map((c) => c.shot);
      // The text pops up off its card as the camera arrives (overshooting a little, like a spring), casting its
      // shadow down and to the right; it settles flat again as the camera leaves.
      const spring = gsap.parseEase("back.out(2.2)");
      const pop = (at: number) =>
        cards.forEach((c, j) => {
          const p = spring(THREE.MathUtils.clamp(1 - 2 * Math.abs(at - (j + 1)), 0, 1));
          const s = c.radius / 0.048; // in proportion to the hole
          c.face.position.z = (0.0006 + POP.lift * p) * s;
          c.face.scale.setScalar(1 - POP.grow + POP.grow * p);
          c.shadow.position.set(POP.shadow * p * s, -POP.shadow * p * s, 0.0003 * s);
          (c.shadow.material as THREE.MeshBasicMaterial).opacity = 0.35 * Math.min(1, p);
        });

      // Shots: the opening view, each hole straight on, then back out to the opening view.
      const shots = [iso, ...holes, iso];
      let zoom = 1; // narrow screens pull back from the cards so they still fit across
      const look = new THREE.Vector3();
      const dir = new THREE.Vector3();
      let progress = 0;
      let calls = 0; // times round the dial: the meter runs on across them
      const draw = () => {
        // Each leg: hold on the shot for the first and last 20% of its scroll, glide in between.
        const legs = progress * (shots.length - 1);
        const i = Math.min(Math.floor(legs), shots.length - 2);
        const t = THREE.MathUtils.smoothstep(legs - i, 0.2, 0.8);
        const [a, b] = [shots[i], shots[i + 1]];
        const [da, db] = [a === iso ? a.dist : a.dist * zoom, b === iso ? b.dist : b.dist * zoom];
        look.lerpVectors(a.look, b.look, t);
        dir.lerpVectors(a.dir, b.dir, t).normalize();
        camera.position.copy(look).addScaledVector(dir, da ** (1 - t) * db ** t); // zooms at an even rate, near or far
        camera.lookAt(look);
        pop(i + t);
        // The booth's call meter: a minute of call per screen scrolled, at the STD rate on the card.
        const secs = Math.round((calls + progress) * (shots.length - 1) * 60);
        tally.textContent = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")} · Rs.${((secs / 60) * 2.4).toFixed(2)}`;
        renderer.render(scene, camera);
      };
      const resize = () => {
        renderer.setSize(el.clientWidth, el.clientHeight);
        camera.aspect = el.clientWidth / el.clientHeight;
        // The fixed nav bar (the layout's first header) covers the top: centre every shot in the space below it.
        const nav = document.querySelector("header")?.offsetHeight ?? 0;
        camera.setViewOffset(el.clientWidth, el.clientHeight, 0, -nav / 2, el.clientWidth, el.clientHeight);
        zoom = Math.max(1, 0.9 / camera.aspect);
        // Fit the opening view: back off until the whole outline is inside FILL of the space below the nav bar.
        const tanV = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * FILL * (1 - nav / el.clientHeight);
        const tanH = tanV * camera.aspect;
        iso.dist = outline.reduce((d, p) => Math.max(d, p.z + Math.max(Math.abs(p.x - cx) / tanH, Math.abs(p.y - cy) / tanV)), 0);
        draw();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      // Pin and scrub: one screen of scrolling per shot. Reduced motion keeps the isometric still. The tour ends as it
      // starts, on the whole phone, so scrolling past its end jumps back a tour's length (keeping any overshoot) and
      // dials on, round and round.
      const st = matchMedia("(prefers-reduced-motion: reduce)").matches
        ? null
        : ScrollTrigger.create({
            trigger: sec,
            start: "top top",
            end: `+=${(shots.length - 1) * 100}%`,
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              progress = self.progress;
              draw();
              if (self.scroll() >= self.end - 1) {
                calls++;
                jumpScroll(Math.max(self.start, self.scroll() - (self.end - self.start)));
              }
            },
          });

      cleanup = () => {
        st?.kill(true);
        ro.disconnect();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            [o.material].flat().forEach((m) => {
              for (const v of Object.values(m)) if ((v as THREE.Texture | null)?.isTexture) (v as THREE.Texture).dispose();
              m.dispose();
            });
          }
        });
        env.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch((e) => console.error("PhoneDial:", e));

    return () => {
      dead = true;
      cleanup();
    };
  }, []);

  return (
    // GSAP wraps the pinned section in a spacer; this outer div is what React removes on unmount.
    <div>
      {/* Dressed as a 90s STD-ISD-PCO booth: yellow walls, the block-letter sign, a call-rate card and the call meter. */}
      <section ref={pin} aria-label="Rotary telephone" className="relative h-[100dvh] overflow-hidden bg-turmeric">
        <div className="halftone absolute inset-0 text-ink/10" aria-hidden="true" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 bottom-6 top-24 flex flex-col justify-between md:inset-x-8 md:flex-row md:items-center">
          {/* the sign: black block capitals, stacked, on a yellow board with a black border */}
          <div className="self-center border-[6px] border-ink bg-marigold px-4 py-2 text-center shadow-[8px_8px_0_var(--color-ink)] md:-rotate-2 md:self-auto md:px-6 md:py-4">
            <p className="font-display text-[clamp(1.5rem,4.5vw,4.5rem)] leading-none text-ink max-md:flex max-md:gap-3">
              <span className="block">STD</span>
              <span className="block">ISD</span>
              <span className="block text-vermillion-deep">PCO</span>
            </p>
            <p className="mt-2 font-deva text-base text-ink md:text-xl">यहाँ से देश-विदेश बात करें</p>
          </div>
          <div className="flex items-end justify-between gap-4 md:flex-col md:items-end md:gap-8">
            {/* the call meter: duration and charge, ticking as the visitor scrolls */}
            <div className="border-4 border-ink bg-ink p-2 shadow-[6px_6px_0_var(--color-vermillion-deep)] md:rotate-1 md:p-3">
              <p className="font-mono text-[10px] font-bold tracking-widest text-cream/70 md:text-xs">DURATION · AMOUNT</p>
              <p ref={meter} className="scanlines mt-1 bg-[#1f0d07] px-2 py-1 font-mono text-lg font-bold tabular-nums text-[#ff6a3d] [text-shadow:0_0_8px_#ff6a3d] md:text-3xl">
                00:00 · Rs.0.00
              </p>
            </div>
            {/* the rate card, hand-lettered on paper and taped up */}
            <div className="relative hidden rotate-2 border-2 border-ink bg-cream px-5 py-4 font-mono text-sm shadow-[5px_5px_0_var(--color-ink)] md:block">
              <span className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 bg-paper/80" />
              <p className="font-display text-lg text-rani-deep">CALL RATES</p>
              <p className="mt-2 flex justify-between gap-6"><span className="font-bold">LOCAL</span>Rs.1 / 3 min</p>
              <p className="flex justify-between gap-6"><span className="font-bold">STD</span>Rs.2.40 / min</p>
              <p className="flex justify-between gap-6"><span className="font-bold">ISD</span>Rs.48 / min</p>
              <p className="mt-2 border-t-2 border-dashed border-ink/40 pt-2 text-xs font-bold text-vermillion-deep">रात 11 बजे के बाद STD ¼ रेट</p>
            </div>
          </div>
        </div>
        <div
          ref={host}
          role="img"
          aria-label="An old black rotary telephone in a yellow STD-ISD-PCO booth, with a contact card in each finger hole"
          className="absolute inset-0"
        />
      </section>
    </div>
  );
}
