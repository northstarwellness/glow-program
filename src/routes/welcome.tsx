import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { GoldDivider } from "@/components/Frame";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

const BONUSES = [
  { n: 1, name: "Polyphenol Power Library", value: "$27", body: "Your complete guide to 40+ polyphenol-rich foods. What they do. How to use them. Which ones matter most for your skin." },
  { n: 2, name: "The Ingredient Encyclopedia", value: "$19", body: "Tap any ingredient in a recipe to learn what it does for your gut, skin, and energy — in plain language." },
  { n: 3, name: "Morning Sound Rituals", value: "$17", body: "5 curated ambient sound sessions. Play while you journal or prepare your Radiant Reds." },
  { n: 4, name: "21 Personalized Ritual Prompts", value: "Priceless", body: "One message per day, written for this stage of your reset. Never generic. Never repeated." },
  { n: 5, name: "The Glow Photo Timeline", value: "$37", body: "Optional daily skin check-in. At Day 21, compare where you started." },
  { n: 6, name: "Day 21 Celebration + Glow Score", value: "$47", body: "When you complete Day 21, you unlock your Glow Score, a celebration screen, and a shareable card." },
];

function Welcome() {
  const hydrated = useHydrated();
  const name = useApp((s) => s.name);
  const setSeen = useApp((s) => s.setSeenWelcome);
  const navigate = useNavigate();

  if (hydrated && !name) return <Navigate to="/" />;

  const begin = () => { setSeen(); navigate({ to: "/home" }); };

  return (
    <div className="ivory-frame min-h-screen">
      <div className="mx-auto max-w-[440px] px-5 pt-8 pb-16">
        <p className="text-center font-serif text-[14px] tracking-[0.45em] text-[var(--charcoal)]/50">RITUAL APP</p>

        <div className="mt-10 fade-rise">
          <h1 className="font-serif text-[42px] leading-[1.05] text-[var(--charcoal)]">
            Good morning,<br />
            <em className="text-[var(--gold)]">{name}.</em>
          </h1>
          <p className="mt-3 font-serif italic text-[18px] text-[var(--charcoal)]/55">
            Your 21-day reset begins today.
          </p>
          <GoldDivider />
        </div>

        {/* Power statement */}
        <div className="rounded-2xl p-6 mt-2" style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}>
          <p className="font-serif text-[17px] leading-relaxed text-[var(--charcoal)]/75 italic">
            "Your serums can't fix what starts underneath. The Inner Glow Reset works at the source — morning by morning, from the inside out."
          </p>
        </div>

        {/* Core offer */}
        <div className="gold-glow-card mt-6 p-6">
          <p className="label-caps text-[var(--gold)]">What you have access to</p>
          <h2 className="mt-2 font-serif text-[26px] leading-tight text-[var(--charcoal)]">
            The Inner Glow Reset
          </h2>
          <p className="mt-0.5 font-serif italic text-[var(--charcoal)]/55">21-Day Beauty Ritual System</p>
          <ul className="mt-5 space-y-2 text-[14px] text-[var(--charcoal)]/70">
            {[
              "21 daily ritual guides — one unlocks each morning",
              "Gut-skin education — why what you eat shows on your face",
              "Polyphenol recipe library built around Radiant Reds",
              "Daily glow journal with personalized prompts",
              "Boosts — targeted practices for skin, energy & gut",
              "Progress tracking, streaks & milestone celebrations",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-[var(--gold)]/20 flex items-center justify-between">
            <p className="label-caps text-[var(--charcoal)]/45">Total value</p>
            <p className="font-serif text-[22px] text-[var(--charcoal)]">$244</p>
          </div>
        </div>

        {/* Bonus stack */}
        <div className="mt-10">
          <p className="label-caps text-center text-[var(--charcoal)]/45">Plus six bonuses included</p>
          <h3 className="mt-2 text-center font-serif text-[24px] text-[var(--charcoal)]">
            Everything else you receive
          </h3>
        </div>

        <div className="mt-5 space-y-3">
          {BONUSES.map((b) => (
            <div key={b.n} className="glass-card p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="label-caps text-[var(--gold)]">Bonus {b.n}</span>
                <span className="rounded-full border border-[var(--taupe)]/30 px-2.5 py-0.5 text-[11px] tracking-wide text-[var(--charcoal)]/50">
                  {b.value}
                </span>
              </div>
              <h4 className="mt-2 font-serif text-[19px] leading-tight text-[var(--charcoal)]">{b.name}</h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--charcoal)]/60">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="warm-divider" />
          <p className="mt-6 font-serif italic text-[16px] text-[var(--charcoal)]/55">
            Yours, beginning today.
          </p>
          <div className="warm-divider mt-6" />
        </div>

        <button onClick={begin} className="gold-pill-btn mt-8 w-full">
          Start Day 1, {name} →
        </button>
        <p className="mt-4 text-center font-serif italic text-[12px] text-[var(--charcoal)]/40">
          No account. No subscription. Just the ritual.
        </p>
      </div>
    </div>
  );
}
