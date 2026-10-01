import { readCustomGrocery, sameItem, writeCustomGrocery } from "@/lib/custom-grocery";
import { createFileRoute, Link, Navigate, useParams } from "@tanstack/react-router";
import { useId, useRef, useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { RECIPES, BLEND_TIPS } from "@/lib/content";
import { OptionalReds } from "@/components/OptionalReds";
import { WhyTheseIngredients } from "@/components/WhyTheseIngredients";
import { findIngredient, recipesUsing } from "@/lib/ingredients";
import { shareOrCopy, PRODUCT_URL } from "@/lib/share";
import { ShareStatus } from "@/components/ShareStatus";
import { SaveRecipeButton } from "@/components/SaveRecipeButton";
import { dayButtonStyle, mix } from "@/lib/recipe-button";
import { recipeHeaderColors } from "@/lib/recipe-header";
import { SparkleBorder, SparkleMotionToggle } from "@/components/SparkleBorder";
import { useSparkleMotion } from "@/lib/sparkle-motion";
import { BuildYourOwn } from "@/components/BuildYourOwn";
import {
  entryDestination,
  recipeLinkSearch,
  resolveRecipeEntry,
  validateRecipeSearch,
  type RecipeSearch,
} from "@/lib/recipe-entry";

function useIngredientChecks(recipeId: string, ingredients: string[]) {
  const key = `noure_recipe_ing_${recipeId}`;
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "{}");
    } catch {
      return {};
    }
  });
  const toggle = (name: string) => {
    const next = { ...checked, [name]: !checked[name] };
    setChecked(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  const allChecked = ingredients.every((n) => !!checked[n]);
  return { checked, toggle, allChecked };
}

export const Route = createFileRoute("/recipes/$id")({
  // Closed, typed entry context — nothing caller-supplied can become a destination.
  validateSearch: (search: Record<string, unknown>): RecipeSearch => validateRecipeSearch(search),
  component: RecipeView,
});

type BlendMode = "thick" | "thin" | "pro";

/** Background of the pressed Save pill: 88% white over the recipe's own first stop. */
const savedTint = (stop: string) => mix(stop, "#FFFFFF", 0.88);

function RecipeView() {
  const { id } = useParams({ from: "/recipes/$id" });
  const search = Route.useSearch();
  const hydrated = useHydrated();
  const s = useApp();

  // Compute recipe before hooks so we can use it safely
  const r = RECIPES.find((x) => x.id === id);

  // All hooks must come before any conditional returns
  const [active, setActive] = useState<string | null>(null);
  const [blendMode, setBlendMode] = useState<BlendMode>("thick");
  const ingChecks = useIngredientChecks(r?.id ?? id, r?.ingredients ?? []);
  const [groceryAdded, setGroceryAdded] = useState<"idle" | "added" | "failed">("idle");
  const [shareMsg, setShareMsg] = useState("");
  const [shareManual, setShareManual] = useState<string | null>(null);
  const whyBase = useId();
  const [motionOn, setMotion] = useSparkleMotion();

  if (hydrated && !s.name) return <Navigate to="/" />;
  if (id === "build") return <BuildShell />;
  if (!r) return <Navigate to="/recipes" />;

  // From here r is guaranteed to exist
  const entry = resolveRecipeEntry(search, r.id);
  const back = entryDestination(entry);
  const saved = s.savedRecipes.includes(r.id);
  const related = RECIPES.filter(
    (x) => !x.bonus && x.id !== r.id && x.benefitTag === r.benefitTag,
  ).slice(0, 2);
  const addToGrocery = () => {
    const existing = readCustomGrocery();
    const newItems = r.ingredients.filter((i) => !existing.some((x) => sameItem(x, i)));
    // "Added" only once the list is really saved; otherwise say it didn't work.
    setGroceryAdded(writeCustomGrocery([...existing, ...newItems]) ? "added" : "failed");
  };
  const blendTip = BLEND_TIPS[r.id];
  const hc = recipeHeaderColors(r.gradient);

  const share = () => {
    setShareMsg("");
    setShareManual(null);
    // Called straight from the tap so iOS keeps the user gesture for the share sheet.
    shareOrCopy({
      title: r.name,
      text: `${r.name}. ${r.benefit}`,
      url: PRODUCT_URL,
    }).then((res) => {
      if (res.status === "copied") setShareMsg("Link copied");
      else if (res.status === "manual") {
        setShareMsg("Couldn't copy automatically. Select the text below to copy it.");
        setShareManual(res.text);
      }
    });
  };

  const blendContent: Record<BlendMode, string> = blendTip
    ? { thick: blendTip.thick, thin: blendTip.thin, pro: blendTip.pro }
    : {
        thick: "Add more yogurt or frozen banana for extra body.",
        thin: "Add more liquid and strain for a lighter texture.",
        pro: "Blend longer for a silkier finish.",
      };

  return (
    <Frame>
      <TopBar name={s.name} />
      {/* Back control names its destination and is derived from the validated entry context. */}
      {back.to === "/day/$n" ? (
        <Link
          to="/day/$n"
          params={back.params}
          hash={back.hash}
          className="inline-flex min-h-11 items-center text-[12px] text-[var(--ink-2)]"
        >
          ← {entry.backLabel}
        </Link>
      ) : (
        <Link
          to="/recipes"
          search={back.search}
          className="inline-flex min-h-11 items-center text-[12px] text-[var(--ink-2)]"
        >
          ← {entry.backLabel}
        </Link>
      )}
      {entry.kind === "day" && (
        <p className="mt-1 label-caps text-[var(--cranberry)]">{entry.eyebrow}</p>
      )}

      {/* Header: the recipe's ORIGINAL gradient fills the whole card, through the title and the
          actions, inside a fine sparkle border in the same palette. Text is the recipe's own deep
          ink on light gradients, or ivory on dark ones (with a veil of the recipe's own deep tone
          only where the gradient is too light for it). */}
      <header
        className="relative mt-3 overflow-hidden rounded-3xl"
        data-testid="recipe-header"
        data-gradient={r.gradient}
        data-text-mode={hc.mode}
        data-text-samples={hc.samples.join(" ")}
        style={
          {
            background: hc.background,
            "--recipe-ink": hc.pillInk,
            "--recipe-edge": hc.line[1],
            // Saved-state pill: a pale wash of the recipe's first color, so its ink stays readable.
            "--recipe-tint": savedTint(hc.stops[0]),
            boxShadow: "0 1px 2px rgba(42,30,34,0.08), 0 16px 32px -22px rgba(42,30,34,0.5)",
          } as React.CSSProperties
        }
      >
        <SparkleBorder line={hc.line} spark={hc.spark} glow={hc.glow} motion={motionOn} />
        <div className="relative px-6 pt-5 pb-5">
          <div className="flex items-start justify-between gap-2">
            <p
              className="pt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: hc.text }}
            >
              Recipe · {r.prep} · Serves {r.servings} ·{" "}
              <span data-testid="recipe-tag">{r.benefitTag}</span>
            </p>
            <SparkleMotionToggle on={motionOn} onChange={setMotion} color={hc.text} />
          </div>
          <h1
            className="mt-0.5 font-serif text-[31px] leading-[1.1] [text-wrap:balance]"
            style={{ color: hc.text }}
          >
            {r.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <SaveRecipeButton
              recipeId={r.id}
              tone="ink"
              className="recipe-action"
              onResult={(m) => {
                setShareManual(null);
                setShareMsg(m);
              }}
            />
            <button type="button" onClick={share} className="recipe-action">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </header>
      {(shareMsg || shareManual) && (
        <ShareStatus message={shareMsg} manualText={shareManual} className="pt-3" />
      )}

      {/* The glass itself: a plain description of taste and texture */}
      <p
        className="mt-5 font-serif text-[18px] leading-relaxed text-[var(--plum)]/85"
        data-testid="recipe-description"
      >
        {r.benefit}
      </p>

      {/* Ingredients — checkable */}
      <section className="mt-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-serif text-[22px] text-[var(--plum)]">Ingredients</h3>
          <p className="text-[11px] italic text-[var(--ink-2)]">Tap to check off</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[var(--plum)]/8 bg-white divide-y divide-[var(--plum)]/5">
          {r.ingredients.map((name, idx) => {
            const info = findIngredient(name);
            const open = active === name && !!info;
            const panelId = `${whyBase}-why-${idx}`;
            return (
              <div key={name}>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => ingChecks.toggle(name)}
                    className={`flex flex-1 items-center gap-4 px-5 py-3.5 text-left transition-all cursor-pointer hover:bg-[var(--sand)]/30 ${
                      ingChecks.checked[name] ? "opacity-50" : ""
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                        ingChecks.checked[name]
                          ? "border-[var(--gold)] bg-[var(--gold)]"
                          : "border-[var(--plum)]/20"
                      }`}
                    >
                      {ingChecks.checked[name] && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`font-serif text-[16px] ${ingChecks.checked[name] ? "line-through text-[var(--ink-2)]" : "text-[var(--plum)]"}`}
                    >
                      {name}
                    </span>
                  </button>
                  {info && (
                    <button
                      type="button"
                      onClick={() => setActive(open ? null : name)}
                      aria-expanded={open}
                      aria-controls={panelId}
                      aria-label={`Why ${info.name}`}
                      className={`mr-1 flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-3 text-[11px] tracking-wide transition-colors cursor-pointer hover:text-[var(--cranberry)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 ${
                        open ? "text-[var(--cranberry)]" : "text-[var(--ink-2)]"
                      }`}
                    >
                      Why
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        aria-hidden="true"
                        className={`transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>
                  )}
                </div>
                {open && info && <WhyCard id={panelId} ing={info} recipeId={r.id} />}
              </div>
            );
          })}
        </div>
        {ingChecks.allChecked && (
          <p className="mt-2 font-serif italic text-[13px] text-[var(--cranberry)]">
            All gathered. Ready to blend.
          </p>
        )}
        <button
          type="button"
          onClick={addToGrocery}
          className={`mt-3 w-full rounded-full border py-3 font-serif text-[14px] transition-all cursor-pointer ${
            groceryAdded === "added"
              ? "border-[var(--gold)]/40 text-[var(--cranberry)]"
              : "border-[var(--plum)]/15 text-[var(--plum)]"
          }`}
        >
          {groceryAdded === "added" ? "Added to grocery list ✓" : "Add ingredients to grocery list"}
        </button>
        {groceryAdded === "failed" && (
          <p role="alert" className="mt-2 font-serif italic text-[12.5px] text-[var(--berry)]">
            Couldn’t save to your grocery list on this device. Please try again.
          </p>
        )}
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

      {/* How to blend it: texture options, after the method */}
      <div className="mt-6 glass-card overflow-hidden">
        <div className="p-5 pb-4">
          <p className="label-caps text-[var(--ink-2)] mb-3">How to blend it</p>
          <div className="flex gap-2">
            {(["thick", "thin", "pro"] as BlendMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setBlendMode(m)}
                className={`flex-1 rounded-full py-2.5 text-[12px] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer ${
                  blendMode === m
                    ? "bg-[var(--cranberry)] text-white"
                    : "bg-[var(--sand)] text-[var(--ink-2)] hover:bg-[var(--sand-deep)]"
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-[var(--cranberry)]"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="label-caps text-[var(--cranberry)]">Pro tip</span>
            </div>
          )}
          <p className="text-[14px] leading-relaxed text-[var(--plum)]/80">
            {blendContent[blendMode]}
          </p>
        </div>
      </div>

      {/* Why these ingredients: sourced, recipe-specific, closed by default */}
      <WhyTheseIngredients recipeId={r.id} />

      {/* Optional addition, after the recipe. Every recipe is complete without it. */}
      <OptionalReds recipeId={r.id} className="mt-4" />

      {/* Guided journey: the one primary action at the end of the method. */}
      {entry.kind === "day" && back.to === "/day/$n" && (
        <Link
          to="/day/$n"
          params={back.params}
          hash={back.hash}
          className="btn-day mt-6"
          style={dayButtonStyle(r.gradient) as React.CSSProperties}
        >
          {entry.continueLabel} →
        </Link>
      )}

      {/* Related recipes */}
      {related.length > 0 && (
        <section className="mt-6">
          <p className="label-caps text-[var(--ink-2)] mb-3">More like this</p>
          <div className="grid grid-cols-2 gap-3">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to="/recipes/$id"
                params={{ id: rel.id }}
                search={
                  entry.kind === "category"
                    ? recipeLinkSearch({ kind: "library", filter: entry.filter })
                    : entry.kind === "saved"
                      ? recipeLinkSearch({ kind: "saved" })
                      : recipeLinkSearch({ kind: "library", filter: "all" })
                }
                className="block"
              >
                <div className="overflow-hidden rounded-2xl bg-white border border-[var(--plum)]/8 shadow-sm">
                  <div className="h-16 w-full" style={{ background: rel.gradient }} />
                  <div className="p-3">
                    <p className="font-serif text-[14px] leading-tight text-[var(--plum)]">
                      {rel.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--ink-2)]">{rel.prep}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <GoldDivider />
    </Frame>
  );
}

type IngredientInfo = NonNullable<ReturnType<typeof findIngredient>>;

/** Inline benefit card under the selected ingredient — no overlay, page stays put. */
function WhyCard({ id, ing, recipeId }: { id: string; ing: IngredientInfo; recipeId: string }) {
  const alsoIn = recipesUsing(ing.name, recipeId);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      id={id}
      ref={(el) => {
        // Only nudge the page if the card would sit under the fixed bottom nav.
        if (el && !ref.current) {
          const nav = document.querySelector<HTMLElement>("nav.fixed");
          el.style.scrollMarginBottom = `${(nav?.offsetHeight ?? 0) + 12}px`;
          requestAnimationFrame(() => el.scrollIntoView({ block: "nearest", behavior: "smooth" }));
        }
        ref.current = el;
      }}
      role="region"
      aria-label={`Why ${ing.name}`}
      className="why-reveal px-4 pb-4"
    >
      <div
        className="rounded-2xl border px-4 py-4 shadow-[0_1px_2px_oklch(0.30_0.05_350/0.06)]"
        style={{ background: "oklch(0.985 0.010 70)", borderColor: "oklch(0.720 0.082 65 / 0.28)" }}
      >
        <p className="font-serif italic text-[13.5px] leading-snug text-[var(--plum)]/70">
          {ing.tagline}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--plum)]/85">
          {ing.description}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[var(--blush)]/60 px-3 py-2.5">
            <p className="label-caps text-[var(--berry)]/75">In the glass</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--plum)]/85">{ing.skin}</p>
          </div>
          <div className="rounded-xl bg-[var(--gold)]/10 px-3 py-2.5">
            <p className="label-caps text-[var(--cranberry)]">Nutrition note</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--plum)]/85">{ing.gut}</p>
          </div>
        </div>
        {alsoIn.length > 0 && (
          <p className="mt-3 text-[11.5px] text-[var(--ink-2)]">Also in: {alsoIn.join(", ")}</p>
        )}
      </div>
    </div>
  );
}

function BuildShell() {
  const s = useApp();
  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/recipes" className="text-[12px] text-[var(--ink-2)]">
        ← Recipes
      </Link>
      <p className="mt-3 label-caps text-[var(--cranberry)]">Custom ritual</p>
      <h1 className="mt-1 font-serif text-[32px] leading-tight text-[var(--plum)]">
        Compose your morning glass.
      </h1>
      <p className="mt-1 font-serif italic text-[14.5px] text-[var(--ink-2)]">
        Choose your layers, and we'll tell you what each one brings.
      </p>
      <BuildYourOwn />
    </Frame>
  );
}
