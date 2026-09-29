import type { Page } from "@playwright/test";
import { test, expect, customer, seed, stored, range } from "./fixtures";
import { SWAPS } from "../../src/lib/swaps";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

const shown = (upTo: number) => [1, 7, 14].filter((m) => m <= upTo).map((m) => `day-${m}`);
const onDay = (day: number, over: Record<string, unknown> = {}) =>
  customer({ completedDays: range(1, day - 1), shownMilestones: shown(day - 1), ...over });

async function clipboard(page: Page, mode: "ok" | "deny") {
  await page.context().addInitScript((m) => {
    const w = window as unknown as { __copied: string[] };
    w.__copied = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (t: string) =>
          m === "ok"
            ? (w.__copied.push(t), Promise.resolve())
            : Promise.reject(new DOMException("denied", "NotAllowedError")),
      },
    });
    document.execCommand = () => false;
  }, mode);
}

test.describe("Grocery: servings copy, Simple swaps, Copy list", () => {
  test("Radiant Reds line states 30 servings and the real 21 + 9 split", async ({ page }) => {
    await seed(page, onDay(3));
    await page.goto("/grocery");
    await expect(
      page.getByText(
        "30 servings: one scoop a morning covers all 21 Reset days, with 9 left to enjoy afterward.",
        { exact: false },
      ),
    ).toBeVisible();
    await expect(page.getByText(/covers the full 21 days/)).toHaveCount(0);
  });

  test("Simple swaps lists every curated swap, honestly framed, and is readable on a phone", async ({
    page,
  }) => {
    await seed(page, onDay(3));
    await page.goto("/grocery");
    const sec = page.getByTestId("simple-swaps");
    await sec.scrollIntoViewIfNeeded();
    await expect(sec.getByRole("heading", { name: "Simple swaps" })).toBeVisible();
    await expect(sec).toContainText("it isn’t a nutritional match, and your list stays as it is");
    await expect(sec.locator("li")).toHaveCount(SWAPS.length);
    for (const sw of SWAPS) await expect(sec).toContainText(sw.swap);
    await expect(sec).toContainText("Used in: Cherry Cacao");
    const text = await sec.innerText();
    for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT]) expect(text).not.toMatch(re);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(1);
  });

  test("Copy list says Copied! only after a real clipboard write, and never includes swaps", async ({
    page,
  }) => {
    await clipboard(page, "ok");
    await seed(page, onDay(3, { groceryChecked: {} }));
    await page.goto("/grocery");
    const before = (await stored(page)).groceryChecked;
    await page.getByRole("button", { name: "Copy list" }).click();
    await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible();
    const copied = await page.evaluate(
      () => (window as unknown as { __copied: string[] }).__copied,
    );
    expect(copied).toHaveLength(1);
    expect(copied[0]).toContain("☐ Radiant Reds");
    expect(copied[0]).not.toMatch(/Swap:|Simple swaps/);
    expect((await stored(page)).groceryChecked).toEqual(before);
  });

  test("Copy list never claims success when the clipboard is blocked", async ({ page }) => {
    await clipboard(page, "deny");
    await seed(page, onDay(3, { groceryChecked: {} }));
    await page.goto("/grocery");
    await page.getByRole("button", { name: "Copy list" }).click();
    await expect(page.getByRole("textbox", { name: "Text to copy" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copied!" })).toHaveCount(0);
    await expect(page.getByText(/copied/i)).toHaveCount(0);
  });
});

test.describe("Check-in options and Today’s prompt", () => {
  test("the four new options save to the right day; older choices still show", async ({ page }) => {
    await seed(page, onDay(5, { outcomesByDay: { 2: ["Glowy", "Less bloated"] } }));
    await page.goto("/day/5");
    for (const label of ["Rested", "Focused", "Just okay", "Tired"])
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Just okay", exact: true }).click();
    await page.getByRole("button", { name: "Rested", exact: true }).click();
    expect((await stored(page)).outcomesByDay).toEqual({
      2: ["Glowy", "Less bloated"],
      5: ["Just okay", "Rested"],
    });
    await page.goto("/journal");
    await expect(page.getByTestId("daily-reflection-5").getByRole("listitem")).toHaveText([
      "Rested",
      "Just okay",
    ]);
    await expect(page.getByTestId("daily-reflection-2").getByRole("listitem")).toHaveText([
      "Comfortable",
      "Glowy",
    ]);
  });

  test("Today’s prompt sits on a pearl surface, not a pink fill, with readable text", async ({
    page,
  }) => {
    await seed(page, onDay(4));
    await page.goto("/day/4");
    const card = page.locator('a[href="/journal/4"]').filter({ hasText: "Today's prompt" });
    await expect(card).toBeVisible();
    expect(await card.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      "rgb(255, 255, 255)",
    );
  });

  test("the header title reads RITUAL APP (no NOURÉ header) and goes Home", async ({ page }) => {
    await seed(page, onDay(4));
    await page.goto("/progress");
    const title = page.getByRole("link", { name: "Ritual App, home" });
    await expect(title).toHaveText("RITUAL APP");
    await expect(page.locator("main").getByText("NOURÉ", { exact: true })).toHaveCount(0);
    await title.click();
    await expect(page).toHaveURL(/\/home$/);
  });
});

// ---------------- Private Day 21 reflection with journal words ----------------

const ALL = range(1, 21);
const entry = (text: string) => ({ prompt: "p", entry: text, response: "", timestamp: "t" });
const LINES: Record<number, string> = {
  2: "I noticed the kitchen is quiet before anyone else wakes up.",
  9: "Making it is getting easier than the first week.",
  11: "I blended it faster because I prepped the fruit the night before.",
  13: "My doctor appointment was stressful.",
  17: "I enjoy the ten minutes more than I expected when I started.",
  20: "I want to keep a slow first ten minutes after day 21.",
};
const rich = customer({
  name: "Maya",
  completedDays: ALL,
  shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
  outcomesByDay: Object.fromEntries(ALL.map((d) => [d, d < 11 ? ["Rested"] : ["Focused"]])),
  journalEntries: Object.fromEntries(ALL.map((d) => [d, entry(LINES[d] ?? `Day ${d}. Fine.`)])),
});
const sparse = customer({
  name: "Jo",
  completedDays: ALL,
  shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
  outcomesByDay: {},
  journalEntries: { 4: entry("ok") },
});

test.describe("Private Glow Reflection", () => {
  test("21 entries: verbatim, dated excerpts on the private screen, with an open question", async ({
    page,
  }) => {
    await seed(page, rich);
    await page.goto("/reflection");
    const words = page.getByTestId("own-words");
    await words.scrollIntoViewIfNeeded();
    await expect(words).toContainText(
      "Private to this screen. Not included on your Glow Reflection card.",
    );
    await expect(words.locator("blockquote")).toHaveText([
      `“${LINES[2]}”`,
      `“${LINES[11]}”`,
      `“${LINES[17]}”`,
    ]);
    await expect(words).toContainText("Day 11 · Week 2");
    await expect(words).toContainText("Where a sentence gives a reason, the reason is yours.");
    // Day 9 has no first-person words, so it is not quoted.
    await expect(words).not.toContainText(LINES[9]);
    await expect(words).toContainText(
      "Reading your Week 1 words beside your Week 3 words, what do you notice?",
    );
    await expect(page.locator("main")).not.toContainText("doctor");
    await expect(page.locator("main")).toContainText(`On Day 20 you wrote: “${LINES[20]}”`);
  });

  test("sparse writing: honest about what is available, nothing invented", async ({ page }) => {
    await seed(page, sparse);
    await page.goto("/reflection");
    const words = page.getByTestId("own-words");
    await expect(words).toContainText("none are quoted here");
    await expect(words.locator("blockquote")).toHaveCount(0);
  });

  test("the saved Glow Reflection card is built without any journal words", async ({ page }) => {
    await page.context().addInitScript(() => {
      const w = window as unknown as { __texts: string[] };
      w.__texts = [];
      const orig = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (t: string, ...rest: number[]) {
        w.__texts.push(String(t));
        return orig.call(this, t, ...(rest as [number, number]));
      };
    });
    await seed(page, rich);
    await page.goto("/reflection");
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __texts: string[] }).__texts.length))
      .toBeGreaterThan(5);
    const drawn = (await page.evaluate(() => (window as unknown as { __texts: string[] }).__texts))
      .join(" ")
      .replace(/\u200a/g, "");
    for (const line of Object.values(LINES)) expect(drawn).not.toContain(line.slice(0, 20));
    expect(drawn).not.toMatch(/kitchen|prepped|doctor|slow first/i);
  });
});

