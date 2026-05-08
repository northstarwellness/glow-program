import { createFileRoute, Link, Navigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { INGREDIENTS, RECIPES } from "@/lib/content";

export const Route = createFileRoute("/recipes/$id")({ component: RecipeView });

function RecipeView() {
  const { id } = useParams({ from: "/recipes/$id" });
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return <Navigate to="/recipes" />;
  const saved = s.savedRecipes.includes(r.id);
  const [active, setActive] = useState<string | null>(null);
  const ing = active ? INGREDIENTS.find((i) => i.name.toLowerCase() === active.toLowerCase()) : null;

  const share = () => {
    const text = `${r.name} — ${r.benefitTag}. ${r.benefit}`;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  };

  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/recipes" className="text-[12px] text-[var(--plum)]/60">← Recipes</Link>

      <div className="mt-3 overflow-hidden rounded-3xl p-7 text-[var(--ivory)] shadow-lg" style={{ background: r.gradient }}>
        <p className="label-caps text-[var(--ivory)]/70">Recipe</p>
        <h1 className="mt-2 font-serif text-[32px] leading-tight">{r.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>{r.prep}</Pill><Pill>Serves {r.servings}</Pill><Pill>{r.benefitTag}</Pill>
        </div>
      </div>

      <div className="sand-card mt-5 p-5">
        <p className="label-caps text-[var(--gold)]">Glow benefit</p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--plum)]/85">{r.benefit}</p>
      </div>

      <section className="mt-6">
        <h3 className="font-serif text-[22px] text-[var(--plum)]">Ingredients</h3>
        <p className="text-[12px] text-[var(--plum)]/55">Tap any ingredient to learn what it does.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {r.ingredients.map((name) => (
            <button key={name} onClick={() => setActive(name)}
              className="rounded-full border border-[var(--plum)]/15 bg-[var(--card)] px-3.5 py-1.5 text-[13px] text-[var(--plum)] transition hover:border-[var(--gold)]">
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-serif text-[22px] text-[var(--plum)]">Method</h3>
        <ol className="mt-3 space-y-2.5">
          {r.method.map((m, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-[var(--card)] p-3 shadow-sm">
              <span className="font-serif text-[20px] leading-none text-[var(--gold)]">{i + 1}</span>
              <span className="text-[14px] text-[var(--plum)]/85">{m}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-6 flex gap-3">
        <button onClick={() => s.toggleSavedRecipe(r.id)}
          className={`flex-1 rounded-full border px-4 py-3 font-serif text-[15px] ${
            saved ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]" : "border-[var(--plum)]/20 text-[var(--plum)]"
          }`}>
          {saved ? "♥ Saved" : "♡ Save recipe"}
        </button>
        <button onClick={share} className="rounded-full border border-[var(--plum)]/20 px-4 py-3 font-serif text-[15px] text-[var(--plum)]">
          Share
        </button>
      </div>

      {ing && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/30 slide-up" onClick={() => setActive(null)}>
          <div className="mx-auto w-full max-w-[440px] rounded-t-3xl bg-[var(--ivory)] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[var(--plum)]/15" />
            <p className="label-caps text-[var(--gold)]">Ingredient</p>
            <h2 className="mt-1 font-serif text-[26px] text-[var(--plum)]">{ing.name}</h2>
            <p className="font-serif italic text-[14px] text-[var(--plum)]/60">{ing.tagline}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--plum)]/85">{ing.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="sand-card p-3">
                <p className="label-caps text-[var(--gold)]">Gut</p>
                <p className="mt-1 text-[12.5px] text-[var(--plum)]/85">{ing.gut}</p>
              </div>
              <div className="sand-card p-3">
                <p className="label-caps text-[var(--gold)]">Skin</p>
                <p className="mt-1 text-[12.5px] text-[var(--plum)]/85">{ing.skin}</p>
              </div>
            </div>
            <p className="mt-4 text-[12px] text-[var(--plum)]/60">Also in: {ing.alsoIn.join(", ")}</p>
            <button onClick={() => setActive(null)} className="gold-pill-btn mt-5 w-full">Back to recipe</button>
          </div>
        </div>
      )}
    </Frame>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[var(--ivory)]/20 px-3 py-1 text-[11px] tracking-wide">{children}</span>;
}
