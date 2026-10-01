import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  activeDay,
  daysBetween,
  mergePersisted,
  ritualProgress,
  useApp,
} from "@/lib/store";
import { ALL_JOURNAL_NUDGES, JOURNAL_NUDGES } from "@/lib/reflections";
import { JOURNAL_PROMPTS } from "@/lib/content";

const range = (a: number, b: number) =>
  Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!).state;

beforeEach(() => {
  localStorage.clear();
  useApp.getState().resetAll();
});

describe("Your Ritual counts completed mornings only", () => {
  it.each([
    ["new", [], 0, 21, 1],
    ["Days 1–6", range(1, 6), 6, 15, 7],
    ["Days 1–20", range(1, 20), 20, 1, 21],
    ["all 21", range(1, 21), 21, 0, null],
    ["legacy gap 1,2,4", [1, 2, 4], 3, 18, 3],
    ["legacy strings and junk", ["1", "2", 2, null, 99], 2, 19, 3],
  ])("%s", (_l, days, completed, remaining, next) => {
    expect(ritualProgress(days)).toEqual({ completed, remaining, next });
  });

  it("next morning is always the active day until all 21 are done", () => {
    for (let n = 0; n < 21; n++)
      expect(ritualProgress(range(1, n)).next).toBe(activeDay(range(1, n)));
  });

  it("is independent of journal entries and daily logs (not a weighted score)", () => {
    expect(ritualProgress(range(1, 5)).completed).toBe(5);
  });
});

describe("a break never moves the day or erases progress", () => {
  it("the active day depends only on completed days, not elapsed time", () => {
    useApp.setState({
      name: "QA",
      startDate: new Date(Date.now() - 40 * 86400000).toISOString(),
      completedDays: range(1, 6),
      lastVisitAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    });
    expect(activeDay(useApp.getState().completedDays)).toBe(7);
    useApp.getState().setLastVisit(new Date().toISOString());
    expect(stored().completedDays).toEqual(range(1, 6));
  });

  it("daysBetween counts local calendar days and tolerates bad input", () => {
    const now = new Date(2026, 8, 29, 7, 0);
    expect(daysBetween(new Date(2026, 8, 29, 1, 0).toISOString(), now)).toBe(0);
    expect(daysBetween(new Date(2026, 8, 27, 23, 0).toISOString(), now)).toBe(2);
    expect(daysBetween(null, now)).toBe(0);
    expect(daysBetween("not a date", now)).toBe(0);
  });
});

describe("existing saved data loads unchanged", () => {
  it("older data without lastVisitAt keeps every record", () => {
    const legacy = {
      verifiedEmail: "qa@example.test",
      name: "QA",
      completedDays: [1, 2, 3],
      journalEntries: {
        2: { prompt: "old prompt", entry: "keep-me", response: "r", timestamp: "t" },
      },
      dailyLogs: { 2: { journal: true, reds: true } },
      outcomesByDay: { 3: ["Glowy"] },
      savedRecipes: ["pomegranate-elixir"],
    };
    const merged = mergePersisted(legacy, useApp.getInitialState());
    expect(merged.lastVisitAt).toBeNull();
    expect(merged.journalEntries[2].entry).toBe("keep-me");
    expect(merged.journalEntries[2].prompt).toBe("old prompt");
    expect(merged.completedDays).toEqual([1, 2, 3]);
    expect(merged.dailyLogs[2]).toEqual({ journal: true, reds: true });
    expect(merged.outcomesByDay).toEqual({ 3: ["Glowy"] });
  });
});

describe("Morning Journal", () => {
  it("clearJournal removes only that day's note", () => {
    const e = { prompt: "p", entry: "x", response: "", timestamp: "t" };
    useApp.getState().saveJournal(2, e);
    useApp.getState().saveJournal(3, { ...e, entry: "y" });
    useApp.getState().clearJournal(2);
    expect(Object.keys(stored().journalEntries)).toEqual(["3"]);
    useApp.getState().clearJournal(9); // no-op
    expect(stored().journalEntries[3].entry).toBe("y");
  });

  it("resetAll clears lastVisitAt with everything else", () => {
    useApp.getState().setLastVisit("2026-09-01T07:00:00.000Z");
    useApp.getState().resetAll();
    expect(stored().lastVisitAt).toBeNull();
  });

  it("old openers are still stripped from saved notes", () => {
    for (const legacy of ["My digestion felt", "I felt lighter when", "What I noticed today."])
      expect(ALL_JOURNAL_NUDGES).toContain(legacy);
    for (const n of JOURNAL_NUDGES) expect(ALL_JOURNAL_NUDGES).toContain(n);
  });

  it("prompts never ask her to inspect skin or body, or imply a result", () => {
    for (let d = 1; d <= 21; d++) {
      const p = JOURNAL_PROMPTS[d]("QA");
      expect(p).not.toMatch(/\b(skin|body|digestion|bloat|craving|shifting|shifted|lighter)\b/i);
      // No therapy language, forced positivity or questions that demand a profound answer.
      expect(p).not.toMatch(
        /sacred|hard on yourself|carrying|heal|trauma|grateful|gratitude|deepest|truly|purpose|why did you start|what made you start/i,
      );
      expect(p.length).toBeLessThanOrEqual(70);
    }
    for (const n of JOURNAL_NUDGES)
      expect(n).not.toMatch(/\b(skin|body|digestion|bloat|lighter|energy)\b/i);
  });
});

describe("shortened feelings check-in", () => {
  it("shows eight values, all valid stored outcomes; the two new ones are appended", async () => {
    const { OUTCOMES, VISIBLE_OUTCOMES } = await import("@/lib/store");
    expect([...VISIBLE_OUTCOMES]).toEqual([
      "Rested",
      "Energized",
      "Calm",
      "Focused",
      "Satisfied",
      "Just okay",
      "Tired",
      "Overwhelmed",
    ]);
    for (const o of VISIBLE_OUTCOMES) expect(OUTCOMES).toContain(o);
    // Nothing removed or reordered from what storage accepts; the two new values come last.
    expect(OUTCOMES).toHaveLength(14);
    expect(OUTCOMES.slice(12)).toEqual(["Calm", "Overwhelmed"]);
  });

  it("new feelings save alongside older records without rewriting them", () => {
    useApp.setState({ outcomesByDay: { 2: ["Glowy", "Less bloated"], 3: ["Rested"] } });
    useApp.getState().toggleOutcomeForDay(4, "Overwhelmed");
    useApp.getState().toggleOutcomeForDay(4, "Calm");
    expect(stored().outcomesByDay).toEqual({
      2: ["Glowy", "Less bloated"],
      3: ["Rested"],
      4: ["Overwhelmed", "Calm"],
    });
  });

  it("an earlier feeling outside the short list can still be unticked, and nothing else changes", () => {
    useApp.setState({ outcomesByDay: { 3: ["Glowy", "Rested"], 4: ["Less bloated"] } });
    useApp.getState().toggleOutcomeForDay(3, "Glowy");
    expect(stored().outcomesByDay).toEqual({ 3: ["Rested"], 4: ["Less bloated"] });
  });
});
