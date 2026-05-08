import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Placeholder, GoldDivider } from "@/components/Shell";
import { CTALink } from "@/components/CTA";
import { useGlow } from "@/lib/glow-store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOURÉ — The 21-Day Inner Glow Reset" },
      { name: "description", content: "A 21-day morning ritual for radiant skin, a calm gut, and steady energy. From NOURÉ Wellness." },
      { property: "og:title", content: "NOURÉ — The 21-Day Inner Glow Reset" },
      { property: "og:description", content: "Beauty from within. 21 days of polyphenol-rich rituals and feminine wellness." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const hydrated = useHydrated();
  const startedAt = useGlow((s) => s.startedAt);
  const showResume = hydrated && !!startedAt;

  return (
    <Shell hideNav>
      <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-accent">
        A 21-Day Ritual by NOURÉ
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-primary">
        Your Inner Glow,<br />
        <em className="text-[var(--berry)]">Reset.</em>
      </h1>
      <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground">
        A 21-day morning ritual for radiant skin, a calm gut, and steady energy —
        rooted in polyphenol-rich rituals and feminine wellness.
      </p>

      <div className="mt-8">
        <Placeholder label="hero image — provide your photography" ratio="aspect-[4/5]" />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <CTALink to="/quiz" variant="primary">Begin Your Reset</CTALink>
        {showResume && (
          <Link to="/today" className="text-center font-serif text-sm italic text-muted-foreground underline-offset-4 hover:underline">
            I've started before — continue
          </Link>
        )}
      </div>

      <GoldDivider />

      <p className="text-center font-serif text-xs italic text-muted-foreground">
        Free. No account needed. Two minutes to begin.
      </p>
    </Shell>
  );
}
