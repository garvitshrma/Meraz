"use client";

// Background music, as on the coming-soon page: a playlist streamed by a hidden YouTube player (IFrame API), each song
// from its chosen moment, the next one when it ends. Browsers allow sound only after the visitor interacts, so every
// click, tap or key press tries to start it until it plays, unless the visitor paused it (remembered). Lives in the
// layout, so the song carries on from page to page. The "now playing" card is painted like the site's buttons; it
// appears once the player is ready and stays away if YouTube is blocked or a video is unavailable. On a phone the
// YouTube and Spotify links drop out to keep it small. It can be dragged anywhere; the spot is kept.
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { DotsSixVertical, Pause, Play, SkipBack, SkipForward, SpotifyLogo, YoutubeLogo } from "@phosphor-icons/react";

const SONGS = [
  { id: "Q-pA2JKBsE8", start: 93, title: "Pran", artist: "Ritviz" },
  { id: "s4fYA_wkta8", start: 167, title: "Iss Tarah", artist: "Chaar Diwaari ft. Sonu Nigam" },
  { id: "zN38VR5Fr8I", start: 13, title: "Class-Sikh Maut Vol. II", artist: "Prabh Deep x Seedhe Maut" },
  { id: "N1s-GN1SWqY", start: 10, title: "Maharani", artist: "Karun, Lambo Drive, Arpit Bala & Revo Lekhak" },
  { id: "-YlmnPh-6rE", start: 4, title: "For A Reason", artist: "Karan Aujla & Ikky" },
  { id: "w6Vj7fq1LEQ", start: 48, title: "Kaafizyada", artist: "Nanku" },
];
const VOLUME = 60;
const MUTED_KEY = "bgm-muted";
const POS_KEY = "bgm-pos"; // where the visitor dragged the card to, remembered
const EDGE = 6; // the card is kept this many px inside the screen

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  unMute(): void;
  setVolume(v: number): void;
  loadVideoById(o: { videoId: string; startSeconds: number }): void;
};
type YTNamespace = { Player: new (el: HTMLElement, o: object) => YTPlayer; PlayerState: { PLAYING: number; ENDED: number } };
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function MusicPlayer() {
  const pathname = usePathname();
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  // read inside the player's callbacks, which are made once
  const state = useRef({ idx: 0, playing: false, muted: false, wanted: false, ready: false });
  const controls = useRef({ next: () => {}, prev: () => {}, toggle: () => {} }); // set up with the player
  // The card can be picked up and put anywhere: dragged by any part of it but its buttons, by mouse or finger.
  const card = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const grab = useRef<{ dx: number; dy: number; id: number } | null>(null);
  const clampPos = (x: number, y: number) => {
    const r = card.current?.getBoundingClientRect();
    const [w, h] = [r?.width ?? 0, r?.height ?? 0];
    return { x: Math.min(Math.max(EDGE, x), innerWidth - w - EDGE), y: Math.min(Math.max(EDGE, y), innerHeight - h - EDGE) };
  };
  useEffect(() => {
    if (!ready) return;
    try {
      const saved = JSON.parse(localStorage.getItem(POS_KEY) ?? "null");
      if (saved) setPos(clampPos(saved.x, saved.y));
    } catch {}
    // keep it on screen when the window changes size (a phone turning, its browser bar sliding)
    const keep = () => setPos((p) => (p ? clampPos(p.x, p.y) : p));
    addEventListener("resize", keep);
    return () => removeEventListener("resize", keep);
  }, [ready]);
  const drag = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as Element).closest("a,button") || e.button !== 0) return;
      const r = e.currentTarget.getBoundingClientRect();
      grab.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, id: e.pointerId };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      const g = grab.current;
      if (g && g.id === e.pointerId) setPos(clampPos(e.clientX - g.dx, e.clientY - g.dy));
    },
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => {
      if (grab.current?.id !== e.pointerId) return;
      grab.current = null;
      setPos((p) => {
        try {
          if (p) localStorage.setItem(POS_KEY, JSON.stringify(p));
        } catch {}
        return p;
      });
    },
  };

  useEffect(() => {
    try {
      state.current.muted = localStorage.getItem(MUTED_KEY) === "1";
    } catch {}
    const s = state.current;
    const play = () => {
      s.wanted = true;
      const p = player.current;
      if (s.ready && p) {
        p.unMute();
        p.setVolume(VOLUME);
        p.playVideo();
      }
    };
    const go = (step: number) => {
      s.idx = (s.idx + step + SONGS.length) % SONGS.length;
      setIdx(s.idx);
      const p = player.current;
      if (!s.ready || !p) return;
      s.muted = false;
      try {
        localStorage.setItem(MUTED_KEY, "0");
      } catch {}
      p.unMute();
      p.setVolume(VOLUME);
      p.loadVideoById({ videoId: SONGS[s.idx].id, startSeconds: SONGS[s.idx].start });
    };
    controls.current = {
      next: () => go(1),
      prev: () => go(-1),
      toggle: () => {
        s.muted = s.playing;
        try {
          localStorage.setItem(MUTED_KEY, s.muted ? "1" : "0");
        } catch {}
        if (s.muted) {
          s.wanted = false;
          player.current?.pauseVideo();
        } else play();
      },
    };

    const make = () => {
      const YT = window.YT!;
      player.current = new YT.Player(host.current!, {
        host: "https://www.youtube-nocookie.com",
        videoId: SONGS[0].id,
        width: 640,
        height: 360,
        playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, start: SONGS[0].start, origin: location.origin },
        events: {
          onReady: () => {
            s.ready = true;
            setReady(true);
            player.current!.setVolume(VOLUME);
            if (s.wanted && !s.muted) play();
          },
          onStateChange: (e: { data: number }) => {
            s.playing = e.data === YT.PlayerState.PLAYING;
            setPlaying(s.playing);
            if (e.data === YT.PlayerState.ENDED) go(1);
          },
          onError: () => setFailed(true), // video unavailable: no card
        },
      });
    };
    if (window.YT?.Player) make();
    else {
      window.onYouTubeIframeAPIReady = make;
      const api = document.createElement("script");
      api.src = "https://www.youtube.com/iframe_api";
      api.onerror = () => setFailed(true); // YouTube blocked or offline: the site works without music
      document.head.append(api);
    }

    // every click, tap or key press tries to start the song until it plays, unless the visitor paused it
    const nudge = (e: Event) => {
      if ((e.target as Element).closest?.("[data-music]")) return; // the card handles itself
      if (!s.playing && !s.muted) play();
    };
    addEventListener("pointerdown", nudge);
    addEventListener("keydown", nudge);
    return () => {
      removeEventListener("pointerdown", nudge);
      removeEventListener("keydown", nudge);
    };
  }, []);

  const song = SONGS[idx];
  const q = encodeURIComponent(`${song.title} ${song.artist}`);
  // top right until moved: under the nav bar on inner pages (home has none)
  const top = pathname === "/" ? "top-3" : "top-[5.6rem]";
  const icon = "grid size-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-cream/15";

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 size-px opacity-0">
        <div ref={host} />
      </div>
      {!failed ? (
        <>
          <div
            ref={card}
            data-music
            {...drag}
            onPointerCancel={drag.onPointerUp}
            style={pos ? { left: pos.x, top: pos.y } : undefined}
            className={`fixed z-[15001] flex cursor-grab touch-none select-none items-center gap-0.5 rounded-full border-[3px] border-ink/60 bg-ink/45 py-0.5 pl-1 pr-0.5 text-turmeric shadow-[inset_0_0_0_2px_rgb(242_193_78/0.7),4px_4px_0_rgb(184_22_111/0.55)] backdrop-blur-md active:cursor-grabbing print:hidden ${pos ? "" : `right-3 ${top}`}`}
          >
            {/* the grip: shows it can be moved */}
            <DotsSixVertical size={18} weight="bold" aria-hidden="true" className="shrink-0 opacity-70" />
            {/* a little equaliser, moving while the song plays */}
            <span aria-hidden="true" className="mr-2 flex h-3 items-end gap-0.5 max-sm:mr-1">
              {[0, -0.3, -0.6].map((d) => (
                <i
                  key={d}
                  className={`block w-[3px] rounded-[1px] bg-current ${playing ? "h-full animate-[eq_0.9s_ease-in-out_infinite_alternate]" : "h-[30%]"}`}
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </span>
            <span className="mr-1 max-w-[min(30vw,14rem)] truncate font-display text-xs">
              {song.title} <span className="font-sans font-normal text-cream/80">· {song.artist}</span>
            </span>
            <a className={`${icon} max-sm:hidden`} href={`https://www.youtube.com/watch?v=${song.id}`} target="_blank" rel="noopener noreferrer" aria-label={`${song.title} by ${song.artist} on YouTube`}>
              <YoutubeLogo size={20} weight="fill" aria-hidden="true" />
            </a>
            <a className={`${icon} max-sm:hidden`} href={`https://open.spotify.com/search/${q}`} target="_blank" rel="noopener noreferrer" aria-label={`${song.title} by ${song.artist} on Spotify`}>
              <SpotifyLogo size={20} weight="fill" aria-hidden="true" />
            </a>
            <button type="button" className={icon} onClick={() => controls.current.prev()} aria-label="Previous song">
              <SkipBack size={18} weight="fill" aria-hidden="true" />
            </button>
            <button type="button" className={icon} onClick={() => controls.current.next()} aria-label="Next song">
              <SkipForward size={18} weight="fill" aria-hidden="true" />
            </button>
            <button type="button" className={`${icon} bg-turmeric text-ink hover:bg-cream`} onClick={() => controls.current.toggle()} aria-label={playing ? "Pause music" : "Play music"}>
              {playing ? <Pause size={18} weight="fill" aria-hidden="true" /> : <Play size={18} weight="fill" aria-hidden="true" />}
            </button>
          </div>
          {failed && (
            <div className="fixed bottom-3 right-3 z-50 text-xs px-2 py-1 rounded bg-red-900/80 text-cream font-mono pointer-events-none select-none">
              YouTube blocked — music unavailable
            </div>
          )}
        </>
      ) : (
        <div className="fixed bottom-3 right-3 z-50 text-xs px-2 py-1 rounded bg-red-900/80 text-cream font-mono pointer-events-none select-none">
          YouTube blocked — music unavailable
        </div>
      )}
    </>
  );
}
