import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { useGlow } from "@/lib/glow-store";
import { JOURNAL_PROMPTS } from "@/lib/glow-data";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — NOURÉ Inner Glow" }] }),
  component: Journal,
});

function Journal() {
  const days = useGlow((s) => s.days);
  const entries = Object.entries(days)
    .map(([d, v]) => ({ d: parseInt(d, 10), ...v }))
    .filter((e) => (e.journal ?? "").trim().length > 0)
    .sort((a, b) => b.d - a.d);

  return (
    <Shell>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Your Journal</p>
      <h1 className="mt-2 font-serif text-4xl text-primary">A record of your reset.</h1>

      <GoldDivider />

      {entries.length === 0 ? (
        <p className="font-serif italic text-muted-foreground">
          Your entries will appear here. Begin with{" "}
          <Link to="/today" className="text-primary underline">today's prompt</Link>.
        </p>
      ) : (
        <div className="space-y-5">
          {entries.map((e) => (
            <Link
              key={e.d}
              to="/day/$n"
              params={{ n: String(e.d) }}
              className="ritual-card block px-5 py-4"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent">Day {e.d}</p>
              <p className="mt-1 font-serif italic text-muted-foreground">
                {JOURNAL_PROMPTS[e.d]}
              </p>
              <p className="mt-2 font-serif text-base text-foreground line-clamp-3">
                {e.journal}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Shell>
  );
}
