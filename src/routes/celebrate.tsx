import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp, glowScore, isProgramComplete, activeDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { REDS_URL } from "@/lib/content";
import { renderGlowCard } from "@/lib/glow-card";
import { shareOrDownloadFile } from "@/lib/share";
import { ShareStatus } from "@/components/ShareStatus";

export const Route = createFileRoute("/celebrate")({ component: Celebrate });

function Celebrate() {
  const hydrated = useHydrated();
  const s = useApp();
  const markMilestoneShown = useApp((st) => st.markMilestoneShown);
  const earnBadge = useApp((st) => st.earnBadge);
  const complete = hydrated && isProgramComplete(s.completedDays);
  // Record the Day 21 celebration only once the program is really complete (never pre-hydration).
  useEffect(() => {
    if (complete) {
      markMilestoneShown("day-21");
      earnBadge("day-21");
    }
  }, [complete, markMilestoneShown, earnBadge]);
  const score = glowScore(s);
  // Server renders in UTC; format the local date only on the client to avoid a hydration mismatch.
  const date = hydrated
    ? new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
    : "";
  const card = useGlowCardFile(
    complete && s.name
      ? JSON.stringify({
          name: s.name,
          score,
          daysDone: s.completedDays.length,
          entries: Object.keys(s.journalEntries).length,
          redsDays: Object.values(s.dailyLogs).filter((l) => l.reds).length,
          date,
        })
      : null,
  );
  const [saveMsg, setSaveMsg] = useState("");
  if (!hydrated) return <div className="ivory-frame min-h-screen" aria-busy="true" />;
  if (!s.name) return <Navigate to="/" />;
  // Not finished yet (e.g. an early direct link): go to the real active day.
  if (!complete)
    return <Navigate to="/day/$n" params={{ n: String(activeDay(s.completedDays)) }} replace />;

  const saveCard = () => {
    setSaveMsg("");
    if (!card.file) {
      setSaveMsg(
        card.failed
          ? "We couldn't create your Glow Card image on this device."
          : "Your Glow Card is still being prepared. Try again in a moment.",
      );
      return;
    }
    // Share sheet (includes "Save Image" on iPhone) — invoked synchronously from the tap.
    void shareOrDownloadFile(card.file, "My Glow Card").then((outcome) => {
      if (outcome === "downloaded") setSaveMsg("Your Glow Card download has started.");
      if (outcome === "failed") setSaveMsg("We couldn't download your Glow Card on this device.");
    });
  };

  return (
    <div className="ivory-frame relative min-h-screen">
      <Confetti />
      <div className="mx-auto max-w-[440px] px-6 pt-10 pb-16 text-center">
        <p className="label-caps text-[var(--gold)]">Day 21 · Complete</p>

        <h1 className="mt-4 font-serif text-[44px] leading-tight text-[var(--plum)]">
          You did it,
          <br />
          <em className="text-[var(--berry)]">{s.name}.</em>
        </h1>

        <p className="mt-4 font-serif italic text-[17px] text-[var(--plum)]/65 max-w-[28ch] mx-auto">
          21 days. One ritual. You kept it.
        </p>

        {/* Glow Score */}
        <div className="gold-glow-card mt-8 p-8">
          <p className="label-caps text-[var(--gold)]">Your Glow Score</p>
          <p className="mt-2 font-serif text-[88px] leading-none text-[var(--plum)]">{score}</p>
          <div className="gold-divider my-5" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <p className="font-serif text-[28px] text-[var(--plum)]">{s.completedDays.length}</p>
              <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--plum)]/50 mt-0.5">
                Days Done
              </p>
            </div>
            <div>
              <p className="font-serif text-[28px] text-[var(--plum)]">
                {Object.keys(s.journalEntries).length}
              </p>
              <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--plum)]/50 mt-0.5">
                Entries
              </p>
            </div>
            <div>
              <p className="font-serif text-[28px] text-[var(--plum)]">
                {Object.values(s.dailyLogs).filter((l) => l.reds).length}
              </p>
              <p className="text-[10px] tracking-[0.14em] uppercase text-[var(--plum)]/50 mt-0.5">
                Reds Days
              </p>
            </div>
          </div>
        </div>

        {/* Certificate card */}
        <div className="glass-card mt-5 p-6">
          <p className="label-caps text-[var(--gold)]">Inner Glow Reset — Complete</p>
          <p className="mt-2 font-serif text-[18px] text-[var(--plum)]">{s.name}</p>
          <p className="mt-1 text-[12px] tracking-wide text-[var(--plum)]/50">Day 21 · {date}</p>
        </div>

        <button type="button" onClick={saveCard} className="gold-pill-btn mt-8 w-full">
          Save My Glow Card
        </button>
        <ShareStatus className="mt-2" message={saveMsg} />
        <Link
          to="/reflection"
          className="mt-3 block w-full rounded-full border border-[var(--gold)]/50 bg-[var(--blush)] px-6 py-3 font-serif text-[16px] text-[var(--plum)] text-center"
        >
          Read Your Glow Reflection →
        </Link>
        <a
          href={REDS_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block w-full rounded-full border border-[var(--plum)]/25 px-6 py-3 font-serif text-[16px] text-[var(--plum)] text-center"
        >
          Begin Your Next Ritual →
        </a>
      </div>
    </div>
  );
}

/**
 * Pre-renders the card so the tap can open the share sheet without awaiting (iOS gesture rule).
 * Takes the card data as a JSON string so it re-renders only when the content actually changes.
 */
function useGlowCardFile(dataJson: string | null) {
  const [state, setState] = useState<{ file: File | null; failed: boolean }>({
    file: null,
    failed: false,
  });
  useEffect(() => {
    if (!dataJson) return;
    let live = true;
    renderGlowCard(JSON.parse(dataJson))
      .then(
        (blob) =>
          live &&
          setState({
            file: new File([blob], "noure-glow-card.png", { type: "image/png" }),
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

function Confetti() {
  const pieces = Array.from({ length: 60 });
  return (
    <div className="gold-confetti">
      {pieces.map((_, i) => (
        <span
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
            width: `${4 + Math.random() * 7}px`,
            height: `${4 + Math.random() * 7}px`,
            borderRadius: i % 4 === 0 ? "2px" : "50%",
            background:
              i % 3 === 0
                ? "var(--color-berry)"
                : i % 3 === 1
                  ? "var(--color-gold)"
                  : "oklch(0.82 0.06 10)",
          }}
        />
      ))}
    </div>
  );
}
