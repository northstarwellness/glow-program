import { createFileRoute, Link, Navigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { INGREDIENTS, RECIPES, REDS_URL, BLEND_TIPS, GLOW_BOOST_STORIES } from "@/lib/content";
import { BuildYourOwn } from "@/components/BuildYourOwn";
import { SmoothieImage } from "@/components/SmoothieImage";

function useIngredientChecks(recipeId: string, ingredients: string[]) {
  const key = `noure_recipe_ing_${recipeId}`;
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? "{}"); }
    catch { return {}; }
  });
  const toggle = (name: string) => {
    const next = { ...checked, [name]: !checked[name] };
    setChecked(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  const allChecked = ingredients.every((n) => !!checked[n]);
  return { checked, toggle, allChecked };
}

export const Route = createFileRoute("/recipes/$id")({ component: RecipeView });

type BlendMode = "thick" | "thin" | "pro";

function RecipeView() {
  const { id } = useParams({ from: "/recipes/$id" });
  const hydrated = useHydrated();
  const s = useApp();

  // Compute recipe before hooks so we can use it safely
  const r = RECIPES.find((x) => x.id === id);

  // All hooks must come before any conditional returns
  const [active, setActive] = useState<string | null>(null);
  const [blendMode, setBlendMode] = useState<BlendMode>("thick");
  const ingChecks = useIngredientChecks(r?.id ?? id, r?.ingredients ?? []);
  const [groceryAdded, setGroceryAdded] = useState(false);

  if (hydrated && !s.name) return <Navigate to="/" />;
  if (id === "build") return <BuildShell />;
  if (!r) return <Navigate to="/recipes" />;

  // From here r is guaranteed to exist
  const saved = s.savedRecipes.includes(r.id);
  const ing = active ? INGREDIENTS.find((i) => i.name.toLowerCase() === active.toLowerCase()) : null;
  const related = RECIPES.filter((x) => !x.bonus && x.id !== r.id && x.benefitTag === r.benefitTag).slice(0, 2);
  const addToGrocery = () => {
    const key = "noure_grocery_custom";
    try {
      const existing: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      const newItems = r.ingredients.filter((i) => !existing.includes(i));
      localStorage.setItem(key, JSON.stringify([...existing, ...newItems]));
      setGroceryAdded(true);
    } catch { /* silent */ }
  };
  const blendTip = BLEND_TIPS[r.id];
  const glowStory = GLOW_BOOST_STORIES[r.id];

  const share = () => {
    const text = `${r.name} — ${r.benefitTag}. ${r.benefit}`;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  };

  const blendContent: Record<BlendMode, string> = blendTip
    ? { thick: blendTip.thick, thin: blendTip.thin, pro: blendTip.pro }
    : { thick: "Add more yogurt or frozen banana for extra body.", thin: "Add more liquid and strain for a lighter texture.", pro: "Blend longer for a silkier finish." };

  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/recipes" className="text-[12px] text-[var(--plum)]/50">← Recipes</Link>

      {/* Hero — smoothie photo with gradient overlay */}
      <div
        className="relative mt-3 overflow-hidden rounded-3xl text-[var(--ivory)] shadow-xl"
        style={{ minHeight: "220px" }}
      >
        <SmoothieImage
          recipe={r}
          className="absolute inset-0 h-full w-full"
          style={{ minHeight: "220px" }}
        />
        {/* Gradient overlay — top dark for legibility, bottom fade */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)" }}
        />
        <div className="relative px-7 pb-0 pt-7">
        <p className="label-caps text-[var(--ivory)]/70">Recipe · {r.prep} · Serves {r.servings}</p>
        <h1 className="mt-2 font-serif text-[34px] leading-[1.1] drop-shadow-sm">{r.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>{r.benefitTag}</Pill>
          {saved && <Pill>Saved</Pill>}
        </div>
        <div className="mt-6 h-1 w-full bg-[var(--ivory)]/15" />
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => s.toggleSavedRecipe(r.id)}
            className="flex items-center gap-2 text-[var(--ivory)]/80 text-[13px] font-medium cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            {saved ? "Saved" : "Save recipe"}
          </button>
          <button
            onClick={share}
            className="flex items-center gap-2 text-[var(--ivory)]/80 text-[13px] font-medium cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
            </svg>
            Share
          </button>
        </div>
        </div>{/* end relative content */}
      </div>{/* end hero */}

      {/* Glow benefit */}
      <div className="mt-4 glass-card p-5">
        <p className="label-caps text-[var(--gold)] mb-2">Glow benefit</p>
        <p className="text-[14px] leading-relaxed text-[var(--plum)]/80">{r.benefit}</p>
      </div>

      {/* RADIANT REDS GLOW BOOST — premium, personalized */}
      <div
        className="mt-5 overflow-hidden rounded-3xl text-[var(--ivory)]"
        style={{ background: "linear-gradient(145deg, #5C2541 0%, #7B2D4E 60%, #9B1B3A 100%)" }}
      >
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            <p className="label-caps text-[var(--gold)]">Radiant Reds Glow Boost</p>
          </div>
          {glowStory ? (
            <>
              <h3 className="font-serif text-[22px] leading-tight text-[var(--ivory)]">
                {glowStory.headline}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--ivory)]/80">
                {glowStory.skinStory}
              </p>
              <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="label-caps text-[var(--gold)]/80 mb-1.5">How to add it</p>
                <p className="text-[13px] leading-relaxed text-[var(--ivory)]/85">{glowStory.moment}</p>
              </div>
            </>
          ) : (
            <p className="mt-2 font-serif italic text-[15px] leading-relaxed text-[var(--ivory)]/80">
              {r.redsBoost.why}
            </p>
          )}
        </div>

        <div className="px-6 pb-3">
          <div className="grid grid-cols-1 gap-2">
            {r.redsBoost.proof.map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl bg-white/8 px-3.5 py-2.5">
                <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gold)]" />
                <span className="text-[12.5px] leading-relaxed text-[var(--ivory)]/80">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <a
          href={REDS_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between border-t border-white/15 px-6 py-4"
        >
          <div>
            <p className="font-serif text-[15px] tracking-wide text-[var(--gold)]">Shop Radiant Reds</p>
            <p className="font-serif italic text-[12px] text-[var(--ivory)]/55 mt-0.5">The blend behind every morning</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--gold)]/60">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      {/* HOW TO BLEND IT — new section */}
      <div className="mt-5 glass-card overflow-hidden">
        <div className="p-5 pb-4">
          <p className="label-caps text-[var(--plum)]/45 mb-3">How to blend it</p>
          <div className="flex gap-2">
            {(["thick", "thin", "pro"] as BlendMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setBlendMode(m)}
                className={`flex-1 rounded-full py-2.5 text-[12px] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer ${
                  blendMode === m
                    ? "bg-[var(--plum)] text-[var(--ivory)]"
                    : "bg-[var(--plum)]/8 text-[var(--plum)]/60 hover:bg-[var(--plum)]/15"
                }`}
              >
                {m === "pro" ? "Pro tip" : `Make it ${m}`}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--gold)]/15 px-5 py-4">
          {blendMode === "pro" && (
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--gold)]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="label-caps text-[var(--gold)]">Pro tip</span>
            </div>
          )}
          <p className="text-[14px] leading-relaxed text-[var(--plum)]/80">
            {blendContent[blendMode]}
          </p>
        </div>
      </div>

      {/* Ingredients — checkable */}
      <section className="mt-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-serif text-[22px] text-[var(--plum)]">Ingredients</h3>
          <p className="text-[11px] italic text-[var(--plum)]/40">Tap to check off</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[var(--plum)]/8 bg-white divide-y divide-[var(--plum)]/5">
          {r.ingredients.map((name) => (
            <div key={name} className="flex items-center">
              <button
                onClick={() => ingChecks.toggle(name)}
                className={`flex flex-1 items-center gap-4 px-5 py-3.5 text-left transition-all cursor-pointer hover:bg-[var(--sand)]/30 ${
                  ingChecks.checked[name] ? "opacity-50" : ""
                }`}
              >
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                  ingChecks.checked[name]
                    ? "border-[var(--gold)] bg-[var(--gold)]"
                    : "border-[var(--plum)]/20"
                }`}>
                  {ingChecks.checked[name] && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </span>
                <span className={`font-serif text-[16px] ${ingChecks.checked[name] ? "line-through text-[var(--plum)]/35" : "text-[var(--plum)]"}`}>
                  {name}
                </span>
              </button>
              <button
                onClick={() => setActive(name)}
                className="px-4 py-3.5 text-[11px] tracking-wide text-[var(--plum)]/30 hover:text-[var(--gold)] transition-colors cursor-pointer"
              >
                Why →
              </button>
            </div>
          ))}
        </div>
        {ingChecks.allChecked && (
          <p className="mt-2 font-serif italic text-[13px] text-[var(--gold)]">All gathered. Ready to blend.</p>
        )}
        <button
          onClick={addToGrocery}
          className={`mt-3 w-full rounded-full border py-3 font-serif text-[14px] transition-all cursor-pointer ${
            groceryAdded
              ? "border-[var(--gold)]/40 text-[var(--gold)]"
              : "border-[var(--plum)]/15 text-[var(--plum)]"
          }`}
        >
          {groceryAdded ? "Added to grocery list ✓" : "Add ingredients to grocery list"}
        </button>
      </section>

      {/* Method */}
      <section className="mt-6">
        <h3 className="font-serif text-[22px] text-[var(--plum)] mb-3">Method</h3>
        <ol className="space-y-2.5">
          {r.method.map((m, i) => (
            <li key={i} className="flex gap-4 glass-card p-4">
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-serif text-[18px] leading-none text-[var(--ivory)]"
                style={{ background: r.gradient }}
              >
                {i + 1}
              </span>
              <span className="text-[14px] leading-relaxed text-[var(--plum)]/85 pt-1">{m}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Related recipes */}
      {related.length > 0 && (
        <section className="mt-6">
          <p className="label-caps text-[var(--plum)]/45 mb-3">More {r.benefitTag} rituals</p>
          <div className="grid grid-cols-2 gap-3">
            {related.map((rel) => (
              <Link key={rel.id} to="/recipes/$id" params={{ id: rel.id }} className="block">
                <div className="overflow-hidden rounded-2xl bg-white border border-[var(--plum)]/8 shadow-sm">
                  <div className="h-16 w-full" style={{ background: rel.gradient }} />
                  <div className="p-3">
                    <p className="font-serif text-[14px] leading-tight text-[var(--plum)]">{rel.name}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--plum)]/45">{rel.prep}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <GoldDivider />

      {/* Ingredient info sheet */}
      {ing && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/40 slide-up" onClick={() => setActive(null)}>
          <div
            className="mx-auto w-full max-w-[440px] rounded-t-3xl p-6 shadow-2xl"
            style={{ background: "oklch(0.985 0.010 70)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[var(--plum)]/15" />
            <p className="label-caps text-[var(--gold)]">Ingredient</p>
            <h2 className="mt-1 font-serif text-[28px] text-[var(--plum)]">{ing.name}</h2>
            <p className="font-serif italic text-[14px] text-[var(--plum)]/55">{ing.tagline}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--plum)]/80">{ing.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="blush-card p-3">
                <p className="label-caps text-[var(--berry)]/70">Skin</p>
                <p className="mt-1 text-[12.5px] text-[var(--plum)]/80">{ing.skin}</p>
              </div>
              <div className="gold-glow-card p-3">
                <p className="label-caps text-[var(--gold)]">Gut</p>
                <p className="mt-1 text-[12.5px] text-[var(--plum)]/80">{ing.gut}</p>
              </div>
            </div>
            <p className="mt-4 text-[12px] text-[var(--plum)]/45">Also in: {ing.alsoIn.join(", ")}</p>
            <button onClick={() => setActive(null)} className="gold-pill-btn mt-5 w-full">Back to recipe</button>
          </div>
        </div>
      )}
    </Frame>
  );
}

function BuildShell() {
  const s = useApp();
  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/recipes" className="text-[12px] text-[var(--plum)]/50">← Recipes</Link>
      <p className="mt-3 label-caps text-[var(--gold)]">Custom ritual</p>
      <h1 className="mt-1 font-serif text-[32px] leading-tight text-[var(--plum)]">Compose your morning glass.</h1>
      <p className="mt-1 font-serif italic text-[14.5px] text-[var(--plum)]/55">
        Choose your layers — we'll write the benefits.
      </p>
      <BuildYourOwn />
    </Frame>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--ivory)]/20 px-3 py-1 text-[11px] tracking-wide text-[var(--ivory)]">
      {children}
    </span>
  );
}
