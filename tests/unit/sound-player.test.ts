import { afterEach, describe, expect, it } from "vitest";
import {
  __setEngine,
  getPlayerState,
  pauseSound,
  playSound,
  setVolume,
  stopSound,
  toggleSound,
  type Engine,
} from "../../src/lib/sound-player";
import { SOUNDS, soundForDay } from "../../src/lib/sounds";
import * as content from "../../src/lib/content";
import { existsSync, readFileSync } from "node:fs";

/** A fake engine that records what the player asked it to do. */
function fakeEngine(opts: { fail?: boolean } = {}) {
  const log: string[] = [];
  let playing = 0;
  const e: Engine & { log: string[]; playing: () => number; volume: number } = {
    log,
    volume: 0,
    playing: () => playing,
    load: (src) => (opts.fail ? Promise.reject(new Error("404")) : Promise.resolve(`buf:${src}`)),
    start: (b, offset, fade) => {
      playing++;
      log.push(`start ${b} @${offset} fade${fade}`);
    },
    stop: (fade) => {
      playing--;
      log.push(`stop fade${fade}`);
      return 12.5;
    },
    setVolume: (v) => {
      e.volume = v;
    },
    resume: () => Promise.resolve(),
  };
  return e;
}
const tick = () => new Promise((r) => setTimeout(r, 0));
afterEach(() => __setEngine(null));

describe("shared sound player", () => {
  it("plays one sound at a time: starting another stops the first before it starts", async () => {
    const e = fakeEngine();
    __setEngine(() => e);
    await playSound("a", "/sounds/a.m4a");
    expect(getPlayerState()).toMatchObject({ id: "a", status: "playing" });
    await playSound("b", "/sounds/b.m4a");
    expect(getPlayerState()).toMatchObject({ id: "b", status: "playing" });
    expect(e.playing()).toBe(1);
    expect(e.log).toEqual([
      "start buf:/sounds/a.m4a @0 fade0.8",
      "stop fade0.35",
      "start buf:/sounds/b.m4a @0 fade0.8",
    ]);
  });

  it("pauses with a fade and resumes from the same place in the loop", async () => {
    const e = fakeEngine();
    __setEngine(() => e);
    await playSound("a", "/sounds/a.m4a");
    toggleSound("a", "/sounds/a.m4a");
    expect(getPlayerState().status).toBe("paused");
    await playSound("a", "/sounds/a.m4a");
    expect(e.log.at(-1)).toBe("start buf:/sounds/a.m4a @12.5 fade0.8");
    stopSound();
    expect(getPlayerState()).toMatchObject({ id: null, status: "idle" });
    expect(e.playing()).toBe(0);
  });

  it("reports a loading error instead of claiming playback", async () => {
    __setEngine(() => fakeEngine({ fail: true }));
    await playSound("a", "/sounds/missing.m4a");
    expect(getPlayerState()).toMatchObject({ id: "a", status: "error" });
  });

  it("a pause during loading wins: nothing starts afterwards", async () => {
    const e = fakeEngine();
    __setEngine(() => e);
    const p = playSound("a", "/sounds/a.m4a");
    pauseSound();
    await p;
    await tick();
    expect(e.playing()).toBe(0);
    expect(getPlayerState().status).toBe("paused");
  });

  it("volume is clamped, applied and never zero", async () => {
    const e = fakeEngine();
    __setEngine(() => e);
    await playSound("a", "/sounds/a.m4a");
    setVolume(0.4);
    expect(e.volume).toBe(0.4);
    setVolume(0);
    expect(getPlayerState().volume).toBe(0.05);
    setVolume(3);
    expect(getPlayerState().volume).toBe(1);
  });
});

describe("sound library", () => {
  it("has exactly the five verified CC0 recordings, bundled with the app", () => {
    expect(SOUNDS.map((s) => s.name)).toEqual([
      "Soft Rain",
      "Morning Birds",
      "Gentle Waves",
      "Quiet Piano",
      "Soft Ambient",
    ]);
    for (const s of SOUNDS) {
      expect(s.src).toMatch(/^\/sounds\/[a-z-]+\.m4a$/);
      expect(existsSync(`public${s.src}`), s.src).toBe(true);
      expect(readFileSync(`public${s.src}`).length).toBeGreaterThan(500_000);
      expect(s.rights).toMatch(/^CC0 1\.0\. ".+" by \S+, freesound\.org\/s\/\d+$/);
      // Accurate nature labels only: no healing, frequency, nervous-system or medical wording.
      expect(`${s.name} ${s.description}`).not.toMatch(
        /heal|hz|frequency|nervous|anxiety|stress|sleep|therap|cortisol|calm your|focus|proven|brain/i,
      );
    }
    expect(JSON.stringify(content)).not.toMatch(/pixabay|freesound\.org\/data|cdn\.freesound/i);
  });

  it("offers one of the five on each of the 21 days, repeating in order", () => {
    const days = Array.from({ length: 21 }, (_, i) => soundForDay(i + 1)?.id);
    expect(days.slice(0, 6)).toEqual([
      "soft-rain",
      "morning-birds",
      "gentle-waves",
      "quiet-piano",
      "soft-ambient",
      "soft-rain",
    ]);
    expect(new Set(days).size).toBe(5);
    expect(soundForDay(3, [])).toBeNull();
  });
});
