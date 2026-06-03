import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { GoldDivider, Pomegranate } from "@/components/Frame";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

const BONUSES = [
  { n: 1, name: "Polyphenol Power Library", value: "$27", body: "Your complete guide to 40+ polyphenol-rich foods. What they do. How to use them. Which ones matter most for your skin." },
  { n: 2, name: "The Ingredient Encyclopedia", value: "$19", body: "Tap any ingredient in a recipe to learn what it does for your gut, skin, and energy — in plain language." },
  { n: 3, name: "Morning Sound Rituals", value: "$17", body: "5 curated ambient sound sessions. Play while you journal or prepare your Radiant Reds." },
  { n: 4, name: "21 Personalized Push Notifications", value: "Priceless", body: "One message per day, written for this stage of your reset. Never generic. Never repeated." },
  { n: 5, name: "The Glow Photo Timeline", value: "$37", body: "Optional daily skin check-in photos. At Day 21, the app generates a side-by-side visual of your journey." },
  { n: 6, name: "Day 21 Celebration", value: "$47", body: "When you complete Day 21, you unlock a celebration screen, your Glow Score, and a shareable card." },
];

function Welcome() {
  const hydrated = useHydrated();
  const unlocked = useApp((s) => s.unlocked);
  const name = useApp((s) => s.name);
  const setName = useApp((s) => s.setName);
  const setSeen = useApp((s) => s.setSeenWelcome);
  const navigate = useNavigate();
  const [nameVal, setNameVal] = useState("");

  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!unlocked) return <Navigate to="/" />;

  // If Shopify didn't return a name, ask for it before proceeding
  if (!name) {
    const submitName = (e: React.FormEvent) => {
      e.preventDefault();
      const v = nameVal.trim();
      if (!v) return;
      setName(v);
    };

    return (
      <div className="ivory-frame min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-center px-6 text-center">
          <Pomegranate size={120} />
          <h1 className="mt-6 font-serif text-[36px] leading-tight text-[var(--plum)]">
            One last thing.
          </h1>
          <p className="mt-3 font-serif italic text-[16px] text-[var(--plum)]/70">
            What should we call you?
          </p>
          <form onSubmit={submitName} className="mt-8 w-full">
            <input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              placeholder="Your first name"
              className="w-full border-0 border-b border-[var(--plum)]/30 bg-transparent px-1 py-3 text-center font-serif text-2xl text-[var(--plum)] placeholder:text-[var(--plum)]/30 focus:border-[var(--gold)] focus:outline-none"
              maxLength={32}
            />
            <button
              type="submit"
              disabled={!nameVal.trim()}
              className="gold-pill-btn mt-8 w-full disabled:opacity-50"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  const begin = () => {
    setSeen();
    navigate({ to: "/home" });
  };

  return (
    <div className="ivory-frame min-h-screen">
      <div className="mx-auto max-w-[440px] px-5 pt-8 pb-16">
        <p className="text-center font-serif text-[14px] tracking-[0.4em] text-[var(--plum)]">NOURÉ</p>

        <div className="mt-10 fade-rise">
          <h1 className="font-serif text-[40px] leading-[1.05] text-[var(--plum)]">
            Good morning,<br /><em className="text-[var(--berry)]">{name}.</em>
          </h1>
          <p className="mt-3 font-serif italic text-[18px] text-[var(--plum)]/70">
            Your 21-day reset begins today.
          </p>
          <GoldDivider />
        </div>

        <div className="sand-card mt-2 border-l-4 border-[var(--gold)] p-6">
          <p className="label-caps text-[var(--gold)]">The Core Offer</p>
          <h2 className="mt-2 font-serif text-[28px] leading-tight text-[var(--plum)]">
            The Inner Glow Reset
          </h2>
          <p className="mt-1 font-serif italic text-[var(--plum)]/70">21-Day Beauty Ritual System</p>
          <ul className="mt-4 space-y-1.5 text-[14px] text-[var(--plum)]/85">
            <li>· 21 daily ritual guides</li>
            <li>· Gut-skin education</li>
            <li>· Polyphenol recipe library</li>
            <li>· Daily glow journal with insights</li>
            <li>· Morning audio practices</li>
            <li>· Progress tracking and milestones</li>
          </ul>
          <p className="mt-5 label-caps text-[var(--gold)]">Value: $97</p>
        </div>

        <div className="mt-10">
          <p className="label-caps text-center text-[var(--plum)]/60">Plus six bonuses</p>
          <h3 className="mt-2 text-center font-serif text-[26px] text-[var(--plum)]">
            Everything you also receive
          </h3>
        </div>

        <div className="mt-6 space-y-4">
          {BONUSES.map((b, i) => (
            <div
              key={b.n}
              className={`relative rounded-2xl border-l-4 border-[var(--gold)] p-5 shadow-sm ${
                i % 2 === 0 ? "bg-[var(--sand)]" : "bg-[var(--card)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <UnlockIcon />
                  <span className="label-caps text-[var(--gold)]">Bonus {b.n}</span>
                </div>
                <span className="rounded-full bg-[var(--plum)]/8 px-3 py-1 text-[11px] tracking-wide text-[var(--plum)]/70">
                  {b.value}
                </span>
              </div>
              <h4 className="mt-3 font-serif text-[20px] leading-tight text-[var(--plum)]">{b.name}</h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--plum)]/75">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="warm-divider" />
          <p className="mt-6 font-serif text-[22px] text-[var(--plum)]/70">Total value</p>
          <p className="font-serif text-[56px] leading-none text-[var(--plum)]">$244</p>
          <p className="mt-3 font-serif italic text-[15px] text-[var(--plum)]/60">
            Yours, included with your Radiant Reds ritual.
          </p>
          <div className="warm-divider mt-6" />
        </div>

        <div className="mt-8">
          <Pomegranate size={120} />
        </div>

        <button onClick={begin} className="gold-pill-btn mt-8 w-full">
          Start Day 1, {name} →
        </button>
        <p className="mt-4 text-center font-serif italic text-[12px] text-[var(--plum)]/50">
          No account. No subscription. Just the ritual.
        </p>
      </div>
    </div>
  );
}

function UnlockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--gold)]">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0" />
    </svg>
  );
}
