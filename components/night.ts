// Shared by the night scenes (RoadJump, EventsStreet): the night sky with its full moon, and the fireworks.
import * as THREE from "three";

export const HAZE = 0x304a60; // the sky photo's colour at the horizon, so the far ground fades into it
// Night sky: "Qwantani Moonrise (Pure Sky)" by Greg Zaal, Poly Haven (CC0), graded from its lifted exposure back to
// night, its moon turned to +z, and cut off 9 deg below the horizon (sky.jpg). That band is spread over SKY_SPAN degrees
// from the zenith, which lowers the moon from 14 to 8 deg up, into a chase camera's view.
const SKY_SPAN = 106.8;

// A soft round dot: firework sparks, lamp glows, bulbs.
export function glowDot() {
  const glow = document.createElement("canvas");
  glow.width = glow.height = 64;
  const gc = glow.getContext("2d")!;
  const spot = gc.createRadialGradient(32, 32, 0, 32, 32, 32);
  spot.addColorStop(0, "#fff");
  spot.addColorStop(0.25, "rgba(255,255,255,0.8)");
  spot.addColorStop(1, "rgba(255,255,255,0)");
  gc.fillStyle = spot;
  gc.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(glow);
}

// The sky (see SKY_SPAN), on the inside of a sphere that the scene keeps on its camera (dome.position), not
// scene.background (as a background it is first converted to a cube map, with shaders of its own, on the first frame,
// ~0.4 s). Below its cut-off the background is the haze colour. The photo does not hold up the first frame: until it
// lands the dome shows a one-pixel stand-in in the haze colour, through the same shader, so swapping it in costs nothing.
// The photo's moon is a blown-out blob, so its glare is toned down in sky.jpg and NASA's full Moon (Scientific
// Visualization Studio, "Moon Phase and Libration, 2024", public domain; moon.webp) is laid over it: moon.el degrees
// up, moon.size degrees across, dimmed to moon.tint, in an aura (a soft glow of its own, moon.aura times as wide, so it
// shows on any screen, not only one bright enough to bring out the photo's own faint glare). The whole sky turns by
// turn radians about y, the moon with it.
export function nightSky(skyLoad: Promise<ImageBitmap>, moon: { el: number; size: number; tint: number; aura: number }, turn: number, gone: () => boolean) {
  const hazeRGB = new THREE.Color(HAZE).toArray().map((c) => Math.round(c * 255));
  let sky: THREE.Texture = new THREE.DataTexture(new Uint8Array([...hazeRGB, 255]), 1, 1);
  sky.needsUpdate = true;
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(250, 64, 32, 0, 2 * Math.PI, 0, THREE.MathUtils.degToRad(SKY_SPAN)).scale(-1, 1, 1),
    new THREE.MeshBasicMaterial({ map: sky, fog: false, depthWrite: false }),
  );
  dome.renderOrder = -1; // drawn first, behind everything
  dome.frustumCulled = false;
  dome.rotation.y = turn;
  skyLoad
    .then((bitmap) => {
      if (gone()) return bitmap.close();
      // ImageBitmaps upload top row first, so v is turned round in place of flipY. Only ever magnified: no mipmaps.
      const t = new THREE.Texture(bitmap);
      t.flipY = false;
      t.repeat.y = -1;
      t.offset.y = 1;
      t.colorSpace = THREE.SRGBColorSpace;
      t.generateMipmaps = false;
      t.minFilter = THREE.LinearFilter;
      t.needsUpdate = true;
      sky.dispose();
      dome.material.map = sky = t;
    })
    .catch((e) => console.error("sky:", e));
  const el = THREE.MathUtils.degToRad(moon.el);
  const at = new THREE.Vector3(0, Math.sin(el), Math.cos(el)).multiplyScalar(240); // just inside the sky
  const across = 2 * 240 * Math.tan(THREE.MathUtils.degToRad(moon.size / 2));
  const glow = document.createElement("canvas");
  glow.width = glow.height = 128;
  const gc = glow.getContext("2d")!;
  const fall = gc.createRadialGradient(64, 64, 0, 64, 64, 64);
  fall.addColorStop(0, "rgba(255,252,240,0.6)");
  fall.addColorStop(0.15, "rgba(255,252,240,0.35)");
  fall.addColorStop(0.4, "rgba(255,252,240,0.1)");
  fall.addColorStop(1, "rgba(255,252,240,0)");
  gc.fillStyle = fall;
  gc.fillRect(0, 0, 128, 128);
  const auraTex = new THREE.CanvasTexture(glow);
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: auraTex, color: moon.tint, blending: THREE.AdditiveBlending, fog: false, depthWrite: false }));
  aura.position.copy(at);
  aura.scale.setScalar(across * moon.aura);
  dome.add(aura);
  let moonTex: THREE.Texture | undefined;
  new THREE.TextureLoader()
    .loadAsync("/moon.webp")
    .then((t) => {
      if (gone()) return t.dispose();
      t.colorSpace = THREE.SRGBColorSpace;
      moonTex = t;
      const disc = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, color: moon.tint, fog: false, depthWrite: false }));
      disc.position.copy(at);
      disc.scale.setScalar(across);
      disc.renderOrder = 1; // over its aura
      dome.add(disc);
    })
    .catch((e) => console.error("moon:", e));
  return {
    dome,
    dispose: () => {
      sky.dispose();
      moonTex?.dispose();
      auraTex.dispose();
      aura.material.dispose();
    },
  };
}

