import { describe, expect, it } from "vitest";
import {
  CATEGORY_FILTERS,
  entryDestination,
  PROGRAM_DAYS,
  recipeIdForDay,
  recipeLinkSearch,
  resolveRecipeEntry,
  validateLibrarySearch,
  validateRecipeSearch,
} from "@/lib/recipe-entry";
import { DAYS, RECIPES } from "@/lib/content";

const idOf = (day: number) => recipeIdForDay(day)!;

describe("Day 1–21 → recipe mapping", () => {
  it("every day maps to exactly one canonical, existing recipe", () => {
    expect(DAYS).toHaveLength(PROGRAM_DAYS);
    for (let day = 1; day <= PROGRAM_DAYS; day++) {
      const id = recipeIdForDay(day);
      expect(id, `Day ${day} has no recipe`).toBeTruthy();
      expect(
        RECIPES.some((r) => r.id === id),
        `Day ${day} → missing recipe ${id}`,
      ).toBe(true);
    }
  });
  it("days outside 1–21 map to nothing", () => {
    for (const bad of [0, 22, -1, 1.5, NaN]) expect(recipeIdForDay(bad)).toBeNull();
  });
});

describe("validating entry context from the URL", () => {
  it("keeps a valid guided day", () => {
    expect(validateRecipeSearch({ source: "day", day: "5" })).toEqual({ source: "day", day: 5 });
  });
  it("drops an out-of-range or malformed day", () => {
    for (const day of ["0", "22", "abc", "", "1.5"])
      expect(validateRecipeSearch({ source: "day", day })).toEqual({});
  });
  it("accepts only known sources and categories", () => {
    expect(validateRecipeSearch({ source: "all" })).toEqual({ source: "all" });
    expect(validateRecipeSearch({ source: "saved" })).toEqual({ source: "saved" });
    expect(validateRecipeSearch({ source: "category", filter: "foundation" })).toEqual({
      source: "category",
      filter: "foundation",
    });
    expect(validateRecipeSearch({ source: "category", filter: "nope" })).toEqual({});
    expect(validateRecipeSearch({ source: "evil" })).toEqual({});
  });
  it("never carries an arbitrary destination", () => {
    const hostile = {
      source: "day",
      day: "1",
      returnTo: "https://example.com/phish",
      next: "//evil.test",
    };
    expect(validateRecipeSearch(hostile)).toEqual({ source: "day", day: 1 });
  });
  it("library search keeps only known tab and category values", () => {
    expect(validateLibrarySearch({ tab: "saved", filter: "glow" })).toEqual({
      tab: "saved",
      filter: "glow",
    });
    expect(validateLibrarySearch({ tab: "evil", filter: "../../etc" })).toEqual({});
  });
});

describe("resolving the entry and its destination", () => {
  it("guided context is accepted only when the recipe belongs to that day", () => {
    const entry = resolveRecipeEntry({ source: "day", day: 1 }, idOf(1));
    expect(entry).toMatchObject({
      kind: "day",
      day: 1,
      backLabel: "Back to Day 1",
      continueLabel: "Continue Day 1",
    });
    expect(entryDestination(entry)).toEqual({
      to: "/day/$n",
      params: { n: "1" },
      hash: "complete",
    });
  });
  it("a mismatched day/recipe pair falls back to the library", () => {
    const wrong = resolveRecipeEntry({ source: "day", day: 1 }, idOf(2));
    expect(wrong.kind).toBe("all");
    expect(entryDestination(wrong)).toEqual({ to: "/recipes", search: {} });
  });
  it("an unknown recipe id falls back to the library", () => {
    expect(resolveRecipeEntry({ source: "day", day: 1 }, "retired-recipe").kind).toBe("all");
  });
  it("missing context falls back to the library", () => {
    expect(resolveRecipeEntry({}, idOf(3))).toEqual({
      kind: "all",
      backLabel: "Back to All Recipes",
    });
  });
  it("saved and category contexts return where they came from", () => {
    expect(entryDestination(resolveRecipeEntry({ source: "saved" }, idOf(4)))).toEqual({
      to: "/recipes",
      search: { tab: "saved" },
    });
    expect(
      entryDestination(resolveRecipeEntry({ source: "category", filter: "build" }, idOf(9))),
    ).toEqual({ to: "/recipes", search: { filter: "build" } });
  });
  it("every day resolves to its own guided context", () => {
    for (let day = 1; day <= PROGRAM_DAYS; day++) {
      const entry = resolveRecipeEntry({ source: "day", day }, idOf(day));
      expect(entry).toMatchObject({ kind: "day", day });
      expect(entryDestination(entry)).toMatchObject({ params: { n: String(day) } });
    }
  });
});

describe("building recipe links", () => {
  it("day, saved and category links carry only closed values", () => {
    expect(recipeLinkSearch({ kind: "day", day: 7 })).toEqual({ source: "day", day: 7 });
    expect(recipeLinkSearch({ kind: "saved" })).toEqual({ source: "saved" });
    expect(recipeLinkSearch({ kind: "library", filter: "all" })).toEqual({ source: "all" });
    for (const filter of CATEGORY_FILTERS.filter((f) => f !== "all")) {
      expect(recipeLinkSearch({ kind: "library", filter })).toEqual({ source: "category", filter });
    }
  });
});
