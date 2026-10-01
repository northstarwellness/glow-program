import { describe, expect, it } from "vitest";
import { RECIPES } from "../../src/lib/content";
import { recipeHeaderColors } from "../../src/lib/recipe-header";
import { contrast } from "../../src/lib/recipe-button";

describe("recipe header colors (original gradient, readable text)", () => {
  it("covers all 33 recipes", () => {
    expect(RECIPES).toHaveLength(33);
  });
  for (const r of RECIPES) {
    it(`${r.id}: keeps the original gradient and reads at 4.5:1 on every point`, () => {
      const c = recipeHeaderColors(r.gradient);
      expect(c.gradient).toBe(r.gradient);
      // The original gradient is always the bottom layer, unchanged.
      expect(c.background.endsWith(r.gradient)).toBe(true);
      // Never a neutral gray or black veil: only the recipe's own deep tone.
      if (c.veil) expect(c.veil).not.toMatch(/rgba\((\d+), \1, \1/);
      expect(Math.min(...c.samples.map((s) => contrast(c.text, s)))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.pillInk, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
    });
  }
  it("light gradients get no veil at all", () => {
    for (const r of RECIPES) {
      const c = recipeHeaderColors(r.gradient);
      if (c.mode === "ink") expect(c.background).toBe(r.gradient);
    }
  });
});

describe("saved-state Save pill stays readable on every recipe", () => {
  it("the pill ink reads at 4.5:1 or better on the pressed tint", async () => {
    const { mix } = await import("../../src/lib/recipe-button");
    for (const r of RECIPES) {
      const c = recipeHeaderColors(r.gradient);
      const tint = mix(c.stops[0], "#FFFFFF", 0.88);
      expect(contrast(c.pillInk, tint), r.id).toBeGreaterThanOrEqual(4.5);
    }
  });
});
