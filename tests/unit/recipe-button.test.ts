import { describe, expect, it } from "vitest";
import { DAYS, RECIPES } from "@/lib/content";
import {
  CHARCOAL,
  IVORY,
  contrast,
  dayButtonColors,
  gradientStops,
  mix,
  washSamples,
} from "@/lib/recipe-button";

const worstInk = (g: string) => {
  const c = dayButtonColors(g);
  return Math.min(...washSamples(c.washStops).map((s) => contrast(c.ink, s)));
};

describe("day/recipe button colors", () => {
  it.each(RECIPES.map((r) => [r.id, r] as const))(
    "%s: label reads at WCAG AA (4.5:1) across the whole wash",
    (_, r) => {
      expect(worstInk(r.gradient)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("the wash is each recipe's own colors, lightened toward ivory (not a new palette)", () => {
    for (const r of RECIPES) {
      const c = dayButtonColors(r.gradient);
      const src = gradientStops(r.gradient);
      expect(c.washStops).toHaveLength(src.length);
      // Each wash stop sits on the line from the recipe's own stop to ivory (same hue family).
      c.washStops.forEach((w, i) => {
        const hit = Array.from({ length: 81 }, (_, k) => mix(src[i], IVORY, k / 100)).includes(w);
        expect(hit, `${r.id} stop ${i}`).toBe(true);
      });
      // Still a visible tint, never plain ivory.
      expect(Math.max(...c.washStops.map((w) => contrast(w, IVORY)))).toBeGreaterThanOrEqual(1.18);
      // Light: every wash stop is closer to ivory than to charcoal.
      for (const s of c.washStops)
        expect(contrast(s, CHARCOAL)).toBeGreaterThan(contrast(s, IVORY));
    }
  });

  it("Day 1 feels like Pomegranate and Day 6 like Fig & Almond", () => {
    const byDay = (d: number) => RECIPES.find((r) => r.id === DAYS[d - 1].recipeId)!;
    expect(byDay(1).id).toBe("pomegranate-elixir");
    expect(byDay(6).id).toBe("fig-almond");
    const pom = dayButtonColors(byDay(1).gradient);
    const fig = dayButtonColors(byDay(6).gradient);
    expect(pom.washStops).not.toEqual(fig.washStops);
    expect(pom.shadow).toBe("#7B2D4E"); // pomegranate's plum
    expect(fig.shadow).toBe("#C49A6C"); // fig's warm gold-brown
  });

  it("recipe color blocks themselves are never changed", () => {
    const before = RECIPES.map((r) => r.gradient);
    RECIPES.forEach((r) => dayButtonColors(r.gradient));
    expect(RECIPES.map((r) => r.gradient)).toEqual(before);
  });

  it("reports the worst-case label contrast per recipe", () => {
    const rows = RECIPES.map((r) => `${r.id} ${worstInk(r.gradient).toFixed(2)}`);
    console.log("INK_CONTRAST " + rows.join(" | "));
    expect(rows).toHaveLength(RECIPES.length);
  });
});

describe("pearl general button", () => {
  it("dark text reads on both pearl stops", () => {
    for (const s of ["#FFFFFF", "#F7F3EE"]) expect(contrast(CHARCOAL, s)).toBeGreaterThan(12);
  });
});
