import { describe, expect, it } from "vitest";
import { findIngredient } from "@/lib/ingredients";
import { RECIPES } from "@/lib/content";

describe("findIngredient", () => {
  it.each([
    ["Pomegranate", "Pomegranate"],
    ["1/2 cup pomegranate juice", "Pomegranate"],
    ["3/4 cup almond milk", "Almond milk"],
    ["Almond butter", "Almond"],
    ["1 cup frozen strawberries", "Strawberry"],
    ["1 scoop Radiant Reds (Glow Boost)", "Radiant Reds"],
  ])("%s → %s", (line, name) => expect(findIngredient(line)?.name).toBe(name));

  it.each([
    "1 cup frozen cherries",
    "1/2 cup Greek yogurt",
    "1 cup frozen mixed berries",
    "1/2 cup ice",
    "Lemongrass",
    "Plump dates",
  ])("does not attach benefits to %s", (line) => expect(findIngredient(line)).toBeNull());

  it("every recipe line either maps to an entry or has no Why control", () => {
    for (const r of RECIPES)
      for (const line of r.ingredients) {
        const hit = findIngredient(line);
        if (hit) expect(line.toLowerCase()).toContain(hit.name.toLowerCase().replace(/y$/, ""));
      }
  });
});
