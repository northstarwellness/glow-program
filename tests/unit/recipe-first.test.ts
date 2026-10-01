import { describe, expect, it } from "vitest";
import { RECIPES, BLEND_TIPS } from "@/lib/content";
import { RECIPE_WHY, WHY_SOURCES } from "@/lib/recipe-why";
import { REDS_BY_RECIPE, REDS_SECTION } from "@/lib/recipe-reds";

const REDS = /radiant reds|glow boost/i;

describe("recipe-first: the base recipe stands on its own", () => {
  it.each(RECIPES.map((r) => [r.id, r] as const))(
    "%s never needs Radiant Reds in its ingredients, method or description",
    (_id, r) => {
      for (const line of [...r.ingredients, ...r.method, r.benefit]) expect(line).not.toMatch(REDS);
    },
  );

  // Each listed ingredient is really used by the method (checked on its key word).
  const KEY: Record<string, string> = {
    "Matcha (green tea)": "matcha",
    "Culinary lavender": "lavender",
    "Baby spinach": "spinach",
    "Black fig": "fig",
    "Tart cherry": "cherr",
    "Hibiscus tea": "hibiscus",
    Blueberry: "berr",
    Strawberry: "berr",
    Raspberry: "raspberr",
    Pomegranate: "pomegranate",
    Almond: "almond",
    Chia: "chia",
    Orange: "orange",
    Lime: "lime",
    Lemon: "lemon",
    Peach: "peach",
    Plum: "plum",
    Cherry: "cherr",
  };
  it.each(RECIPES.filter((r) => !r.quick).map((r) => [r.id, r] as const))(
    "%s lists only ingredients its method uses",
    (_id, r) => {
      const method = r.method.join(" ").toLowerCase();
      for (const ing of r.ingredients) {
        const key = (KEY[ing] ?? ing).toLowerCase();
        expect(method, `${r.id}: ${ing}`).toContain(key.replace(/s$/, ""));
      }
    },
  );
});

