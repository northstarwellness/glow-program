import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { useGlow } from "@/lib/glow-store";
import { QUIZ, scoreQuiz, type GlowTypeId } from "@/lib/glow-data";

export const Route = createFileRoute("/quiz/$step")({
  head: () => ({ meta: [{ title: "Glow quiz — NOURÉ" }] }),
  component: QuizStep,
});

function QuizStep() {
  const { step } = Route.useParams();
  const n = Math.max(1, Math.min(QUIZ.length, parseInt(step, 10) || 1));
  const q = QUIZ[n - 1];
  const navigate = useNavigate();
  const setQuizAnswer = useGlow((s) => s.setQuizAnswer);
  const setGlowType = useGlow((s) => s.setGlowType);
  const answers = useGlow((s) => s.quizAnswers);

  function pick(tag: GlowTypeId) {
    setQuizAnswer(q.id, tag);
    if (n < QUIZ.length) {
      navigate({ to: "/quiz/$step", params: { step: String(n + 1) } });
    } else {
      const nextAnswers = { ...answers, [q.id]: tag };
      setGlowType(scoreQuiz(nextAnswers));
      navigate({ to: "/quiz/email" });
    }
  }

  return (
    <Shell hideNav>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
        Question {n} of {QUIZ.length}
      </p>
      <h1 className="mt-4 font-serif text-3xl leading-snug text-primary">{q.q}</h1>
      <GoldDivider />
      <div className="flex flex-col gap-3">
        {q.options.map((o) => {
          const selected = answers[q.id] === o.tag;
          return (
            <button
              key={o.label}
              onClick={() => pick(o.tag)}
              className={`ritual-card w-full px-5 py-4 text-left font-serif text-lg transition-all ${
                selected ? "ring-2 ring-accent" : "hover:border-accent/60"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => navigate({ to: n === 1 ? "/quiz" : "/quiz/$step", params: { step: String(n - 1) } } as never)}
        className="mt-8 w-full text-center text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        Back
      </button>
    </Shell>
  );
}
