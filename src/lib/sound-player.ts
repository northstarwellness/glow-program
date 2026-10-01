import { useEffect, useSyncExternalStore } from "react";

/**
 * One shared sound player for the whole app (Web Audio).
 *
 * - One sound at a time: starting another fades the current one out and stops it first.
 * - Seamless loops: each bundled file is decoded once and looped sample-accurately.
 * - Volume works on iPhone too (HTMLAudioElement.volume is ignored by iOS Safari), through a gain
 *   node, and is remembered on this device.
 * - Gentle fades in and out on play, pause and switching.
 * - Never starts on its own: only playSound(), called from a tap.
 * - Pauses when the page is hidden and stops when the last screen with a sound control closes.
 *   Background or offline playback is not promised.
 */
export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";
export type PlayerState = { id: string | null; status: PlayerStatus; volume: number };

/** The small slice of the Web Audio API this player uses (swappable in tests). */
export type Engine = {
  load(src: string): Promise<unknown>;
  start(buffer: unknown, offset: number, fadeIn: number): void;
  stop(fadeOut: number): number; // returns the loop position to resume from
  setVolume(v: number): void;
  resume(): Promise<void>;
};

const FADE_IN = 0.8;
const FADE_OUT = 0.35;
const VOLUME_KEY = "noure_sound_volume";

let engine: Engine | null = null;
let makeEngine: () => Engine = () => webAudioEngine();
let current: { id: string; buffer: unknown; offset: number } | null = null;
let token = 0;
let users = 0;
const listeners = new Set<() => void>();

function readVolume() {
  try {
    const v = Number(localStorage.getItem(VOLUME_KEY));
    if (Number.isFinite(v) && v > 0 && v <= 1) return v;
  } catch {
    /* storage unavailable */
  }
  return 0.7;
}
let state: PlayerState = { id: null, status: "idle", volume: 0.7 };
let volumeLoaded = false;

function set(next: Partial<PlayerState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}
function eng() {
  if (!engine) {
    engine = makeEngine();
    if (!volumeLoaded) {
      volumeLoaded = true;
      state = { ...state, volume: readVolume() };
    }
    engine.setVolume(state.volume);
  }
  return engine;
}

/** Tests supply a fake engine. */
export function __setEngine(make: (() => Engine) | null) {
  makeEngine = make ?? (() => webAudioEngine());
  engine = null;
  current = null;
  token = 0;
  volumeLoaded = true;
  state = { id: null, status: "idle", volume: 0.7 };
}

export async function playSound(id: string, src: string) {
  const e = eng();
  const my = ++token;
  // Resume inside the tap so iOS allows audio.
  const resumed = e.resume().catch(() => undefined);
  if (current && current.id === id && state.status === "paused") {
    await resumed;
    if (my !== token) return;
    e.start(current.buffer, current.offset, FADE_IN);
    set({ id, status: "playing" });
    return;
  }
  if (state.status === "playing" || state.status === "loading") e.stop(FADE_OUT);
  current = null;
  set({ id, status: "loading" });
  try {
    const [buffer] = await Promise.all([e.load(src), resumed]);
    if (my !== token) return; // another tap won
    current = { id, buffer, offset: 0 };
    e.start(buffer, 0, FADE_IN);
    set({ id, status: "playing" });
  } catch {
    if (my === token) set({ id, status: "error" });
  }
}

export function pauseSound() {
  token++;
  if (!engine || state.status !== "playing") {
    if (state.status === "loading") set({ status: "paused" });
    return;
  }
  const pos = engine.stop(FADE_OUT);
  if (current) current.offset = pos;
  set({ status: "paused" });
}

export function stopSound() {
  token++;
  if (engine && state.status === "playing") engine.stop(FADE_OUT);
  current = null;
  set({ id: null, status: "idle" });
}

export function toggleSound(id: string, src: string) {
  if (state.id === id && (state.status === "playing" || state.status === "loading")) pauseSound();
  else void playSound(id, src);
}

export function setVolume(v: number) {
  const vol = Math.min(1, Math.max(0.05, v));
  try {
    localStorage.setItem(VOLUME_KEY, String(vol));
  } catch {
    /* not remembered, still applied */
  }
  engine?.setVolume(vol);
  volumeLoaded = true;
  set({ volume: vol });
}

export function getPlayerState() {
  return state;
}

/** Subscribes a sound control. Pauses when the page is hidden; stops when the last one unmounts. */
export function useSoundPlayer(): PlayerState {
  useEffect(() => {
    users += 1;
    if (!volumeLoaded) {
      volumeLoaded = true;
      set({ volume: readVolume() });
    }
    const onHide = () => {
      if (document.visibilityState === "hidden") pauseSound();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      users -= 1;
      if (users === 0) stopSound();
    };
  }, []);
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

/** The real engine: fetch + decode once per sound, loop an AudioBufferSourceNode through gains. */
function webAudioEngine(): Engine {
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.connect(ctx.destination);
  const cache = new Map<string, AudioBuffer>();
  let live: {
    src: AudioBufferSourceNode;
    fade: GainNode;
    startedAt: number;
    offset: number;
  } | null = null;
  const w = window as unknown as { __ritualSound?: Record<string, unknown> };
  const diag = (extra: Record<string, unknown> = {}) =>
    (w.__ritualSound = {
      contextState: ctx.state,
      playing: !!live,
      loop: live?.src.loop ?? false,
      volume: master.gain.value,
      ...extra,
    });
  diag();
  return {
    async load(url) {
      const hit = cache.get(url);
      if (hit) return hit;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.arrayBuffer();
      const buf = await new Promise<AudioBuffer>((ok, bad) => ctx.decodeAudioData(data, ok, bad));
      // Keep only the most recent sound decoded, to limit memory on phones.
      cache.clear();
      cache.set(url, buf);
      return buf;
    },
    start(buffer, offset, fadeIn) {
      const b = buffer as AudioBuffer;
      const src = ctx.createBufferSource();
      src.buffer = b;
      src.loop = true;
      const fade = ctx.createGain();
      const t = ctx.currentTime;
      fade.gain.setValueAtTime(0.0001, t);
      fade.gain.exponentialRampToValueAtTime(1, t + fadeIn);
      src.connect(fade).connect(master);
      const off = ((offset % b.duration) + b.duration) % b.duration;
      src.start(t, off);
      live = { src, fade, startedAt: t, offset: off };
      diag({ startedAt: t });
    },
    stop(fadeOut) {
      if (!live) return 0;
      const { src, fade, startedAt, offset } = live;
      const t = ctx.currentTime;
      const dur = src.buffer?.duration ?? 1;
      const pos = (offset + (t - startedAt)) % dur;
      fade.gain.cancelScheduledValues(t);
      fade.gain.setValueAtTime(Math.max(fade.gain.value, 0.0001), t);
      fade.gain.exponentialRampToValueAtTime(0.0001, t + fadeOut);
      src.stop(t + fadeOut + 0.02);
      live = null;
      diag();
      return pos;
    },
    setVolume(v) {
      master.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
      diag({ volume: v });
    },
    async resume() {
      if (ctx.state !== "running") await ctx.resume();
      diag();
    },
  };
}
