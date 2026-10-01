import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Frame, Wordmark } from "@/components/Frame";
import { useApp, activeDay, daysBetween, isProgramComplete } from "@/lib/store";
import { ProgressSkeleton } from "@/components/ProgressSkeleton";
import { recipeLinkSearch } from "@/lib/recipe-entry";
import { dayButtonStyle } from "@/lib/recipe-button";
import { useHydrated } from "@/lib/use-hydrated";
import {
  DAYS,
  JOURNAL_PROMPTS,
  PHASES,
  RECIPES,
  REDS_URL,
  phaseFor,
  type Recipe,
} from "@/lib/content";
import { SmoothieImage } from "@/components/SmoothieImage";
import { KnowledgeLinks } from "@/components/Knowledge";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();

  // All hooks must be called before any conditional returns
  // The previous visit, read once after saved data loads, then today's visit is recorded.
  const previousVisit = useRef<string | null | undefined>(undefined);
  const setLastVisit = useApp((st) => st.setLastVisit);
  useEffect(() => {
    if (!hydrated || previousVisit.current !== undefined) return;
    previousVisit.current = useApp.getState().lastVisitAt;
    setLastVisit(new Date().toISOString());
  }, [hydrated, setLastVisit]);
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
  // Progress lives in localStorage; until it loads, the store holds Day 1 defaults.
  // Render nothing day-specific so a slow first paint can't show or link to the wrong day.
  if (!hydrated) return <ProgressSkeleton />;

  const day = activeDay(s.completedDays);
  const done = s.completedDays.length;
  const complete = isProgramComplete(s.completedDays);
  const phase = phaseFor(day);
  const today = DAYS[day - 1];
  const recipe = RECIPES.find((r) => r.id === today.recipeId)!;
  const promptText = JOURNAL_PROMPTS[day]?.(s.name ?? "") ?? "";
  const notesWritten = Object.keys(s.journalEntries).length;
  // Back after two or more calendar days away: a plain welcome. Nothing was lost or skipped.
  const away =
    previousVisit.current === undefined
      ? daysBetween(s.lastVisitAt)
      : daysBetween(previousVisit.current);
  const welcomeBack = !complete && done > 0 && away >= 2;

  const reset = (
    <ResetCard
      day={day}
      done={done}
      complete={complete}
      completedDays={s.completedDays}
      weekLabel={`${phase.label} · Week ${phase.week}`}
      title={today.title}
      recipe={recipe}
    />
  );
  const everyday = <EverydayMornings primary={complete} />;

  return (
    <Frame>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Wordmark />
        <Link
          to="/profile"
          className="inline-flex min-h-[44px] items-center whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/70"
        >
          Day {day} of 21
        </Link>
      </div>

      {/* Greeting */}
      <header className="mt-3">
        <p className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-[var(--charcoal)]/70">
          Good morning, {s.name}
          <span aria-hidden="true" className="h-px w-10 bg-[var(--charcoal)]/35" />
        </p>
        <h1 className="mt-2 font-serif text-[40px] leading-[0.98] tracking-[-0.015em] text-[var(--charcoal)]">
          Your morning ritual.
        </h1>
      </header>

      {welcomeBack && (
        <p
          data-testid="welcome-back"
          className="mt-3 font-serif italic text-[16px] leading-snug text-[var(--charcoal)]/75"
        >
          Welcome back. Your {done} {done === 1 ? "morning is" : "mornings are"} saved, and Day{" "}
          {day} is ready whenever you are.
        </p>
      )}

      {/* Your Ritual: counts of completed mornings, never a score or a streak. */}
      <div className="mt-3 grid grid-cols-2 gap-2.5" data-testid="counters">
        <Counter value={done} label={done === 1 ? "Morning complete" : "Mornings complete"} />
        {complete ? (
          <Counter
            value={notesWritten}
            label={notesWritten === 1 ? "Journal entry" : "Journal entries"}
          />
        ) : (
          <Counter value={`Day ${day}`} label="Next morning" />
        )}
      </div>

      {/* The two paths, always both visible. After Day 21, Everyday Mornings leads. */}
      {complete ? (
        <>
          {everyday}
          {reset}
        </>
      ) : (
        <>
          {reset}
          {everyday}
        </>
      )}

      <QuickGlowBonus />

      {/* Everything else, in one tidy group */}
      <nav
        aria-label="More in your ritual"
        className="mt-6 overflow-hidden rounded-3xl border border-[var(--taupe)]/30 bg-white shadow-sm"
      >
        <HomeRow
          to={complete ? "/journal" : "/journal/$n"}
          params={complete ? undefined : { n: String(day) }}
          title="Morning Journal"
          note={complete ? "Your reflections from all 21 mornings" : `Optional · ${promptText}`}
        />
        <HomeRow
          to="/progress"
          title="Progress"
          note={`${done} ${done === 1 ? "morning" : "mornings"} complete`}
        />
        <a
          href={REDS_URL}
          target="_top"
          className="home-row flex min-h-[64px] items-center justify-between gap-4 px-5 py-3.5"
        >
          <span className="min-w-0">
            <span className="block font-serif text-[18px] leading-tight text-[var(--charcoal)]">
              Radiant Reds
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-[var(--charcoal)]/70">
              An optional addition to your glass
            </span>
          </span>
          <Chevron external />
        </a>
      </nav>

      {/* The Ritual Guide: each part as its own tile, so it is clear what opens. */}
      <section aria-labelledby="home-guide" className="mt-6">
        <p id="home-guide" className="label-caps mb-3 text-[var(--ink-2)]">
          The Ritual Guide
        </p>
        <KnowledgeLinks />
      </section>

      <Link
        to="/profile"
        className="mt-5 flex min-h-[44px] items-center justify-center text-[13px] tracking-[0.02em] text-[var(--charcoal)]/70"
      >
        Profile & settings
      </Link>
    </Frame>
  );
}

