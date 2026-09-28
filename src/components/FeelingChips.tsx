import { OUTCOMES, outcomeLabel, useApp } from "@/lib/store";
import { feelingsForDay, persistedFeelingsForDay } from "@/lib/reflections";

/**
 * The day's "How do you feel?" choices. One component for the Day page and the Journal,
 * both writing to outcomesByDay[day], so the two screens can never disagree.
 */
export function FeelingChips({ day, savedNote }: { day: number; savedNote: string }) {
  const byDay = useApp((s) => s.outcomesByDay);
  const toggle = useApp((s) => s.toggleOutcomeForDay);
  const selected = feelingsForDay(byDay, day);
  // Confirm against storage itself before telling her it's saved.
  const persisted = persistedFeelingsForDay(day);
  const saved = persisted !== null && persisted.join("|") === selected.join("|");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {OUTCOMES.map((outcome) => {
          const active = selected.includes(outcome);
          return (
            <button
              key={outcome}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(day, outcome)}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 font-serif text-[15px] transition-all cursor-pointer ${
                active
                  ? "border-[var(--gold-deep)] bg-[var(--blush)] text-[var(--charcoal)] shadow-[inset_0_0_0_1px_var(--gold-deep)]"
                  : "border-[var(--taupe)]/35 bg-[var(--beige)] text-[var(--charcoal)]/75 hover:border-[var(--gold)]/50"
              }`}
            >
              {active && <Check />}
              {outcomeLabel(outcome)}
            </button>
          );
        })}
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 font-serif italic text-[12.5px] ${saved ? "text-[var(--charcoal)]/55" : "text-[var(--berry)]"}`}
      >
        {selected.length === 0
          ? ""
          : saved
            ? savedNote
            : "We couldn't save this on your device. Please try again."}
      </p>
    </div>
  );
}

/** Quiet, non-interactive checked chips for the Journal list. */
export function FeelingTags({ feelings }: { feelings: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Feelings you chose">
      {feelings.map((o) => (
        <li
          key={o}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--gold)]/45 bg-[var(--blush)] px-2.5 py-0.5 font-serif text-[12.5px] text-[var(--charcoal)]/85"
        >
          <Check size={10} />
          {outcomeLabel(o)}
        </li>
      ))}
    </ul>
  );
}

function Check({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      className="text-[var(--gold-deep)]"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
