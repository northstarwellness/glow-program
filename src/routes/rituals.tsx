import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Frame, TopBar } from "@/components/Frame";
import { useApp, currentDay, isDayUnlocked } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, PHASES, programFor } from "@/lib/content";

export const Route = createFileRoute("/rituals")({ component: Rituals });

function Rituals() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;
  const day = currentDay(s.startDate);
  const program = programFor(s.activeProgram);

  return (
    <Frame>
      <TopBar name={s.name} day={day} />
      <h1 className="font-serif text-[32px] leading-tight text-[var(--plum)]">21 day rituals.</h1>
      <p className="mt-1 font-serif italic text-[14.5px] text-[var(--plum)]/55">Three weeks. One morning at a time.</p>

      {PHASES.map((p) => {
        const weekLabel = program.weekThemes[p.week - 1] ?? p.label;
        return (
          <section key={p.week} className="mt-7">
            <div className="rounded-2xl bg-[var(--sand)] p-4">
              <p className="label-caps text-[var(--gold)]">Week {p.week}</p>
              <h2 className="mt-0.5 font-serif text-[21px] text-[var(--plum)]">{weekLabel}</h2>
              <p className="text-[12px] text-[var(--plum)]/50">Days {p.range[0]}–{p.range[1]}</p>
            </div>
            <div className="mt-3 space-y-2">
              {DAYS.slice(p.range[0] - 1, p.range[1]).map((d) => {
                const unlocked = isDayUnlocked(d.day, s.startDate, s.completedDays);
                const done = s.completedDays.includes(d.day);
                const card = (
                  <div className={`flex items-center gap-3 rounded-2xl p-4 shadow-sm transition-all ${
                    unlocked ? "bg-[var(--card)] border border-[var(--plum)]/8" : "bg-[var(--sand)]/50"
                  }`}>
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                      done ? "bg-[var(--gold)]" : unlocked ? "bg-[var(--gold)]/12" : "bg-[var(--plum)]/5"
                    }`}>
                      <span className={`font-serif text-[22px] ${done ? "text-[var(--ivory)]" : unlocked ? "text-[var(--gold)]" : "text-[var(--plum)]/25"}`}>
                        {d.day}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-serif text-[17px] leading-tight ${unlocked ? "text-[var(--plum)]" : "text-[var(--plum)]/35"}`}>
                        {d.title}
                      </h3>
                      <p className={`mt-0.5 truncate text-[12px] ${unlocked ? "text-[var(--plum)]/55" : "text-[var(--plum)]/28"}`}>
                        {d.teaser}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {done
                        ? <span className="text-[var(--gold)] text-[13px]">Done</span>
                        : unlocked
                        ? <span className="text-[var(--plum)]/40 text-[13px]">→</span>
                        : <LockIcon />}
                    </div>
                  </div>
                );
                return unlocked ? (
                  <Link key={d.day} to="/day/$n" params={{ n: String(d.day) }} className="block">{card}</Link>
                ) : (
                  <div key={d.day}>{card}</div>
                );
              })}
            </div>
          </section>
        );
      })}
    </Frame>
  );
}

function LockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--plum)]/25"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>;
}
