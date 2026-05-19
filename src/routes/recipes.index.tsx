import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { RECIPES } from "@/lib/content";

export const Route = createFileRoute("/recipes/")({ component: Recipes });

type Feel = {
  id: string;
  label: string;
  sub: string;
  recipeIds: string[];
};

const FEELS: Feel[] = [
  { id: "glowing",   label: "Glowing skin",       sub: "Polyphenol-dense for the gut-skin axis",       recipeIds: ["pomegranate-elixir", "beet-glow", "berry-bloom"] },
  { id: "bloating",  label: "Less bloated",        sub: "Prebiotic fiber and gentle motility support",   recipeIds: ["fig-almond", "ginger-pear", "papaya-lime"] },
  { id: "energy",    label: "Steady energy",       sub: "Beet nitrates and clean morning fuel",          recipeIds: ["beet-glow", "honey-almond", "matcha-cloud"] },
  { id: "hormone",   label: "Hormone support",     sub: "Adaptogens and anti-inflammatory polyphenols",  recipeIds: ["plum-rose", "peach-saffron", "cherry-cacao"] },
  { id: "digestion", label: "Digestion",           sub: "Enzymes, ginger, and gut-calming ingredients", recipeIds: ["papaya-lime", "fig-almond", "ginger-pear"] },
  { id: "reset",     label: "Morning reset",       sub: "Hydration and polyphenol clarity",              recipeIds: ["pomegranate-elixir", "watermelon-reds", "matcha-cloud"] },
  { id: "beauty",    label: "Beauty from within",  sub: "Rose, saffron, and skin-tone polyphenols",      recipeIds: ["rose-cardamom", "blueberry-basil", "peach-saffron"] },
  { id: "calm",      label: "Calm nervous system", sub: "Lavender, rose, and anti-cortisol adaptogens",  recipeIds: ["lavender-honey", "rose-cardamom", "plum-rose"] },
];

function Recipes() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;

  const [activeFeel, setActiveFeel] = useState<Feel | null>(null);
  const core = RECIPES.filter((r) => !r.bonus);

  const displayRecipes = activeFeel
    ? activeFeel.recipeIds.map((id) => RECIPES.find((r) => r.id === id)!).filter(Boolean)
    : core;

  return (
    <Frame>
      <TopBar name={s.name} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">Smoothie rituals.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--plum)]/60">
        {core.length} recipes built for the gut-skin axis.
      </p>

      {/* Build your own */}
      <Link to="/recipes/$id" params={{ id: "build" }} className="mt-5 block">
        <div className="overflow-hidden rounded-3xl border border-[var(--gold)]/40 bg-[var(--card)] p-5 shadow-sm">
          <p className="label-caps text-[var(--gold)]">Custom ritual</p>
          <h3 className="mt-1 font-serif text-[22px] leading-tight text-[var(--plum)]">Build your own smoothie</h3>
          <p className="mt-1 text-[12.5px] italic text-[var(--plum)]/65">
            Choose your ingredients layer by layer. We write the benefits.
          </p>
          <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-[var(--gold)]">Begin</p>
        </div>
      </Link>

      {/* How do you want to feel */}
      <div className="mt-7">
        <p className="label-caps text-[var(--plum)]/55">How do you want to feel?</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {FEELS.map((f) => {
            const active = activeFeel?.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFeel(active ? null : f)}
                className={`rounded-2xl border p-3.5 text-left transition-all ${
                  active
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--plum)]/12 bg-[var(--card)]"
                }`}
              >
                <p className={`font-serif text-[16px] leading-tight ${active ? "text-[var(--plum)]" : "text-[var(--plum)]"}`}>
                  {f.label}
                </p>
                <p className="mt-0.5 text-[11px] italic text-[var(--plum)]/55">{f.sub}</p>
              </button>
            );
          })}
        </div>
        {activeFeel && (
          <button
            onClick={() => setActiveFeel(null)}
            className="mt-2 text-[11px] text-[var(--plum)]/50"
          >
            Clear filter — show all recipes
          </button>
        )}
      </div>

      {/* Recipe grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {displayRecipes.map((r) => {
          const saved = s.savedRecipes.includes(r.id);
          return (
            <Link key={r.id} to="/recipes/$id" params={{ id: r.id }} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-sm" style={{ background: r.gradient }}>
                <div className="flex h-full flex-col justify-end p-3 text-[var(--ivory)]">
                  <span className="self-start rounded-full bg-[var(--ivory)]/25 px-2 py-0.5 text-[9px] tracking-wider uppercase">
                    {r.benefitTag}
                  </span>
                  <h3 className="mt-2 font-serif text-[16px] leading-tight">{r.name}</h3>
                  <p className="mt-1 text-[10px] tracking-wide opacity-80">{r.prep}</p>
                </div>
              </div>
              {saved && (
                <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-[var(--gold)]">Saved</p>
              )}
            </Link>
          );
        })}
      </div>
    </Frame>
  );
}
