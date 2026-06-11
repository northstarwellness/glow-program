import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { RECIPES } from "@/lib/content";
import { SmoothieImage } from "@/components/SmoothieImage";

export const Route = createFileRoute("/recipes/")({ component: Recipes });

type PhaseFilter = "all" | "foundation" | "build" | "glow" | "bonus";

const PHASE_LABELS: Record<PhaseFilter, string> = {
  all: "All",
  foundation: "Foundation",
  build: "Build",
  glow: "Glow",
  bonus: "Bonus",
};

const core = RECIPES.filter((r) => !r.bonus);

function Recipes() {
  const hydrated = useHydrated();
  const s = useApp();
  const [filter, setFilter] = useState<PhaseFilter>("all");

  if (hydrated && !s.name) return <Navigate to="/" />;

  const displayRecipes = (() => {
    if (filter === "all") return core;
    if (filter === "foundation") return core.slice(0, 7);
    if (filter === "build") return core.slice(7, 14);
    if (filter === "glow") return core.slice(14, 21);
    if (filter === "bonus") return RECIPES.filter((r) => r.bonus);
    return core;
  })();

  return (
    <Frame>
      <TopBar name={s.name} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--charcoal)]">The 21 smoothies.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--charcoal)]/55">
        Polyphenol rituals for every morning.
      </p>

      {/* Phase filter pills */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(["all", "foundation", "build", "glow", "bonus"] as PhaseFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer ${
              filter === f
                ? "bg-[var(--charcoal)] text-[var(--ivory)]"
                : "bg-white text-[var(--charcoal)]/55 border border-[var(--taupe)]/30"
            }`}
          >
            {PHASE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {displayRecipes.map((r) => {
          const saved = s.savedRecipes.includes(r.id);
          return (
            <Link key={r.id} to="/recipes/$id" params={{ id: r.id }} className="group block">
              <div className="overflow-hidden rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm transition-shadow group-hover:shadow-md">
                {/* Smoothie photo with gradient fallback */}
                <SmoothieImage recipe={r} className="h-[80px] w-full" />
                <div className="p-3.5">
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-[9.5px] tracking-[0.15em] uppercase font-medium"
                        style={{ background: "oklch(0.205 0 0 / 0.06)", color: "var(--charcoal)" }}>
                    {r.benefitTag}
                  </span>
                  <h3 className="mt-1.5 font-serif text-[15px] leading-tight text-[var(--charcoal)]">{r.name}</h3>
                  <p className="mt-1 text-[11px] text-[var(--charcoal)]/40">{r.prep}</p>
                  {saved && (
                    <p className="mt-1.5 text-[9.5px] tracking-[0.14em] uppercase text-[var(--gold)]">Saved</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filter === "bonus" && (
        <p className="mt-4 text-center font-serif italic text-[13px] text-[var(--charcoal)]/40">
          Bonus rituals — beyond the 21-day rotation.
        </p>
      )}
    </Frame>
  );
}
