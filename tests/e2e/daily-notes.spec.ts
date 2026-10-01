import type { Page } from "@playwright/test";
import {
  test,
  expect,
  customer,
  seed,
  stored,
  range,
  daysAgo,
  homePrimary,
  markComplete,
} from "./fixtures";

const shown = (n: number) => [1, 7, 14].filter((d) => d <= n).map((d) => `day-${d}`);
const onDay = (day: number, over: Record<string, unknown> = {}) =>
  customer({ completedDays: range(1, day - 1), shownMilestones: shown(day - 1), ...over });
const noteBox = (page: Page) =>
  page.getByPlaceholder("A thought, a feeling, an idea. Start anywhere.");
const saveEntry = (page: Page) => page.getByRole("button", { name: "Save entry" });

test.describe("Morning Journal", () => {
  test("offers one prompt with free writing, and can be skipped without blocking the morning", async ({
    page,
  }) => {
    await seed(page, onDay(4, { outcomesByDay: {} }));
    await page.goto("/journal/4");
    await expect(page.getByText("A little space for what's on your mind.")).toBeVisible();
    await expect(page.getByText("What's on your mind this morning?")).toBeVisible();
    await expect(page.getByText("Or start with")).toHaveCount(0); // no extra suggested openers
    await expect(saveEntry(page)).toBeDisabled(); // nothing to save yet
    await page.getByTestId("skip-note").click();
    await expect(page).toHaveURL(/\/day\/4$/);
    const s = await stored(page);
    expect(s.journalEntries[4]).toBeUndefined();
    expect(s.outcomesByDay[4]).toBeUndefined();
    // No journal entry and no feelings: the morning still completes and progress counts it.
    await markComplete(page, 4);
    await expect(page).toHaveURL(/\/day\/5$/);
    expect((await stored(page)).completedDays).toEqual(range(1, 4));
    await page.goto("/progress");
    await expect(page.getByTestId("your-ritual")).toContainText("4 of 21");
  });

  test("Save entry saves right away and the entry survives closing and reopening the app", async ({
    page,
  }) => {
    await seed(page, onDay(4));
    await page.goto("/journal/4");
    await noteBox(page).pressSequentially("Want to call Mia this week.", { delay: 5 });
    await saveEntry(page).click();
    await expect(page.getByText("Saved on this device.")).toBeVisible();
    await expect(saveEntry(page)).toBeDisabled();
    expect((await stored(page)).journalEntries[4].entry).toBe("Want to call Mia this week.");
    await page.goto("/home");
    await page.reload();
    await page.goto("/journal/4");
    await expect(noteBox(page)).toHaveValue("Want to call Mia this week.");
  });

  test("autosave still keeps what she writes, even when leaving right away", async ({ page }) => {
    await seed(page, onDay(4));
    await page.goto("/journal/4");
    await noteBox(page).fill("Quick one");
    await page.getByTestId("skip-note").click();
    await expect(page).toHaveURL(/\/day\/4$/);
    expect((await stored(page)).journalEntries[4].entry).toBe("Quick one");
  });

  test("typing, then switching away from the app within a moment, still saves", async ({
    page,
  }) => {
    await seed(page, onDay(4));
    await page.goto("/journal/4");
    await noteBox(page).fill("Before the school run");
    // What iOS does when she swipes to another app or locks the phone.
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect((await stored(page)).journalEntries[4].entry).toBe("Before the school run");
  });

  test("clearing an entry removes it; other entries are untouched", async ({ page }) => {
    await seed(page, onDay(4));
    await page.goto("/journal/2");
    await expect(noteBox(page)).toHaveValue("keep-me");
    await page.goto("/journal/3");
    await noteBox(page).fill("temporary");
    await expect(page.getByText("Saved on this device.")).toBeVisible();
    await noteBox(page).fill("");
    await expect(page.getByText("Saved on this device.")).toHaveCount(0);
    await page.waitForTimeout(1000);
    const s = await stored(page);
    expect(s.journalEntries[3]).toBeUndefined();
    expect(s.journalEntries[2].entry).toBe("keep-me");
  });

  test("older entries keep their original prompt, on the entry and in Your reflections", async ({
    page,
  }) => {
    await seed(
      page,
      onDay(4, {
        journalEntries: {
          3: {
            prompt: "What did you notice in your body this morning?",
            entry: "legacy words",
            response: "",
            timestamp: daysAgo(3),
          },
        },
        outcomesByDay: {},
      }),
    );
    await page.goto("/journal/3");
    await expect(page.getByText("What did you notice in your body this morning?")).toBeVisible();
    await expect(noteBox(page)).toHaveValue("legacy words");
    await page.goto("/journal");
    await expect(page.getByRole("heading", { name: "Your reflections" })).toBeVisible();
    await expect(page.getByTestId("journal-day-3").getByTestId("entry-prompt")).toHaveText(
      "What did you notice in your body this morning?",
    );
    expect((await stored(page)).journalEntries[3].prompt).toBe(
      "What did you notice in your body this morning?",
    );
  });

  test("new labels everywhere: no Glow Journal, Daily Notes, Glow Score or streak", async ({
    page,
  }) => {
    await seed(page, onDay(6));
    for (const url of ["/home", "/journal", "/journal/6", "/day/6", "/progress", "/welcome"]) {
      await page.goto(url);
      const text = await page.locator("body").innerText();
      expect(text, url).not.toMatch(/Glow Journal|Daily Notes?|Glow Score|glow score|streak/i);
    }
    await page.goto("/home");
    await expect(page.getByRole("link", { name: /^Journal$/ })).toBeVisible();
    await page.goto("/journal");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Morning Journal.");
  });
});

