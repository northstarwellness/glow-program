import { createFileRoute, Link, Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, RECIPES, phaseFor } from "@/lib/content";

export const Route = createFileRoute("/day/$n")({ component: DayView });

function DayView() {
  const { n } = useParams({ from: "/day/$n" });
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();

  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!s.name) return <Navigate to="/" />;

  const dayNum = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  const today = currentDay(s.startDate);
  const locked = dayNum > today;
  if (locked) return <Navigate to="/rituals" />;
  const d = DAYS[dayNum - 1];
  const phase = phaseFor(dayNum);
  const recipe = RECIPES.find((r) => r.id === d.recipeId)!;
  const done = s.completedDays.includes(dayNum);

  const complete = () => {
    s.completeDay(dayNum);
    s.toggleLog(dayNum, "ritual");
    if (dayNum === 21) navigate({ to: "/celebrate" });
    else if ([1, 7, 14].includes(dayNum)) navigate({ to: "/milestone/$id", params: { id: `day-${dayNum}` } });
    else navigate({ to: "/home" });
  };

  return (
    <Frame>
      <TopBar name={s.name} day={today} />
      <Link to="/rituals" className="text-[12px] text-[var(--plum)]/60">← All rituals</Link>

      <div className="mt-3">
        <p className="label-caps text-[var(--gold)]">Week {phase.week} · {phase.label}</p>
        <p className="mt-2 font-serif text-[72px] leading-none text-[var(--plum)]">Day {dayNum}</p>
        <h1 className="mt-2 font-serif text-[30px] leading-tight text-[var(--plum)]">{d.title}</h1>
      </div>

      <GoldDivider />

      <p className="font-serif italic text-[17px] leading-relaxed text-[var(--plum)]/80 drop-cap">
        {d.guide}
      </p>

      <div className="mt-7">
        <p className="label-caps text-[var(--plum)]/55">Today's recipe</p>
        <Link to="/recipes/$id" params={{ id: recipe.id }} className="mt-2 flex gap-3 sand-card p-3">
          <div className="h-20 w-20 flex-shrink-0 rounded-xl" style={{ background: recipe.gradient }} />
          <div className="flex-1">
            <h4 className="font-serif text-[19px] text-[var(--plum)]">{recipe.name}</h4>
            <p className="text-[12px] text-[var(--plum)]/65">{recipe.prep} · {recipe.benefitTag}</p>
          </div>
        </Link>
      </div>

      <div className="mt-4">
        <p className="label-caps text-[var(--plum)]/55">Sound ritual</p>
        <Link to="/bonuses" hash="sounds" className="mt-2 block sand-card p-4">
          <p className="font-serif text-[17px] text-[var(--plum)]">Open morning sound rituals →</p>
          <p className="text-[12px] text-[var(--plum)]/60">Five ambient sessions for your morning.</p>
        </Link>
      </div>

      <div className="mt-4">
        <p className="label-caps text-[var(--plum)]/55">Today's prompt</p>
        <Link to="/journal/$n" params={{ n: String(dayNum) }} className="mt-2 block rounded-2xl border-l-4 border-[var(--plum)] bg-[var(--card)] p-4 shadow-sm">
          <p className="font-serif italic text-[16px] text-[var(--plum)]">Open your glow journal →</p>
        </Link>
      </div>

      <button onClick={complete} className="gold-pill-btn mt-8 w-full">
        {done ? "Marked complete ✓" : "Mark Day " + dayNum + " complete"}
      </button>
    </Frame>
  );
}
