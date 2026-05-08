import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Frame, TopBar } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, PHASES } from "@/lib/content";

export const Route = createFileRoute("/rituals")({ component: Rituals });

function Rituals() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;
  const day = currentDay(s.startDate);

  return (
    <Frame>
      <TopBar name={s.name} day={day} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">The 21 rituals.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--plum)]/60">Three weeks. One morning at a time.</p>

      {PHASES.map((p) => (
        <section key={p.week} className="mt-8">
          <div className="sand-card p-4">
            <p className="label-caps text-[var(--gold)]">Week {p.week}</p>
            <h2 className="mt-1 font-serif text-[22px] text-[var(--plum)]">{p.label}</h2>
            <p className="text-[12px] text-[var(--plum)]/60">Days {p.range[0]}–{p.range[1]}</p>
          </div>
          <div className="mt-3 space-y-2.5">
            {DAYS.slice(p.range[0] - 1, p.range[1]).map((d) => {
              const unlocked = d.day <= day;
              const done = s.completedDays.includes(d.day);
              const card = (
                <div className={`flex items-center gap-4 rounded-2xl p-4 shadow-sm transition-all ${
                  unlocked ? "bg-[var(--card)]" : "bg-[var(--sand)]/60"
                }`}>
                  <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${
                    unlocked ? "bg-[var(--gold)]/15" : "bg-[var(--plum)]/5"
                  }`}>
                    <span className={`font-serif text-[24px] ${unlocked ? "text-[var(--gold)]" : "text-[var(--plum)]/30"}`}>
                      {d.day}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-serif text-[18px] leading-tight ${unlocked ? "text-[var(--plum)]" : "text-[var(--plum)]/40"}`}>
                      {d.title}
                    </h3>
                    <p className={`mt-0.5 truncate text-[12.5px] ${unlocked ? "text-[var(--plum)]/65" : "text-[var(--plum)]/35"}`}>
                      {d.teaser}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {done ? <span className="text-[var(--gold)]">✓</span>
                      : unlocked ? <span className="text-[var(--plum)]/60">→</span>
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
      ))}
    </Frame>
  );
}
function LockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--plum)]/30"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>;
}