test.describe("Your Ritual", () => {
  test("Progress shows completed mornings and the next morning, never a score", async ({
    page,
  }) => {
    await seed(page, onDay(7));
    await page.goto("/progress");
    const card = page.getByTestId("your-ritual");
    await expect(card).toContainText("6 of 21");
    await expect(card).toContainText("mornings complete");
    await expect(card).toContainText("Next morning: Day 7");
    await expect(card).toContainText("1Journal entry");
    await expect(card).toContainText("15Mornings to go");
    await card.getByRole("link", { name: /Next morning: Day 7/ }).click();
    await expect(page).toHaveURL(/\/day\/7$/);
  });

  test("legacy gap counts real completed mornings, not a streak", async ({ page }) => {
    await seed(page, customer({ completedDays: [1, 2, 4], shownMilestones: ["day-1"] }));
    await page.goto("/progress");
    await expect(page.getByTestId("your-ritual")).toContainText("3 of 21");
    await expect(page.getByTestId("your-ritual")).toContainText("Next morning: Day 3");
  });

  test("Day 21 celebration shows 21 mornings, no score", async ({ page }) => {
    await seed(
      page,
      customer({ completedDays: range(1, 21), shownMilestones: ["day-1", "day-7", "day-14"] }),
    );
    await page.goto("/celebrate");
    const card = page.getByTestId("your-ritual");
    await expect(card).toContainText("21");
    await expect(card).toContainText("mornings complete");
    await expect(page.getByText(/Glow Score/i)).toHaveCount(0);
  });
});

test.describe("Returning after a break", () => {
  test("a 12-day break: welcome back, same day, nothing lost", async ({ page }) => {
    await seed(page, onDay(7, { startDate: daysAgo(30), lastVisitAt: daysAgo(12) }));
    await page.goto("/home");
    await expect(page.getByTestId("welcome-back")).toHaveText(
      "Welcome back. Your 6 mornings are saved, and Day 7 is ready whenever you are.",
    );
    await expect(homePrimary(page)).toHaveText(/^Continue Day 7/);
    const s = await stored(page);
    expect(s.completedDays).toEqual(range(1, 6));
    expect(s.journalEntries[2].entry).toBe("keep-me");
    // Today's visit is recorded, so the welcome shows once, not on every open.
    expect(Date.now() - new Date(s.lastVisitAt).getTime()).toBeLessThan(60_000);
    await page.reload();
    await expect(page.getByTestId("welcome-back")).toHaveCount(0);
    await expect(homePrimary(page)).toHaveText(/^Continue Day 7/);
  });

  test("older saved data with no visit record loads normally, no welcome", async ({ page }) => {
    await seed(page, onDay(5));
    await page.goto("/home");
    await expect(page.getByTestId("welcome-back")).toHaveCount(0);
    await expect(homePrimary(page)).toHaveText(/^Continue Day 5/);
  });

  test("yesterday's visit is not a break", async ({ page }) => {
    await seed(page, onDay(5, { lastVisitAt: daysAgo(1) }));
    await page.goto("/home");
    await expect(page.getByTestId("welcome-back")).toHaveCount(0);
  });
});

