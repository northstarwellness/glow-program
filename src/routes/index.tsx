import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import type { OnboardingAnswers } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOURÉ — The Inner Glow Reset" },
      { name: "description", content: "A 21-day morning ritual for radiant skin, a calm gut, and steady energy." },
    ],
  }),
  component: Entry,
});

type Step = "name" | "skin" | "gut" | "pace";

function Entry() {
  const hydrated = useHydrated();
  const name = useApp((s) => s.name);
  const seenWelcome = useApp((s) => s.seenWelcome);
  const onboardingDone = useApp((s) => s.onboardingDone);
  const setName = useApp((s) => s.setName);
  const startReset = useApp((s) => s.startReset);
  const setOnboarding = useApp((s) => s.setOnboarding);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(() => {
    // If returning user has a name but hasn't done onboarding, skip name step
    if (hydrated && name && !onboardingDone) return "skin";
    return "name";
  });

  const [nameVal, setNameVal] = useState("");
  const [pending, setPending] = useState<Partial<OnboardingAnswers>>({});

  if (hydrated && name && onboardingDone && seenWelcome) return <Navigate to="/home" />;
  if (hydrated && name && onboardingDone && !seenWelcome) return <Navigate to="/welcome" />;

  const submitName = (e: React.FormEvent) => {
    e.preventDefault();
    const v = nameVal.trim();
    if (!v) return;
    setName(v);
    startReset();
    setStep("skin");
  };

  const pickSkin = (val: OnboardingAnswers["skinGoal"]) => {
    setPending((p) => ({ ...p, skinGoal: val }));
    setStep("gut");
  };

  const pickGut = (val: OnboardingAnswers["gutGoal"]) => {
    setPending((p) => ({ ...p, gutGoal: val }));
    setStep("pace");
  };

  const pickPace = (val: OnboardingAnswers["morningPace"]) => {
    const final: OnboardingAnswers = {
      skinGoal: pending.skinGoal ?? null,
      gutGoal: pending.gutGoal ?? null,
      morningPace: val,
    };
    setOnboarding(final);
    navigate({ to: "/welcome" });
  };

  if (step === "name") {
    return (
      <div className="ivory-frame min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-center px-7 pb-14 pt-10">

          {/* Brand label */}
          <p className="label-caps tracking-[0.38em] text-[var(--plum)]/50">NOURÉ WELLNESS</p>

          {/* Editorial headline */}
          <div className="mt-8 w-full text-center fade-rise">
            <h1 className="font-serif text-[50px] leading-[1.0] text-[var(--plum)]">
              The Inner<br />Glow Reset
            </h1>

            {/* Thin gold rule */}
            <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

            {/* Subheadline */}
            <p className="mt-4 font-serif italic text-[18px] leading-snug text-[var(--plum)]/65">
              21 Days to Radiant Skin from Within
            </p>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-[34ch] text-[13.5px] leading-relaxed text-[var(--plum)]/50">
              A polyphenol-powered ritual for women done chasing glow from a jar. Your kitchen, your mornings, your most luminous chapter — one quiet sip at a time.
            </p>
          </div>

          {/* Warm rule before form */}
          <div className="warm-divider mt-8 w-full" />

          {/* Name form */}
          <form onSubmit={submitName} className="w-full">
            <p className="label-caps mb-3 text-center text-[var(--plum)]/38">What shall I call you</p>
            <input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-[var(--plum)]/18 bg-[var(--card)] px-4 py-3.5 text-center font-serif text-[20px] text-[var(--plum)] shadow-sm placeholder:text-[var(--plum)]/28 focus:border-[var(--gold)]/70 focus:outline-none focus:ring-0 transition-colors"
              maxLength={32}
            />
            <button
              type="submit"
              disabled={!nameVal.trim()}
              className="mt-5 w-full rounded-full bg-[var(--plum)] py-[14px] text-[12px] font-medium tracking-[0.22em] uppercase text-white/90 shadow-sm transition-opacity hover:opacity-85 disabled:opacity-35"
            >
              Begin Your Ritual →
            </button>
          </form>

          {/* Privacy note */}
          <p className="mt-5 text-center font-serif italic text-[11px] text-[var(--plum)]/35">
            Your progress is saved privately, only on this device.
          </p>

        </div>
      </div>
    );
  }

  return <OnboardingQuiz step={step} onSkin={pickSkin} onGut={pickGut} onPace={pickPace} />;
}

