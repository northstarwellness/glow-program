import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ARTICLES,
  BLEND_TIPS,
  DAYS,
  GLOW_BOOST_STORIES,
  GROCERY_LIST,
  INGREDIENTS,
  JOURNAL_PROMPTS,
  MILESTONES,
  NOTIFICATIONS,
  POLYPHENOLS,
  RECIPES,
  REDS_SERVINGS_PER_BAG,
  reflectJournal,
} from "@/lib/content";
import { OUTCOMES, STORAGE_KEY, mergePersisted, outcomeLabel, useApp } from "@/lib/store";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

const read = (p: string) => readFileSync(resolve(__dirname, "../..", p), "utf8");

// Every file that holds customer-facing copy, including dormant copy such as NOTIFICATIONS.
const SOURCES = [
  "src/lib/content.ts",
  "src/components/BuildYourOwn.tsx",
  "lovable-landing.tsx",
  "src/lib/glow-reflection.ts",
  "src/lib/reflections.ts",
  "src/lib/glow-card.ts",
  "src/components/FeelingChips.tsx",
  ...[
    "__root",
    "index",
    "landing",
    "welcome",
    "verify",
    "home",
    "day.$n",
    "rituals",
    "recipes.index",
    "recipes.$id",
    "bonuses",
    "boosts",
    "grocery",
    "journal.index",
    "journal.$n",
    "progress",
    "celebrate",
    "milestone.$id",
    "profile",
    "reflection",
  ].map((r) => `src/routes/${r}.tsx`),
];
const rendered = (p: string) => {
  let t = read(p);
  if (p.endsWith("journal.$n.tsx")) t = t.replace(/system: `[\s\S]*?`,/, ""); // AI guardrail names the claims it forbids
  return t.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, ""); // code comments are not shown
};

describe("customer-facing copy", () => {
  it.each(SOURCES)("%s has no prohibited claim language", (p) => {
    const t = rendered(p);
    for (const re of PROHIBITED) expect(t, `${p} matches ${re}`).not.toMatch(re);
  });

  it.each(SOURCES)("%s has no unverified testimonial or typicality language", (p) => {
    const t = rendered(p);
    for (const re of [...TESTIMONIAL, ...DAY_RESULT])
      expect(t, `${p} matches ${re}`).not.toMatch(re);
  });

  it("runtime content carries no prohibited or testimonial language", () => {
    const pools = ["tired", "skin", "missed", "amazing", "bloated", "hello"].flatMap((w) =>
      Array.from({ length: 40 }, () => reflectJournal(w, "QA")),
    );
    const text = JSON.stringify([
      DAYS,
      RECIPES,
      INGREDIENTS,
      POLYPHENOLS,
      ARTICLES,
      BLEND_TIPS,
      GLOW_BOOST_STORIES,
      MILESTONES,
      GROCERY_LIST,
      Object.values(JOURNAL_PROMPTS).map((f) => f("QA")),
      pools,
      NOTIFICATIONS,
    ]);
    for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT]) expect(text).not.toMatch(re);
  });

  it("dormant NOTIFICATIONS carry no prohibited, testimonial or promised-result wording", () => {
    expect(Object.keys(NOTIFICATIONS).map(Number)).toEqual(
      Array.from({ length: 21 }, (_, i) => i + 1),
    );
    for (const [day, msg] of Object.entries(NOTIFICATIONS)) {
      for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT])
        expect(msg, `notification day ${day} matches ${re}`).not.toMatch(re);
      expect(msg, `notification day ${day} uses an em dash`).not.toContain("—");
    }
  });

  it("keeps the approved Beet line exactly", () => {
    expect(INGREDIENTS.find((i) => i.name === "Beet")?.gut).toBe(
      "Supports a calm, well-fed gut environment.",
    );
  });

  it("replaces the Photo Timeline with a reflection that promises no visible change", () => {
    const w = read("src/routes/welcome.tsx");
    expect(w).not.toMatch(
      /Photo Timeline|compare where you started|before and after|before-and-after/i,
    );
    expect(w).toContain("Your Glow Reflection");
    expect(w).toContain(
      "A private place to notice and remember how the ritual felt across your 21 days.",
    );
  });

  it("only claims a bag covers 21 days when the label's serving count backs it", () => {
    const claims = JSON.stringify(GROCERY_LIST) + read("src/routes/grocery.tsx");
    if (/covers the full 21 days/.test(claims))
      expect(REDS_SERVINGS_PER_BAG).toBeGreaterThanOrEqual(21);
  });

  it("has no dead reference to Boosts outside the Boosts screen itself", () => {
    for (const p of SOURCES.filter((s) => !s.endsWith("boosts.tsx"))) {
      expect(rendered(p), p).not.toMatch(/\bBoosts\b/);
      expect(rendered(p), p).not.toMatch(/to="\/boosts"/);
    }
  });
});

