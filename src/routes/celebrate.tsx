import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp, glowScore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { Pomegranate } from "@/components/Frame";
import { REDS_URL } from "@/lib/content";

export const Route = createFileRoute("/celebrate")({ component: Celebrate });

function Celebrate() {
  const hydrated = useHydrated();
  const s = useApp();
  useEffect(() => { s.markMilestoneShown("day-21"); s.earnBadge("day-21"); }, []);
  if (hydrated && !s.name) return <Navigate to="/" />;
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
  const pieces = Array.from({ length: 50 });
  return (
    <div className="gold-confetti">
      {pieces.map((_, i) => (
        <span key={i} style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 4}s`,
          animationDelay: `${Math.random() * 2}s`,
          width: `${5 + Math.random() * 7}px`,
          height: `${5 + Math.random() * 7}px`,
          background: i % 3 === 0 ? "var(--color-berry)" : i % 3 === 1 ? "var(--color-gold)" : "var(--color-plum)",
        }} />
      ))}
    </div>
  );
}
