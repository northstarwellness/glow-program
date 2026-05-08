import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, Placeholder, GoldDivider } from "@/components/Shell";
import { CTA, CTALink } from "@/components/CTA";
import { useGlow } from "@/lib/glow-store";
import { GLOW_TYPES, REDS_URL, scoreQuiz } from "@/lib/glow-data";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your Glow Type — NOURÉ" },
      { name: "description", content: "Your personalized 21-day Inner Glow Reset." },
    ],
  }),
  component: Result,
});

function Result() {
  const navigate = useNavigate();
  const glowType = useGlow((s) => s.glowType);
  const answers = useGlow((s) => s.quizAnswers);
  const startReset = useGlow((s) => s.startReset);

  const id = glowType ?? scoreQuiz(answers);
  const t = GLOW_TYPES[id];

  function start() {
    startReset();
    navigate({ to: "/today" });
  }

  return (
    <Shell hideNav>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Your Glow Type</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-primary">
        You're <em>{t.name}.</em>
      </h1>
      <p className="mt-3 font-serif text-lg italic text-[var(--berry)]">{t.tagline}</p>

      <div className="mt-6">
        <Placeholder label={`portrait — ${t.name}`} ratio="aspect-[4/5]" />
      </div>

      <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">{t.body}</p>

      <GoldDivider />

      <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Your 21 days will focus on</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {t.pillars.map((p) => (
          <span key={p} className="rounded-full border border-accent/50 px-3 py-1 font-serif text-sm text-primary">
            {p}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <CTA variant="primary" onClick={start}>Start Day 1</CTA>
        <CTALink href={REDS_URL} variant="outline">Shop Radiant Reds</CTALink>
      </div>
    </Shell>
  );
}
