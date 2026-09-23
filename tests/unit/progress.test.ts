import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  STORAGE_KEY,
  activeDay,
  isDayPersisted,
  isDayUnlocked,
  isProgramComplete,
  mergePersisted,
  normalizeCompletedDays,
  routeAfterComplete,
  useApp,
} from "@/lib/store";

const range = (a: number, b: number) =>
  Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!).state;

function seed(extra: Record<string, unknown> = {}) {
  useApp.setState({
    verifiedEmail: "qa@example.test",
    name: "QA",
    startDate: new Date().toISOString(),
    completedDays: [],
    journalEntries: { 2: { prompt: "p", entry: "keep-me", response: "r", timestamp: "t" } },
    dailyLogs: { 3: { reds: true } },
    savedRecipes: ["pomegranate-elixir"],
    groceryChecked: { beet: true },
    outcomesByDay: { 3: ["Glowy"] },
    shownMilestones: ["day-1"],
    badgesEarned: ["day-1"],
    seenWelcome: true,
    ...extra,
  });
}

beforeEach(() => {
  localStorage.clear();
  seed();
});

describe("activeDay = earliest incomplete day", () => {
  it.each([
    ["no completed days", [], 1],
    ["Days 1–4", range(1, 4), 5],
    ["Days 1–5", range(1, 5), 6],
    ["Days 1–6", range(1, 6), 7],
    ["Days 1–13", range(1, 13), 14],
    ["Days 1–20", range(1, 20), 21],
    ["all 21", range(1, 21), 21],
    ["duplicates", [1, 1, 2, 2, 3, 3, 4], 5],
    ["out of order", [4, 2, 1, 3], 5],
    ["gap: Days 1–4 + 6", [1, 2, 3, 4, 6], 5],
    ["legacy strings", ["1", "2", " 3 ", "4"], 5],
    ["junk values mixed in", [1, null, "x", 0, 22, 3.5, 2, 3, 4], 5],
    ["not an array", "garbage", 1],
  ])("%s → Day %#", (_label, days, expected) => expect(activeDay(days)).toBe(expected));

  it("isProgramComplete only for all 21", () => {
    expect(isProgramComplete(range(1, 20))).toBe(false);
    expect(isProgramComplete([...range(1, 21), 21])).toBe(true);
  });
});

describe("unlocking: completed days + the active day only", () => {
  it("sequential Days 1–4: 1–5 open, 6–21 locked", () => {
    for (let d = 1; d <= 21; d++) expect(isDayUnlocked(d, range(1, 4))).toBe(d <= 5);
  });
  it("gap Days 1–4 + 6: Day 5 (active) and 6 (done) open, 7+ locked", () => {
    const days = [1, 2, 3, 4, 6];
    expect(isDayUnlocked(5, days)).toBe(true);
    expect(isDayUnlocked(6, days)).toBe(true);
    expect(isDayUnlocked(7, days)).toBe(false);
  });
  it("the calendar never unlocks days ahead", () => {
    seed({ startDate: new Date(Date.now() - 10 * 86400000).toISOString() });
    expect(isDayUnlocked(2, [])).toBe(false);
  });
});

describe("Day N completion destinations", () => {
  it.each(range(1, 20))("Day %i → next step", (n) => {
    const after = range(1, n);
    const r = routeAfterComplete(n, after);
    if ([1, 7, 14].includes(n))
      expect(r).toEqual({ to: "/milestone/$id", params: { id: `day-${n}` } });
    else expect(r).toEqual({ to: "/day/$n", params: { n: String(n + 1) } });
    expect(activeDay(after)).toBe(n + 1);
  });
  it("Day 21 → celebrate, never Day 22", () => {
    expect(routeAfterComplete(21, range(1, 21))).toEqual({ to: "/celebrate" });
  });
  it("gap: completing Day 5 when Day 6 is already done → Day 7", () => {
    expect(routeAfterComplete(5, [1, 2, 3, 4, 5, 6])).toEqual({
      to: "/day/$n",
      params: { n: "7" },
    });
  });
});

