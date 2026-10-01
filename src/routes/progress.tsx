import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, activeDay, isProgramComplete, outcomeLabel, ritualProgress } from "@/lib/store";
import { daysWithFeelings, feelingCounts } from "@/lib/reflections";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, PHASES } from "@/lib/content";

export const Route = createFileRoute("/progress")({ component: Progress });

function Progress() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;

  const day = activeDay(s.completedDays);
  const ritual = ritualProgress(s.completedDays);
  const pct = Math.round((ritual.completed / 21) * 100);
  const redsCount = Object.values(s.dailyLogs).filter((l) => l.reds).length;
  const ritualCount = Object.values(s.dailyLogs).filter((l) => l.ritual).length;
  const journalCount = Object.keys(s.journalEntries).length;

  // Same reader as the Day page and Journal: each feeling counts once per day.
  const topOutcomes = feelingCounts(s.outcomesByDay)
    .slice(0, 5)
    .map((c) => [c.outcome, c.days] as const);
  const daysWithOutcomes = daysWithFeelings(s.outcomesByDay).length;

  return (
    <Frame>
      <TopBar name={s.name} day={day} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--charcoal)]">Progress.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--ink-2)]">
        Every morning you've kept.
      </p>

      {hydrated && isProgramComplete(s.completedDays) && (
        <Link
          to="/reflection"
          className="mt-5 flex items-center justify-between rounded-2xl p-5"
          style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}
        >
          <div>
            <p className="label-caps text-[var(--berry)]/70">Day 21 · Complete</p>
            <p className="mt-1 font-serif text-[19px] text-[var(--charcoal)]">Your Reflection</p>
          </div>
          <span aria-hidden="true" className="font-serif text-[18px] text-[var(--ink-2)]">
            →
          </span>
        </Link>
      )}

      {/* Your Ritual: counts of completed mornings only, never a score */}
      <section
        aria-labelledby="your-ritual-heading"
        data-testid="your-ritual"
        className="mt-5 gold-glow-card p-6 text-center"
      >
        <p id="your-ritual-heading" className="label-caps text-[var(--gold-deep)]">
          Your Ritual
        </p>
        <p className="mt-2 font-serif text-[64px] leading-none text-[var(--charcoal)]">
          {ritual.completed}
          <span className="text-[26px] text-[var(--ink-2)]"> of 21</span>
        </p>
        <p className="mt-2 font-serif italic text-[15px] text-[var(--charcoal)]/65">
          {ritual.completed === 1 ? "morning complete" : "mornings complete"}
        </p>
        <div className="gold-divider mt-5 mb-4" />
        {hydrated && ritual.next !== null ? (
          <Link
            to="/day/$n"
            params={{ n: String(ritual.next) }}
            className="block font-serif text-[16px] text-[var(--charcoal)]"
          >
            Next morning: Day {ritual.next} · {DAYS[ritual.next - 1].title} →
          </Link>
        ) : (
          <p className="font-serif text-[16px] text-[var(--charcoal)]">All 21 mornings complete.</p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <p className="font-serif text-[24px] text-[var(--charcoal)]">{journalCount}</p>
            <p className="text-[9.5px] tracking-[0.14em] uppercase text-[var(--ink-2)] mt-0.5">
              {journalCount === 1 ? "Journal entry" : "Journal entries"}
            </p>
          </div>
          <div>
            <p className="font-serif text-[24px] text-[var(--charcoal)]">{ritual.remaining}</p>
            <p className="text-[9.5px] tracking-[0.14em] uppercase text-[var(--ink-2)] mt-0.5">
              {ritual.remaining === 1 ? "Morning to go" : "Mornings to go"}
            </p>
          </div>
        </div>
      </section>

      {/* Progress bar */}
      <div className="mt-5 glass-card p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="label-caps text-[var(--ink-2)]">Reset progress</p>
          <p className="font-serif text-[13px] text-[var(--ink-2)]">Day {day} of 21</p>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--taupe)]/20">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-[var(--ink-2)]">
          <span>Start</span>
          <span>Day 7</span>
          <span>Day 14</span>
          <span>Day 21</span>
        </div>
      </div>

      {/* Habit breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <HabitCard label="Radiant Reds" value={redsCount} max={21} color="cranberry" />
        <HabitCard label="Morning Ritual" value={ritualCount} max={21} color="charcoal" />
        <HabitCard label="Journal" value={journalCount} max={21} color="ink-2" />
      </div>

      {/* 21-day calendar */}
      <div className="mt-5 glass-card p-5">
        <p className="label-caps text-[var(--ink-2)] mb-3">21-Day Calendar</p>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
            const done = s.completedDays.includes(d);
            const isToday = d === day;
            const locked = d > day;
            return (
              <div key={d} className="flex flex-col items-center gap-0.5">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-medium transition-all ${
                    done
                      ? "bg-[var(--cranberry)] text-white shadow-sm"
                      : isToday
                        ? "ring-2 ring-[var(--charcoal)]/30 text-[var(--charcoal)]"
                        : locked
                          ? "bg-[var(--taupe)]/15 text-[var(--charcoal)]/25"
                          : "bg-[var(--taupe)]/25 text-[var(--ink-2)]"
                  }`}
                >
                  {done ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M4 13l4 4L20 6" />
                    </svg>
                  ) : (
                    d
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week phases */}
      <div className="mt-4 space-y-2">
        {PHASES.map((p) => {
          const phaseDays = Array.from({ length: 7 }, (_, i) => p.range[0] + i);
          const done = phaseDays.filter((d) => s.completedDays.includes(d)).length;
          const phasePct = Math.round((done / 7) * 100);
          return (
            <div key={p.week} className="glass-card p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="label-caps text-[var(--cranberry)]">Week {p.week}</span>
                  <p className="font-serif text-[15px] text-[var(--charcoal)] mt-0.5">{p.label}</p>
                </div>
                <p className="font-serif text-[20px] text-[var(--charcoal)]">{done}/7</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--taupe)]/20">
                <div className="progress-bar-fill" style={{ width: `${phasePct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Your Ritual Outcomes */}
      {daysWithOutcomes > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="label-caps text-[var(--ink-2)]">How mornings felt</p>
            <span className="text-[11px] font-serif italic text-[var(--ink-2)]">
              {daysWithOutcomes} {daysWithOutcomes === 1 ? "day" : "days"} logged
            </span>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm p-5 space-y-3">
            {topOutcomes.map(([outcome, count], idx) => {
              const maxCount = topOutcomes[0]?.[1] ?? 1;
              const barPct = Math.round((count / maxCount) * 100);
              return (
                <div key={outcome} data-testid="outcome-row" data-label={outcomeLabel(outcome)}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`font-serif text-[15px] text-[var(--charcoal)] ${idx === 0 ? "font-medium" : ""}`}
                    >
                      {outcomeLabel(outcome)}
                      {idx === 0 && (
                        <span className="ml-2 rounded-full bg-[var(--gold)]/15 px-2 py-0.5 text-[9.5px] tracking-[0.12em] uppercase text-[var(--cranberry)]">
                          Most felt
                        </span>
                      )}
                    </span>
                    <span className="font-serif text-[13px] text-[var(--ink-2)]">
                      {count} {count === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--taupe)]/20">
                    <div
                      className="h-full rounded-full bg-[var(--gold)] transition-all duration-700"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center font-serif italic text-[12px] text-[var(--ink-2)]">
            Optional. Tap how a morning felt on its Day page.
          </p>
        </div>
      )}

      <GoldDivider />
      <p className="text-center font-serif italic text-[13px] text-[var(--ink-2)]">
        Every day logged adds to your 21-day record.
      </p>
    </Frame>
  );
}

function HabitCard({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="glass-card p-3.5 text-center">
      <p className="font-serif text-[26px] leading-none" style={{ color: `var(--${color})` }}>
        {value}
      </p>
      <p className="mt-0.5 text-[9px] tracking-[0.12em] uppercase text-[var(--ink-2)]">{label}</p>
      <div className="mt-2 h-1 w-full rounded-full bg-[var(--taupe)]/20">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: `var(--${color})` }}
        />
      </div>
    </div>
  );
}
