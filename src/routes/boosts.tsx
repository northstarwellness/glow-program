import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar } from "@/components/Frame";
import { useApp, activeDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

// Retired (release pass, 2026-09-30): not linked anywhere, and its legacy wording predates the
// claim rules. Any old link lands on Home.
export const Route = createFileRoute("/boosts")({
  beforeLoad: () => {
    throw redirect({ to: "/home", replace: true });
  },
  component: Boosts,
});

type Boost = {
  id: string;
  category: "skin" | "gut" | "energy" | "ritual";
  title: string;
  duration: string;
  teaser: string;
  steps: string[];
  polyphenol?: string;
  tag: string;
};

const BOOSTS: Boost[] = [
  {
    id: "lymphatic-glow",
    category: "skin",
    title: "Morning Glow Massage",
    duration: "4 min",
    teaser: "Gentle strokes to wake up your face before anything else touches your day.",
    tag: "Skin",
    steps: [
      "Start at your collarbone — use gentle downward strokes 5×",
      "Move up to your jaw. Press and release along the jawline, ear to chin, 5×",
      "Under eye: feather-light taps outward from bridge to temple, 8×",
      "Forehead: press fingertips at center, sweep outward to temples, 5×",
      "Finish at neck — three slow, firm downward strokes each side",
    ],
  },
  {
    id: "gut-reset-morning",
    category: "gut",
    title: "Warm Water Morning Start",
    duration: "5 min",
    teaser: "A warm, slow start to the day. Try this one before coffee.",
    polyphenol: "Pairs with your Radiant Reds",
    tag: "Gut",
    steps: [
      "Drink 12oz warm water with a squeeze of lemon — room temperature, not cold",
      "3 minutes of gentle abdominal breathing: inhale 4 counts, exhale 6",
      "Seated spinal twist: hold 30 seconds each side",
      "Follow with your Radiant Reds — this is your polyphenol window",
    ],
  },
  {
    id: "cold-glow",
    category: "skin",
    title: "Cold Water Glow Splash",
    duration: "2 min",
    teaser: "One of the oldest morning habits. A cold splash feels bracing, fresh and wide awake.",
    tag: "Skin",
    steps: [
      "After cleansing, fill your sink with cold water",
      "Dip your face 3–5 times, holding for 3 seconds each",
      "Pat dry — don't rub",
      "Apply your serum while skin is still slightly damp",
    ],
  },
  {
    id: "antioxidant-breakfast",
    category: "gut",
    title: "Antioxidant First Meal",
    duration: "Build as habit",
    teaser: "The first thing you eat sets the tone for your morning. Make it colorful.",
    polyphenol: "Polyphenol-forward",
    tag: "Nutrition",
    steps: [
      "Lead with color: berries, dark leafy greens, or beet in your first meal",
      "Add a fat source, like avocado, olive oil or seeds, for richness",
      "Skip the ultra-processed carb as your opener",
      "Eat within a couple of hours of waking, whenever it suits your morning",
    ],
  },
  {
    id: "breathwork-glow",
    category: "energy",
    title: "Three-Minute Breathwork",
    duration: "3 min",
    teaser: "Three minutes of slow breathing, and a calmer start to whatever comes next.",
    tag: "Energy",
    steps: [
      "Find a quiet seat. Close your eyes.",
      "Inhale through nose for 4 counts",
      "Hold for 2 counts",
      "Exhale through mouth for 8 counts — twice as long as the inhale",
      "Repeat 6 cycles. Feel your shoulders drop on round 3.",
    ],
  },
  {
    id: "evening-skin-window",
    category: "ritual",
    title: "Evening Skin Ritual",
    duration: "10 min",
    teaser: "Ten unhurried minutes to close the day and care for your skin.",
    tag: "Ritual",
    steps: [
      "Cleanse gently — never strip",
      "Apply a vitamin C or polyphenol serum while skin is damp",
      "Facial oil: press into skin (don't rub), focus on cheeks and temples",
      "Journal one sentence: how does your skin feel today vs. Day 1?",
      "Magnesium-rich snack if needed: dark chocolate, almonds, or pumpkin seeds",
    ],
  },
  {
    id: "glow-walk",
    category: "energy",
    title: "The Morning Glow Walk",
    duration: "10 min",
    teaser: "Ten minutes of morning daylight, fresh air and an easy pace.",
    tag: "Energy",
    steps: [
      "Within 30 minutes of waking, step outside",
      "Leave your sunglasses off for the first few minutes if that's comfortable",
      "Walk at a comfortable pace. This is a stroll, not a workout.",
      "No phone. Just the walk.",
    ],
  },
  {
    id: "polyphenol-reset",
    category: "ritual",
    title: "The Polyphenol Window",
    duration: "Daily anchor",
    teaser: "Every ritual in this reset orbits one moment. This is it.",
    polyphenol: "Core NOURÉ ritual",
    tag: "Ritual",
    steps: [
      "First thing in the morning, before coffee or breakfast",
      "Prepare your Radiant Reds — 1 scoop in 8–10oz cold or room temp water",
      "Drink slowly. Don't rush this.",
      "This is your moment, before the day asks anything of you.",
      "Tick Radiant Reds in today's check-ins.",
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  skin: "text-[var(--berry)] bg-[var(--berry)]/10",
  gut: "text-[var(--cranberry)] bg-[var(--gold)]/12",
  energy: "text-[var(--sage)] bg-[oklch(0.83_0.038_145)]/15",
  ritual: "text-[var(--plum)] bg-[var(--plum)]/8",
};

function Boosts() {
  const hydrated = useHydrated();
  const s = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  if (hydrated && !s.name) return <Navigate to="/" />;
  const day = activeDay(s.completedDays);

  return (
    <Frame>
      <TopBar name={s.name} day={day} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">Boosts.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--ink-2)] max-w-[30ch]">
        Small, lovely practices for your morning and evening. Stack them with your daily ritual or
        use them alone.
      </p>

      <div className="mt-2 rounded-2xl blush-card p-4 mb-6">
        <p className="text-[13px] leading-relaxed text-[var(--plum)]/75 italic font-serif">
          "Small practices, kept daily, make the ritual your own."
        </p>
      </div>

      <div className="space-y-3">
        {BOOSTS.map((boost) => {
          const open = expanded === boost.id;
          return (
            <div key={boost.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpanded(open ? null : boost.id)}
                className="w-full p-5 text-left cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.14em] uppercase font-medium ${CATEGORY_COLORS[boost.category]}`}
                      >
                        {boost.tag}
                      </span>
                      <span className="text-[11px] text-[var(--ink-2)]">{boost.duration}</span>
                    </div>
                    <h3 className="font-serif text-[19px] leading-tight text-[var(--plum)]">
                      {boost.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--plum)]/65">
                      {boost.teaser}
                    </p>
                    {boost.polyphenol && (
                      <p className="mt-2 text-[11px] tracking-wide text-[var(--cranberry)] label-caps">
                        {boost.polyphenol}
                      </p>
                    )}
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className={`flex-shrink-0 mt-1 text-[var(--ink-2)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {open && (
                <div className="border-t border-[var(--gold)]/15 px-5 pb-5 pt-4">
                  <p className="label-caps text-[var(--cranberry)] mb-3">How to do it</p>
                  <ol className="space-y-3">
                    {boost.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/15 font-serif text-[11px] text-[var(--cranberry)]">
                          {i + 1}
                        </span>
                        <p className="text-[13.5px] leading-relaxed text-[var(--plum)]/80">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Frame>
  );
}
