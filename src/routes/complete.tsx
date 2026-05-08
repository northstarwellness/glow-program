import { createFileRoute } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { CTALink } from "@/components/CTA";
import { useGlow, currentDay } from "@/lib/glow-store";
import { REDS_URL, GLOW_TYPES } from "@/lib/glow-data";

export const Route = createFileRoute("/complete")({
  head: () => ({ meta: [{ title: "You glow differently now — NOURÉ" }] }),
  component: Complete,
});

function Complete() {
  const startedAt = useGlow((s) => s.startedAt);
  const days = useGlow((s) => s.days);
  const glowType = useGlow((s) => s.glowType);
  const completed = Object.values(days).filter((d) => d.completedSteps.length >= 3).length;
  const journals = Object.values(days).filter((d) => (d.journal ?? "").trim().length > 0).length;
  const day = currentDay(startedAt);

  return (
    <Shell hideNav>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Day {day}</p>
      <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-primary">
        You glow <em className="text-[var(--berry)]">differently</em> now.
      </h1>
      <p className="mt-5 font-serif italic text-muted-foreground">
        Twenty-one days of ritual is not a small thing. Let's keep going.
      </p>

      <GoldDivider />

      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Days" value={`${day}`} />
        <Stat label="Rituals" value={`${completed}`} />
        <Stat label="Entries" value={`${journals}`} />
      </div>

      {glowType && (
        <p className="mt-8 text-center font-serif italic text-muted-foreground">
          You moved through {GLOW_TYPES[glowType].name}.
        </p>
      )}

      <GoldDivider />

      <div className="flex flex-col gap-3">
        <CTALink href={REDS_URL} variant="primary">Continue with Radiant Reds</CTALink>
        <CTALink to="/about" variant="outline">Read the NOURÉ story</CTALink>
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ritual-card px-3 py-5">
      <p className="font-serif text-3xl text-primary">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-accent">{label}</p>
    </div>
  );
}
