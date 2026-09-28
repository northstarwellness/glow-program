import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Frame, TopBar } from "@/components/Frame";
import { useApp, activeDay, isDayUnlocked, isProgramComplete } from "@/lib/store";
import { ProgressSkeleton } from "@/components/ProgressSkeleton";
import { useHydrated } from "@/lib/use-hydrated";
import { JOURNAL_PROMPTS } from "@/lib/content";
import { feelingsForDay, journalDateForDay, journalTextForDay } from "@/lib/reflections";
import { FeelingTags } from "@/components/FeelingChips";

export const Route = createFileRoute("/journal/")({ component: JournalIndex });

function JournalIndex() {
  const hydrated = useHydrated();
  const s = useApp();
  // Until saved progress loads, the store holds Day 1 defaults — show nothing day-specific.
  if (!hydrated) return <ProgressSkeleton />;
  if (!s.name) return <Navigate to="/" />;
  const day = activeDay(s.completedDays);

  return (
    <Frame>
      <TopBar name={s.name} day={day} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--charcoal)]">
        {s.name}'s glow journal.
      </h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--charcoal)]/55">
        21 prompts. 21 entries.
      </p>

      <Link
        to="/journal/$n"
        params={{ n: String(day) }}
        className="mt-5 block rounded-2xl border-l-4 border-[var(--gold)] bg-white border border-[var(--taupe)]/20 shadow-sm p-5"
      >
        <p className="label-caps text-[var(--gold)]">Today / Day {day}</p>
        <p className="mt-2 font-serif italic text-[18px] text-[var(--charcoal)]">
          "{JOURNAL_PROMPTS[day]?.(s.name ?? "")}"
        </p>
        <p className="mt-3 text-[12px] text-[var(--charcoal)]/50">Tap to write</p>
      </Link>

      {isProgramComplete(s.completedDays) && <ReflectionLink />}

      <h2 className="mt-8 font-serif text-[22px] text-[var(--charcoal)]">All entries</h2>
      <div className="mt-3 space-y-2">
        {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
          const entry = s.journalEntries[d];
          const feelings = feelingsForDay(s.outcomesByDay, d);
          const unlocked = isDayUnlocked(d, s.completedDays);
          const card =
            feelings.length > 0 ? (
              <DailyReflectionCard
                day={d}
                feelings={feelings}
                text={journalTextForDay(s.journalEntries, d)}
                date={journalDateForDay(s.journalEntries, d)}
                editable={unlocked}
              />
            ) : (
              <div
                className={`flex items-center gap-3 rounded-xl p-3 ${entry ? "bg-white border border-[var(--taupe)]/15 shadow-sm" : "bg-[var(--beige)]"}`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-serif text-[16px] ${
                    entry
                      ? "bg-[var(--gold)] text-[var(--ivory)]"
                      : unlocked
                        ? "bg-[var(--charcoal)]/8 text-[var(--charcoal)]/55"
                        : "bg-[var(--charcoal)]/4 text-[var(--charcoal)]/25"
                  }`}
                >
                  {d}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-serif italic text-[14px] ${entry ? "text-[var(--charcoal)]" : "text-[var(--charcoal)]/45"}`}
                  >
                    {entry
                      ? entry.entry.slice(0, 60) + (entry.entry.length > 60 ? "…" : "")
                      : unlocked
                        ? "Not yet written"
                        : "Locked"}
                  </p>
                </div>
              </div>
            );
          return unlocked ? (
            <Link
              key={d}
              to="/journal/$n"
              params={{ n: String(d) }}
              className="block"
              data-testid={`journal-day-${d}`}
            >
              {card}
            </Link>
          ) : (
            <div key={d} data-testid={`journal-day-${d}`}>
              {card}
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/** A day she checked in on: her feelings, plus the start of what she wrote, if anything. */
function DailyReflectionCard({
  day,
  feelings,
  text,
  date,
  editable,
}: {
  day: number;
  feelings: string[];
  text: string;
  date: Date | null;
  editable: boolean;
}) {
  return (
    <div
      data-testid={`daily-reflection-${day}`}
      className="flex gap-3 rounded-xl border border-[var(--taupe)]/15 bg-white p-3 shadow-sm"
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gold)] font-serif text-[16px] text-[var(--ivory)]">
        {day}
      </span>
      <div className="min-w-0 flex-1">
        <p className="label-caps text-[10px] text-[var(--gold-deep)]">
          Day {day} · Daily Reflection
          {date && (
            <span className="text-[var(--charcoal)]/45">
              {" · "}
              {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          )}
        </p>
        <div className="mt-2">
          <FeelingTags feelings={feelings} />
        </div>
        {text && (
          <p className="mt-2 line-clamp-2 font-serif italic text-[14px] leading-snug text-[var(--charcoal)]">
            {text}
          </p>
        )}
        {editable && (
          <p className="mt-2 text-[12px] text-[var(--charcoal)]/55">
            {text ? "Open to read or edit →" : "Open to write or edit →"}
          </p>
        )}
      </div>
    </div>
  );
}

function ReflectionLink() {
  return (
    <Link
      to="/reflection"
      className="mt-4 flex items-center justify-between rounded-2xl p-5"
      style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}
    >
      <div>
        <p className="label-caps text-[var(--berry)]/70">Day 21 · Complete</p>
        <p className="mt-1 font-serif text-[19px] text-[var(--charcoal)]">Your Glow Reflection</p>
      </div>
      <span aria-hidden="true" className="font-serif text-[18px] text-[var(--charcoal)]/50">
        →
      </span>
    </Link>
  );
}
