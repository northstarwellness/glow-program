import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, JOURNAL_PROMPTS, MILESTONES, PHASES, RECIPES, phaseFor } from "@/lib/content";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();

  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!s.unlocked) return <Navigate to="/" />;
  if (!s.seenWelcome) return <Navigate to="/welcome" />;

  const day = currentDay(s.startDate);
  const phase = phaseFor(day);
  const today = DAYS[day - 1];
  const recipe = RECIPES.find((r) => r.id === today.recipeId)!;
  const log = s.dailyLogs[day] ?? {};
  const allLogged = log.reds && log.ritual && log.journal;
  const promptText = JOURNAL_PROMPTS[day]?.(s.name ?? "") ?? "";

  // Milestones
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

  return (
    <Frame>
      <TopBar name={s.name} day={day} />

      {/* Hero */}
      <Link to="/day/$n" params={{ n: String(day) }} className="block">
        <div className="relative overflow-hidden rounded-3xl p-7 text-[var(--ivory)] shadow-lg"
             style={{ background: "linear-gradient(135deg, #6B1730 0%, #9B1B3A 60%, #7B2D4E 100%)" }}>
          <p className="label-caps text-[var(--gold)]/90">{phase.label} · Week {phase.week}</p>
          <p className="mt-3 font-serif text-[80px] leading-none text-[var(--gold)]">Day {day}</p>
          <h2 className="mt-2 font-serif text-[26px] leading-tight">{today.title}</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--ivory)]/85">{today.teaser}</p>
          <div className="ivory-pill-btn mt-6 inline-block">Open Today's Ritual →</div>
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[var(--gold)]/15 blur-2xl" />
        </div>
      </Link>

      {/* Quick log */}
      <div className="mt-6">
        <p className="label-caps text-[var(--plum)]/55">Today's check-ins</p>
        <div className={`mt-2 grid grid-cols-3 gap-2 rounded-2xl p-2 ${allLogged ? "bg-[var(--gold)]/15" : ""}`}>
          <LogTile label="Radiant Reds" icon="glass" done={!!log.reds} onClick={() => s.toggleLog(day, "reds")} />
          <LogTile label="Morning ritual" icon="leaf" done={!!log.ritual} onClick={() => s.toggleLog(day, "ritual")} />
          <LogTile label="Journal entry" icon="sun" done={!!log.journal} onClick={() => s.toggleLog(day, "journal")} />
        </div>
        {allLogged && (
          <p className="mt-2 text-center font-serif italic text-[14px] text-[var(--plum)]">
            {s.name}, today is complete. ✓
          </p>
        )}
      </div>

      {/* Week progress */}
      <div className="mt-6">
        <p className="label-caps text-[var(--plum)]/55">This week's progress</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PHASES.map((p) => {
            const isActive = p.week === phase.week;
            const days = Array.from({ length: 7 }, (_, i) => p.range[0] + i);
            return (
              <div key={p.week} className={`rounded-2xl p-3 ${isActive ? "bg-[var(--gold)]/15 ring-1 ring-[var(--gold)]/40" : "bg-[var(--sand)]"}`}>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--plum)]/60">Week {p.week}</p>
                <p className="font-serif text-[14px] text-[var(--plum)]">{p.label}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {days.map((d) => {
                    const done = s.completedDays.includes(d);
                    return <span key={d} className={`h-2 w-2 rounded-full ${done ? "bg-[var(--gold)]" : "bg-[var(--plum)]/15"}`} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipe of the day */}
      <div className="mt-6">
        <p className="label-caps text-[var(--plum)]/55">Recipe of the day</p>
        <Link to="/recipes/$id" params={{ id: recipe.id }} className="mt-2 flex gap-3 sand-card overflow-hidden p-3">
          <div className="h-20 w-20 flex-shrink-0 rounded-xl" style={{ background: recipe.gradient }} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--gold)]">{recipe.prep} · {recipe.servings}</p>
            <h4 className="mt-1 font-serif text-[19px] leading-tight text-[var(--plum)]">{recipe.name}</h4>
            <span className="mt-2 inline-block rounded-full bg-[var(--plum)]/8 px-2.5 py-0.5 text-[10px] tracking-wide text-[var(--plum)]">{recipe.benefitTag}</span>
          </div>
        </Link>
      </div>

      {/* Journal prompt */}
      <Link to="/journal/$n" params={{ n: String(day) }} className="mt-6 block rounded-2xl border-l-4 border-[var(--plum)] bg-[var(--card)] p-5 shadow-sm">
        <div className="gold-divider mb-3 -mt-1" />
        <p className="label-caps text-[var(--gold)]">Today's prompt</p>
        <p className="mt-2 font-serif italic text-[19px] leading-snug text-[var(--plum)]">"{promptText}"</p>
        <p className="mt-3 text-[12px] text-[var(--plum)]/55">Tap to write →</p>
      </Link>

      {/* Tools */}
      <div className="mt-6">
        <p className="label-caps text-[var(--plum)]/55">Your toolkit</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Link to="/tracker" className="flex flex-col items-center gap-2 rounded-2xl bg-[var(--card)] p-4 text-center shadow-sm">
            <HeartIcon />
            <span className="font-serif text-[13px] leading-tight text-[var(--plum)]">How I feel</span>
          </Link>
          <Link to="/grocery" className="flex flex-col items-center gap-2 rounded-2xl bg-[var(--card)] p-4 text-center shadow-sm">
            <ListIcon />
            <span className="font-serif text-[13px] leading-tight text-[var(--plum)]">Grocery list</span>
          </Link>
          <Link to="/recipes/$id" params={{ id: "build" }} className="flex flex-col items-center gap-2 rounded-2xl bg-[var(--card)] p-4 text-center shadow-sm">
            <BlendIcon />
            <span className="font-serif text-[13px] leading-tight text-[var(--plum)]">Build a smoothie</span>
          </Link>
        </div>
      </div>

      <GoldDivider />
      <Link to="/profile" className="block text-center font-serif italic text-[13px] text-[var(--plum)]/55">
        Profile & settings
      </Link>
    </Frame>
  );
}

function parseMilestone(id: string): number {
  const m = id.match(/day-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function LogTile({ label, icon, done, onClick }: { label: string; icon: "glass" | "leaf" | "sun"; done: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all ${
        done ? "bg-[var(--gold)] text-[var(--ivory)]" : "bg-[var(--sand)] text-[var(--plum)]"
      }`}>
      {done ? <CheckIcon /> : <TileIcon name={icon} />}
      <span className="text-[11px] leading-tight">{label}</span>
      <span className={`text-[9px] tracking-wider uppercase ${done ? "text-[var(--ivory)]/80" : "text-[var(--plum)]/50"}`}>{done ? "Logged" : "Tap to log"}</span>
    </button>
  );
}
function HeartIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--gold)]"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>; }
function ListIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--gold)]"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function BlendIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--gold)]"><path d="M6 3h12l-2 12a4 4 0 01-8 0L6 3z"/><path d="M4 7h16"/></svg>; }
function CheckIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 13l4 4L20 6" /></svg>; }
function TileIcon({ name }: { name: "glass" | "leaf" | "sun" }) {
  if (name === "glass") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h12l-2 12a4 4 0 01-8 0L6 3z" /></svg>;
  if (name === "leaf") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 21c0-9 7-16 16-16-1 9-7 16-16 16z" /></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></svg>;
}
