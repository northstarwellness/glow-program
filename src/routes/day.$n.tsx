import { createFileRoute, Link, Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, GoldDivider, TopBar } from "@/components/Frame";
import { useApp, unlockedUpTo, OUTCOMES } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, JOURNAL_PROMPTS, RECIPES, REDS_URL, phaseFor } from "@/lib/content";
import { SmoothieImage } from "@/components/SmoothieImage";

export const Route = createFileRoute("/day/$n")({ component: DayView });

function useIngredientChecks(dayNum: number, ingredients: string[]) {
  const key = `noure_day_ing_${dayNum}`;
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? "{}"); }
    catch { return {}; }
  });
  const toggle = (name: string) => {
    const next = { ...checked, [name]: !checked[name] };
    setChecked(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  const reset = () => {
    setChecked({});
    localStorage.removeItem(key);
  };
  const allChecked = ingredients.every((n) => !!checked[n]);
  return { checked, toggle, reset, allChecked };
}

function DayView() {
  const { n } = useParams({ from: "/day/$n" });
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();

  // Compute values needed for hooks before any conditional returns
  const dayNum = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  const today = unlockedUpTo(s.startDate, s.completedDays);
  const locked = dayNum > today;
  const d = DAYS[dayNum - 1];
  const recipe = RECIPES.find((r) => r.id === d?.recipeId) ?? RECIPES[0];

  // All hooks before conditional returns
  const { checked, toggle, allChecked } = useIngredientChecks(dayNum, recipe.ingredients);

  if (hydrated && !s.name) return <Navigate to="/" />;
  if (locked) return <Navigate to="/rituals" />;

  const phase = phaseFor(dayNum);
  const done = s.completedDays.includes(dayNum);
  const log = s.dailyLogs[dayNum] ?? {};
  const prompt = JOURNAL_PROMPTS[dayNum]?.(s.name ?? "") ?? "";

  const complete = () => {
    s.completeDay(dayNum);
    s.toggleLog(dayNum, "ritual");
    if (dayNum === 21) navigate({ to: "/celebrate" });
    else if ([1, 7, 14].includes(dayNum)) navigate({ to: "/milestone/$id", params: { id: `day-${dayNum}` } });
    else navigate({ to: "/home" });
  };

  return (
    <Frame>
      <TopBar name={s.name} day={dayNum} />

      {/* Phase breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Link to="/rituals" className="text-[12px] text-[var(--charcoal)]/45">← All rituals</Link>
        <span className="text-[var(--taupe)]/60">·</span>
        <span className="label-caps text-[var(--gold)]">Week {phase.week} · {phase.label}</span>
      </div>

      {/* Day hero — editorial light card */}
      <div
        className="relative overflow-hidden rounded-3xl px-7 pt-7 pb-8"
        style={{
          background: "var(--beige)",
          border: "1px solid oklch(0.748 0.012 65 / 0.18)",
        }}
      >
        <div className="mb-3 h-px w-8 bg-[var(--gold)]/60" />
        <p className="label-caps text-[var(--gold)]">Week {phase.week} · {phase.label}</p>
        <p className="font-serif text-[72px] leading-none text-[var(--charcoal)]">{dayNum}</p>
        <h1 className="mt-1 font-serif text-[28px] leading-tight text-[var(--charcoal)]">{d.title}</h1>
        {done && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-4 py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M4 13l4 4L20 6"/></svg>
            <span className="font-serif text-[13px] text-[var(--ivory)]">Complete</span>
          </div>
        )}
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[var(--gold)]/8 blur-3xl" />
      </div>

      <GoldDivider />

      {/* Ritual guide */}
      <div className="bg-white border border-[var(--taupe)]/20 rounded-2xl p-6 shadow-sm">
        <p className="label-caps text-[var(--charcoal)]/40 mb-3">Today's ritual</p>
        <p className="font-serif italic text-[17px] leading-relaxed text-[var(--charcoal)]/80 drop-cap">
          {d.guide}
        </p>
      </div>

      <GoldDivider />

      {/* Recipe card with checkable ingredients */}
      <div>
        <p className="label-caps text-[var(--charcoal)]/40 mb-3">Today's recipe</p>
        <div className="overflow-hidden rounded-2xl">
          {/* Recipe hero — photo with gradient fallback */}
          <div className="relative overflow-hidden" style={{ minHeight: "140px" }}>
            <SmoothieImage
              recipe={recipe}
              className="absolute inset-0 h-full w-full"
              style={{ minHeight: "140px" }}
            />
            {/* Gradient overlay for text legibility */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)" }}
            />
            <div className="relative p-5 pt-8 text-[var(--ivory)]">
              <p className="label-caps text-[var(--ivory)]/75">{recipe.prep} · {recipe.benefitTag}</p>
              <h3 className="mt-1 font-serif text-[26px] leading-tight drop-shadow-sm">{recipe.name}</h3>
            </div>
          </div>
          {/* Checkable ingredient list */}
          <div className="bg-white border border-[var(--taupe)]/15 border-t-0 rounded-b-2xl">
            <p className="px-5 pt-4 pb-1 label-caps text-[var(--charcoal)]/40">Gather your ingredients</p>
            <div className="divide-y divide-[var(--taupe)]/15">
              {recipe.ingredients.map((name) => (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left transition-all cursor-pointer hover:bg-[var(--beige)]/60"
                >
                  <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                    checked[name]
                      ? "border-[var(--gold)] bg-[var(--gold)]"
                      : "border-[var(--taupe)]/40 bg-transparent"
                  }`}>
                    {checked[name] && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </span>
                  <span className={`font-serif text-[16px] transition-all ${
                    checked[name] ? "text-[var(--charcoal)]/30 line-through" : "text-[var(--charcoal)]"
                  }`}>{name}</span>
                </button>
              ))}
            </div>
            {allChecked && (
              <p className="px-5 py-3 font-serif italic text-[13px] text-[var(--gold)]">All gathered. Ready to blend.</p>
            )}
            <div className="px-5 py-4">
              <Link
                to="/recipes/$id"
                params={{ id: recipe.id }}
                className="block w-full rounded-full border border-[var(--taupe)]/30 py-2.5 text-center font-serif text-[14px] text-[var(--charcoal)]"
              >
                Full recipe + method →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Radiant Reds Boost — warm gold card */}
      <div className="mt-5 rounded-3xl overflow-hidden"
           style={{ background: "linear-gradient(135deg, oklch(0.968 0.028 68) 0%, oklch(0.985 0.016 65) 100%)", border: "1px solid oklch(0.720 0.082 65 / 0.25)" }}>
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            <p className="label-caps text-[var(--gold)]">Radiant Reds Boost</p>
          </div>
          <p className="font-serif italic text-[16px] leading-relaxed text-[var(--charcoal)]/75">
            {recipe.redsBoost.why}
          </p>
        </div>
        <div className="px-6 pb-4 mt-2 space-y-1.5">
          {recipe.redsBoost.proof.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--gold)]" />
              <span className="label-caps text-[var(--charcoal)]/55">{p}</span>
            </div>
          ))}
        </div>
        <a
          href={REDS_URL}
          target="_top"
          className="flex items-center justify-between border-t border-[var(--gold)]/20 px-6 py-3.5"
        >
          <span className="font-serif text-[14px] text-[var(--gold)]">Shop Radiant Reds →</span>
        </a>
      </div>

      {/* Check-ins */}
      <div className="mt-5">
        <p className="label-caps text-[var(--charcoal)]/40 mb-3">Today's check-ins</p>
        <div className={`grid grid-cols-3 gap-2 rounded-2xl p-2 transition-all ${
          log.reds && log.ritual && log.journal ? "bg-[var(--gold)]/8" : ""
        }`}>
          <LogTile label="Radiant Reds" icon="glass" done={!!log.reds} onClick={() => s.toggleLog(dayNum, "reds")} />
          <LogTile label="Morning ritual" icon="leaf" done={!!log.ritual} onClick={() => s.toggleLog(dayNum, "ritual")} />
          <LogTile label="Journal" icon="sun" done={!!log.journal} onClick={() => s.toggleLog(dayNum, "journal")} />
        </div>
      </div>

      {/* Feeling chips — post-ritual check-in */}
      <RitualFeelChips day={dayNum} />

      {/* Journal prompt */}
      <Link
        to="/journal/$n"
        params={{ n: String(dayNum) }}
        className="mt-4 flex items-center justify-between rounded-2xl p-5 cursor-pointer"
        style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}
      >
        <div className="min-w-0 flex-1 pr-3">
          <p className="label-caps text-[var(--berry)]/60 mb-2">Today's prompt</p>
          <p className="font-serif italic text-[18px] leading-snug text-[var(--charcoal)]">"{prompt}"</p>
          <p className="mt-2 text-[12px] text-[var(--charcoal)]/40">Tap to write →</p>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--taupe)] flex-shrink-0">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </Link>

      <GoldDivider />

      {/* Complete button */}
      <button
        onClick={complete}
        className={`w-full rounded-full px-6 py-4 font-serif text-[18px] transition-all ${
          done
            ? "border border-[var(--gold)]/40 bg-transparent text-[var(--gold)]"
            : "gold-pill-btn"
        }`}
      >
        {done ? `Day ${dayNum} complete` : `Mark Day ${dayNum} Complete →`}
      </button>
      <p className="mt-3 text-center font-serif italic text-[12px] text-[var(--charcoal)]/35">
        {done ? "See you tomorrow morning." : "One tap when your ritual is done."}
      </p>
    </Frame>
  );
}

const NO_OUTCOMES: string[] = [];

function RitualFeelChips({ day }: { day: number }) {
  const outcomes = useApp((s) => s.outcomesByDay[day]) ?? NO_OUTCOMES;
  const toggle = useApp((s) => s.toggleOutcomeForDay);

  return (
    <div className="mt-5 rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm p-5">
      <p className="label-caps text-[var(--charcoal)]/40 mb-1">How do you feel after today's ritual?</p>
      <p className="font-serif italic text-[13px] text-[var(--charcoal)]/45 mb-4">Select all that feel true.</p>
      <div className="flex flex-wrap gap-2">
        {OUTCOMES.map((outcome) => {
          const active = outcomes.includes(outcome);
          return (
            <button
              key={outcome}
              onClick={() => toggle(day, outcome)}
              className={`rounded-full px-4 py-2 font-serif text-[14px] transition-all cursor-pointer ${
                active
                  ? "bg-[var(--gold)] text-[var(--ivory)] shadow-sm"
                  : "bg-[var(--beige)] text-[var(--charcoal)]/65 border border-[var(--taupe)]/25 hover:border-[var(--gold)]/40"
              }`}
            >
              {outcome}
            </button>
          );
        })}
      </div>
      {outcomes.length > 0 && (
        <p className="mt-4 font-serif italic text-[12px] text-[var(--charcoal)]/40">
          Saved. Your body keeps the record.
        </p>
      )}
    </div>
  );
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
