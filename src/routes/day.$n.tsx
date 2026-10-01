import {
  createFileRoute,
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Frame, GoldDivider, TopBar } from "@/components/Frame";
import { useApp, routeAfterComplete, isDayPersisted, isDayUnlocked, activeDay } from "@/lib/store";
import { ProgressSkeleton } from "@/components/ProgressSkeleton";
import { COMPLETION_ANCHOR, recipeLinkSearch } from "@/lib/recipe-entry";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, JOURNAL_PROMPTS, RECIPES, phaseFor } from "@/lib/content";
import { OptionalReds } from "@/components/OptionalReds";
import { DailySound } from "@/components/Sounds";
import { SOUNDS } from "@/lib/sounds";
import { SmoothieImage } from "@/components/SmoothieImage";
import { dayButtonStyle } from "@/lib/recipe-button";
import { FeelingChips } from "@/components/FeelingChips";

export const Route = createFileRoute("/day/$n")({ component: DayRoute });

let lastCompletionAt = 0;

/** Remount per day so per-day local state (ingredient checks, save status) never carries over. */
function DayRoute() {
  const { n } = useParams({ from: "/day/$n" });
  return <DayView key={n} />;
}

function useIngredientChecks(dayNum: number, ingredients: string[]) {
  const key = `noure_day_ing_${dayNum}`;
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "{}");
    } catch {
      return {};
    }
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
  const validParam = /^\d+$/.test(n) && +n >= 1 && +n <= 21;
  const dayNum = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  const locked = !validParam || !isDayUnlocked(dayNum, s.completedDays);
  const d = DAYS[dayNum - 1];
  const recipe = RECIPES.find((r) => r.id === d?.recipeId) ?? RECIPES[0];

  // All hooks before conditional returns
  const { checked, toggle, allChecked } = useIngredientChecks(dayNum, recipe.ingredients);
  const completing = useRef(false);
  const completionRef = useRef<HTMLElement>(null);
  const completeBtnRef = useRef<HTMLButtonElement>(null);
  const { hash } = useLocation();
  // One-shot redirect for a locked or invalid day → the customer's active day.
  const redirectTo = hydrated && s.name && locked ? String(activeDay(s.completedDays)) : null;
  useEffect(() => {
    if (redirectTo) navigate({ to: "/day/$n", params: { n: redirectTo }, replace: true });
  }, [redirectTo, navigate]);
  // Returning from the guided recipe (#complete): reveal the completion area once
  // layout is ready, and put focus there for keyboard/VoiceOver. One move, no loop.
  useEffect(() => {
    if (!hydrated || hash !== COMPLETION_ANCHOR) return;
    const id = requestAnimationFrame(() => {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      completionRef.current?.scrollIntoView({
        block: "center",
        behavior: reduce ? "auto" : "smooth",
      });
      completeBtnRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [hydrated, hash, dayNum]);
  const [saveFailed, setSaveFailed] = useState(false);

  // Until saved progress loads, the store holds Day 1 defaults — show nothing day-specific.
  if (!hydrated) return <ProgressSkeleton />;
  if (!s.name) return <Navigate to="/" />;
  // Locked or invalid day → redirected once by the effect above. Rendering <Navigate>
  // to this same route re-triggers itself ("Maximum update depth exceeded").
  if (locked) return <ProgressSkeleton />;

  const phase = phaseFor(dayNum);
  const done = s.completedDays.includes(dayNum);
  const log = s.dailyLogs[dayNum] ?? {};
  const prompt = JOURNAL_PROMPTS[dayNum]?.(s.name ?? "") ?? "";

  const complete = () => {
    // A second tap right after a completion (e.g. a double-tap that lands on the next day's
    // button once it opens) is ignored, so a day can never be completed by accident.
    if (completing.current || Date.now() - lastCompletionAt < 800) return;
    completing.current = true;
    setSaveFailed(false);
    const wasDone = useApp.getState().completedDays.includes(dayNum);
    try {
      const { completeDay, setLog } = useApp.getState();
      completeDay(dayNum);
      setLog(dayNum, "ritual", true);
    } catch {
      /* storage write threw — verified below */
    }
    if (!isDayPersisted(dayNum)) {
      completing.current = false;
      setSaveFailed(true);
      return;
    }
    // Guard stays set: this view unmounts on navigation (keyed by day).
    lastCompletionAt = Date.now();
    const after = useApp.getState().completedDays;
    // A re-tap on an already-finished day skips its milestone and goes to the active day.
    if (wasDone && dayNum < 21)
      navigate({ to: "/day/$n", params: { n: String(activeDay(after)) }, replace: true });
    else navigate({ ...routeAfterComplete(dayNum, after), replace: true });
  };

  return (
    <Frame>
      <TopBar name={s.name} day={dayNum} />

      {/* Phase breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Link to="/rituals" className="text-[12px] text-[var(--ink-2)]">
          ← All rituals
        </Link>
        <span className="text-[var(--ink-2)]">·</span>
        <span className="label-caps text-[var(--cranberry)]">
          Week {phase.week} · {phase.label}
        </span>
      </div>

      {/* Day hero — editorial light card */}
      <div
        className="day-hero relative overflow-hidden rounded-3xl px-7 pt-7 pb-8"
        data-testid="day-hero"
      >
        <div className="mb-3.5 h-px w-8 bg-[var(--gold)]/60" />
        <p className="label-caps text-[var(--cranberry)]">
          Week {phase.week} · {phase.label}
        </p>
        <p className="mt-3 font-serif text-[72px] leading-[0.9] text-[var(--charcoal)]">{dayNum}</p>
        <h1 className="mt-3 font-serif text-[28px] leading-tight text-[var(--charcoal)] [text-wrap:balance]">
          {d.title}
        </h1>
        {done && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-4 py-1.5">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M4 13l4 4L20 6" />
            </svg>
            <span className="font-serif text-[13px] text-[var(--ivory)]">Complete</span>
          </div>
        )}
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[var(--gold)]/8 blur-3xl" />
      </div>

      <GoldDivider />

      {/* The morning in order: recipe, optional sound, ritual, optional journal. */}
      <MorningSteps
        recipeName={recipe.name}
        prep={recipe.prep}
        hasSound={SOUNDS.length > 0}
        dayNum={dayNum}
      />

      {/* Recipe card with checkable ingredients */}
      <div id="day-recipe" className="scroll-mt-6">
        <p className="label-caps text-[var(--ink-2)] mb-3">Today's recipe</p>
        <div className="overflow-hidden rounded-2xl">
          {/* Recipe hero — photo with gradient fallback */}
          <div className="relative overflow-hidden" style={{ minHeight: "140px" }}>
            <SmoothieImage
              recipe={recipe}
              className="h-full w-full"
              style={{ position: "absolute", inset: 0 }}
            />
            {/* Gradient overlay for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)",
              }}
            />
            <div className="relative p-5 pt-8 text-[var(--ivory)]">
              <p className="label-caps text-[var(--ivory)]/75">
                {recipe.prep} · {recipe.benefitTag}
              </p>
              <h3 className="mt-1 font-serif text-[26px] leading-tight drop-shadow-sm">
                {recipe.name}
              </h3>
            </div>
          </div>
          {/* Checkable ingredient list */}
          <div className="bg-white border border-[var(--taupe)]/15 border-t-0 rounded-b-2xl">
            <p className="px-5 pt-4 pb-1 label-caps text-[var(--ink-2)]">Gather your ingredients</p>
            <div className="divide-y divide-[var(--taupe)]/15">
              {recipe.ingredients.map((name) => (
                <button
                  key={name}
                  onClick={() => toggle(name)}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left transition-all cursor-pointer hover:bg-[var(--beige)]/60"
                >
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                      checked[name]
                        ? "border-[var(--gold)] bg-[var(--gold)]"
                        : "border-[var(--taupe)]/40 bg-transparent"
                    }`}
                  >
                    {checked[name] && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`font-serif text-[16px] transition-all ${
                      checked[name] ? "text-[var(--ink-2)] line-through" : "text-[var(--charcoal)]"
                    }`}
                  >
                    {name}
                  </span>
                </button>
              ))}
            </div>
            {allChecked && (
              <p className="px-5 py-3 font-serif italic text-[13px] text-[var(--cranberry)]">
                All gathered. Ready to blend.
              </p>
            )}
            <div className="px-5 py-4">
              <Link
                to="/recipes/$id"
                params={{ id: recipe.id }}
                search={recipeLinkSearch({ kind: "day", day: dayNum })}
                className="btn-day-quiet"
                style={dayButtonStyle(recipe.gradient) as React.CSSProperties}
                data-testid="open-recipe"
              >
                Open full recipe &amp; method →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Optional sound. Shown only when a verified sound exists; never affects completion. */}
      <DailySound day={dayNum} />

      {/* Today's ritual: read once the glass is ready */}
      <div
        id="day-ritual"
        className="reading-card mt-5 scroll-mt-6 rounded-2xl p-6"
        data-testid="todays-ritual"
      >
        <p className="label-caps text-[var(--ink-2)] mb-3">Today's ritual</p>
        <p className="font-serif italic text-[17px] leading-relaxed text-[var(--charcoal)]/80 drop-cap">
          {d.guide}
        </p>
      </div>

      {/* Check-ins */}
      <div className="mt-5">
        <p className="label-caps text-[var(--ink-2)] mb-3">Today's check-ins</p>
        <div
          className={`grid grid-cols-3 gap-2 rounded-2xl p-2 transition-all ${
            log.reds && log.ritual && log.journal ? "bg-[var(--gold)]/8" : ""
          }`}
        >
          <LogTile
            label="Radiant Reds"
            icon="glass"
            done={!!log.reds}
            optional
            onClick={() => s.toggleLog(dayNum, "reds")}
          />
          <LogTile
            label="Morning ritual"
            icon="leaf"
            done={!!log.ritual}
            onClick={() => s.toggleLog(dayNum, "ritual")}
          />
          <LogTile
            label="Journal"
            icon="sun"
            done={!!log.journal}
            onClick={() => s.toggleLog(dayNum, "journal")}
          />
        </div>
      </div>

      {/* Feeling chips — post-ritual check-in */}
      <RitualFeelChips day={dayNum} />

      {/* Journal prompt */}
      <Link
        id="day-journal"
        to="/journal/$n"
        params={{ n: String(dayNum) }}
        className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--taupe)]/25 bg-white p-5 shadow-sm cursor-pointer"
      >
        <div className="min-w-0 flex-1 pr-3">
          <span aria-hidden="true" className="mb-2.5 block h-px w-7 bg-[var(--berry)]/50" />
          <p className="label-caps text-[var(--berry)] mb-2">Morning Journal · optional</p>
          <p className="font-serif italic text-[18px] leading-snug text-[var(--charcoal)]">
            "{prompt}"
          </p>
          <p className="mt-2 text-[12px] text-[var(--charcoal)]/70">
            {s.journalEntries[dayNum] ? "Read or edit your entry →" : "Tap to write →"}
          </p>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="text-[var(--ink-2)] flex-shrink-0"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>

      {/* Optional addition, after the recipe and check-ins. The morning is complete without it. */}
      <OptionalReds recipeId={recipe.id} className="mt-4" />

      <GoldDivider />

      {/* Completion section — the guided journey returns here by anchor. */}
      <section
        id={COMPLETION_ANCHOR}
        ref={completionRef}
        tabIndex={-1}
        className="scroll-mt-6 outline-none"
      >
        <p className="label-caps mb-3 text-[var(--ink-2)]">Finish today</p>
        <button
          type="button"
          ref={completeBtnRef}
          onClick={complete}
          className={done ? "btn-done" : "btn-day"}
          style={dayButtonStyle(recipe.gradient) as React.CSSProperties}
          data-testid="complete-day"
        >
          {done && (
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          )}
          {done ? `Day ${dayNum} complete` : `Mark Day ${dayNum} Complete →`}
        </button>
        <p className="mt-3 text-center font-serif italic text-[12px] text-[var(--ink-2)]">
          {done ? "See you tomorrow morning." : "One tap when your ritual is done."}
        </p>
        <p role="alert" className="mt-2 text-center text-[12px] text-[var(--berry)]">
          {saveFailed ? "We couldn't save your progress on this device. Please try again." : ""}
        </p>
      </section>
    </Frame>
  );
}

function RitualFeelChips({ day }: { day: number }) {
  return (
    <div
      id="feelings"
      className="mt-5 scroll-mt-6 rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm p-5"
    >
      <p className="label-caps text-[var(--ink-2)] mb-1">Optional</p>
      <h2 className="font-serif text-[20px] leading-tight text-[var(--charcoal)]">
        How do you feel today?
      </h2>
      <p className="mt-1 mb-4 text-[13px] leading-snug text-[var(--charcoal)]/70">
        A small check-in, just for you. Tap any that fit, or skip.
      </p>
      <FeelingChips day={day} savedNote="Saved to your 21-day record and your Morning Journal." />
    </div>
  );
}

function LogTile({
  label,
  icon,
  done,
  optional = false,
  onClick,
}: {
  label: string;
  icon: "glass" | "leaf" | "sun";
  done: boolean;
  /** Logging it never affects completing the day. */
  optional?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all cursor-pointer ${
        done
          ? "bg-[var(--gold)]/10 ring-1 ring-[var(--gold)]/40 text-[var(--charcoal)]"
          : "bg-[var(--beige)] text-[var(--charcoal)] hover:bg-[var(--taupe)]/20"
      }`}
    >
      {done ? <CheckIcon /> : <TileIcon name={icon} />}
      <span className="text-[11px] leading-tight">{label}</span>
      <span
        className={`text-[9px] tracking-wider uppercase ${done ? "text-[var(--cranberry)]" : "text-[var(--ink-2)]"}`}
      >
        {done ? "Logged" : optional ? "Optional" : "Begin"}
      </span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 13l4 4L20 6" />
    </svg>
  );
}
function TileIcon({ name }: { name: "glass" | "leaf" | "sun" }) {
  if (name === "glass")
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M6 3h12l-2 12a4 4 0 01-8 0L6 3z" />
      </svg>
    );
  if (name === "leaf")
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M5 21c0-9 7-16 16-16-1 9-7 16-16 16z" />
      </svg>
    );
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

/** A short outline of this morning, in page order, each step linking to its section. */
function MorningSteps({
  recipeName,
  prep,
  hasSound,
  dayNum,
}: {
  recipeName: string;
  prep: string;
  hasSound: boolean;
  dayNum: number;
}) {
  const steps: { href: string; label: string; note: string }[] = [
    { href: "#day-recipe", label: `Make ${recipeName}`, note: prep },
    ...(hasSound ? [{ href: "#day-sound", label: "Play a sound", note: "Optional" }] : []),
    { href: "#day-ritual", label: "Read today's ritual", note: "A few quiet minutes" },
    { href: "#day-journal", label: "Write in your journal", note: "Optional" },
  ];
  return (
    <nav aria-label={`Day ${dayNum}, this morning`} className="mb-6" data-testid="morning-steps">
      <p className="label-caps mb-2.5 text-[var(--ink-2)]">This morning</p>
      <ol className="overflow-hidden rounded-2xl border border-[var(--taupe)]/20 bg-white">
        {steps.map((st, i) => (
          <li key={st.label} className={i ? "border-t border-[var(--taupe)]/15" : ""}>
            <a
              href={st.href}
              className="home-row flex min-h-[52px] items-center gap-3.5 px-4 py-2.5"
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/50 font-serif text-[13px] text-[var(--charcoal)]/75"
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 font-serif text-[16.5px] leading-tight text-[var(--charcoal)]">
                {st.label}
              </span>
              <span className="flex-shrink-0 text-[12px] text-[var(--ink-2)]">{st.note}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[12px] text-[var(--ink-2)]">
        When you&rsquo;re done, mark Day {dayNum} complete at the bottom of the page.
      </p>
    </nav>
  );
}
