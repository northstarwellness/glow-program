import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Frame, GoldDivider, TopBar } from "@/components/Frame";
import { ProgressSkeleton } from "@/components/ProgressSkeleton";
import { ShareStatus } from "@/components/ShareStatus";
import { useApp, activeDay, isProgramComplete } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { buildGlowReflection, type GlowReflectionCardData } from "@/lib/glow-reflection";
import { renderReflectionCard } from "@/lib/glow-card";
import { shareOrDownloadFile } from "@/lib/share";

export const Route = createFileRoute("/reflection")({ component: Reflection });

function Reflection() {
  const hydrated = useHydrated();
  const s = useApp();
  const complete = hydrated && isProgramComplete(s.completedDays);
  // Built on this device from her own saved activity; nothing is sent anywhere.
  const r = useMemo(
    () =>
      buildGlowReflection({
        name: s.name,
        completedDays: s.completedDays,
        outcomesByDay: s.outcomesByDay,
        journalEntries: s.journalEntries,
        dailyLogs: s.dailyLogs,
        savedRecipes: s.savedRecipes,
      }),
    [s.name, s.completedDays, s.outcomesByDay, s.journalEntries, s.dailyLogs, s.savedRecipes],
  );
  // Client-only date, so the server's UTC clock never shows.
  const date = hydrated
    ? new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
    : "";
  const card = useReflectionCardFile(complete ? JSON.stringify({ ...r.card, date }) : null);
  const [saveMsg, setSaveMsg] = useState("");

  if (!hydrated) return <ProgressSkeleton />;
  if (!s.name) return <Navigate to="/" />;
  if (!complete)
    return <Navigate to="/day/$n" params={{ n: String(activeDay(s.completedDays)) }} replace />;

  const saveCard = () => {
    setSaveMsg("");
    if (!card.file) {
      setSaveMsg(
        card.failed
          ? "We couldn't create your Glow Reflection card on this device."
          : "Your card is still being prepared. Try again in a moment.",
      );
      return;
    }
    void shareOrDownloadFile(card.file, "My Glow Reflection").then((outcome) => {
      if (outcome === "downloaded") setSaveMsg("Your Glow Reflection card download has started.");
      if (outcome === "failed")
        setSaveMsg("We couldn't save your Glow Reflection card on this device.");
    });
  };

  return (
    <Frame>
      <TopBar name={s.name} day={21} />
      <Link to="/progress" className="text-[12px] text-[var(--charcoal)]/55">
        ← Progress
      </Link>

      {/* 1. Opening */}
      <header className="mt-4">
        <p className="label-caps text-[var(--gold-deep)]">Day 21 · Your Glow Reflection</p>
        <h1 className="mt-3 font-serif text-[32px] leading-tight text-[var(--charcoal)]">
          {r.opening.title}
        </h1>
        <p className="mt-3 font-serif italic text-[17px] leading-relaxed text-[var(--charcoal)]/70">
          {r.opening.body}
        </p>
      </header>

      <GoldDivider />

      {/* 2. Rhythm */}
      <Section title="Your 21-Day Rhythm">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <Stat value={r.rhythm.daysCompleted} label="Days" />
          <Stat value={r.rhythm.checkInDays} label="Check-ins" />
          <Stat value={r.rhythm.journalDays} label="Journal days" />
        </div>
        <Lines lines={r.rhythm.lines} />
      </Section>

      {/* 3. What you noticed */}
      <Section title="What You Noticed">
        {r.noticed.top.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-2" aria-label="Your most-chosen feelings">
            {r.noticed.top.map((t) => (
              <li
                key={t.outcome}
                className="rounded-full border border-[var(--gold)]/45 bg-[var(--blush)] px-3.5 py-1.5 font-serif text-[15px] text-[var(--charcoal)]"
              >
                {t.label}
                <span className="ml-1.5 text-[12px] text-[var(--charcoal)]/55">
                  {t.days} {t.days === 1 ? "day" : "days"}
                </span>
              </li>
            ))}
          </ul>
        )}
        {r.noticed.top.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            {r.noticed.weeks.map((w) => (
              <div
                key={w.week}
                className="rounded-xl bg-[var(--beige)] px-2 py-3 text-center"
                data-testid={`week-${w.week}`}
              >
                <p className="label-caps text-[10px] text-[var(--charcoal)]/55">Week {w.week}</p>
                <p className="mt-1 font-serif text-[15px] leading-snug text-[var(--charcoal)]">
                  {w.top.length ? w.top.join(" · ") : "—"}
                </p>
                <p className="mt-1 text-[11px] text-[var(--charcoal)]/55">
                  {w.checkInDays} of 7 days
                </p>
              </div>
            ))}
          </div>
        )}
        <Lines lines={r.noticed.lines} />
      </Section>

      {/* 4. Reflection */}
      <section
        className="mt-6 rounded-2xl p-6"
        style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}
      >
        <p className="label-caps text-[var(--berry)]/75">Your Reflection</p>
        <div className="mt-3 space-y-3">
          {r.reflection.map((p) => (
            <p
              key={p}
              className="font-serif italic text-[18px] leading-relaxed text-[var(--charcoal)]"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* 4b. In your own words — private, verbatim, dated. Never on the card. */}
      {r.words && (
        <section
          aria-labelledby="own-words"
          data-testid="own-words"
          className="mt-6 rounded-2xl border border-[var(--taupe)]/20 bg-white p-5 shadow-sm"
        >
          <h2 id="own-words" className="label-caps mb-1 text-[var(--charcoal)]/70">
            In Your Own Words
          </h2>
          <p className="mb-4 text-[12px] text-[var(--charcoal)]/70">
            Private to this screen. Not included on your Glow Reflection card.
          </p>
          {r.words.lines.map((l) => (
            <p key={l} className="mb-2 text-[14px] leading-relaxed text-[var(--charcoal)]/80">
              {l}
            </p>
          ))}
          {r.words.excerpts.length > 0 && (
            <ul className="mt-3 space-y-3">
              {r.words.excerpts.map((e) => (
                <li
                  key={`${e.day}-${e.text}`}
                  className="rounded-xl border-l-2 border-[var(--taupe)]/60 bg-[var(--ivory)] px-4 py-3"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--charcoal)]/70">
                    Day {e.day} · Week {e.week}
                  </p>
                  <blockquote className="mt-1 font-serif text-[17px] leading-snug text-[var(--charcoal)]">
                    “{e.text}”
                  </blockquote>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 font-serif text-[16px] leading-snug text-[var(--charcoal)]">
            {r.words.question}
          </p>
        </section>
      )}

      {/* 5. Carry it forward */}
      <Section title="Carry It Forward">
        <ol className="space-y-3">
          {r.carryForward.map((c, i) => (
            <li key={c.id} className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/60 font-serif text-[14px] text-[var(--charcoal)]">
                {i + 1}
              </span>
              <div>
                <p className="font-serif text-[17px] text-[var(--charcoal)]">{c.title}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-[var(--charcoal)]/70">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* 6. Closing */}
      <GoldDivider />
      <p className="text-center font-serif italic text-[20px] leading-relaxed text-[var(--charcoal)]/80">
        {r.closing}
      </p>

      {/* 7. Card */}
      <div className="mt-8">
        <button type="button" onClick={saveCard} className="gold-pill-btn w-full">
          Save My Glow Reflection Card
        </button>
        <ShareStatus className="mt-2 text-center" message={saveMsg} />
        <p className="mt-2 text-center text-[12px] text-[var(--charcoal)]/55">
          The card shows your counts and chosen words. Your journal entries stay private.
        </p>
      </div>
    </Frame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl border border-[var(--taupe)]/20 bg-white p-5 shadow-sm">
      <h2 className="label-caps mb-4 text-[var(--charcoal)]/55">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-[var(--beige)] py-3">
      <p className="font-serif text-[28px] leading-none text-[var(--charcoal)]">{value}</p>
      <p className="mt-1 text-[9.5px] tracking-[0.12em] uppercase text-[var(--charcoal)]/55">
        {label}
      </p>
    </div>
  );
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <div className="mt-4 space-y-2">
      {lines.map((l) => (
        <p key={l} className="font-serif text-[16px] leading-relaxed text-[var(--charcoal)]/80">
          {l}
        </p>
      ))}
    </div>
  );
}

/** Pre-renders the card so the tap can open the share sheet without awaiting (iOS gesture rule). */
function useReflectionCardFile(dataJson: string | null) {
  const [state, setState] = useState<{ file: File | null; failed: boolean }>({
    file: null,
    failed: false,
  });
  useEffect(() => {
    if (!dataJson) return;
    let live = true;
    renderReflectionCard(JSON.parse(dataJson) as GlowReflectionCardData & { date: string })
      .then(
        (blob) =>
          live &&
          setState({
            file: new File([blob], "noure-glow-reflection.png", { type: "image/png" }),
            failed: false,
          }),
      )
      .catch(() => live && setState({ file: null, failed: true }));
    return () => {
      live = false;
    };
  }, [dataJson]);
  return state;
}
