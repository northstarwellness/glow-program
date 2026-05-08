import { createFileRoute } from "@tanstack/react-router";
import { Shell, Placeholder, GoldDivider } from "@/components/Shell";
import { CTALink } from "@/components/CTA";
import { REDS_URL } from "@/lib/glow-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NOURÉ — Beauty from within" },
      { name: "description", content: "Why NOURÉ exists. The story behind Radiant Reds and the Inner Glow Reset." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Shell>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">The NOURÉ story</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-primary">
        Beauty from <em>within.</em>
      </h1>

      <div className="mt-6">
        <Placeholder label="founder portrait — provide photo" ratio="aspect-[4/5]" />
      </div>

      <GoldDivider />

      <div className="space-y-5 font-serif text-[17px] leading-relaxed text-foreground">
        <p>
          NOURÉ began with a question: why does skin glow from some women and not others,
          even when they're doing everything right?
        </p>
        <p>
          The answer wasn't in the serum. It was in the gut. In the morning. In what
          they were feeding their cells before the day started.
        </p>
        <p>
          The Inner Glow Reset is built around that answer — 21 days of ritual,
          polyphenols, and a morning practice designed to shift how your skin looks
          from the inside out.
        </p>
        <p>This is beauty from within. It has always been the most direct route.</p>
        <p className="font-sans text-sm uppercase tracking-[0.3em] text-accent">— NOURÉ Wellness</p>
      </div>

      <GoldDivider />

      <div className="flex flex-col gap-3">
        <CTALink href={REDS_URL} variant="primary">Shop Radiant Reds</CTALink>
        <CTALink to="/notifications" variant="outline">Set your morning reminder</CTALink>
      </div>
    </Shell>
  );
}
