import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { GoldDivider } from "@/components/Frame";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

const UNLOCKED = [
  {
    label: "Morning ritual",
    title: "21 daily smoothie guides",
    body: "A different recipe each morning, built around what your skin and gut need at each stage of the reset.",
  },
  {
    label: "Smart grocery list",
    title: "Shop by week or all 21 days",
    body: "Every ingredient organized by category. Check off as you shop. Switch between one week and the full program.",
  },
  {
    label: "Daily checklist",
    title: "Your personalized ritual",
    body: "A short morning checklist shaped by your skin goal and pace. Hydration, nourishment, reflection.",
  },
  {
    label: "Journal",
    title: "Prompts + daily check-ins",
    body: "One gentle prompt each morning. A quick check-in for skin, gut, energy, and mood. Patterns reveal themselves.",
  },
  {
    label: "Three program paths",
    title: "Choose your focus",
    body: "Skin Glow. Feel Lighter. Balanced Energy. Same 21 days, different emphasis — pick the one that fits your season.",
  },
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

        {/* Brand word */}
        <p className="text-center label-caps tracking-[0.42em] text-[var(--plum)]/45">NOURÉ WELLNESS</p>

        {/* Greeting */}
        <div className="mt-10 fade-rise">
          <h1 className="font-serif text-[42px] leading-[1.05] text-[var(--plum)]">
            Welcome,<br />
            <em className="not-italic text-[var(--berry)]">{name}.</em>
          </h1>
          <p className="mt-3 font-serif italic text-[16px] leading-relaxed text-[var(--plum)]/55">
            Your Inner Glow Reset is ready. Here's what you have access to.
          </p>
        </div>

        <GoldDivider />

        {/* Unlocked section */}
        <p className="label-caps text-[var(--gold)]">What's inside your reset</p>

        {/* Feature cards */}
        <div className="mt-4 space-y-3">
          {UNLOCKED.map((f) => (
            <div key={f.label} className="rounded-2xl border border-[var(--plum)]/8 bg-[var(--card)] px-5 py-4 shadow-sm">
              <p className="label-caps text-[var(--plum)]/38">{f.label}</p>
              <p className="mt-1 font-serif text-[19px] leading-tight text-[var(--plum)]">{f.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--plum)]/55">{f.body}</p>
            </div>
          ))}
        </div>

        <GoldDivider />

        {/* CTA */}
        <button
          onClick={begin}
          className="mt-2 w-full rounded-full bg-[var(--plum)] py-[14px] text-[12px] font-medium tracking-[0.22em] uppercase text-white/90 shadow-sm transition-opacity hover:opacity-85"
        >
          Begin Day 1, {name} →
        </button>
        <p className="mt-4 text-center font-serif italic text-[11.5px] text-[var(--plum)]/38">
          No account needed. Your progress stays on this device.
        </p>

      </div>
    </div>
  );
}