// ---------------- Review evidence (only when EVIDENCE_DIR is set) ----------------

test.describe("review evidence", () => {
  test.skip(!process.env.EVIDENCE_DIR, "set EVIDENCE_DIR to capture review screenshots");
  const dir = process.env.EVIDENCE_DIR ?? "";

  test("screenshots", async ({ page }, info) => {
    test.setTimeout(300_000);
    const shot = async (name: string, full = false) => {
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${dir}/${info.project.name}/${name}.png`, fullPage: full });
    };
    const load = async (v: object, path: string) => {
      await page.goto("/");
      await page.evaluate((x) => localStorage.setItem("noure_app_v1", x), JSON.stringify(v));
      await page.goto(path);
    };
    const center = (sel: string) =>
      page
        .locator(sel)
        .first()
        .evaluate((el) => el.scrollIntoView({ block: "center" }));

    await load(onDay(6, { name: "Kara" }), "/home");
    await shot("01-home-day6-top");
    await center('[data-testid="week-1"]');
    await shot("02-home-week-dots");
    await center('nav[aria-label="More in your ritual"]');
    await shot("03-home-link-group");
    await shot("04-home-day6-full", true);
    await load(onDay(9, { name: "Kara" }), "/home");
    await center('[data-testid="week-2"]');
    await shot("05-home-day9-build-week");
    await load(onDay(6, { name: "Kara" }), "/day/6");
    await center('a[href="/journal/6"]');
    await shot("06-day6-todays-prompt-pearl");
    await center("#feelings");
    await shot("07-day6-checkin-options");
    await load(onDay(6, { name: "Kara" }), "/grocery");
    await shot("08-pantry-top-servings");
    await center('[data-testid="simple-swaps"]');
    await page.getByTestId("simple-swaps").evaluate((el) => el.scrollIntoView({ block: "start" }));
    await shot("09-pantry-simple-swaps");
    await load(
      { ...rich, state: { ...(rich as { state: object }).state, name: "Maya" } },
      "/reflection",
    );
    await shot("10-reflection-rich-full", true);
    await center('[data-testid="own-words"]');
    await shot("11-reflection-rich-own-words");
    await load(sparse, "/reflection");
    await shot("12-reflection-sparse-full", true);
    await page.setViewportSize({ width: 320, height: 640 });
    await load(onDay(6, { name: "Kara" }), "/home");
    await shot("13-home-320px-full", true);
    await load(onDay(6, { name: "Kara" }), "/grocery");
    await center('[data-testid="simple-swaps"]');
    await shot("14-pantry-swaps-320px");
  });
});
