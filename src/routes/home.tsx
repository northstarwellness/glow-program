import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Frame, GlowMark } from "@/components/Frame";
import { useApp, activeDay, isDayUnlocked } from "@/lib/store";
import type { ProgramId } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import {
  DAYS, JOURNAL_PROMPTS, PHASES, RECIPES, phaseFor,
  GLOW_FOCUS, getPersonalizedTasks, currentStreak,
  programFor, PROGRAMS,
} from "@/lib/content";

export const Route = createFileRoute("/home")({ component: Home });

// ─── Headline pool per program ─────────────────────────────
const PROGRAM_HEADLINES: Record<ProgramId, string[]> = {
  "skin-glow": [
    "What you nourish inside, your skin wears.",
    "The glow was always building from within.",
    "Your skin remembers every morning you showed up.",
  ],
  "feel-lighter": [
    "A lighter morning begins in the kitchen.",
    "Ease is something you cultivate, one glass at a time.",
    "Your body knows how to settle. Help it along.",
  ],
  "balanced-energy": [
    "Steady energy is built before the day begins.",
    "A calm morning is the most productive one.",
    "The ritual sets the tone. The rest follows.",
  ],
};

function editorialLine(programId: ProgramId, day: number): string {
  const pool = PROGRAM_HEADLINES[programId];
  return pool[(day - 1) % pool.length];
}

