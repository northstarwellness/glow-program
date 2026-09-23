import { DAYS, RECIPES } from "@/lib/content";

/**
 * How a recipe page was entered. This is the single source of truth for recipe
 * navigation: links are built here, context is validated here, and the Back /
 * Continue labels and destinations are derived here.
 *
 * Only these closed values are accepted — no caller-supplied return URL exists,
 * so an external or arbitrary destination can never be injected.
 */
export const RECIPE_SOURCES = ["day", "all", "saved", "category"] as const;
export type RecipeSource = (typeof RECIPE_SOURCES)[number];

export const CATEGORY_FILTERS = ["all", "foundation", "build", "glow", "bonus", "quick"] as const;
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: "All",
  foundation: "Foundation",
  build: "Build",
  glow: "Glow",
  bonus: "Bonus",
  quick: "Quick Glow",
};

/** Search params carried on /recipes/$id. */
export type RecipeSearch = { source?: RecipeSource; day?: number; filter?: CategoryFilter };

/** Search params carried on /recipes (the library list). */
export type LibrarySearch = { tab?: "all" | "saved"; filter?: CategoryFilter };

export const PROGRAM_DAYS = 21;
const isDay = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= PROGRAM_DAYS;
const isCategory = (v: unknown): v is CategoryFilter =>
  typeof v === "string" && (CATEGORY_FILTERS as readonly string[]).includes(v);

/** The canonical recipe assigned to a program day (1–21). */
export const recipeIdForDay = (day: number): string | null =>
  isDay(day) ? (DAYS[day - 1]?.recipeId ?? null) : null;

/** Validates raw URL search values into a known entry context. */
export function validateRecipeSearch(search: Record<string, unknown>): RecipeSearch {
  const source = RECIPE_SOURCES.find((s) => s === search.source);
  if (!source) return {};
  if (source === "day") {
    const day = Number(search.day);
    return isDay(day) ? { source, day } : {};
  }
  if (source === "category") {
    return isCategory(search.filter) ? { source, filter: search.filter } : {};
  }
  return { source };
}

export function validateLibrarySearch(search: Record<string, unknown>): LibrarySearch {
  const out: LibrarySearch = {};
  if (search.tab === "saved" || search.tab === "all") out.tab = search.tab;
  if (isCategory(search.filter)) out.filter = search.filter;
  return out;
}

export type RecipeEntry =
  | { kind: "day"; day: number; backLabel: string; continueLabel: string; eyebrow: string }
  | { kind: "all"; backLabel: string }
  | { kind: "saved"; backLabel: string }
  | { kind: "category"; filter: CategoryFilter; backLabel: string };

/**
 * Resolves the entry context for a recipe page.
 * Guided context is accepted only when the day's canonical recipe matches the
 * recipe being viewed; anything missing, invalid or mismatched safely falls back
 * to the independent recipe library.
 */
export function resolveRecipeEntry(search: RecipeSearch, recipeId: string): RecipeEntry {
  const known = RECIPES.some((r) => r.id === recipeId);
  if (
    search.source === "day" &&
    isDay(search.day) &&
    known &&
    recipeIdForDay(search.day) === recipeId
  ) {
    return {
      kind: "day",
      day: search.day,
      backLabel: `Back to Day ${search.day}`,
      continueLabel: `Continue Day ${search.day}`,
      eyebrow: `Day ${search.day} recipe`,
    };
  }
  if (search.source === "saved") return { kind: "saved", backLabel: "Back to Saved Recipes" };
  if (search.source === "category" && search.filter && search.filter !== "all") {
    return {
      kind: "category",
      filter: search.filter,
      backLabel: `Back to ${CATEGORY_LABELS[search.filter]}`,
    };
  }
  return { kind: "all", backLabel: "Back to All Recipes" };
}

/** Anchor on the day page that the guided journey returns to. */
export const COMPLETION_ANCHOR = "complete";

/** Where the Back / Continue controls lead, derived from validated context only. */
export function entryDestination(
  entry: RecipeEntry,
):
  | { to: "/day/$n"; params: { n: string }; hash: string }
  | { to: "/recipes"; search: LibrarySearch } {
  if (entry.kind === "day") {
    return { to: "/day/$n", params: { n: String(entry.day) }, hash: COMPLETION_ANCHOR };
  }
  if (entry.kind === "saved") return { to: "/recipes", search: { tab: "saved" } };
  if (entry.kind === "category") return { to: "/recipes", search: { filter: entry.filter } };
  return { to: "/recipes", search: {} };
}

/** Builds the search params for a link into a recipe from a known place. */
export function recipeLinkSearch(
  from:
    | { kind: "day"; day: number }
    | { kind: "saved" }
    | { kind: "library"; filter: CategoryFilter },
): RecipeSearch {
  if (from.kind === "day") return { source: "day", day: from.day };
  if (from.kind === "saved") return { source: "saved" };
  return from.filter === "all" ? { source: "all" } : { source: "category", filter: from.filter };
}
