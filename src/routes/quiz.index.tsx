import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { CTALink } from "@/components/CTA";

export const Route = createFileRoute("/quiz/")({
  head: () => ({
    meta: [
      { title: "Find your Glow Type — NOURÉ" },
      { name: "description", content: "Five quiet questions to personalize your 21-day reset." },
    ],
  }),
  component: QuizIntro,
});

function QuizIntro() {
  const navigate = useNavigate();
  return (
    <Shell hideNav>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Step 1 of 6</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-primary">
        Let's find your <em>Glow Type.</em>
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        Five quiet questions. We'll personalize your 21 days around how <em>you</em> glow.
      </p>
      <GoldDivider />
      <CTALink to="/quiz/$step" params={{ step: "1" }} variant="primary" className="w-full">
        Begin
      </CTALink>
      <button
        onClick={() => navigate({ to: "/" })}
        className="mt-4 w-full text-center text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        Back
      </button>
    </Shell>
  );
}
