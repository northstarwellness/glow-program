import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { GoldDivider } from "@/components/Frame";
import { SOUNDS } from "@/lib/sounds";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

/** Everything else inside the app, described plainly. No prices or invented values. */
const ALSO_INCLUDED = [
  {
    name: "Polyphenol Library",
    body: "Eight polyphenol-rich foods, what they are and how to use them, plus a guide to every recipe ingredient.",
  },
  {
    name: "Ingredient guide",
    body: "Tap any ingredient in a recipe to learn what it brings to your glass, in plain language.",
  },
  // Listed only while verified sounds exist (see src/lib/sounds.ts).
  ...(SOUNDS.length
    ? [
        {
          name: "Morning sounds",
          body: "Nature sounds and quiet instrumental music to play while you make your glass or write in your journal.",
        },
      ]
    : []),
  {
    name: "21 journal prompts",
    body: "One short prompt for each morning. Write about it, write about anything, or skip it.",
  },
  {
    name: "Your Reflection",
    body: "On Day 21, a private look back at the mornings you completed and the feelings you chose.",
  },
  {
    name: "Day 21 Celebration",
    body: "When you complete Day 21, you get a celebration screen and a Ritual Card of your 21 mornings to save or share.",
  },
];

function Welcome() {
  const hydrated = useHydrated();
  const name = useApp((s) => s.name);
  const setSeen = useApp((s) => s.setSeenWelcome);
  const navigate = useNavigate();

  if (hydrated && !name) return <Navigate to="/" />;

  const begin = () => {
    setSeen();
    navigate({ to: "/home" });
  };

  return (
    <div className="ivory-frame min-h-screen">
      <div className="mx-auto max-w-[440px] px-5 pt-8 pb-16">
        <p className="text-center font-serif text-[14px] tracking-[0.45em] text-[var(--ink-2)]">
          RITUAL APP
        </p>

        <div className="mt-10 fade-rise">
          <h1 className="font-serif text-[42px] leading-[1.05] text-[var(--charcoal)]">
            Good morning,
            <br />
            <em className="text-[var(--cranberry)]">{name}.</em>
          </h1>
          <p className="mt-3 font-serif italic text-[18px] text-[var(--ink-2)]">
            Your 21-day reset begins today.
          </p>
          <GoldDivider />
        </div>

        {/* Power statement */}
        <div
          className="rounded-2xl p-6 mt-2"
          style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}
        >
          <p className="font-serif text-[17px] leading-relaxed text-[var(--charcoal)]/75 italic">
            "Skincare works on the outside. Your 21 Mornings are the inside half of your routine:
            one polyphenol-rich glass, every morning for 21 days."
          </p>
        </div>

        {/* Core offer */}
        <div className="gold-glow-card mt-6 p-6">
          <p className="label-caps text-[var(--cranberry)]">What you have access to</p>
          <h2 className="mt-2 font-serif text-[26px] leading-tight text-[var(--charcoal)]">
            Your 21 Mornings
          </h2>
          <p className="mt-0.5 font-serif italic text-[var(--charcoal)]/65">
            The 21-Day Beauty Ritual
          </p>
          <ul className="mt-5 space-y-2 text-[14px] text-[var(--charcoal)]/70">
            {[
              "21 daily ritual guides, taken in order at your own pace",
              "Beauty-from-within education on polyphenols, plants and color",
              "Polyphenol recipe library built around Radiant Reds",
              "Morning Journal: a little space for what's on your mind",
              "Your Ritual: completed mornings and milestone celebrations",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gold)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Also included, described plainly */}
        <div className="mt-10">
          <h3 className="text-center font-serif text-[24px] text-[var(--charcoal)]">
            Also included
          </h3>
        </div>

        <div className="mt-5 space-y-3">
          {ALSO_INCLUDED.map((item) => (
            <div key={item.name} className="glass-card p-5">
              <h4 className="font-serif text-[19px] leading-tight text-[var(--charcoal)]">
                {item.name}
              </h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--charcoal)]/65">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="warm-divider" />
          <p className="mt-6 font-serif italic text-[16px] text-[var(--ink-2)]">
            Yours, beginning today.
          </p>
          <div className="warm-divider mt-6" />
        </div>

        <button onClick={begin} className="gold-pill-btn mt-8 w-full">
          Start Day 1, {name} →
        </button>
        <p className="mt-4 text-center font-serif italic text-[12px] text-[var(--ink-2)]">
          Your progress is saved on this device.
        </p>
      </div>
    </div>
  );
}
