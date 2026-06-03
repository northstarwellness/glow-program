import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, currentDay, type DailyCheck } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/tracker")({ component: Tracker });

const METRICS: { key: keyof DailyCheck; label: string; low: string; high: string }[] = [
  { key: "energy",   label: "Energy",       low: "Drained",    high: "Lit up" },
  { key: "skin",     label: "Skin clarity", low: "Dull",       high: "Glowing" },
  { key: "bloating", label: "Gut ease",     low: "Bloated",    high: "Calm" },
  { key: "mood",     label: "Mood",         low: "Low",        high: "Open" },
];

function Tracker() {
  const hydrated = useHydrated();
  const s = useApp();

  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!s.unlocked) return <Navigate to="/" />;

  const day = currentDay(s.startDate);
  const today = s.dailyChecks[day];
  const [draft, setDraft] = useState<Partial<DailyCheck>>(today ?? {});
  const [saved, setSaved] = useState(!!today);

  const isDraftComplete = METRICS.every((m) => (draft[m.key] ?? 0) > 0);

  const save = () => {
    if (!isDraftComplete) return;
    s.setDailyCheck(day, draft as DailyCheck);
    setSaved(true);
  };

  // Build sparkline data (days 1 through current)
  const sparkDays = Array.from({ length: day }, (_, i) => i + 1);

  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/home" className="text-[12px] text-[var(--plum)]/60">← Home</Link>

      <h1 className="mt-3 font-serif text-[32px] leading-tight text-[var(--plum)]">How are you feeling?</h1>
      <p className="mt-1 font-serif italic text-[14px] text-[var(--plum)]/60">
        Day {day} check-in.
      </p>

      {saved ? (
        <div className="mt-5 rounded-3xl bg-[var(--gold)]/12 p-6 text-center">
          <p className="label-caps text-[var(--gold)]">Day {day} logged</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {METRICS.map((m) => (
              <div key={m.key} className="rounded-2xl bg-[var(--card)] p-3 text-center">
                <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--plum)]/55">{m.label}</p>
                <p className="mt-1 font-serif text-[28px] leading-none text-[var(--gold)]">
                  {draft[m.key] ?? today?.[m.key] ?? "—"}
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--plum)]/45">out of 5</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSaved(false)}
            className="mt-5 text-[12px] text-[var(--plum)]/50"
          >
            Edit today's check-in
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {METRICS.map((m) => (
            <div key={m.key} className="sand-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-serif text-[18px] text-[var(--plum)]">{m.label}</p>
                {(draft[m.key] ?? 0) > 0 && (
                  <span className="rounded-full bg-[var(--gold)]/15 px-3 py-1 font-serif text-[15px] text-[var(--gold)]">
                    {draft[m.key]}
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setDraft({ ...draft, [m.key]: v })}
                    className={`flex-1 rounded-xl py-3 text-[14px] font-serif transition ${
                      draft[m.key] === v
                        ? "bg-[var(--gold)] text-[var(--ivory)]"
                        : "bg-[var(--card)] text-[var(--plum)]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-[var(--plum)]/40">
                <span>{m.low}</span>
                <span>{m.high}</span>
              </div>
            </div>
          ))}

          <button
            onClick={save}
            disabled={!isDraftComplete}
            className="gold-pill-btn mt-2 w-full disabled:opacity-40"
          >
            Save check-in
          </button>
        </div>
      )}

      {day > 1 && (
        <>
          <GoldDivider />
          <h2 className="font-serif text-[22px] text-[var(--plum)]">Your trend.</h2>
          <p className="mt-1 font-serif italic text-[13px] text-[var(--plum)]/55">
            Energy and skin clarity over {day} days.
          </p>

          <div className="mt-4 space-y-4">
            {(["energy", "skin"] as const).map((key) => {
              const label = key === "energy" ? "Energy" : "Skin clarity";
              return (
                <div key={key} className="sand-card p-4">
                  <p className="label-caps text-[var(--gold)]">{label}</p>
                  <div className="mt-3 flex items-end gap-1">
                    {sparkDays.map((d) => {
                      const val = s.dailyChecks[d]?.[key] ?? 0;
                      return (
                        <div key={d} className="flex flex-1 flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-sm transition-all ${
                              val > 0 ? "bg-[var(--gold)]" : "bg-[var(--plum)]/10"
                            }`}
                            style={{ height: val > 0 ? `${(val / 5) * 48}px` : "4px" }}
                          />
                          {d % 7 === 1 && (
                            <p className="text-[8px] text-[var(--plum)]/40">{d}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-[var(--plum)]/40">
                    <span>Day 1</span>
                    <span>Day {day}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {METRICS.map((m) => {
              const vals = sparkDays.map((d) => s.dailyChecks[d]?.[m.key] ?? 0).filter((v) => v > 0);
              const avg = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
              return (
                <div key={m.key} className="sand-card p-4 text-center">
                  <p className="label-caps text-[var(--plum)]/55">{m.label}</p>
                  <p className="mt-1 font-serif text-[28px] leading-none text-[var(--gold)]">{avg}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--plum)]/40">avg over {vals.length} days</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Frame>
  );
}
