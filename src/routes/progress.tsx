import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { useGlow, currentDay } from "@/lib/glow-store";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Your progress — NOURÉ" }] }),
  component: Progress,
});

function Progress() {
  const startedAt = useGlow((s) => s.startedAt);
  const days = useGlow((s) => s.days);
  const today = currentDay(startedAt);
  const completed = Object.values(days).filter((d) => d.completedSteps.length >= 3).length;
  const journals = Object.values(days).filter((d) => (d.journal ?? "").trim().length > 0).length;

  const milestones = [
    { d: 7,  name: "Awakening" },
    { d: 14, name: "Rooted" },
    { d: 21, name: "Radiant" },
  ];

  return (
    <Shell>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Your Reset</p>
      <h1 className="mt-2 font-serif text-5xl text-primary">
        {today} <span className="text-muted-foreground">/ 21</span>
      </h1>
      <p className="mt-2 font-serif italic text-muted-foreground">
        {completed} days complete · {journals} journal entries
      </p>

      <GoldDivider />

      <h2 className="mb-4 font-serif text-2xl text-primary">Milestones</h2>
      <div className="space-y-3">
        {milestones.map((m) => {
          const reached = today >= m.d;
          return (
            <div
              key={m.d}
              className={`ritual-card flex items-center justify-between px-5 py-4 ${
                reached ? "ring-1 ring-accent" : "opacity-60"
              }`}
            >
              <div>
                <p className="font-serif text-xl text-primary">Day {m.d}</p>
                <p className="font-serif italic text-muted-foreground">{m.name}</p>
              </div>
              <span className={`text-xs uppercase tracking-[0.2em] ${reached ? "text-accent" : "text-muted-foreground"}`}>
                {reached ? "Reached" : "Soon"}
              </span>
            </div>
          );
        })}
      </div>

      <GoldDivider />

      <h2 className="mb-4 font-serif text-2xl text-primary">All days</h2>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => {
          const state = days[d];
          const isToday = d === today;
          const done = (state?.completedSteps.length ?? 0) >= 3;
          const locked = d > today;
          return (
            <Link
              key={d}
              to="/day/$n"
              params={{ n: String(d) }}
              className={`flex aspect-square items-center justify-center rounded-full border font-serif text-sm transition-all ${
                done
                  ? "border-accent bg-accent text-gold-foreground"
                  : isToday
                    ? "border-primary text-primary"
                    : locked
                      ? "border-border text-muted-foreground"
                      : "border-border text-foreground"
              }`}
            >
              {d}
            </Link>
          );
        })}
      </div>

      {today >= 21 && (
        <div className="mt-8 text-center">
          <Link to="/complete" className="font-serif italic text-primary underline">
            See your day 21 recap
          </Link>
        </div>
      )}
    </Shell>
  );
}
