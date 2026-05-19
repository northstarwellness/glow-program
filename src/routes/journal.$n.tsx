import { createFileRoute, Link, Navigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { JOURNAL_PROMPTS, reflectJournal } from "@/lib/content";

export const Route = createFileRoute("/journal/$n")({ component: JournalDay });

function JournalDay() {
  const { n } = useParams({ from: "/journal/$n" });
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;
  const day = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  const today = currentDay(s.startDate);
  if (day > today) return <Navigate to="/journal" />;

  const existing = s.journalEntries[day];
  const prompt = JOURNAL_PROMPTS[day]?.(s.name ?? "") ?? "";
  const [text, setText] = useState(existing?.entry ?? "");
  const [response, setResponse] = useState<string | null>(existing?.response ?? null);

  const save = () => {
    if (!text.trim()) return;
    const r = reflectJournal(text, s.name ?? "");
    setResponse(r);
    s.saveJournal(day, { prompt, entry: text, response: r, timestamp: new Date().toISOString() });
    s.toggleLog(day, "journal");
    if (Object.keys(s.journalEntries).length === 0) s.earnBadge("first-words");
  };

  const dateLabel = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <Frame>
      <TopBar name={s.name} day={today} />
      <Link to="/journal" className="text-[12px] text-[var(--plum)]/60">← Journal</Link>

      <p className="mt-3 label-caps text-[var(--gold)]">Day {day} · {dateLabel}</p>
      <h1 className="mt-1 font-serif text-[28px] leading-tight text-[var(--plum)]">{s.name}'s glow journal</h1>

      <div className="sand-card mt-5 border-l-4 border-[var(--gold)] p-5">
        <p className="font-serif italic text-[19px] leading-snug text-[var(--plum)]">"{prompt}"</p>
      </div>

      {!response && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Write what's true today…"
            className="mt-4 w-full resize-none rounded-2xl border border-[var(--plum)]/15 bg-[var(--card)] p-4 text-[15px] leading-relaxed text-[var(--plum)] placeholder:text-[var(--plum)]/30 focus:border-[var(--gold)] focus:outline-none"
          />
          <button onClick={save} disabled={!text.trim()} className="gold-pill-btn mt-4 w-full disabled:opacity-50">
            Save + Get Your Glow Insight
          </button>
        </>
      )}

      {response && (
        <div className="mt-6 fade-rise">
          <div className="mb-4 flex items-center gap-3">
            <div className="gold-divider flex-1" />
            <span className="label-caps text-[var(--gold)]">Logged</span>
            <div className="gold-divider flex-1" />
          </div>

          <div className="rounded-3xl border border-[var(--gold)]/30 bg-[var(--card)] p-6 shadow-sm">
            <p className="label-caps text-center text-[var(--gold)]">Your glow insight</p>
            <p className="mt-4 text-center font-serif italic text-[20px] leading-snug text-[var(--plum)]">
              "{response}"
            </p>
          </div>

          <details className="mt-5 rounded-2xl bg-[var(--sand)] p-4">
            <summary className="cursor-pointer font-serif text-[14px] italic text-[var(--plum)]/70">
              Read what you wrote
            </summary>
            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--plum)]/80">{text}</p>
          </details>

          <Link to="/journal" className="mt-5 block rounded-full border border-[var(--plum)]/20 py-3 text-center font-serif text-[15px] text-[var(--plum)]">
            Return to journal
          </Link>
        </div>
      )}
    </Frame>
  );
}