test.describe("Shortened feelings check-in", () => {
  const chips = (page: Page) => page.locator("#feelings").getByRole("button");

  test("a new day offers six optional feelings, and skipping them never blocks the morning", async ({
    page,
  }) => {
    await seed(page, onDay(4, { outcomesByDay: {} }));
    await page.goto("/day/4");
    await expect(chips(page)).toHaveText([
      "Rested",
      "Energized",
      "Calm",
      "Focused",
      "Satisfied",
      "Just okay",
      "Tired",
      "Overwhelmed",
    ]);
    await expect(page.getByRole("heading", { name: "How do you feel today?" })).toBeVisible();
    await expect(page.getByText("A small check-in, just for you.", { exact: false })).toBeVisible();
    await markComplete(page, 4);
    await expect(page).toHaveURL(/\/day\/5$/);
    expect((await stored(page)).outcomesByDay[4]).toBeUndefined();
  });

  test("a day saved with older feelings still shows them, ticked, and they still count", async ({
    page,
  }) => {
    await seed(page, onDay(5, { outcomesByDay: { 3: ["Glowy", "Less bloated"], 4: ["Rested"] } }));
    await page.goto("/day/3");
    await expect(chips(page)).toHaveText([
      "Rested",
      "Energized",
      "Calm",
      "Focused",
      "Satisfied",
      "Just okay",
      "Tired",
      "Overwhelmed",
      "Comfortable",
      "Glowy",
    ]);
    await expect(chips(page).filter({ hasText: "Glowy" })).toHaveAttribute("aria-pressed", "true");
    // Unticking keeps the chip on screen, so it can be ticked again.
    await chips(page).filter({ hasText: "Glowy" }).click();
    await expect(chips(page).filter({ hasText: "Glowy" })).toHaveAttribute("aria-pressed", "false");
    let s = await stored(page);
    expect(s.outcomesByDay).toEqual({ 3: ["Less bloated"], 4: ["Rested"] });
    await chips(page).filter({ hasText: "Glowy" }).click();
    s = await stored(page);
    expect(s.outcomesByDay[3]).toEqual(["Less bloated", "Glowy"]);
    await page.goto("/progress");
    const rows = page.getByTestId("outcome-row");
    await expect(rows).toHaveCount(3);
    await expect(page.locator('[data-label="Comfortable"]')).toBeVisible();
    await expect(page.locator('[data-label="Glowy"]')).toBeVisible();
  });
});

test.describe("Quick Mornings", () => {
  test("the new name shows everywhere; ids, routes, saves and ticks still work", async ({
    page,
  }) => {
    await seed(
      page,
      onDay(4, {
        savedRecipes: ["berry-reds-yogurt-shake"],
        groceryChecked: { "qg-frozen-berries": true },
      }),
    );
    for (const url of [
      "/home",
      "/recipes",
      "/recipes?filter=quick",
      "/grocery",
      "/recipes/berry-reds-yogurt-shake",
    ]) {
      await page.goto(url);
      const text = await page.locator("body").innerText();
      expect(text, url).not.toMatch(/Quick Glow/i);
    }
    await page.goto("/home");
    await expect(page.getByTestId("quick-glow")).toContainText(
      "Short on time? Choose a simple smoothie for this morning.",
    );
    await page.getByTestId("quick-glow").click();
    await expect(page).toHaveURL(/\/recipes#quick-glow$/);
    await expect(page.getByRole("heading", { name: "Quick Mornings." })).toBeVisible();
    await page.goto("/grocery");
    await expect(page.getByText("Quick Mornings", { exact: true })).toBeVisible();
    const s = await stored(page);
    expect(s.savedRecipes).toEqual(["berry-reds-yogurt-shake"]);
    expect(s.groceryChecked).toEqual({ "qg-frozen-berries": true });
    await page.goto("/recipes/berry-reds-yogurt-shake");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