describe("Why these ingredients", () => {
  it("every recipe has an intro and two or three sourced points", () => {
    for (const r of RECIPES) {
      const w = RECIPE_WHY[r.id];
      expect(w, r.id).toBeTruthy();
      expect(w.intro.length).toBeGreaterThan(20);
      expect(w.points.length).toBeGreaterThanOrEqual(2);
      expect(w.points.length).toBeLessThanOrEqual(3);
      for (const p of w.points) {
        expect(p.title.length).toBeLessThan(45);
        for (const s of p.sources) {
          expect(WHY_SOURCES[s], `${r.id}: ${s}`).toBeTruthy();
          expect(WHY_SOURCES[s].url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("never counts Radiant Reds and never makes a banned claim", () => {
    const text = JSON.stringify(RECIPE_WHY);
    expect(text).not.toMatch(/radiant reds|glow boost/i);
    expect(text).not.toMatch(
      /—|–|\bdetox|cleans|inflamm|hormone|immun|blood sugar|weight loss|anti-?aging|free radical|\brich in\b|\w-rich\b|\bhigh in\b|good source|excellent source|packed with|loaded with|superfood/i,
    );
  });
});

describe("Optional addition: Radiant Reds", () => {
  it("every recipe has a short headline, two or three points and a how-to; the 10-minute suggestion is attributed", () => {
    for (const r of RECIPES) {
      const n = REDS_BY_RECIPE[r.id];
      expect(n, r.id).toBeTruthy();
      expect(n.headline.length, r.id).toBeLessThan(60);
      expect(n.points.length, r.id).toBeGreaterThanOrEqual(2);
      expect(n.points.length, r.id).toBeLessThanOrEqual(3);
      for (const pt of n.points) expect(pt.length, r.id).toBeLessThan(170);
      expect(n.howTo.length).toBeGreaterThan(20);
      // No taste or shade predictions: those were not verified.
      expect(JSON.stringify(n), r.id).not.toMatch(/tart|coral|muddier|muddy|brown|pulse/i);
      // No unattributed imperative on each recipe; the supplier listing is cited.
      expect(n.howTo, r.id).not.toMatch(/(Drink|Eat) within 10 minutes/);
    }
    expect(REDS_SECTION.labelDetails).toMatch(
      /supplier's product listing suggests one scoop in 6 to 8 oz of cold water or another beverage once a day, consumed within 10 minutes of mixing/,
    );
  });

  it("claims no multiplier, synergy, absorption or result, and says the recipe is complete without it", () => {
    // Customer text only (not ids or code comments).
    const text = JSON.stringify([Object.values(REDS_SECTION), Object.values(REDS_BY_RECIPE)]);
    expect(text).not.toMatch(
      /\b(double|triple|quadruple|three times|four times)\b|\d+x\b|synerg|absor|bioavail|concentrat|second wave|deepen|skin|glow|more than juice|boost|detox|immun|inflamm|metabol(?!ic blend)|energy/i,
    );
    expect(REDS_SECTION.labelDetails).toContain("every recipe here is complete without it");
    expect(text).not.toMatch(/—|–/);
  });

  it("warm recipes offer a cold glass alongside, with no unsupported heat instruction", () => {
    for (const id of [
      "golden-turmeric",
      "lavender-honey",
      "rose-cardamom",
      "bonus-cacao-tonic",
      "bonus-warm-elixir",
    ])
      expect(REDS_BY_RECIPE[id].howTo).toMatch(/cold water to enjoy alongside/);
    // The supplier listing says "cold water or favorite beverage" and nothing about heat.
    expect(JSON.stringify(REDS_BY_RECIPE)).not.toMatch(/out of the warm cup|heat|hot liquid/i);
  });
});

describe("blend tips", () => {
  it("never mention Radiant Reds or use em dashes", () => {
    const text = JSON.stringify(BLEND_TIPS);
    expect(text).not.toMatch(/radiant reds|glow boost|—|°C/i);
  });
});

describe("recipe names and discovery tags", () => {
  const TAGS = [
    "Bright & tart",
    "Fruity",
    "Chocolatey",
    "Floral",
    "Creamy",
    "Earthy",
    "Warm & spiced",
    "Green tea",
    "Tropical",
    "Sparkling",
    "Fresh & green",
    "Make-ahead",
    "Gently spiced",
    "Frozen treat",
    "Coffee",
  ];

  it("names are unique and make no outcome, product or spa claims", () => {
    const names = RECIPES.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
    for (const r of RECIPES) {
      // "Elixir" is allowed on one recipe only, as an evocative food name (owner, 2026-09-30).
      const n = r.id === "pomegranate-elixir" ? r.name.replace(/ Elixir$/, "") : r.name;
      expect(n).not.toMatch(
        /glow|gut|detox|repair|anti-?aging|hormone|sleep|midnight|calm|collagen|reds|tonic|elixir|mylk|lightness|quickie|radiant|skin/i,
      );
    }
    expect(RECIPES.find((r) => r.id === "pomegranate-elixir")?.name).toBe(
      "Pomegranate & Raspberry Elixir",
    );
  });

  it("every tag is a discovery tag from the agreed set, never a health benefit", () => {
    for (const r of RECIPES) expect(TAGS, `${r.id}: ${r.benefitTag}`).toContain(r.benefitTag);
  });

  it("caffeine-containing recipes are never positioned as calm or for bedtime", () => {
    const caffeinated = RECIPES.filter((r) =>
      /cacao|cocoa|coffee|cold brew|matcha/i.test([...r.ingredients, ...r.method].join(" ")),
    );
    expect(caffeinated.length).toBeGreaterThanOrEqual(5);
    for (const r of caffeinated) {
      const text = [r.name, r.benefitTag, r.benefit, ...r.method].join(" ");
      expect(text, r.id).not.toMatch(/\b(calm|bed|bedtime|sleep|nightcap|wind-down|midnight)\b/i);
    }
    const tipText = JSON.stringify(caffeinated.map((r) => BLEND_TIPS[r.id] ?? {}));
    expect(tipText).not.toMatch(/\b(bed|bedtime|sleep|nightcap)\b/i);
  });

  it("grocery notes that name a recipe use a current recipe name", async () => {
    const { GROCERY_LIST } = await import("@/lib/content");
    const names = new Set(RECIPES.map((r) => r.name));
    const noted = GROCERY_LIST.flatMap((c) => c.items)
      .map((i) => i.note ?? "")
      .filter((n) => /Smoothie|Shake|Cooler|&/.test(n))
      .map((n) => n.replace(/^For /, ""));
    expect(noted.length).toBeGreaterThan(5);
    for (const n of noted) expect(names, n).toContain(n);
  });

  it("'Also in' lists are derived from the recipes and never name a missing recipe", async () => {
    const { recipesUsing } = await import("@/lib/ingredients");
    const names = new Set(RECIPES.map((r) => r.name));
    for (const n of recipesUsing("Pomegranate")) expect(names).toContain(n);
    expect(recipesUsing("Pomegranate")).toContain("Pomegranate & Raspberry Elixir");
    expect(recipesUsing("Pomegranate", "pomegranate-elixir")).not.toContain(
      "Pomegranate & Raspberry Elixir",
    );
  });
});

describe("Radiant Reds headlines match the recipe and the label", () => {
  const LABEL = [
    "beet",
    "strawberr",
    "hibiscus",
    "raspberr",
    "black currant",
    "acai",
    "blueberr",
    "cranberr",
    "grape seed",
    "african mango",
    "pomegranate",
  ];
  it("a 'two sources of pomegranate' headline only where the recipe really has pomegranate", () => {
    for (const r of RECIPES) {
      if (!/pomegranate/i.test(REDS_BY_RECIPE[r.id].headline)) continue;
      expect([...r.ingredients, ...r.method].join(" "), r.id).toMatch(/pomegranate/i);
    }
  });
  it("every 'in the label's Polyphenol Blend' point names only fruits that are on the label and in the recipe", () => {
    for (const r of RECIPES) {
      for (const pt of REDS_BY_RECIPE[r.id].points) {
        if (!/in the label's Polyphenol Blend/.test(pt) || /often include/.test(pt)) continue;
        const named = LABEL.filter((f) => pt.toLowerCase().includes(f));
        expect(named.length, `${r.id}: ${pt}`).toBeGreaterThan(0);
        const recipe = [...r.ingredients, ...r.method].join(" ").toLowerCase();
        for (const f of named) expect(recipe, `${r.id} lacks ${f}`).toContain(f);
      }
    }
  });
});