// Fireworks: one baked shell (fireworks.glb, baked by the build into fireworks.bin: a rocket climbing about 38 units,
// then 2,200 sparks bursting out about 50 units over 8 s), let off again and again at each show. at: launch point in
// metres, scale: shell size, speed: playback rate (the bake runs slow), gap: seconds between shells.
export type Show = { at: number[]; scale: number; speed: number; gap: number };
// The shell's timeline in bake seconds: it bursts at burst and its last sparks die by end. Sparks sag under gravity by
// droop units per second squared after the burst; size is a spark's size in metres.
const SHELL = { burst: 2.1, end: 10, droop: 0.5, size: 1.4 };
const FIREWORK_COLOURS = [0xffb627, 0xff3d3d, 0x19d3c5, 0xff4fa3, 0x7dff6b, 0x8f7bff, 0xff7a1a];
const TRAIL = [[0, 1], [0.1, 0.5], [0.22, 0.22]]; // bake seconds behind the spark, brightness

// Every show plays the baked shell, each spark drawn with a short trail (the same spark a moment earlier, dimmer).
// The sparks fade as they burn out, crackling at the end, and sag under gravity. Each shell takes a new colour, with a
// few warm-white sparks in its core; its burst flashes flash (a light with no falloff) in that colour. still: one still
// frame (reduced motion), its shells caught mid-burst; otherwise they go up in turn. Add sparks to the scene; once the
// shell's file has landed, build(buffer) arms update(dt).
export function fireworkShows(shows: Show[], sparkTex: THREE.Texture, flash: THREE.PointLight, still = false) {
  const geo = new THREE.BufferGeometry();
  const sparks = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ size: SHELL.size, map: sparkTex, vertexColors: true, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
  );
  sparks.frustumCulled = false;
  const pick = () => FIREWORK_COLOURS[Math.floor(Math.random() * FIREWORK_COLOURS.length)];
  let update = (dt: number) => void dt; // quiet until the shell has landed
  const build = (buf: ArrayBuffer) => {
    const head = new Float32Array(buf, 0, 9);
    const [frames, P, DT] = head;
    const [lo, span] = [head.subarray(3, 6), head.subarray(6, 9)];
    const at = new Uint16Array(buf, 36, frames * P * 3); // positions, scaled into lo..lo+span
    const big = new Uint8Array(buf, 36 + frames * P * 6, frames * P); // size: 0 before it is lit and after it dies
    const n = shows.length * TRAIL.length * P;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
    const shells = shows.map((s, i) => ({ ...s, t: still ? 3.5 + i * 0.6 : -i * 1.4, colour: new THREE.Color(pick()) }));
    const core = new THREE.Color(0xfff1c1);
    update = (dt) => {
      let bright = 0;
      shells.forEach((s, si) => {
        s.t += dt * s.speed;
        if (s.t > SHELL.end) {
          s.t = -s.gap * s.speed; // a pause, then the next shell, in a new colour
          s.colour.setHex(pick());
        }
        const burst = s.t > SHELL.burst ? Math.exp(-1.5 * (s.t - SHELL.burst)) : 0;
        if (burst > bright) {
          bright = burst;
          flash.color.copy(s.colour);
          flash.position.set(s.at[0], s.at[1] + 38 * s.scale, s.at[2]);
        }
        TRAIL.forEach(([back, glowing], j) => {
          const t = s.t - back;
          const f = t / DT - 1; // frame k was baked at (k + 1) * DT
          const f0 = Math.floor(f);
          const first = (si * TRAIL.length + j) * P;
          if (f0 < 0 || f0 >= frames - 1) return void col.fill(0, first * 3, (first + P) * 3);
          const u = f - f0;
          const age = Math.max(0, t - SHELL.burst);
          const fade = glowing * Math.max(0, 1 - age / (SHELL.end - SHELL.burst)) ** 1.3;
          const sag = SHELL.droop * age * age;
          for (let i = 0; i < P; i++) {
            const [k0, o] = [f0 * P + i, (first + i) * 3];
            let b = ((big[k0] + (big[k0 + P] - big[k0]) * u) / 255) * fade;
            if (b > 0 && age > 4 && Math.random() < 0.3) b *= 0.25; // crackle as they burn out
            for (let c = 0; c < 3; c++) {
              const q = at[k0 * 3 + c] + (at[(k0 + P) * 3 + c] - at[k0 * 3 + c]) * u;
              pos[o + c] = s.at[c] + (lo[c] + (q / 65535) * span[c] - (c === 1 ? sag : 0)) * s.scale;
            }
            const tint = i % 6 === 0 ? core : s.colour;
            [col[o], col[o + 1], col[o + 2]] = [tint.r * b, tint.g * b, tint.b * b];
          }
        });
      });
      flash.intensity = 1.2 * bright;
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
    };
    update(0);
  };
  return {
    sparks,
    build,
    update: (dt: number) => update(dt),
    dispose: () => {
      geo.dispose();
      sparks.material.dispose();
    },
  };
}
