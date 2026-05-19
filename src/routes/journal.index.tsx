import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Frame, TopBar } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { JOURNAL_PROMPTS } from "@/lib/content";

export const Route = createFileRoute("/journal/")({ component: JournalIndex });

function JournalIndex() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;
  const day = currentDay(s.startDate);

  return (
    <Frame>
      <TopBar name={s.name} day={day} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">{s.name}'s glow journal.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--plum)]/60">21 prompts. 21 entries.</p>

      <Link to="/journal/$n" params={{ n: String(day) }} className="mt-5 block rounded-2xl border-l-4 border-[var(--gold)] bg-[var(--card)] p-5 shadow-sm">
        <p className="label-caps text-[var(--gold)]">Today / Day {day}</p>
        <p className="mt-2 font-serif italic text-[18px] text-[var(--plum)]">"{JOURNAL_PROMPTS[day]?.(s.name ?? "")}"</p>
        <p className="mt-3 text-[12px] text-[var(--plum)]/60">Tap to write</p>
      </Link>

      <h2 className="mt-8 font-serif text-[22px] text-[var(--plum)]">All entries</h2>
      <div className="mt-3 space-y-2">
        {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
          const entry = s.journalEntries[d];
          const unlocked = d <= day;
          const card = (
            <div className={`flex items-center gap-3 rounded-xl p-3 ${entry ? "bg-[var(--card)] shadow-sm" : "bg-[var(--sand)]"}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-full font-serif text-[16px] ${
                entry ? "bg-[var(--gold)] text-[var(--ivory)]" : unlocked ? "bg-[var(--plum)]/10 text-[var(--plum)]/60" : "bg-[var(--plum)]/5 text-[var(--plum)]/30"
              }`}>{d}</span>
              <div className="min-w-0 flex-1">
                <p className={`truncate font-serif italic text-[14px] ${entry ? "text-[var(--plum)]" : "text-[var(--plum)]/50"}`}>
                  {entry ? entry.entry.slice(0, 60) + (entry.entry.length > 60 ? "…" : "") : unlocked ? "Not yet written" : "Locked"}
                </p>
              </div>
            </div>
          );
          return unlocked ? <Link key={d} to="/journal/$n" params={{ n: String(d) }} className="block">{card}</Link> : <div key={d}>{card}</div>;
        })}
      </div>
    </Frame>
  );
}
