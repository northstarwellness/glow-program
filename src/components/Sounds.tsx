import { useState } from "react";
import { SOUNDS, soundForDay, type Sound } from "@/lib/sounds";
import {
  playSound,
  setVolume,
  toggleSound,
  useSoundPlayer,
  type PlayerState,
} from "@/lib/sound-player";

function statusText(p: PlayerState, s: Sound) {
  if (p.id !== s.id) return "Plays on a loop";
  if (p.status === "loading") return "Loading…";
  if (p.status === "playing") return "Playing";
  if (p.status === "paused") return "Paused";
  if (p.status === "error") return "Couldn't play this sound. Check your connection and try again.";
  return "Plays on a loop";
}

/** One volume for every sound, remembered on this device. */
function VolumeControl({
  p,
  id,
  tone = "plum",
}: {
  p: PlayerState;
  id: string;
  tone?: "plum" | "charcoal";
}) {
  const color = tone === "plum" ? "var(--plum)" : "var(--charcoal)";
  return (
    <div className="mt-3 flex items-center gap-3">
      <label htmlFor={id} className="text-[12px]" style={{ color }}>
        Volume
      </label>
      <input
        id={id}
        type="range"
        min={5}
        max={100}
        step={1}
        value={Math.round(p.volume * 100)}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        className="sound-volume h-11 min-w-0 flex-1"
        style={{ accentColor: "var(--cranberry)" }}
        aria-valuetext={`${Math.round(p.volume * 100)} percent`}
        data-testid="sound-volume"
      />
    </div>
  );
}

function PlayButton({ p, s }: { p: PlayerState; s: Sound }) {
  const active = p.id === s.id && (p.status === "playing" || p.status === "loading");
  return (
    <button
      type="button"
      onClick={() => toggleSound(s.id, s.src)}
      aria-label={`${active ? "Pause" : "Play"} ${s.name}`}
      aria-pressed={active}
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--cranberry)] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
    >
      {active ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
    </button>
  );
}

/** The Sounds library. With no verified tracks it says so plainly instead of offering silence. */
export function SoundLibrary({ sounds = SOUNDS }: { sounds?: readonly Sound[] }) {
  const p = useSoundPlayer();
  if (!sounds.length) {
    return (
      <div className="sand-card p-5" data-testid="sounds-unavailable">
        <p className="font-serif text-[18px] text-[var(--plum)]">No sounds right now</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--plum)]/75">
          Your ritual works fully without them.
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-3" data-testid="sound-library">
      {sounds.map((s) => (
        <li
          key={s.id}
          className="sand-card flex items-center justify-between gap-4 p-4"
          data-testid="sound-row"
        >
          <div className="min-w-0">
            <p className="font-serif text-[18px] text-[var(--plum)]">{s.name}</p>
            <p className="text-[12.5px] text-[var(--plum)]/70">{s.description}</p>
            <p
              role="status"
              className="mt-0.5 text-[11px] uppercase tracking-wide text-[var(--ink-2)]"
            >
              {statusText(p, s)}
            </p>
          </div>
          <PlayButton p={p} s={s} />
        </li>
      ))}
      <li className="px-1">
        <VolumeControl p={p} id="sound-volume-library" />
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--plum)]/65">
          Optional background listening: nature recordings and quiet instrumentals. They play only
          when you tap Play, one at a time, on a loop until you pause. Sound is never needed to
          finish a morning.
        </p>
        <details className="mt-2 text-[12px] text-[var(--plum)]/65">
          <summary className="inline-flex min-h-11 cursor-pointer items-center">
            Sound credits
          </summary>
          <ul className="space-y-1 pb-2">
            {sounds.map((x) => (
              <li key={x.id}>
                {x.name}: {x.rights}
              </li>
            ))}
          </ul>
        </details>
      </li>
    </ul>
  );
}

/**
 * Optional "Sound for this morning" on each day. Never plays on its own and never affects
 * completing the day. Hidden while no verified sound exists.
 */
export function DailySound({ day, sounds = SOUNDS }: { day: number; sounds?: readonly Sound[] }) {
  const p = useSoundPlayer();
  const [chosen, setChosen] = useState<string | null>(null);
  const [choosing, setChoosing] = useState(false);
  const fallback = soundForDay(day, sounds);
  if (!fallback) return null;
  const s = sounds.find((x) => x.id === chosen) ?? fallback;
  return (
    <section
      id="day-sound"
      aria-labelledby={`sound-${day}`}
      data-testid="daily-sound"
      className="mt-5 scroll-mt-6 rounded-2xl border border-[var(--taupe)]/20 bg-white p-5 shadow-sm"
    >
      <p id={`sound-${day}`} className="label-caps mb-3 text-[var(--ink-2)]">
        Optional · Sound for this morning
      </p>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-[18px] text-[var(--charcoal)]">{s.name}</p>
          <p role="status" className="text-[12px] text-[var(--charcoal)]/65">
            {statusText(p, s)}
          </p>
        </div>
        <PlayButton p={p} s={s} />
      </div>
      <VolumeControl p={p} id={`sound-volume-day-${day}`} tone="charcoal" />
      <button
        type="button"
        onClick={() => setChoosing((c) => !c)}
        aria-expanded={choosing}
        className="mt-2 inline-flex min-h-11 items-center text-[13px] text-[var(--charcoal)]/75 underline decoration-[var(--gold)]/60 underline-offset-4"
      >
        Choose another sound
      </button>
      {choosing && (
        <ul className="mt-1 flex flex-wrap gap-2">
          {sounds.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                aria-pressed={x.id === s.id}
                onClick={() => {
                  setChosen(x.id);
                  setChoosing(false);
                  // Already listening: switch straight to the new sound (the old one stops first).
                  if (p.status === "playing" || p.status === "loading") playSound(x.id, x.src);
                }}
                className={`min-h-11 rounded-full border px-4 text-[13px] ${x.id === s.id ? "border-[var(--gold)] text-[var(--charcoal)]" : "border-[var(--taupe)]/40 text-[var(--charcoal)]/75"}`}
              >
                {x.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
