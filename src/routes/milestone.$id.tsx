import { createFileRoute, Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { MILESTONES } from "@/lib/content";

export const Route = createFileRoute("/milestone/$id")({ component: Milestone });

function Milestone() {
  const { id } = useParams({ from: "/milestone/$id" });
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();
  if (hydrated && !s.name) return <Navigate to="/" />;
  const m = MILESTONES[id];
  useEffect(() => { if (m) { s.markMilestoneShown(id); s.earnBadge(id); } }, [id, m]);
  if (!m) return <Navigate to="/home" />;
  const title = m.title.replace(/\{name\}/g, s.name ?? "");

  return (
    <div className="ivory-frame fade-rise relative min-h-screen">
      <Confetti />
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-center px-6 text-center">
        <p className="label-caps text-[var(--gold)]">Milestone</p>
        <h1 className="mt-4 font-serif text-[42px] leading-tight text-[var(--plum)]">{title}</h1>
        <p className="mt-4 font-serif italic text-[18px] text-[var(--plum)]/70">{m.sub}</p>

        <div className="mt-10 flex h-32 w-32 items-center justify-center rounded-full bg-[var(--gold)]/15 ring-1 ring-[var(--gold)]/40">
          <p className="px-3 text-center font-serif text-[18px] leading-tight text-[var(--gold)]">{m.badge}</p>
        </div>

        <button onClick={() => navigate({ to: "/home" })} className="gold-pill-btn mt-12 w-full">
          Continue
        </button>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 28 });
  return (
    <div className="gold-confetti">
      {pieces.map((_, i) => (
        <span key={i} style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 3}s`,
          animationDelay: `${Math.random() * 1.5}s`,
          width: `${4 + Math.random() * 6}px`,
          height: `${4 + Math.random() * 6}px`,
          background: i % 2 ? "var(--color-gold)" : "var(--color-berry)",
        }} />
      ))}
    </div>
  );
}
