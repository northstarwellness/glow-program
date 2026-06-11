import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Frame, GoldDivider } from "@/components/Frame";
import { useApp, unlockedUpTo, glowScore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, JOURNAL_PROMPTS, PHASES, RECIPES, REDS_URL, phaseFor } from "@/lib/content";
import { SmoothieImage } from "@/components/SmoothieImage";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (!hydrated) return;
    const trigger = (id: string) => {
      if (s.completedDays.includes(parseMilestone(id)) && !s.shownMilestones.includes(id)) {
        navigate({ to: "/milestone/$id", params: { id } });
      }
    };
    if (s.completedDays.includes(1)) trigger("day-1");
    if (s.completedDays.includes(7)) trigger("day-7");
    if (s.completedDays.includes(14)) trigger("day-14");
    if (s.completedDays.includes(21)) {
      if (!s.shownMilestones.includes("day-21")) navigate({ to: "/celebrate" });
    }
  }, [hydrated, s.completedDays, s.shownMilestones, navigate]);

  if (hydrated && !s.name) return <Navigate to="/" />;
  if (hydrated && s.name && !s.seenWelcome) return <Navigate to="/welcome" />;

  const day = unlockedUpTo(s.startDate, s.completedDays);
  const phase = phaseFor(day);
  const today = DAYS[day - 1];
  const recipe = RECIPES.find((r) => r.id === today.recipeId)!;
  const log = s.dailyLogs[day] ?? {};
  const allLogged = log.reds && log.ritual && log.journal;
  const promptText = JOURNAL_PROMPTS[day]?.(s.name ?? "") ?? "";
  const score = glowScore(s);
  const streak = calcStreak(s.completedDays, day);
  const pct = Math.round((s.completedDays.length / 21) * 100);

  return (
    <Frame>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/home" className="font-serif text-base tracking-[0.32em] text-[var(--charcoal)]">RITUAL APP</Link>
        <Link to="/profile" className="flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase text-[var(--charcoal)]/45">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
          Day {day} of 21
        </Link>
      </div>

      {/* Greeting */}
      <div className="mb-2">
        <p className="font-serif text-[14px] italic text-[var(--charcoal)]/45">Good morning,</p>
        <h1 className="font-serif text-[34px] leading-tight text-[var(--charcoal)]">{s.name}.</h1>
      </div>

      {/* Progress bar */}
      <div className="mt-5 mb-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="label-caps text-[var(--charcoal)]/40">Reset progress</span>
          <span className="font-serif text-[13px] text-[var(--charcoal)]/45">{pct}% complete</span>
        </div>
        <div className="h-1 w-full rounded-full bg-[var(--taupe)]/25">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm p-3 text-center">
          <p className="font-serif text-[26px] leading-none text-[var(--gold)]">{score}</p>
          <p className="mt-1 text-[9.5px] tracking-[0.14em] uppercase text-[var(--charcoal)]/45">Glow Score</p>
        </div>
        <div className="rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm p-3 text-center">
          <p className="font-serif text-[26px] leading-none text-[var(--charcoal)]">{streak}</p>
          <p className="mt-1 text-[9.5px] tracking-[0.14em] uppercase text-[var(--charcoal)]/45">Day Streak</p>
        </div>
        <div className="rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm p-3 text-center">
          <p className="font-serif text-[26px] leading-none text-[var(--charcoal)]">{21 - day + 1}</p>
          <p className="mt-1 text-[9.5px] tracking-[0.14em] uppercase text-[var(--charcoal)]/45">Days Left</p>
        </div>
      </div>

      {/* Hero — today's ritual — editorial light card */}
      <Link to="/day/$n" params={{ n: String(day) }} className="block mt-5">
        <div
          className="relative overflow-hidden rounded-3xl p-6 cursor-pointer"
          style={{
            background: "var(--beige)",
            border: "1px solid oklch(0.748 0.012 65 / 0.2)",
          }}
        >
          {/* Gold accent bar */}
          <div className="mb-4 h-px w-8 bg-[var(--gold)]/60" />
          <p className="label-caps text-[var(--gold)]">{phase.label} · Week {phase.week}</p>
          <p className="mt-2 font-serif text-[68px] leading-none text-[var(--charcoal)]">Day {day}</p>
          <h2 className="mt-1 font-serif text-[22px] leading-tight text-[var(--charcoal)]">{today.title}</h2>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--charcoal)]/55">{today.teaser}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--charcoal)] px-5 py-2.5 font-serif text-[14px] text-[var(--ivory)]">
            Open Today's Ritual →
          </div>
          {/* Subtle decorative element */}
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[var(--gold)]/8 blur-3xl" />
        </div>
      </Link>

      {/* Quick log */}
      <div className="mt-5">
        <p className="label-caps text-[var(--charcoal)]/40">Today's check-ins</p>
        <div className={`mt-2.5 grid grid-cols-3 gap-2 rounded-2xl p-2 transition-all ${allLogged ? "bg-[var(--gold)]/8" : ""}`}>
          <LogTile label="Radiant Reds" icon="glass" done={!!log.reds} onClick={() => s.toggleLog(day, "reds")} />
          <LogTile label="Morning ritual" icon="leaf" done={!!log.ritual} onClick={() => s.toggleLog(day, "ritual")} />
          <LogTile label="Journal" icon="sun" done={!!log.journal} onClick={() => s.toggleLog(day, "journal")} />
        </div>
        {allLogged && (
          <p className="mt-2.5 text-center font-serif italic text-[14px] text-[var(--charcoal)]/70">
            Today is complete. Your skin noticed.
          </p>
        )}
      </div>

      {/* Week progress */}
      <div className="mt-5">
        <p className="label-caps text-[var(--charcoal)]/40">Your 21 days</p>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {PHASES.map((p) => {
            const isActive = p.week === phase.week;
            const days = Array.from({ length: 7 }, (_, i) => p.range[0] + i);
            return (
              <div key={p.week} className={`rounded-2xl p-3 ${
                isActive
                  ? "gold-glow-card ring-1 ring-[var(--gold)]/30"
                  : "bg-white border border-[var(--taupe)]/20"
              }`}>
                <p className="text-[9.5px] tracking-[0.16em] uppercase text-[var(--charcoal)]/40">Wk {p.week}</p>
                <p className="font-serif text-[13px] text-[var(--charcoal)] mt-0.5">{p.label}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {days.map((d) => {
                    const done = s.completedDays.includes(d);
                    const isToday = d === day;
                    return (
                      <span
                        key={d}
                        className={`h-2 w-2 rounded-full ${
                          done ? "bg-[var(--gold)]" : isToday ? "bg-[var(--charcoal)]/30 ring-1 ring-[var(--charcoal)]/20" : "bg-[var(--taupe)]/30"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Glow Check-In */}
      <GlowCheckIn day={day} />

      {/* Recipe of the day */}
      <div className="mt-5">
        <p className="label-caps text-[var(--charcoal)]/40">Recipe of the day</p>
        <Link to="/recipes/$id" params={{ id: recipe.id }} className="mt-2.5 flex gap-3 bg-white border border-[var(--taupe)]/20 rounded-2xl overflow-hidden p-3.5 shadow-sm cursor-pointer">
          <SmoothieImage
            recipe={recipe}
            className="h-20 w-20 flex-shrink-0 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--gold)]">{recipe.prep} · {recipe.servings}</p>
            <h4 className="mt-1 font-serif text-[18px] leading-tight text-[var(--charcoal)]">{recipe.name}</h4>
            <span className="mt-2 inline-block rounded-full bg-[var(--charcoal)]/6 px-2.5 py-0.5 text-[10px] tracking-wide text-[var(--charcoal)]/70">{recipe.benefitTag}</span>
          </div>
        </Link>
      </div>

      {/* Radiant Reds upsell */}
      <a href={REDS_URL} target="_top" className="mt-5 block rounded-2xl px-5 py-4 cursor-pointer"
         style={{ background: "linear-gradient(135deg, oklch(0.970 0.022 68) 0%, oklch(0.985 0.015 72) 100%)", border: "1px solid oklch(0.720 0.082 65 / 0.25)" }}>
        <p className="label-caps text-[var(--gold)]">Your ritual base</p>
        <p className="mt-1.5 font-serif text-[17px] leading-snug text-[var(--charcoal)]">
          Radiant Reds — the polyphenol blend in every morning.
        </p>
        <p className="mt-1 font-serif italic text-[13px] text-[var(--charcoal)]/55">
          Add one scoop. Every glass becomes a full ritual.
        </p>
        <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-[var(--gold)]">Shop Radiant Reds →</p>
      </a>

      {/* Journal prompt */}
      <Link to="/journal/$n" params={{ n: String(day) }}
        className="mt-5 block rounded-2xl p-5 cursor-pointer"
        style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}>
        <p className="label-caps text-[var(--berry)]/60">Today's prompt</p>
        <p className="mt-2 font-serif italic text-[19px] leading-snug text-[var(--charcoal)]">"{promptText}"</p>
        <p className="mt-3 text-[12px] text-[var(--charcoal)]/40">Tap to write →</p>
      </Link>

      <GoldDivider />
      <Link to="/profile" className="block text-center font-serif italic text-[13px] text-[var(--charcoal)]/40">
        Profile & settings
      </Link>
    </Frame>
  );
}

function parseMilestone(id: string): number {
  const m = id.match(/day-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function calcStreak(completedDays: number[], currentDay: number): number {
  let streak = 0;
  for (let d = currentDay; d >= 1; d--) {
    if (completedDays.includes(d)) streak++;
    else break;
  }
  return streak;
}

function LogTile({ label, icon, done, onClick }: { label: string; icon: "glass" | "leaf" | "sun"; done: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all cursor-pointer ${
      done
        ? "bg-[var(--gold)]/10 ring-1 ring-[var(--gold)]/40 text-[var(--charcoal)]"
        : "bg-[var(--beige)] text-[var(--charcoal)] hover:bg-[var(--taupe)]/20"
    }`}>
      {done ? <CheckIcon /> : <TileIcon name={icon} />}
      <span className="text-[11px] leading-tight">{label}</span>
      <span className={`text-[9px] tracking-wider uppercase ${done ? "text-[var(--gold)]" : "text-[var(--charcoal)]/40"}`}>
        {done ? "Logged" : "Begin"}
      </span>
    </button>
  );
}

function CheckIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 13l4 4L20 6" /></svg>;
}
function TileIcon({ name }: { name: "glass" | "leaf" | "sun" }) {
  if (name === "glass") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h12l-2 12a4 4 0 01-8 0L6 3z" /></svg>;
  if (name === "leaf") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 21c0-9 7-16 16-16-1 9-7 16-16 16z" /></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>;
}

// Quick-tap outcomes on the home dashboard (maps display label → outcome string stored in store)
const QUICK_TAPS: { label: string; icon: React.ReactNode; outcome: string }[] = [
  {
    label: "Skin",
    outcome: "Glowy",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    label: "Digestion",
    outcome: "Calm digestion",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 12c1.5-2 6.5-2 8 0" />
      </svg>
    ),
  },
  {
    label: "Energy",
    outcome: "Energized",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

const NO_OUTCOMES: string[] = [];

function GlowCheckIn({ day }: { day: number }) {
  const outcomes = useApp((s) => s.outcomesByDay[day]) ?? NO_OUTCOMES;
  const toggle = useApp((s) => s.toggleOutcomeForDay);

  return (
    <div className="mt-5 rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="label-caps text-[var(--charcoal)]/40">Today's Glow Check-In</p>
        <Link
          to="/day/$n"
          params={{ n: String(day) }}
          className="text-[11px] tracking-[0.12em] uppercase text-[var(--gold)]"
        >
          Track how I feel →
        </Link>
      </div>
      <div className="flex gap-2">
        {QUICK_TAPS.map((qt) => {
          const active = outcomes.includes(qt.outcome);
          return (
            <button
              key={qt.outcome}
              onClick={() => toggle(day, qt.outcome)}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-center transition-all cursor-pointer ${
                active
                  ? "bg-[var(--gold)]/12 ring-1 ring-[var(--gold)]/40 text-[var(--charcoal)]"
                  : "bg-[var(--beige)] text-[var(--charcoal)]/55 hover:bg-[var(--taupe)]/15"
              }`}
            >
              <span className={active ? "text-[var(--gold)]" : ""}>{qt.icon}</span>
              <span className="text-[11px] leading-tight font-medium">{qt.label}</span>
              {active && (
                <span className="text-[9px] tracking-wider uppercase text-[var(--gold)]">Felt it</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