describe("completeDay persistence", () => {
  it("records each day exactly once, even when repeated", () => {
    const { completeDay } = useApp.getState();
    for (let n = 1; n <= 21; n++) {
      completeDay(n);
      completeDay(n);
    }
    expect(stored().completedDays).toEqual(range(1, 21));
  });
  it("normalizes legacy strings/duplicates on write without losing valid days", () => {
    seed({ completedDays: ["1", 2, "3", 3, 4] as unknown as number[] });
    useApp.getState().completeDay(5);
    expect(stored().completedDays).toEqual(range(1, 5));
  });
  it("ignores out-of-range days", () => {
    const { completeDay } = useApp.getState();
    completeDay(0);
    completeDay(22);
    expect(useApp.getState().completedDays).toEqual([]);
  });
  it("unrelated stored fields survive every progress write", () => {
    const { completeDay, setLog } = useApp.getState();
    for (let n = 1; n <= 21; n++) {
      completeDay(n);
      setLog(n, "ritual", true);
    }
    const s = stored();
    expect(s.journalEntries[2].entry).toBe("keep-me");
    expect(s.dailyLogs[3]).toEqual({ reds: true, ritual: true });
    expect(s.savedRecipes).toEqual(["pomegranate-elixir"]);
    expect(s.groceryChecked).toEqual({ beet: true });
    expect(s.outcomesByDay[3]).toEqual(["Glowy"]);
  });
  it("completion never toggles an already-logged ritual off", () => {
    seed({ dailyLogs: { 5: { ritual: true, reds: true } } });
    const { completeDay, setLog } = useApp.getState();
    completeDay(5);
    setLog(5, "ritual", true);
    setLog(5, "ritual", true);
    expect(stored().dailyLogs[5]).toEqual({ ritual: true, reds: true });
  });
  it("a failed storage write is detected, never reported as saved", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    try {
      useApp.getState().completeDay(5);
    } catch {
      /* surfaced to caller */
    }
    spy.mockRestore();
    expect(isDayPersisted(5)).toBe(false);
  });
  it("a failed storage read is detected", () => {
    expect(
      isDayPersisted(5, {
        getItem: () => {
          throw new Error("blocked");
        },
      }),
    ).toBe(false);
    expect(isDayPersisted(5, { getItem: () => "{not json" })).toBe(false);
  });
  it("storage key is still exactly noure_app_v1", () => {
    useApp.getState().completeDay(1);
    expect(STORAGE_KEY).toBe("noure_app_v1");
    expect(Object.keys(localStorage)).toEqual(["noure_app_v1"]);
  });
});

describe("loading saved data safely (mergePersisted)", () => {
  const defaults = useApp.getInitialState();
  it("recoverable legacy data: normalizes completedDays, keeps everything valid", () => {
    const m = mergePersisted(
      { name: "Kara", completedDays: [3, "1", 2, 2], journalEntries: { 1: { entry: "x" } } },
      defaults,
    );
    expect(m.completedDays).toEqual([1, 2, 3]);
    expect(m.name).toBe("Kara");
    expect(m.journalEntries[1]).toEqual({ entry: "x" });
  });
  it("fields with an unusable type fall back to defaults instead of crashing screens", () => {
    const m = mergePersisted(
      { name: "Kara", completedDays: null, dailyLogs: null, savedRecipes: "x", outcomesByDay: [] },
      defaults,
    );
    expect(m.completedDays).toEqual([]);
    expect(m.dailyLogs).toEqual({});
    expect(m.savedRecipes).toEqual([]);
    expect(m.outcomesByDay).toEqual({});
    expect(m.name).toBe("Kara");
  });
  it("older saves missing newer fields get defaults for just those fields", () => {
    const m = mergePersisted({ name: "Kara", completedDays: [1, 2] }, defaults);
    expect(m.outcomesByDay).toEqual({});
    expect(m.groceryChecked).toEqual({});
    expect(activeDay(m.completedDays)).toBe(3);
  });
  it("non-object saved state is ignored (defaults), never thrown", () => {
    expect(mergePersisted("garbage", defaults)).toBe(defaults);
    expect(mergePersisted(null, defaults)).toBe(defaults);
  });
});

describe("unreadable saved JSON", () => {
  it("keeps an untouched backup copy and loads without crashing", async () => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, "{not valid json");
    await useApp.persist.rehydrate();
    expect(localStorage.getItem("noure_app_v1_unreadable_backup")).toBe("{not valid json");
    expect(isDayPersisted(1)).toBe(false); // never claims completion from unreadable data
    expect(activeDay(useApp.getState().completedDays)).toBeGreaterThanOrEqual(1);
  });
});
