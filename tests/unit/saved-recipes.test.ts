import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  STORAGE_KEY,
  dedupeIds,
  isRecipeSavedPersisted,
  mergePersisted,
  useApp,
} from "@/lib/store";
import { RECIPES } from "@/lib/content";

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!).state;
const ID = "pomegranate-elixir";

beforeEach(() => {
  localStorage.clear();
  useApp.setState({
    verifiedEmail: "qa@example.test",
    name: "QA",
    startDate: new Date().toISOString(),
    completedDays: [1, 2, 3],
    journalEntries: { 2: { prompt: "p", entry: "keep-me", response: "r", timestamp: "t" } },
    dailyLogs: { 3: { reds: true } },
    savedRecipes: [],
    groceryChecked: { beet: true },
    outcomesByDay: { 3: ["Glowy"] },
    badgesEarned: ["day-1"],
    shownMilestones: ["day-1"],
    seenWelcome: true,
  });
});

describe("saving recipes", () => {
  it("saves a recipe id exactly once, however many times it is tapped", () => {
    const { setRecipeSaved } = useApp.getState();
    setRecipeSaved(ID, true);
    setRecipeSaved(ID, true);
    setRecipeSaved(ID, true);
    expect(useApp.getState().savedRecipes).toEqual([ID]);
    expect(stored().savedRecipes).toEqual([ID]);
  });

  it("removes only that recipe and leaves the others", () => {
    const { setRecipeSaved } = useApp.getState();
    setRecipeSaved(ID, true);
    setRecipeSaved("berry-bloom", true);
    setRecipeSaved(ID, false);
    expect(useApp.getState().savedRecipes).toEqual(["berry-bloom"]);
    expect(RECIPES.find((r) => r.id === ID)).toBeTruthy(); // the recipe itself is untouched
  });

  it("toggling repeatedly never duplicates", () => {
    const { toggleSavedRecipe } = useApp.getState();
    for (let i = 0; i < 6; i++) toggleSavedRecipe(ID);
    expect(useApp.getState().savedRecipes).toEqual([]);
    toggleSavedRecipe(ID);
    expect(useApp.getState().savedRecipes).toEqual([ID]);
  });

  it("every progress field survives saving and removing", () => {
    const { setRecipeSaved } = useApp.getState();
    setRecipeSaved(ID, true);
    setRecipeSaved(ID, false);
    const s = stored();
    expect(s.completedDays).toEqual([1, 2, 3]);
    expect(s.journalEntries[2].entry).toBe("keep-me");
    expect(s.dailyLogs[3]).toEqual({ reds: true });
    expect(s.groceryChecked).toEqual({ beet: true });
    expect(s.outcomesByDay[3]).toEqual(["Glowy"]);
    expect(Object.keys(localStorage)).toEqual(["noure_app_v1"]);
  });

  it("a blocked storage write is detected, never reported as saved", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "QuotaExceededError");
    });
    try {
      useApp.getState().setRecipeSaved(ID, true);
    } catch {
      /* surfaced to the caller */
    }
    spy.mockRestore();
    expect(isRecipeSavedPersisted(ID, true)).toBe(false);
  });

  it("confirms a real write", () => {
    useApp.getState().setRecipeSaved(ID, true);
    expect(isRecipeSavedPersisted(ID, true)).toBe(true);
    useApp.getState().setRecipeSaved(ID, false);
    expect(isRecipeSavedPersisted(ID, false)).toBe(true);
  });
});

describe("stored saved-recipe data", () => {
  const defaults = useApp.getInitialState();

  it("legacy data with no saved list loads as an empty list", () => {
    const m = mergePersisted({ name: "Kara", completedDays: [1, 2] }, defaults);
    expect(m.savedRecipes).toEqual([]);
    expect(m.completedDays).toEqual([1, 2]);
  });

  it("duplicates and junk in stored ids are cleaned on load, valid ids kept in order", () => {
    const m = mergePersisted({ savedRecipes: [ID, ID, "", null, "berry-bloom", 7] }, defaults);
    expect(m.savedRecipes).toEqual([ID, "berry-bloom"]);
  });

  it("a saved list of the wrong type falls back to empty instead of crashing", () => {
    expect(mergePersisted({ savedRecipes: "x" }, defaults).savedRecipes).toEqual([]);
  });

  it("a stale id (recipe no longer exists) is kept in storage but matches no recipe", () => {
    const m = mergePersisted({ savedRecipes: ["retired-recipe", ID] }, defaults);
    expect(m.savedRecipes).toEqual(["retired-recipe", ID]);
    expect(RECIPES.filter((r) => m.savedRecipes.includes(r.id)).map((r) => r.id)).toEqual([ID]);
  });

  it("dedupeIds keeps order and drops non-strings", () => {
    expect(dedupeIds(["b", "a", "b", 1, null, "a"])).toEqual(["b", "a"]);
    expect(dedupeIds("nope")).toEqual([]);
  });
});
