import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import type { ReflectionEntry } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { GLOW_FOCUS, getPersonalizedTasks, currentStreak } from "@/lib/content";
import type { ChecklistTask } from "@/lib/content";

export const Route = createFileRoute("/checklist")({ component: ChecklistPage });

const SKIN_LABELS = ["Rough", "Dull", "Okay", "Clear", "Radiant"];
const GUT_LABELS  = ["Heavy", "Unsettled", "Okay", "Comfortable", "Calm"];
const ENERGY_LABELS = ["Depleted", "Low", "Steady", "Good", "Vibrant"];
const MOOD_LABELS = ["Heavy", "Quiet", "Okay", "Light", "Bright"];

function ChecklistPage() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;

  const day = currentDay(s.startDate);
  const focus = GLOW_FOCUS[day];
  const tasks = getPersonalizedTasks(
    day,
    s.onboarding.skinGoal,
    s.onboarding.gutGoal,
    s.onboarding.morningPace
  );
  const dayLog = s.checklistLogs[day] ?? {};
  const doneCount = tasks.filter((t) => dayLog[t.id]).length;
  const streak = currentStreak(s.startDate, s.completedDays, s.checklistLogs);
  const existing = s.reflectionLogs[day];

  return (
    <Frame>
      <TopBar name={s.name} day={day} />

      {/* Streak ribbon */}
      {streak > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[var(--gold)]/12 px-4 py-3">
          <StreakRing streak={streak} />
          <div>
            <p className="font-serif text-[17px] text-[var(--plum)]">
              {streak === 1 ? "Today is day one." : `${streak} days showing up.`}
            </p>
            <p className="text-[11px] text-[var(--plum)]/55">
              {streak < 7 ? "The ritual is forming." : streak < 14 ? "The ritual is becoming yours." : "The ritual belongs to you."}
            </p>
          </div>
        </div>
      )}

      {/* Today's Glow Focus card */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 text-[var(--ivory)] shadow-lg"
        style={{ background: "linear-gradient(135deg, #5C2541 0%, #7B2D4E 60%, #9B4870 100%)" }}
      >
        <p className="label-caps text-[var(--gold)]/85">✦ Today's Glow Focus · Day {day}</p>
        <h2 className="mt-3 font-serif text-[26px] leading-tight">{focus?.focus}</h2>
        <p className="mt-2 font-serif italic text-[14px] leading-relaxed text-[var(--ivory)]/80">{focus?.sub}</p>
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[var(--gold)]/15 blur-2xl" />
      </div>

      {/* Task progress summary */}
      <div className="mt-5 flex items-center justify-between">
        <p className="label-caps text-[var(--plum)]/55">Your ritual tasks</p>
        <span className={`rounded-full px-3 py-1 text-[11px] tracking-wide ${
          doneCount === tasks.length
            ? "bg-[var(--gold)]/20 text-[var(--gold)]"
            : "bg-[var(--sand)] text-[var(--plum)]/60"
        }`}>
          {doneCount} / {tasks.length} complete
        </span>
      </div>

      {/* Task list */}
      <div className="mt-2 space-y-2.5">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            done={!!dayLog[task.id]}
            onToggle={() => s.toggleChecklist(day, task.id)}
          />
        ))}
      </div>

      {doneCount === tasks.length && (
        <div className="mt-5 fade-rise rounded-2xl border border-[var(--gold)]/40 bg-[var(--card)] px-5 py-4 text-center shadow-sm">
          <p className="text-[20px] tracking-[0.3em] text-[var(--gold)]">✦ ✧ ✦</p>
          <p className="mt-2 font-serif italic text-[17px] text-[var(--plum)]">
            Today's ritual is complete, {s.name}.
          </p>
          <p className="mt-1 text-[12px] text-[var(--plum)]/55">
            Scroll down to log your daily reflection.
          </p>
        </div>
      )}

      <GoldDivider />

      {/* Daily Reflection */}
      <ReflectionPanel day={day} existing={existing ?? null} onSave={(e) => s.saveReflection(day, e)} />

      <GoldDivider />
      <div className="flex items-center justify-between">
        <Link to="/home" className="font-serif italic text-[13px] text-[var(--plum)]/50">← Home</Link>
        <Link to="/grocery" className="font-serif italic text-[13px] text-[var(--plum)]/50">Grocery list →</Link>
      </div>
    </Frame>
  );
}

