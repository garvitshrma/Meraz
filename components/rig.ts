// Shared by the 3D scenes (RoadJump, EventsStreet): matte materials, bone lookup by name, and the soldier's Walk and
// Idle clips retargeted onto our rigs.
import * as THREE from "three";
import type { Object3D, SkinnedMesh } from "three";
import type { GLTF } from "three/addons/loaders/GLTFLoader.js";

const q = () => new THREE.Quaternion();
const v3 = () => new THREE.Vector3();

// Every model's PBR material becomes Lambert, which is cheaper to compile (the road's and barricade's PBR shaders
// were most of the first frame's wait) and to draw. With no environment to reflect, PBR adds little here: what
// goes is the glossy highlight and metalness, which without an environment only darkened surfaces towards black.
// Transparency, cut-outs (leaves), glow, baked shadow and flat shading (meshes stored without normals) carry over.
// Shared materials stay shared.
export function matte(root: Object3D) {
  const made = new Map<THREE.Material, THREE.MeshLambertMaterial>();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const m = mesh.material as THREE.MeshStandardMaterial | undefined;
    if (!m?.isMeshStandardMaterial) return; // unlit (basic) materials are cheap already
    if (!made.has(m)) {
      const { color, map, normalMap, normalScale, aoMap, aoMapIntensity, emissive, emissiveMap, emissiveIntensity } = m;
      const { alphaMap, alphaTest, transparent, opacity, side, depthWrite, vertexColors, flatShading, name } = m;
      made.set(m, new THREE.MeshLambertMaterial({ color, map, normalMap, normalScale, aoMap, aoMapIntensity, emissive,
        emissiveMap, emissiveIntensity, alphaMap, alphaTest, transparent, opacity, side, depthWrite, vertexColors, flatShading, name }));
      m.dispose();
    }
    mesh.material = made.get(m)!;
  });
}

// Bones are matched across rigs by name: "mixamorig:Hips_64", "mixamorigHips" and "Hips_01" all key as "Hips".
export const key = (n: string) => n.replace(/_\d+$/, "").replace(/^mixamorig:?/, "");
export const bone = (root: Object3D, n: string) => {
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
// rig must stand at the origin; it keeps its own facing. stride: share of the soldier's leg swing kept.
export function soldier(walker: GLTF, stride: number) {
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
        if (/(UpLeg|Leg|Foot|ToeBase)$/.test(n)) d.slerp(q(), 1 - stride); // shorter stride, less pull on the cloth
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
  return { retarget, facesPlusZ, mixer: sMixer };
}

// Walking speed of an in-place walk, from the stride: the planted foot slides back over its range during
// stance (~60% of a cycle). setTime poses the rig at a clip time.
export function strideSpeed(rig: Object3D, setTime: (t: number) => void, duration: number) {
  const foot = bone(rig, "LeftFoot");
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < 24; i++) {
    setTime((i / 24) * duration);
    const fz = foot.getWorldPosition(v3()).z;
    [lo, hi] = [Math.min(lo, fz), Math.max(hi, fz)];
  }
  return (hi - lo) / (0.6 * duration);
}
