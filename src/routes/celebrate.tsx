import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useApp, glowScore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { Pomegranate } from "@/components/Frame";
import { REDS_URL } from "@/lib/content";

export const Route = createFileRoute("/celebrate")({ component: Celebrate });

function Celebrate() {
  const hydrated = useHydrated();
  const s = useApp();
  useEffect(() => { s.markMilestoneShown("day-21"); s.earnBadge("day-21"); }, []);
  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!s.unlocked) return <Navigate to="/" />;
  const score = glowScore(s);
  const date = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="ivory-frame relative min-h-screen">
      <Confetti />
      <div className="mx-auto max-w-[440px] px-6 pt-10 pb-16 text-center">
        <p className="label-caps text-[var(--gold)]">Day 21 · Complete</p>
        <h1 className="mt-3 font-serif text-[44px] leading-tight text-[var(--plum)]">
          You did it,<br /><em className="text-[var(--berry)]">{s.name}.</em>
        </h1>

        <div className="mt-6"><Pomegranate size={180} /></div>

        <div className="sand-card mt-6 p-6">
          <p className="label-caps text-[var(--gold)]">Your Glow Score</p>
          <p className="mt-1 font-serif text-[80px] leading-none text-[var(--gold)]">{score}</p>
          <div className="gold-divider my-4" />
          <p className="font-serif italic text-[16px] text-[var(--plum)]/75">
            21 days. One ritual. Your skin kept the record.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--gold)]/40 bg-[var(--card)] p-5">
          <p className="font-serif text-[17px] text-[var(--plum)]">The Inner Glow Reset — Complete</p>
          <p className="mt-1 text-[12px] tracking-wide text-[var(--plum)]/60">{s.name} · Day 21 · {date}</p>
        </div>

        <button onClick={() => window.print()} className="gold-pill-btn mt-8 w-full">Save My Glow Card</button>
        <a href={REDS_URL} target="_blank" rel="noreferrer" className="mt-3 block w-full rounded-full border border-[var(--plum)]/30 px-6 py-3 font-serif text-[16px] text-[var(--plum)]">
          Begin Your Next Ritual →
        </a>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      left: (i * 41 + 7) % 100,
      duration: 3 + (i * 11) % 4,
      delay: ((i * 67) % 20) / 10,
      width: 5 + (i % 7),
      height: 5 + ((i + 2) % 7),
    })), []);
  return (
    <div className="gold-confetti">
      {pieces.map((p, i) => (
        <span key={i} style={{
          left: `${p.left}%`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          width: `${p.width}px`,
          height: `${p.height}px`,
          background: i % 3 === 0 ? "var(--color-berry)" : i % 3 === 1 ? "var(--color-gold)" : "var(--color-plum)",
        }} />
      ))}
    </div>
  );
}
