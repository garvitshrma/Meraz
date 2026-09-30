"use client";

// All audio is synthesised with Web Audio, so there are no audio files to ship.
// Sound is off until the visitor presses the cassette.
import { createContext, useContext, useRef, useState, type ReactNode } from "react";

type Sound = { on: boolean; toggle: () => void; crackle: () => void; clack: () => void };
const SoundCtx = createContext<Sound>({ on: false, toggle() {}, crackle() {}, clack() {} });
export const useSound = () => useContext(SoundCtx);

function noise(ac: AudioContext, seconds: number, freq: number, vol: number, at = 0) {
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const gain = ac.createGain();
  const t = ac.currentTime + at;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + seconds);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(t);
}

// Tanpura-style drone: Sa, Pa, upper Sa and low Sa, each gently breathing.
function drone(ac: AudioContext) {
  const master = ac.createGain();
  master.gain.value = 0;
  const lowpass = ac.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1100;
  lowpass.connect(master).connect(ac.destination);
  [65.41, 130.81, 196, 261.63].forEach((f, i) => {
    const osc = ac.createOscillator();
    osc.type = i % 2 ? "sawtooth" : "triangle";
    osc.frequency.value = f;
    osc.detune.value = (i - 1.5) * 3;
    const g = ac.createGain();
    g.gain.value = i % 2 ? 0.06 : 0.22;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.12 + i * 0.07;
    const depth = ac.createGain();
    depth.gain.value = g.gain.value * 0.6;
    lfo.connect(depth).connect(g.gain);
    osc.connect(g).connect(lowpass);
    osc.start();
    lfo.start();
  });
  return master;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const ac = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);

  function toggle() {
    const ctx = (ac.current ??= new AudioContext());
    master.current ??= drone(ctx);
    const g = master.current.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    if (on) {
      g.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      setTimeout(() => ctx.state === "running" && !master.current?.gain.value && ctx.suspend(), 600);
    } else {
      ctx.resume();
      g.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);
      noise(ctx, 0.25, 900, 0.3); // cassette "clunk"
    }
    setOn(!on);
  }

  const crackle = () => on && ac.current && noise(ac.current, 0.5, 2200, 0.35);
  const clack = () => {
    if (!on || !ac.current) return;
    noise(ac.current, 0.04, 3000, 0.6);
    noise(ac.current, 0.05, 1400, 0.6, 0.11);
  };

  return <SoundCtx.Provider value={{ on, toggle, crackle, clack }}>{children}</SoundCtx.Provider>;
}
