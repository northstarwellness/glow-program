import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { GROCERY_LIST, RECIPES, REDS_SERVINGS_PER_BAG, DAYS } from "@/lib/content";
import { SWAPS } from "@/lib/swaps";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

describe("Simple swaps", () => {
  it.each(SWAPS.map((s) => [s.id, s] as const))(
    "%s only lists recipes that really use the ingredient",
    (_, sw) => {
      for (const id of sw.recipes) {
        const r = RECIPES.find((x) => x.id === id);
        expect(r, `${sw.id}: unknown recipe ${id}`).toBeTruthy();
        expect(
          r!.ingredients.some((i) => i.toLowerCase().includes(sw.match.toLowerCase())),
          `${id} has no "${sw.match}"`,
        ).toBe(true);
      }
    },
  );

  it("never claims nutritional equivalence and has no claim language", () => {
    const text = JSON.stringify(SWAPS);
    expect(text).not.toMatch(/equivalent|same nutrition|same benefits|just as healthy/i);
    for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT]) expect(text).not.toMatch(re);
  });

  it("the grocery screen states swaps are not a nutritional match and leave the list alone", () => {
    const src = readFileSync(resolve(__dirname, "../../src/routes/grocery.tsx"), "utf8");
    expect(src).toContain("it isn’t a nutritional match, and your list stays as it is");
  });
});

describe("Radiant Reds servings copy", () => {
  it("30 servings, one scoop a morning: 21 Reset days leave exactly 9", () => {
    expect(REDS_SERVINGS_PER_BAG).toBe(30);
    expect(DAYS).toHaveLength(21);
    expect(REDS_SERVINGS_PER_BAG - DAYS.length).toBe(9);
    const note = GROCERY_LIST.flatMap((c) => c.items).find((i) => i.id === "reds")?.note ?? "";
    expect(note).toContain(`${REDS_SERVINGS_PER_BAG} servings`);
    expect(note).toContain("9 left over");
    const src = readFileSync(resolve(__dirname, "../../src/routes/grocery.tsx"), "utf8");
    // Optional everywhere (owner rule): never framed as needed for the 21 days.
    expect(note).toMatch(/^Optional\./);
    expect(src).toContain("One jar holds 30 scoops. Every recipe is complete without it.");
    expect(src + note).not.toMatch(/covers the full 21 days/);
  });
});
