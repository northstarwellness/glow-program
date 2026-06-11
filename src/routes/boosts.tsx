import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/boosts")({ component: Boosts });

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
    title: "Lymphatic Glow Massage",
    duration: "4 min",
    teaser: "Move stagnant fluid, wake your face, reduce morning puffiness before anything else.",
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
    title: "Morning Gut Reset",
    duration: "5 min",
    teaser: "Your gut and skin share the same conversation. Start this one before coffee.",
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
    teaser: "One of the oldest skin secrets. Cold water closes pores, tightens skin, and wakes circulation.",
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
    teaser: "The first thing you eat sets the tone for every system that runs your skin.",
    polyphenol: "Polyphenol-forward",
    tag: "Nutrition",
    steps: [
      "Lead with color: berries, dark leafy greens, or beet in your first meal",
      "Add a fat source — avocado, olive oil, or seeds — for polyphenol absorption",
      "Skip the ultra-processed carb as your opener",
      "Eat within 2 hours of waking for cortisol-aligned digestion",
    ],
  },
  {
    id: "breathwork-glow",
    category: "energy",
    title: "Cortisol Reset Breathwork",
    duration: "3 min",
    teaser: "Chronic stress is one of the most underrated causes of dull skin. This is the 3-minute intervention.",
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
    title: "Evening Skin Window",
    duration: "10 min",
    teaser: "Your skin repairs itself at night. This 10-minute ritual activates that window.",
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
    teaser: "Morning light sets your cortisol rhythm, which directly affects inflammation — which shows up as skin.",
    tag: "Energy",
    steps: [
      "Within 30 minutes of waking, step outside",
      "No sunglasses for the first 5 minutes — you need that light signal",
      "Walk at a comfortable pace — this isn't exercise, it's calibration",
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
      "This is your skin getting what it needs before anything else.",
      "Track it — every Reds day moves your glow score.",
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  skin: "text-[var(--berry)] bg-[var(--berry)]/10",
  gut: "text-[var(--gold)] bg-[var(--gold)]/12",
  energy: "text-[var(--sage)] bg-[oklch(0.83_0.038_145)]/15",
  ritual: "text-[var(--plum)] bg-[var(--plum)]/8",
};

function Boosts() {
  const hydrated = useHydrated();
  const s = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  if (hydrated && !s.name) return <Navigate to="/" />;
  const day = currentDay(s.startDate);

  return (
    <Frame>
      <TopBar name={s.name} day={day} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">Boosts.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--plum)]/55 max-w-[30ch]">
        Targeted practices your skin will feel. Stack them with your daily ritual or use them alone.
      </p>

      <div className="mt-2 rounded-2xl blush-card p-4 mb-6">
        <p className="text-[13px] leading-relaxed text-[var(--plum)]/75 italic font-serif">
          "For the woman doing everything right and still not seeing it on her face — these are the missing pieces."
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
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.14em] uppercase font-medium ${CATEGORY_COLORS[boost.category]}`}>
                        {boost.tag}
                      </span>
                      <span className="text-[11px] text-[var(--plum)]/40">{boost.duration}</span>
                    </div>
                    <h3 className="font-serif text-[19px] leading-tight text-[var(--plum)]">{boost.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--plum)]/65">{boost.teaser}</p>
                    {boost.polyphenol && (
                      <p className="mt-2 text-[11px] tracking-wide text-[var(--gold)] label-caps">{boost.polyphenol}</p>
                    )}
                  </div>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                    className={`flex-shrink-0 mt-1 text-[var(--plum)]/35 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {open && (
                <div className="border-t border-[var(--gold)]/15 px-5 pb-5 pt-4">
                  <p className="label-caps text-[var(--gold)] mb-3">How to do it</p>
                  <ol className="space-y-3">
                    {boost.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/15 font-serif text-[11px] text-[var(--gold)]">
                          {i + 1}
                        </span>
                        <p className="text-[13.5px] leading-relaxed text-[var(--plum)]/80">{step}</p>
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