describe("identity and saved data survive the copy change", () => {
  const RECIPE_IDS = [
    "pomegranate-elixir",
    "berry-bloom",
    "cherry-cacao",
    "plum-rose",
    "watermelon-reds",
    "fig-almond",
    "beet-glow",
    "golden-turmeric",
    "matcha-cloud",
    "lavender-honey",
    "rose-cardamom",
    "blueberry-basil",
    "papaya-lime",
    "peach-saffron",
    "fig-vanilla",
    "cucumber-mint",
    "apricot-almond",
    "kiwi-spinach",
    "vanilla-chia",
    "ginger-pear",
    "honey-almond",
    "bonus-cacao-tonic",
    "bonus-rose-collagen",
    "bonus-green-glow",
    "bonus-warm-elixir",
    "bonus-glow-sorbet",
    "berry-reds-yogurt-shake",
    "pomegranate-vanilla-glow",
    "cucumber-mint-lightness",
    "cherry-cacao-calm-glow",
    "peach-ginger-gut-glow",
    "mocha-reds-morning",
    "tropical-reds-quickie",
  ];

  it("keeps every recipe id, in order", () => {
    expect(RECIPES.map((r) => r.id)).toEqual(RECIPE_IDS);
  });

  it("keeps the canonical day-to-recipe mapping", () => {
    expect(DAYS.map((d) => d.recipeId)).toEqual([
      "pomegranate-elixir",
      "berry-bloom",
      "cherry-cacao",
      "plum-rose",
      "watermelon-reds",
      "fig-almond",
      "beet-glow",
      "pomegranate-elixir",
      "berry-bloom",
      "cherry-cacao",
      "plum-rose",
      "watermelon-reds",
      "fig-almond",
      "beet-glow",
      "pomegranate-elixir",
      "berry-bloom",
      "cherry-cacao",
      "plum-rose",
      "watermelon-reds",
      "fig-almond",
      "beet-glow",
    ]);
  });

  beforeEach(() => localStorage.clear());

  it("resolves a saved recipe under its new display name", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { name: "QA", savedRecipes: ["bonus-rose-collagen"] }, version: 0 }),
    );
    const s = mergePersisted(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).state,
      useApp.getInitialState(),
    );
    const saved = RECIPES.filter((r) => s.savedRecipes.includes(r.id));
    expect(saved.map((r) => r.name)).toEqual(["Rose Strawberry Float"]);
  });

  it("keeps stored check-in values and shows the new display text", () => {
    expect(OUTCOMES).toContain("Less bloated");
    expect(OUTCOMES).toContain("Calm digestion");
    const history = { 3: ["Less bloated", "Glowy"], 4: ["Calm digestion"] };
    const s = mergePersisted({ outcomesByDay: history }, useApp.getInitialState());
    expect(s.outcomesByDay).toEqual(history);
    expect(s.outcomesByDay[3].map(outcomeLabel)).toEqual(["Comfortable", "Glowy"]);
    expect(s.outcomesByDay[4].map(outcomeLabel)).toEqual(["Settled"]);
    expect(outcomeLabel("Lighter")).toBe("Lighter");
  });
});
