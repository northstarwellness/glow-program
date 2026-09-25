import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { Frame, TopBar } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { RECIPES } from "@/lib/content";
import { SmoothieImage } from "@/components/SmoothieImage";
import {
  CATEGORY_LABELS,
  recipeLinkSearch,
  validateLibrarySearch,
  type CategoryFilter,
  type LibrarySearch,
} from "@/lib/recipe-entry";

export const Route = createFileRoute("/recipes/")({
  // Tab and category live in the URL so returning from a recipe restores this exact view.
  validateSearch: (search: Record<string, unknown>): LibrarySearch => validateLibrarySearch(search),
  component: Recipes,
});

const core = RECIPES.filter((r) => !r.bonus && !r.quick);
const quickGlow = RECIPES.filter((r) => r.quick);

function Recipes() {
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();
  const { tab = "all", filter = "all" } = Route.useSearch();
  const setSearch = (next: LibrarySearch) =>
    navigate({ to: "/recipes", search: { tab, filter, ...next }, replace: true });

  if (hydrated && !s.name) return <Navigate to="/" />;

  // Stale ids (a recipe that no longer exists) simply do not appear; nothing is deleted.
  const savedRecipes = RECIPES.filter((r) => s.savedRecipes.includes(r.id));

  const displayRecipes = (() => {
    if (filter === "all") return core;
    if (filter === "foundation") return core.slice(0, 7);
    if (filter === "build") return core.slice(7, 14);
    if (filter === "glow") return core.slice(14, 21);
    if (filter === "bonus") return RECIPES.filter((r) => r.bonus);
    if (filter === "quick") return quickGlow;
    return core;
  })();

  return (
    <Frame>
      <TopBar name={s.name} />
      {tab === "all" ? (
        <>
          <h1 className="font-serif text-[34px] leading-tight text-[var(--charcoal)]">
            The 21 smoothies.
          </h1>
          <p className="mt-1 font-serif italic text-[15px] text-[var(--charcoal)]/55">
            Polyphenol rituals for every morning.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-serif text-[34px] leading-tight text-[var(--charcoal)]">
            Saved Recipes
          </h1>
          {savedRecipes.length > 0 && (
            <p className="mt-1 font-serif italic text-[15px] text-[var(--charcoal)]/55">
              Your favorite blends, gathered in one place.
            </p>
          )}
        </>
      )}

      {/* All Recipes / Saved */}
      <div
        role="tablist"
        aria-label="Recipe view"
        className="mt-5 flex gap-1 rounded-full border border-[var(--taupe)]/30 bg-white p-1"
      >
        {(["all", "saved"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setSearch({ tab: t })}
            className={`flex-1 rounded-full px-4 py-2.5 text-[12px] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 ${
              tab === t ? "bg-[var(--charcoal)] text-[var(--ivory)]" : "text-[var(--charcoal)]/55"
            }`}
          >
            {t === "all" ? "All Recipes" : "Saved"}
          </button>
        ))}
      </div>

      {tab === "all" && (
        <>
          {/* Phase filter pills */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(["all", "foundation", "build", "glow", "bonus", "quick"] as CategoryFilter[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setSearch({ filter: f })}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer ${
                    filter === f
                      ? "bg-[var(--charcoal)] text-[var(--ivory)]"
                      : "bg-white text-[var(--charcoal)]/55 border border-[var(--taupe)]/30"
                  }`}
                >
                  {CATEGORY_LABELS[f]}
                </button>
              ),
            )}
          </div>

          {/* Recipe grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {displayRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} from={{ kind: "library", filter }} />
            ))}
          </div>

          {filter === "bonus" && (
            <p className="mt-4 text-center font-serif italic text-[13px] text-[var(--charcoal)]/40">
              Bonus rituals — beyond the 21-day rotation.
            </p>
          )}

          {filter === "quick" && (
            <p className="mt-4 text-center font-serif italic text-[13px] text-[var(--charcoal)]/40">
              A bonus set — five-minute smoothies outside the 21-day rotation.
            </p>
          )}

          {/* Quick Glow Mornings — bonus section under the full library */}
          {filter === "all" && quickGlow.length > 0 && (
            <section id="quick-glow" className="mt-9">
              <h2 className="font-serif text-[26px] leading-tight text-[var(--charcoal)]">
                Quick Glow Mornings.
              </h2>
              <p className="mt-1 font-serif italic text-[14px] text-[var(--charcoal)]/55">
                Five minutes, start to glass.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {quickGlow.map((r) => (
                  <RecipeCard key={r.id} recipe={r} from={{ kind: "library", filter: "quick" }} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {tab === "saved" &&
        (savedRecipes.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {savedRecipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} from={{ kind: "saved" }} />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-[var(--taupe)]/25 bg-white p-6 text-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
              className="mx-auto text-[var(--gold)]"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <p className="mt-3 font-serif italic text-[15px] text-[var(--charcoal)]/60">
              Your saved rituals will appear here.
            </p>
            <p className="mt-1 text-[12.5px] text-[var(--charcoal)]/45">
              Tap Save recipe on any smoothie.
            </p>
          </div>
        ))}
    </Frame>
  );
}

/**
 * Clean card: artwork, category tag, name and prep time only.
 * No save control, icon, badge or saved marker — the saved state lives on the
 * recipe page and in the Saved view.
 */
function RecipeCard({
  recipe: r,
  from,
}: {
  recipe: (typeof RECIPES)[number];
  from: Parameters<typeof recipeLinkSearch>[0];
}) {
  return (
    <Link
      to="/recipes/$id"
      params={{ id: r.id }}
      search={recipeLinkSearch(from)}
      className="group block"
    >
      <div className="overflow-hidden rounded-2xl bg-white border border-[var(--taupe)]/20 shadow-sm transition-shadow group-hover:shadow-md">
        {/* Smoothie photo with gradient fallback */}
        <SmoothieImage recipe={r} className="h-[80px] w-full" />
        <div className="p-3.5">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[9.5px] tracking-[0.15em] uppercase font-medium"
            style={{ background: "oklch(0.205 0 0 / 0.06)", color: "var(--charcoal)" }}
          >
            {r.benefitTag}
          </span>
          <h3 className="mt-1.5 font-serif text-[15px] leading-tight text-[var(--charcoal)]">
            {r.name}
          </h3>
          <p className="mt-1 text-[11px] text-[var(--charcoal)]/40">{r.prep}</p>
        </div>
      </div>
    </Link>
  );
}