/** The seven smoothies of the 21-day plan, in day order (each repeats once a week). */
const PLAN_RECIPES = [...new Set(DAYS.map((d) => d.recipeId))]
  .map((id) => RECIPES.find((r) => r.id === id))
  .filter((r): r is Recipe => !!r);
const QUICK_RECIPES = RECIPES.filter((r) => r.quick);

function SectionLabel({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2
      id={id}
      className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[var(--charcoal)]/75"
    >
      {children}
    </h2>
  );
}

function Counter({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 rounded-2xl border border-[var(--taupe)]/25 bg-white px-4 py-2 shadow-sm">
      <p className="whitespace-nowrap font-serif text-[24px] leading-none lining-nums text-[var(--charcoal)]">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/70">{label}</p>
    </div>
  );
}

/**
 * Today's recipe, drawn exactly like a card in the Smoothies library: the recipe's own
 * gradient as a short band on a soft white card, with the name underneath.
 */
function RecipeMiniCard({ recipe, day }: { recipe: Recipe; day: number }) {
  return (
    <Link
      to="/recipes/$id"
      params={{ id: recipe.id }}
      search={recipeLinkSearch({ kind: "day", day })}
      aria-label={`Day ${day} recipe: ${recipe.name}, ${recipe.prep}`}
      className="home-focus group block overflow-hidden rounded-2xl border border-[var(--taupe)]/20 bg-white shadow-sm"
      data-testid="today-recipe"
    >
      <SmoothieImage recipe={recipe} className="h-[60px] w-full" />
      <span className="block px-3 pb-3 pt-2">
        <span className="block text-[9.5px] font-medium uppercase tracking-[0.15em] text-[var(--charcoal)]/70">
          Day {day} recipe
        </span>
        <span className="mt-0.5 block font-serif text-[16px] leading-tight text-[var(--charcoal)] group-hover:underline">
          {recipe.name}
        </span>
        <span className="mt-0.5 block text-[11.5px] text-[var(--charcoal)]/70">{recipe.prep}</span>
      </span>
    </Link>
  );
}