function TaskRow({ task, done, onToggle }: { task: ChecklistTask; done: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all ${
      done ? "border-[var(--gold)]/40 bg-[var(--gold)]/8" : "border-[var(--plum)]/10 bg-[var(--card)]"
    } shadow-sm`}>
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
            done
              ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--ivory)]"
              : "border-[var(--plum)]/25 bg-transparent"
          }`}
        >
          {done && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M4 13l4 4L20 6" />
            </svg>
          )}
        </button>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <button onClick={() => setExpanded((v) => !v)} className="w-full text-left">
            <p className={`font-serif text-[17px] leading-tight ${done ? "text-[var(--plum)]/60 line-through decoration-[var(--gold)]/50" : "text-[var(--plum)]"}`}>
              {task.label}
            </p>
            {!expanded && (
              <p className="mt-0.5 text-[11px] text-[var(--plum)]/40">Tap for detail</p>
            )}
          </button>

          {expanded && (
            <p className="mt-2 font-serif italic text-[13.5px] leading-relaxed text-[var(--plum)]/70 fade-rise">
              {task.detail}
            </p>
          )}
        </div>

        {/* Category badge */}
        <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] tracking-wide ${categoryStyle(task.category)}`}>
          {task.category}
        </span>
      </div>
    </div>
  );
}

function categoryStyle(cat: ChecklistTask["category"]): string {
  switch (cat) {
    case "ritual":  return "bg-[var(--plum)]/10 text-[var(--plum)]/70";
    case "nourish": return "bg-[var(--gold)]/15 text-[var(--gold)]";
    case "hydrate": return "bg-[oklch(0.55_0.09_200)]/15 text-[oklch(0.45_0.09_200)]";
    case "reflect": return "bg-[var(--berry)]/10 text-[var(--berry)]/80";
    case "rest":    return "bg-[oklch(0.55_0.06_130)]/15 text-[oklch(0.42_0.07_130)]";
  }
}

// ─── Reflection Panel ──────────────────────────────────────

function ReflectionPanel({
  day,
  existing,
  onSave,
}: {
  day: number;
  existing: ReflectionEntry | null;
  onSave: (e: ReflectionEntry) => void;
}) {
  const [skin, setSkin] = useState(existing?.skin ?? 0);
  const [gut, setGut] = useState(existing?.gut ?? 0);
  const [energy, setEnergy] = useState(existing?.energy ?? 0);
  const [mood, setMood] = useState(existing?.mood ?? 0);
  const [saved, setSaved] = useState(!!existing);

  const allPicked = skin > 0 && gut > 0 && energy > 0 && mood > 0;

  const handleSave = () => {
    onSave({ skin, gut, energy, mood, timestamp: new Date().toISOString() });
    setSaved(true);
  };

  return (
    <div>
      <p className="label-caps text-[var(--gold)]">Daily reflection</p>
      <p className="mt-1 font-serif italic text-[14px] text-[var(--plum)]/60">
        How are you feeling today? One tap per row.
      </p>

      <div className="mt-5 space-y-5">
        <ScaleRow label="Skin" value={skin} labels={SKIN_LABELS} onChange={setSkin} saved={saved} />
        <ScaleRow label="Gut" value={gut} labels={GUT_LABELS} onChange={setGut} saved={saved} />
        <ScaleRow label="Energy" value={energy} labels={ENERGY_LABELS} onChange={setEnergy} saved={saved} />
        <ScaleRow label="Mood" value={mood} labels={MOOD_LABELS} onChange={setMood} saved={saved} />
      </div>

      {!saved && (
        <button
          onClick={handleSave}
          disabled={!allPicked}
          className="gold-pill-btn mt-6 w-full disabled:opacity-40"
        >
          ✦ Save today's reflection
        </button>
      )}

      {saved && (
        <div className="mt-5 fade-rise rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] p-5 text-center">
          <p className="text-[18px] tracking-[0.3em] text-[var(--gold)]">✦</p>
          <p className="mt-2 font-serif italic text-[16px] text-[var(--plum)]">Reflection logged for Day {day}.</p>
          <p className="mt-1 text-[12px] text-[var(--plum)]/50">
            Your patterns will reveal themselves over time.
          </p>
        </div>
      )}
    </div>
  );
}

function ScaleRow({
  label,
  value,
  labels,
  onChange,
  saved,
}: {
  label: string;
  value: number;
  labels: string[];
  onChange: (v: number) => void;
  saved: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-serif text-[15px] text-[var(--plum)]">{label}</p>
        {value > 0 && (
          <p className="font-serif italic text-[13px] text-[var(--gold)]">{labels[value - 1]}</p>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => !saved && onChange(n)}
            disabled={saved}
            className={`flex-1 rounded-xl py-3 text-[12px] font-medium transition-all ${
              value === n
                ? "bg-[var(--gold)] text-[var(--ivory)] shadow-sm"
                : value > 0 && n < value
                ? "bg-[var(--gold)]/25 text-[var(--plum)]/60"
                : "bg-[var(--sand)] text-[var(--plum)]/50"
            } ${saved ? "cursor-default" : "hover:bg-[var(--gold)]/30"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Streak Ring ───────────────────────────────────────────

function StreakRing({ streak }: { streak: number }) {
  const pct = Math.min(streak / 21, 1);
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="oklch(0.388 0.108 354 / 0.12)" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={r}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute font-serif text-[13px] text-[var(--plum)]">{streak}</span>
    </div>
  );
}
