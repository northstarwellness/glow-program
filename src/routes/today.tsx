import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Shell, Placeholder, GoldDivider } from "@/components/Shell";
import { CTALink } from "@/components/CTA";
import { useGlow, currentDay } from "@/lib/glow-store";
import { JOURNAL_PROMPTS, RITUAL_STEPS, SMOOTHIES, reflect, REDS_URL } from "@/lib/glow-data";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/today")({
  head: () => ({ meta: [{ title: "Today — NOURÉ Inner Glow" }] }),
  component: Today,
});

function Today() {
  const startedAt = useGlow((s) => s.startedAt);
  if (!startedAt) return <Navigate to="/" />;
  const day = currentDay(startedAt);
  return <DayView day={day} isToday />;
}

export function DayView({ day, isToday = false }: { day: number; isToday?: boolean }) {
  const dayState = useGlow((s) => s.days[day]);
  const toggleStep = useGlow((s) => s.toggleStep);
  const setJournal = useGlow((s) => s.setJournal);
  const startedAt = useGlow((s) => s.startedAt);
  const today = currentDay(startedAt);
  const locked = day > today;

  const smoothie = SMOOTHIES[(day - 1) % SMOOTHIES.length];
  const prompt = JOURNAL_PROMPTS[day] ?? "What's one thing you're proud of today?";

  const [entry, setEntry] = useState(dayState?.journal ?? "");
  const [reply, setReply] = useState("");
  useEffect(() => { setEntry(dayState?.journal ?? ""); }, [day, dayState?.journal]);

  function saveJournal() {
    setJournal(day, entry);
    setReply(reflect(entry));
  }

  if (locked) {
    return (
      <Shell>
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Day {day}</p>
        <h1 className="mt-4 font-serif text-4xl text-primary">Not yet.</h1>
        <p className="mt-4 font-serif italic text-muted-foreground">
          This day unlocks on day {day} of your reset. Today is day {today}.
        </p>
        <div className="mt-8">
          <Link to="/today" className="font-serif italic underline">Back to today</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
        {isToday ? "Good morning" : `Day ${day}`}
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-primary">
        Day <em>{day}</em> <span className="text-muted-foreground">of 21</span>
      </h1>

      <GoldDivider />

      <h2 className="mb-3 font-serif text-2xl text-primary">Today's Ritual</h2>
      <ul className="ritual-card divide-y divide-border">
        {RITUAL_STEPS.map((s) => {
          const done = dayState?.completedSteps.includes(s.id) ?? false;
          return (
            <li key={s.id}>
              <button
                onClick={() => toggleStep(day, s.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                    done ? "border-accent bg-accent text-gold-foreground" : "border-border"
                  }`}
                  aria-hidden
                >
                  {done ? "✓" : ""}
                </span>
                <span className={`font-serif text-lg ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <GoldDivider />

      <h2 className="mb-3 font-serif text-2xl text-primary">Smoothie of the day</h2>
      <div className="ritual-card overflow-hidden">
        <Placeholder label={`${smoothie.name} — provide photo`} ratio="aspect-[16/10]" />
        <div className="px-5 py-4">
          <p className="font-serif text-xl text-primary">{smoothie.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{smoothie.note}</p>
        </div>
      </div>

      <GoldDivider />

      <h2 className="mb-3 font-serif text-2xl text-primary">Journal</h2>
      <p className="mb-3 font-serif italic text-muted-foreground">{prompt}</p>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        rows={5}
        placeholder="A sentence is enough."
        className="w-full rounded-2xl border border-border bg-card px-5 py-4 font-serif text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/40"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={saveJournal}
          className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          Save entry
        </button>
        {reply && <p className="font-serif text-sm italic text-[var(--berry)]">{reply}</p>}
      </div>

      <GoldDivider />

      <div className="rounded-2xl border border-accent/40 bg-card p-5 text-center">
        <p className="font-serif italic text-muted-foreground">Deepen your ritual</p>
        <p className="mt-1 font-serif text-xl text-primary">Radiant Reds</p>
        <div className="mt-4">
          <CTALink href={REDS_URL} variant="gold">Shop Radiant Reds</CTALink>
        </div>
      </div>
    </Shell>
  );
}