// ─── Home ──────────────────────────────────────────────────
function Home() {
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();

  if (hydrated && !s.name) return <Navigate to="/" />;
  if (hydrated && s.name && !s.seenWelcome) return <Navigate to="/welcome" />;

  // ── Active day: lowest uncompleted day (1–21) ────────────
  const day = activeDay(s.completedDays);
  const allDone = s.completedDays.length >= 21;

  const phase = phaseFor(day);
  const today = DAYS[day - 1];
  const recipe = RECIPES.find((r) => r.id === today.recipeId)!;
  const promptText = JOURNAL_PROMPTS[day]?.(s.name ?? "") ?? "";
  const focus = GLOW_FOCUS[day];
  const program = programFor(s.activeProgram);

  const tasks = getPersonalizedTasks(day, s.onboarding.skinGoal, s.onboarding.gutGoal, s.onboarding.morningPace);
  const dayCheckLog = s.checklistLogs[day] ?? {};
  const checkDone = tasks.filter((t) => dayCheckLog[t.id]).length;
  const anyTaskStarted = checkDone > 0;
  const streak = currentStreak(s.startDate, s.completedDays, s.checklistLogs);
  const headline = editorialLine(s.activeProgram, day);

  // ── CTA label ────────────────────────────────────────────
  const ctaLabel = allDone
    ? "View completion"
    : s.completedDays.includes(day)
    ? `Start Day ${day + 1}`
    : anyTaskStarted
    ? `Continue Day ${day}`
    : `Start Day ${day}`;
  const ctaDay = allDone ? 21 : s.completedDays.includes(day) ? day + 1 : day;

  // ── Milestone redirect ───────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    const trigger = (id: string, milestoneDay: number) => {
      if (s.completedDays.includes(milestoneDay) && !s.shownMilestones.includes(id)) {
        navigate({ to: "/milestone/$id", params: { id } });
      }
    };
    trigger("day-1", 1);
    trigger("day-7", 7);
    trigger("day-14", 14);
    if (s.completedDays.includes(21) && !s.shownMilestones.includes("day-21")) {
      navigate({ to: "/celebrate" });
    }
  }, [hydrated, s.completedDays, s.shownMilestones, navigate]);

  return (
    <Frame>

      {/* ── Brand bar ─────────────────────────────────────── */}
      <div className="mb-7 flex items-center justify-between">
        <GlowMark size={38} />
        <div className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-[var(--plum)]/50">
          <span className="h-1 w-1 rounded-full bg-[var(--gold)]" />
          {s.completedDays.length} of 21 days
        </div>
      </div>

      {/* ── Greeting ──────────────────────────────────────── */}
      <div className="fade-rise">
        <p className="label-caps text-[var(--plum)]/35">{program.name}</p>
        <h1 className="mt-2 font-serif text-[36px] leading-[1.08] text-[var(--plum)]">
          Good morning,<br />
          <span className="text-[var(--berry)]">{s.name}.</span>
        </h1>
        <p className="mt-2 font-serif italic text-[16px] leading-relaxed text-[var(--plum)]/50">
          {headline}
        </p>
      </div>

      {/* ── Primary CTA ───────────────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-[var(--plum)]/10 bg-[var(--card)] p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <p className="label-caps text-[var(--plum)]/40">
              {allDone ? "Program complete" : `Day ${day} · ${phase.label}`}
            </p>
            <p className="mt-1 font-serif text-[20px] leading-tight text-[var(--plum)]">
              {allDone ? "21 days complete." : focus?.focus ?? today.title}
            </p>
            {streak > 0 && (
              <p className="mt-1 text-[11px] text-[var(--gold)]">
                {streak}-day streak
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className="font-serif text-[48px] leading-none text-[var(--plum)]/10">
              {allDone ? "✓" : day}
            </span>
          </div>
        </div>

        {allDone ? (
          <Link
            to="/celebrate"
            className="mt-4 block w-full rounded-full bg-[var(--gold)] py-[14px] text-center text-[12px] font-medium tracking-[0.2em] uppercase text-white shadow-sm"
          >
            {ctaLabel} →
          </Link>
        ) : (
          <Link
            to="/day/$n"
            params={{ n: String(ctaDay) }}
            className="mt-4 block w-full rounded-full bg-[var(--plum)] py-[14px] text-center text-[12px] font-medium tracking-[0.2em] uppercase text-white/90 shadow-sm transition-opacity hover:opacity-85"
          >
            {ctaLabel} →
          </Link>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

      {/* ── Inside your ritual ────────────────────────────── */}
      <p className="label-caps text-[var(--plum)]/40 mb-4">Inside your ritual today</p>

      {/* Today's Smoothie */}
      <Link to="/recipes/$id" params={{ id: recipe.id }} className="block">
        <div className="flex items-center gap-4 rounded-2xl border border-[var(--plum)]/8 bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--gold)]/30">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.imageAlt ?? recipe.name} className="h-[60px] w-[60px] flex-shrink-0 rounded-xl object-cover" />
          ) : (
            <div className="h-[60px] w-[60px] flex-shrink-0 rounded-xl" style={{ background: recipe.gradient }} />
          )}
          <div className="min-w-0 flex-1">
            <p className="label-caps text-[var(--plum)]/35">Today's smoothie · {recipe.prep}</p>
            <p className="mt-0.5 font-serif text-[19px] leading-tight text-[var(--plum)]">{recipe.name}</p>
            <p className="mt-1 text-[12px] text-[var(--plum)]/50">{recipe.benefitTag}</p>
          </div>
          <ChevronIcon />
        </div>
      </Link>

      {/* Glow Checklist */}
      <Link to="/checklist" className="mt-3 block">
        <div className="rounded-2xl border border-[var(--plum)]/8 bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--gold)]/30">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <p className="label-caps text-[var(--plum)]/35">Glow checklist</p>
              <p className="mt-0.5 font-serif text-[19px] leading-tight text-[var(--plum)]">{focus?.focus}</p>
            </div>
            <span className="text-[12px] font-medium text-[var(--plum)]/40">
              {checkDone}/{tasks.length}
            </span>
          </div>
          <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-[var(--plum)]/8">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all"
              style={{ width: tasks.length > 0 ? `${(checkDone / tasks.length) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </Link>

      {/* Journal & Check-In */}
      <Link to="/journal/$n" params={{ n: String(day) }} className="mt-3 block">
        <div className="rounded-2xl border border-[var(--plum)]/8 bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--gold)]/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="label-caps text-[var(--plum)]/35">Journal + check-in</p>
              <p className="mt-1 font-serif italic text-[16px] leading-snug text-[var(--plum)]/80">
                "{promptText}"
              </p>
            </div>
            <ChevronIcon />
          </div>
          {s.journalEntries[day] && (
            <p className="mt-2 text-[11px] tracking-wide text-[var(--gold)]">Written today</p>
          )}
        </div>
      </Link>

      {/* Grocery List */}
      <Link to="/grocery" className="mt-3 block">
        <div className="flex items-center justify-between rounded-2xl border border-[var(--plum)]/8 bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--gold)]/30">
          <div>
            <p className="label-caps text-[var(--plum)]/35">Grocery list</p>
            <p className="mt-0.5 font-serif text-[19px] leading-tight text-[var(--plum)]">Week {phase.week} ingredients</p>
          </div>
          <ChevronIcon />
        </div>
      </Link>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

      {/* ── 21-Day Path ───────────────────────────────────── */}
      <p className="label-caps text-[var(--plum)]/40 mb-4">Your 21-day path</p>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
          const done = s.completedDays.includes(d);
          const isActive = d === day && !allDone;
          const unlocked = isDayUnlocked(d, s.startDate, s.completedDays);
          return (
            <DayPill key={d} day={d} done={done} active={isActive} unlocked={unlocked} />
          );
        })}
      </div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

      {/* ── Choose your program ───────────────────────────── */}
      <p className="label-caps text-[var(--plum)]/40 mb-3">Choose your program</p>
      <div className="space-y-2.5">
        {PROGRAMS.map((prog) => (
          <ProgramCard
            key={prog.id}
            program={prog}
            active={s.activeProgram === prog.id}
            onSelect={() => s.setProgram(prog.id)}
          />
        ))}
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />
      <div className="flex items-center justify-between text-[12px] text-[var(--plum)]/35">
        <Link to="/profile" className="font-serif italic hover:text-[var(--plum)]/60 transition-colors">
          Profile & settings
        </Link>
        <Link to="/bonuses" search={{ tab: "" }} className="font-serif italic hover:text-[var(--plum)]/60 transition-colors">
          Bonuses & sounds
        </Link>
      </div>

    </Frame>
  );
}

// ─── Day Pill ──────────────────────────────────────────────
function DayPill({ day, done, active, unlocked }: {
  day: number; done: boolean; active: boolean; unlocked: boolean;
}) {
  const baseClass = "flex h-9 w-full items-center justify-center rounded-full text-[12px] font-serif transition-all";
  const inner = (
    <span
      className={`${baseClass} ${
        done
          ? "bg-[var(--gold)] text-white shadow-sm"
          : active
          ? "border-2 border-[var(--plum)] bg-[var(--card)] font-bold text-[var(--plum)] shadow-sm"
          : unlocked
          ? "border border-[var(--plum)]/20 bg-[var(--card)] text-[var(--plum)]/55"
          : "bg-[var(--plum)]/5 text-[var(--plum)]/20"
      }`}
    >
      {done ? <SmallCheck /> : day}
    </span>
  );

  if (done || active || unlocked) {
    return (
      <Link to="/day/$n" params={{ n: String(day) }}>
        {inner}
      </Link>
    );
  }
  return <span>{inner}</span>;
}

// ─── Program Card ──────────────────────────────────────────
function ProgramCard({
  program, active, onSelect,
}: {
  program: ReturnType<typeof programFor>; active: boolean; onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`block w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-[var(--gold)]/50 bg-[var(--card)] shadow-sm"
          : "border-[var(--plum)]/8 bg-[var(--sand)] hover:border-[var(--plum)]/15"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className={`font-serif text-[18px] leading-tight ${active ? "text-[var(--plum)]" : "text-[var(--plum)]/60"}`}>
          {program.name.replace(" Program", "")}
        </p>
        <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
          active ? "border-[var(--gold)] bg-[var(--gold)]" : "border-[var(--plum)]/20"
        }`}>
          {active && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M4 13l4 4L20 6" />
            </svg>
          )}
        </div>
      </div>
      <p className={`mt-1 font-serif italic text-[13.5px] leading-relaxed ${active ? "text-[var(--plum)]/60" : "text-[var(--plum)]/40"}`}>
        {program.tagline}
      </p>
    </button>
  );
}

// ─── Icons ─────────────────────────────────────────────────
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-[var(--plum)]/25">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function SmallCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <path d="M4 13l4 4L20 6" />
    </svg>
  );
}
