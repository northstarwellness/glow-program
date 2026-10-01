import { INGREDIENTS, RECIPES } from "@/lib/content";

type Ingredient = (typeof INGREDIENTS)[number];

const byLongestName = [...INGREDIENTS].sort((a, b) => b.name.length - a.name.length);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const plural = (name: string) =>
  name.endsWith("y") ? `(?:${escape(name)}|${escape(name.slice(0, -1))}ies)` : `${escape(name)}s?`;
const patterns = byLongestName.map((ing) => ({
  ing,
  re: new RegExp(`(^|[^\\p{L}])${plural(ing.name)}([^\\p{L}]|$)`, "iu"),
}));

/**
 * Finds the benefit entry for a recipe ingredient line such as
 * "1/2 cup pomegranate juice" → Pomegranate. Exact names win; otherwise the
 * longest whole-word match ("Almond milk" before "Almond"). Returns null when
 * no entry applies, so no benefit content is ever attached to the wrong food.
 */
export function findIngredient(line: string): Ingredient | null {
  const exact = INGREDIENTS.find((i) => i.name.toLowerCase() === line.toLowerCase());
  if (exact) return exact;
  return patterns.find((p) => p.re.test(line))?.ing ?? null;
}

/**
 * Names of the recipes whose ingredient list uses this ingredient, in recipe order.
 * Derived from the recipes themselves, so it always matches their current names.
 */
export function recipesUsing(ingredientName: string, exceptRecipeId?: string): string[] {
  return RECIPES.filter(
    (r) =>
      r.id !== exceptRecipeId &&
      r.ingredients.some((line) => findIngredient(line)?.name === ingredientName),
  ).map((r) => r.name);
}