function OnboardingQuiz({
  step,
  onSkin,
  onGut,
  onPace,
}: {
  step: Exclude<Step, "name">;
  onSkin: (v: OnboardingAnswers["skinGoal"]) => void;
  onGut: (v: OnboardingAnswers["gutGoal"]) => void;
  onPace: (v: OnboardingAnswers["morningPace"]) => void;
}) {
  const stepIndex = step === "skin" ? 0 : step === "gut" ? 1 : 2;

  return (
    <div className="ivory-frame min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-6 pt-10 pb-16">
        {/* Progress bar */}
        <p className="font-serif text-[14px] tracking-[0.4em] text-[var(--plum)]">NOURÉ</p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[2px] flex-1 rounded-full transition-all"
              style={{ background: i <= stepIndex ? "var(--gold)" : "oklch(0.388 0.108 354 / 0.15)" }}
            />
          ))}
        </div>
        <p className="mt-3 label-caps text-[var(--gold)]">Question {stepIndex + 1} of 3</p>

        {step === "skin" && (
          <QuizPanel
            question="What is your skin asking for right now?"
            sub="Your ritual will support this focus throughout the 21 days."
            options={[
              { value: "glow", label: "Brightness & Glow", detail: "More radiance, a lit-from-within quality." },
              { value: "texture", label: "Smoothness & Texture", detail: "Softer surface, more even feel." },
              { value: "calm", label: "Calm & Soothe", detail: "Less sensitivity, more settled skin." },
            ]}
            onSelect={(v) => onSkin(v as OnboardingAnswers["skinGoal"])}
          />
        )}

        {step === "gut" && (
          <QuizPanel
            question="How does your gut feel most mornings?"
            sub="No wrong answer. This shapes your daily nourishment focus."
            options={[
              { value: "bloating", label: "Bloated or heavy", detail: "Fullness that lingers from the night before." },
              { value: "energy", label: "Low energy by noon", detail: "The morning feels okay but fades fast." },
              { value: "unsettled", label: "Unsettled or sensitive", detail: "Easily disrupted — by stress, food, or pace." },
              { value: "good", label: "Pretty well, actually", detail: "I want to nourish what's already working." },
            ]}
            onSelect={(v) => onGut(v as OnboardingAnswers["gutGoal"])}
          />
        )}

        {step === "pace" && (
          <QuizPanel
            question="What does your ideal morning look like?"
            sub="Your checklist will reflect how you move through the ritual."
            options={[
              { value: "quick", label: "Quick & energized", detail: "I want to feel it fast and move into my day." },
              { value: "slow", label: "Slow & unhurried", detail: "I want to linger. The morning is the ritual." },
            ]}
            onSelect={(v) => onPace(v as OnboardingAnswers["morningPace"])}
          />
        )}
      </div>
    </div>
  );
}

function QuizPanel({
  question,
  sub,
  options,
  onSelect,
}: {
  question: string;
  sub: string;
  options: { value: string; label: string; detail: string }[];
  onSelect: (v: string) => void;
}) {
  return (
    <div className="mt-8 fade-rise">
      <h2 className="font-serif text-[30px] leading-tight text-[var(--plum)]">{question}</h2>
      <p className="mt-2 font-serif italic text-[15px] text-[var(--plum)]/60">{sub}</p>

      <div className="mt-8 space-y-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="block w-full rounded-2xl border border-[var(--plum)]/15 bg-[var(--card)] p-5 text-left shadow-sm transition-all active:scale-[0.98] hover:border-[var(--gold)]/60 hover:bg-[var(--sand)]"
          >
            <div className="flex items-center gap-3">
              <span className="text-[var(--gold)] text-[16px]">✦</span>
              <p className="font-serif text-[20px] text-[var(--plum)]">{opt.label}</p>
            </div>
            <p className="mt-1.5 pl-7 font-serif italic text-[13.5px] text-[var(--plum)]/60">{opt.detail}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