/** Foundation · Build · Glow, seven dots each. Filled = done, ring = today, small hollow = still to come. */
function WeekGroups({
  completedDays,
  day,
  complete,
  done,
}: {
  completedDays: number[];
  day: number;
  complete: boolean;
  done: number;
}) {
  return (
    <div
      role="progressbar"
      aria-label="21-Day Reset progress"
      aria-valuemin={0}
      aria-valuemax={21}
      aria-valuenow={done}
      aria-valuetext={`${done} of 21 days complete`}
      className="grid grid-cols-3 gap-2"
    >
      {PHASES.map((p) => {
        const days = Array.from({ length: 7 }, (_, i) => p.range[0] + i);
        const weekDone = days.filter((d) => completedDays.includes(d)).length;
        const current = !complete && days.includes(day);
        return (
          <div
            key={p.week}
            data-testid={`week-${p.week}`}
            data-current={current}
            className="week-card min-w-0 px-2.5 py-2.5 max-[359px]:px-2"
          >
            <p className="font-serif text-[14px] leading-tight text-[var(--charcoal)] max-[359px]:text-[12.5px]">
              {p.label}
            </p>
            <p className="sr-only">
              Week {p.week}: {weekDone} of 7 complete{current ? `, Day ${day} is today` : ""}
            </p>
            <div
              aria-hidden="true"
              className="mt-2 flex items-center gap-[4px] max-[359px]:gap-[3px]"
            >
              {days.map((d) => {
                const state = completedDays.includes(d)
                  ? "done"
                  : !complete && d === day
                    ? "today"
                    : "upcoming";
                return <span key={d} data-state={state} className={`dot dot-${state}`} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResetCard({
  day,
  done,
  complete,
  completedDays,
  weekLabel,
  title,
  recipe,
}: {
  day: number;
  done: number;
  complete: boolean;
  completedDays: number[];
  weekLabel: string;
  title: string;
  recipe: Recipe;
}) {
  return (
    <section
      aria-labelledby="path-reset"
      data-testid="path-reset"
      className="mt-3 overflow-hidden rounded-3xl border border-[var(--taupe)]/30 bg-white shadow-sm"
    >
      {/* A thin band in today's own recipe colors ties the Reset to its smoothie. */}
      <SmoothieImage recipe={recipe} className="h-1.5 w-full" />
      <div className="px-5 pb-4 pt-3.5">
        <SectionLabel id="path-reset">Your 21 Mornings</SectionLabel>

        {complete ? (
          <>
            <p className="mt-2 font-serif text-[24px] leading-tight text-[var(--charcoal)]">
              Complete · 21 of 21
            </p>
            <div className="mt-3">
              <WeekGroups completedDays={completedDays} day={day} complete done={done} />
            </div>
            <div className="mt-4 grid gap-2.5">
              <Link to="/reflection" className="ink-btn-outline">
                Your Reflection
              </Link>
              <Link to="/rituals" className="ink-btn-outline">
                All 21 days
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(118px,42%)] gap-4">
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <p className="font-serif text-[44px] leading-none lining-nums text-[var(--charcoal)]">
                    {String(day).padStart(2, "0")}
                    <span className="ml-1 text-[20px] text-[var(--ink-2)]">/ 21</span>
                  </p>
                  <p className="mt-1.5 text-[12px] text-[var(--charcoal)]/70">
                    {done} of 21 complete
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--charcoal)]/70">
                    {weekLabel.split(" · ").map((part, i) => (
                      <span key={part}>
                        {i > 0 && " · "}
                        <span className="whitespace-nowrap">{part}</span>
                      </span>
                    ))}
                  </p>
                  <p className="mt-1 font-serif italic text-[18px] leading-snug text-[var(--charcoal)]">
                    {title}
                  </p>
                </div>
              </div>
              <RecipeMiniCard recipe={recipe} day={day} />
            </div>
            <div className="mt-3">
              <WeekGroups completedDays={completedDays} day={day} complete={false} done={done} />
            </div>
            <Link
              to="/day/$n"
              params={{ n: String(day) }}
              className="btn-day mt-3.5"
              style={dayButtonStyle(recipe.gradient) as React.CSSProperties}
            >
              {done === 0 ? `Begin Day ${day}` : `Continue Day ${day}`}
              <span aria-hidden="true">→</span>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

function EverydayMornings({ primary }: { primary: boolean }) {
  return (
    <section
      aria-labelledby="path-everyday"
      className="mt-4 rounded-3xl border border-[var(--taupe)]/30 bg-white px-5 pb-5 pt-4 shadow-sm"
      data-testid="path-everyday"
    >
      <SectionLabel id="path-everyday">Everyday Mornings</SectionLabel>
      <p className="mt-1.5 font-serif text-[21px] leading-tight text-[var(--charcoal)]">
        Choose a smoothie for any morning
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--charcoal)]/70">
        Browsing recipes never changes your Reset days.
      </p>
      <div aria-hidden="true" className="mt-3 grid grid-cols-7 gap-1.5">
        {PLAN_RECIPES.map((r) => (
          <SmoothieImage key={r.id} recipe={r} className="h-9 w-full rounded-xl" />
        ))}
      </div>
      <Link to="/recipes" className={`${primary ? "ink-btn" : "ink-btn-outline"} mt-4`}>
        Browse recipes
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

/** The Quick Mornings bonus (formerly Quick Glow Mornings), with its approved wording. Separate from Everyday Mornings. */
function QuickGlowBonus() {
  return (
    <Link
      to="/recipes"
      hash="quick-glow"
      data-testid="quick-glow"
      className="home-row mt-4 flex items-center gap-4 rounded-3xl border border-[var(--taupe)]/30 bg-white p-5 shadow-sm max-[359px]:flex-col max-[359px]:items-start max-[359px]:gap-3"
    >
      <span aria-hidden="true" className="flex flex-shrink-0 -space-x-2">
        {QUICK_RECIPES.slice(0, 4).map((r) => (
          <SmoothieImage key={r.id} recipe={r} className="h-9 w-9 rounded-full ring-2 ring-white" />
        ))}
      </span>
      <span className="min-w-0">
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[var(--charcoal)]/75">
          Bonus
        </span>
        <span className="mt-0.5 block font-serif text-[18px] leading-snug text-[var(--charcoal)]">
          Quick Mornings.
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-[var(--charcoal)]/70">
          Short on time? Choose a simple smoothie for this morning.
        </span>
        <span className="mt-1.5 block text-[11px] uppercase tracking-[0.2em] text-[var(--charcoal)]">
          Open the set →
        </span>
      </span>
    </Link>
  );
}

function HomeRow({
  to,
  params,
  title,
  note,
}: {
  to: "/journal" | "/journal/$n" | "/progress";
  params?: { n: string };
  title: string;
  note: string;
}) {
  return (
    <Link
      to={to}
      params={params as never}
      className="home-row flex min-h-[64px] items-center justify-between gap-4 border-b border-[var(--taupe)]/20 px-5 py-3.5"
    >
      <span className="min-w-0">
        <span className="block font-serif text-[18px] leading-tight text-[var(--charcoal)]">
          {title}
        </span>
        <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-[var(--charcoal)]/70">
          {note}
        </span>
      </span>
      <Chevron />
    </Link>
  );
}

/** A thin, quiet arrow; ↗ for the external shop link. */
function Chevron({ external = false }: { external?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 text-[var(--ink-2)]"
    >
      {external ? <path d="M8 16L16 8M9 8h7v7" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

function parseMilestone(id: string): number {
  const m = id.match(/day-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}
