import { createFileRoute, Link, Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, activeDay, isDayUnlocked } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, RECIPES, phaseFor } from "@/lib/content";

export const Route = createFileRoute("/day/$n")({ component: DayView });

function DayView() {
  const { n } = useParams({ from: "/day/$n" });
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();
  if (hydrated && !s.name) return <Navigate to="/" />;

  const dayNum = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  const currentActiveDay = activeDay(s.completedDays);

  const unlocked = isDayUnlocked(dayNum, s.startDate, s.completedDays);
  if (!unlocked) return <Navigate to="/home" />;

  const d = DAYS[dayNum - 1];
  const phase = phaseFor(dayNum);
  const recipe = RECIPES.find((r) => r.id === d.recipeId)!;
  const done = s.completedDays.includes(dayNum);

  const complete = () => {
    s.completeDay(dayNum);
    s.toggleLog(dayNum, "ritual");
    if (dayNum === 21) navigate({ to: "/celebrate" });
    else if ([1, 7, 14].includes(dayNum)) navigate({ to: "/milestone/$id", params: { id: `day-${dayNum}` } });
    // Otherwise stay on the page — the "Start Day N+1" button appears below
  };

  return (
    <Frame>
      <TopBar name={s.name} day={currentActiveDay} />
      <Link to="/home" className="text-[12px] text-[var(--plum)]/55">← Home</Link>

      <div className="mt-3">
        <p className="label-caps text-[var(--gold)]">Week {phase.week} · {phase.label}</p>
        <p className="mt-2 font-serif text-[64px] leading-none text-[var(--plum)]">Day {dayNum}</p>
        <h1 className="mt-1 font-serif text-[28px] leading-tight text-[var(--plum)]">{d.title}</h1>
      </div>

      <GoldDivider />

      <p className="font-serif italic text-[17px] leading-relaxed text-[var(--plum)]/80 drop-cap">
        {d.guide}
      </p>

      <div className="mt-7">
        <p className="label-caps text-[var(--plum)]/50 mb-2">Today's recipe</p>
        <Link to="/recipes/$id" params={{ id: recipe.id }} className="flex gap-3 rounded-2xl bg-[var(--card)] border border-[var(--plum)]/8 p-3 shadow-sm">
          <div className="h-[72px] w-[72px] flex-shrink-0 rounded-xl" style={{ background: recipe.gradient }} />
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-serif text-[18px] text-[var(--plum)]">{recipe.name}</h4>
            <p className="text-[12px] text-[var(--plum)]/55">{recipe.prep} · {recipe.benefitTag}</p>
          </div>
        </Link>
      </div>

      <div className="mt-4">
        <p className="label-caps text-[var(--plum)]/50 mb-2">Sound ritual</p>
        <Link to="/bonuses" search={{ tab: "sound" }} className="block rounded-2xl bg-[var(--card)] border border-[var(--plum)]/8 p-4 shadow-sm">
          <p className="font-serif text-[17px] text-[var(--plum)]">Open morning sound rituals →</p>
          <p className="text-[12px] text-[var(--plum)]/55 mt-0.5">Five ambient sessions for your morning.</p>
        </Link>
      </div>

      <div className="mt-4">
        <p className="label-caps text-[var(--plum)]/50 mb-2">Today's journal prompt</p>
        <Link to="/journal/$n" params={{ n: String(dayNum) }} className="block rounded-2xl border border-[var(--plum)]/10 bg-[var(--card)] p-4 shadow-sm">
          <p className="font-serif italic text-[16px] text-[var(--plum)]">Open your glow journal →</p>
        </Link>
      </div>

      <button onClick={complete} disabled={done} className="gold-pill-btn mt-8 w-full disabled:opacity-60">
        {done ? "Day " + dayNum + " complete" : "Mark Day " + dayNum + " complete"}
      </button>

      {done && dayNum < 21 && (
        <div className="mt-4 fade-rise space-y-3">
          <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] p-5 text-center shadow-sm">
            <p className="font-serif text-[18px] text-[var(--plum)]">
              Day {dayNum} complete.
            </p>
            <p className="mt-0.5 font-serif italic text-[14px] text-[var(--plum)]/55">
              Day {dayNum + 1} is ready for you.
            </p>
          </div>
          <Link
            to="/day/$n"
            params={{ n: String(dayNum + 1) }}
            className="block w-full rounded-full bg-[var(--plum)] py-[14px] text-center text-[12px] font-medium tracking-[0.2em] uppercase text-white/90 shadow-sm"
          >
            Start Day {dayNum + 1} →
          </Link>
          <Link to="/home" className="block w-full rounded-full py-3 text-center font-serif text-[13px] text-[var(--plum)]/45">
            Return home
          </Link>
        </div>
      )}

      {done && dayNum === 21 && (
        <p className="mt-3 text-center font-serif italic text-[13px] text-[var(--plum)]/55">
          The ritual is complete.
        </p>
      )}
    </Frame>
  );
}
