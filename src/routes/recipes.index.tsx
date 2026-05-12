import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { RECIPES } from "@/lib/content";

export const Route = createFileRoute("/recipes/")({ component: Recipes });

type Filter = "all" | "core" | "bonus";

function Recipes() {
  const hydrated = useHydrated();
  const s = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  if (hydrated && !s.name) return <Navigate to="/" />;

  const displayed = RECIPES.filter((r) =>
    filter === "all" ? true : filter === "core" ? !r.bonus : !!r.bonus
  );

  return (
    <Frame>
      <TopBar name={s.name} />

      <div className="flex items-start justify-between">
        <div>
          <p className="label-caps text-[var(--plum)]/50">Smoothie Library</p>
          <h1 className="mt-0.5 font-serif text-[30px] leading-tight text-[var(--plum)]">All recipes.</h1>
        </div>
        <Link to="/grocery" className="mt-1 flex items-center gap-1.5 rounded-full border border-[var(--plum)]/12 bg-[var(--card)] px-3 py-1.5 text-[11px] tracking-wide text-[var(--plum)]/65 shadow-sm">
          <BagIcon />
          Grocery list
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2">
        {(["all", "core", "bonus"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-[12px] tracking-wide transition ${
              filter === f ? "bg-[var(--plum)] text-[var(--ivory)]" : "bg-[var(--sand)] text-[var(--plum)]/70"
            }`}>
            {f === "all" ? `All (${RECIPES.length})` : f === "core" ? "Program recipes" : "Bonus recipes"}
          </button>
        ))}
      </div>

      {/* Build your own card */}
      <Link to="/recipes/$id" params={{ id: "build" }} className="mt-4 block">
        <div className="overflow-hidden rounded-2xl border border-[var(--plum)]/10 bg-[var(--card)] p-5 shadow-sm">
          <p className="label-caps text-[var(--gold)]">Custom ritual</p>
          <h3 className="mt-0.5 font-serif text-[20px] leading-tight text-[var(--plum)]">Build your own smoothie</h3>
          <p className="mt-1 text-[12.5px] italic text-[var(--plum)]/60">
            Choose a base, a fruit, a fat, a polyphenol — we'll write your benefits.
          </p>
          <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-[var(--gold)]">Begin →</p>
        </div>
      </Link>

      {/* Recipe grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {displayed.map((r) => {
          const saved = s.savedRecipes.includes(r.id);
          return (
            <Link key={r.id} to="/recipes/$id" params={{ id: r.id }} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm" style={{ background: r.gradient }}>
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.imageAlt ?? r.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                {/* gradient scrim so text stays readable over photo */}
                <div className={`absolute inset-0 ${r.image ? "bg-gradient-to-t from-black/55 via-black/10 to-transparent" : ""}`} />
                <div className="relative flex h-full flex-col justify-end p-3 text-[var(--ivory)]">
                  {r.bonus && (
                    <span className="self-start mb-1 rounded-full bg-[var(--ivory)]/35 px-2 py-0.5 text-[8px] tracking-wider uppercase">Bonus</span>
                  )}
                  <span className="self-start rounded-full bg-[var(--ivory)]/20 px-2 py-0.5 text-[9px] tracking-wider uppercase">{r.benefitTag}</span>
                  <h3 className="mt-1.5 font-serif text-[15px] leading-tight drop-shadow-sm">{r.name}</h3>
                  <p className="mt-0.5 text-[10px] tracking-wide opacity-75">{r.prep}</p>
                </div>
              </div>
              {saved && <p className="mt-1 text-[10px] text-[var(--gold)]">Saved</p>}
            </Link>
          );
        })}
      </div>
    </Frame>
  );
}

function BagIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
