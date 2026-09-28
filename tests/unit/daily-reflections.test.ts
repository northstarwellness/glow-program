import { beforeEach, describe, expect, it } from "vitest";
import { OUTCOMES, STORAGE_KEY, mergePersisted, useApp } from "@/lib/store";
import {
  daysWithFeelings,
  feelingCounts,
  feelingsForDay,
  journalDateForDay,
  journalTextForDay,
  persistedFeelingsForDay,
} from "@/lib/reflections";

const days = Array.from({ length: 21 }, (_, i) => i + 1);
const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")?.state;

beforeEach(() => {
  localStorage.clear();
  useApp.getState().resetAll();
});

describe("feeling selections are attached to their own day", () => {
  it.each(days)("Day %i: a selection is saved to that day only", (d) => {
    useApp.getState().toggleOutcomeForDay(d, "Energized");
    const byDay = useApp.getState().outcomesByDay;
    expect(feelingsForDay(byDay, d)).toEqual(["Energized"]);
    for (const other of days.filter((x) => x !== d))
      expect(feelingsForDay(byDay, other)).toEqual([]);
    expect(persistedFeelingsForDay(d)).toEqual(["Energized"]);
  });

  it("changing and removing a selection updates the day and the counts", () => {
    const { toggleOutcomeForDay } = useApp.getState();
    toggleOutcomeForDay(4, "Glowy");
    toggleOutcomeForDay(4, "Lighter");
    expect(feelingsForDay(useApp.getState().outcomesByDay, 4)).toEqual(["Lighter", "Glowy"]);
    toggleOutcomeForDay(4, "Glowy");
    expect(feelingsForDay(useApp.getState().outcomesByDay, 4)).toEqual(["Lighter"]);
    expect(feelingCounts(useApp.getState().outcomesByDay)).toEqual([
      { outcome: "Lighter", days: 1 },
    ]);
    toggleOutcomeForDay(4, "Lighter");
    expect(daysWithFeelings(useApp.getState().outcomesByDay)).toEqual([]);
    expect(persistedFeelingsForDay(4)).toEqual([]);
  });

  it("can never hold a duplicate, however it is tapped", () => {
    const { toggleOutcomeForDay } = useApp.getState();
    for (let i = 0; i < 7; i++) toggleOutcomeForDay(9, "Satisfied");
    expect(stored().outcomesByDay[9]).toEqual(["Satisfied"]);
    // A legacy duplicate is collapsed on the next tap, never multiplied.
    useApp.setState({ outcomesByDay: { 9: ["Satisfied", "Satisfied"] } });
    toggleOutcomeForDay(9, "Glowy");
    expect(useApp.getState().outcomesByDay[9]).toEqual(["Satisfied", "Glowy"]);
    // …and readers count it once either way.
    expect(feelingCounts({ 9: ["Glowy", "Glowy"] })).toEqual([{ outcome: "Glowy", days: 1 }]);
  });

  it("ignores out-of-range days and unknown feelings instead of writing them", () => {
    const { toggleOutcomeForDay } = useApp.getState();
    toggleOutcomeForDay(0, "Glowy");
    toggleOutcomeForDay(22, "Glowy");
    toggleOutcomeForDay(3, "Healed");
    expect(useApp.getState().outcomesByDay).toEqual({});
  });

  it("keeps unrelated days and legacy values untouched when one day changes", () => {
    useApp.setState({ outcomesByDay: { 2: ["Lighter"], 5: ["Old label", "Glowy"] } });
    useApp.getState().toggleOutcomeForDay(3, "Energized");
    const byDay = useApp.getState().outcomesByDay;
    expect(byDay[2]).toEqual(["Lighter"]);
    expect(byDay[5]).toEqual(["Old label", "Glowy"]);
    // Unknown values are skipped on read, not shown and not counted.
    expect(feelingsForDay(byDay, 5)).toEqual(["Glowy"]);
  });

  it("shows feelings in the fixed chip order, whatever order they were tapped in", () => {
    expect(feelingsForDay({ 1: ["Glowy", "Lighter"] }, 1)).toEqual(["Lighter", "Glowy"]);
    expect(OUTCOMES.indexOf("Lighter")).toBeLessThan(OUTCOMES.indexOf("Glowy"));
  });
});

describe("legacy data", () => {
  it("loads a stored record (string keys, no new fields) without rewriting it", () => {
    const legacy = {
      name: "Ana",
      completedDays: [1, 2, 3],
      outcomesByDay: { "2": ["Less bloated", "Energized"], "3": [] },
      journalEntries: {
        "2": { prompt: "p", entry: " kept ", response: "r", timestamp: "2026-09-02T08:00:00Z" },
      },
    };
    const merged = mergePersisted(legacy, useApp.getState());
    expect(merged.completedDays).toEqual([1, 2, 3]);
    expect(merged.outcomesByDay).toBe(legacy.outcomesByDay);
    expect(merged.journalEntries).toBe(legacy.journalEntries);
    expect(feelingsForDay(merged.outcomesByDay, 2)).toEqual(["Less bloated", "Energized"]);
    expect(journalTextForDay(merged.journalEntries, 2)).toBe("kept");
    expect(journalDateForDay(merged.journalEntries, 2)?.toISOString()).toBe(
      "2026-09-02T08:00:00.000Z",
    );
  });

  it("never invents a date or a selection from malformed values", () => {
    expect(journalDateForDay({ 2: { entry: "x", timestamp: "t" } }, 2)).toBeNull();
    expect(feelingsForDay({ 2: "Glowy" }, 2)).toEqual([]);
    expect(feelingsForDay(null, 2)).toEqual([]);
    expect(journalTextForDay({ 2: { entry: 5 } }, 2)).toBe("");
  });

  it("adds no new stored fields", () => {
    useApp.getState().toggleOutcomeForDay(1, "Glowy");
    expect(Object.keys(stored()).sort()).toEqual(
      [
        "verifiedEmail",
        "name",
        "startDate",
        "completedDays",
        "journalEntries",
        "dailyLogs",
        "savedRecipes",
        "photos",
        "notificationTime",
        "badgesEarned",
        "seenWelcome",
        "shownMilestones",
        "groceryChecked",
        "outcomesByDay",
      ].sort(),
    );
  });
});
