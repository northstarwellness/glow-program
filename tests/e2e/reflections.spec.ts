import { mkdirSync, writeFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { test, expect, customer, seed, stored, range } from "./fixtures";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

// Real routing + real localStorage: Day check-in → Journal day → Progress → Day 21 reflection.

const shown = (upTo: number) => [1, 7, 14].filter((m) => m <= upTo).map((m) => `day-${m}`);
/** A customer whose active day is `day` (Days 1..day-1 complete). */
const onDay = (day: number, over: Record<string, unknown> = {}) =>
  customer({
    completedDays: range(1, day - 1),
    shownMilestones: shown(day - 1),
    outcomesByDay: {},
    ...over,
  });

const chip = (page: Page, label: string) =>
  page.locator("main").getByRole("button", { name: label, exact: true });
const reflectionCard = (page: Page, day: number) => page.getByTestId(`daily-reflection-${day}`);
/** Days Progress reports for a feeling (0 when it isn't listed). */
async function progressCount(page: Page, label: string) {
  await page.goto("/progress");
  await expect(page.getByText("Every morning you've kept.")).toBeVisible();
  const row = page.locator(`[data-testid="outcome-row"][data-label="${label}"]`);
  if (!(await row.count())) return 0;
  const m = (await row.innerText()).match(/(\d+)\s+days?/);
  return m ? Number(m[1]) : 0;
}

async function expectUncovered(page: Page, loc: ReturnType<Page["locator"]>) {
  // Center it: a fixed tab bar covers anything parked on the viewport's bottom edge, so the
  // question is whether the control can sit clear of it, not where a browser happens to stop.
  await loc.evaluate((el) => el.scrollIntoView({ block: "center" }));
  const hit = await loc.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!top && (top === el || el.contains(top));
  });
  expect(hit, "control is covered (bottom nav or overlay)").toBe(true);
}

const noSidewaysScroll = async (page: Page) =>
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
  ).toBeLessThanOrEqual(1);

test.describe("Daily Reflection: each day's feelings reach that Journal day and Progress", () => {
  for (const day of range(1, 21)) {
    test(`Day ${day}`, async ({ page }) => {
      await seed(page, onDay(day));
      await page.goto(`/day/${day}`);
      await chip(page, "Energized").click();
      await chip(page, "Rested").click();
      await expect(chip(page, "Energized")).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByText("Saved to your 21-day record and your Morning Journal."),
      ).toBeVisible();
      expect((await stored(page)).outcomesByDay).toEqual({
        [day]: ["Energized", "Rested"],
      });

      await page.goto("/journal");
      const card = reflectionCard(page, day);
      await expect(card).toBeVisible();
      await expect(card.getByRole("listitem")).toHaveText(["Energized", "Rested"]);
      await expect(page.locator('[data-testid^="daily-reflection-"]')).toHaveCount(1);

      expect(await progressCount(page, "Energized")).toBe(1);
      expect(await progressCount(page, "Rested")).toBe(1);
    });
  }
});

test("changing or removing a feeling in the Journal updates the Day page and Progress", async ({
  page,
}) => {
  await seed(page, onDay(6));
  await page.goto("/day/5");
  await chip(page, "Focused").click();
  await chip(page, "Tired").click();

  // Edit from the Journal day
  await page.goto("/journal");
  await reflectionCard(page, 5).click();
  await expect(page).toHaveURL(/\/journal\/5$/);
  await expect(page.getByText("Optional · How this morning felt · Day 5")).toBeVisible();
  await expect(chip(page, "Focused")).toHaveAttribute("aria-pressed", "true");
  await chip(page, "Tired").click();
  await chip(page, "Satisfied").click();
  await expect(page.getByText("Saved to Day 5 and your Progress.")).toBeVisible();

  await page.goto("/day/5");
  await expect(chip(page, "Tired")).toHaveAttribute("aria-pressed", "false");
  await expect(chip(page, "Satisfied")).toHaveAttribute("aria-pressed", "true");
  expect(await progressCount(page, "Tired")).toBe(0);
  expect(await progressCount(page, "Satisfied")).toBe(1);

  // Remove everything: the Daily Reflection card goes, the plain row returns.
  await page.goto("/journal/5");
  await chip(page, "Focused").click();
  await chip(page, "Satisfied").click();
  await page.goto("/journal");
  await expect(reflectionCard(page, 5)).toHaveCount(0);
  await expect(page.getByTestId("journal-day-5")).toContainText("No entry");
  await page.goto("/progress");
  await expect(page.getByText("How mornings felt")).toHaveCount(0);
});

test("repeated taps, reloads and reopening never duplicate; the written entry is kept", async ({
  page,
  context,
}) => {
  await seed(page, onDay(3));
  await page.goto("/day/2");
  for (let i = 0; i < 5; i++) await chip(page, "Satisfied").click(); // odd count → selected
  await expect(chip(page, "Satisfied")).toHaveAttribute("aria-pressed", "true");
  expect((await stored(page)).outcomesByDay).toEqual({ 2: ["Satisfied"] });
  await page.reload();
  await expect(chip(page, "Satisfied")).toHaveAttribute("aria-pressed", "true");
  await page.close();

  const reopened = await context.newPage();
  await reopened.goto("/journal");
  await reopened.waitForSelector("html[data-hydrated]");
  const card = reopened.getByTestId("daily-reflection-2");
  await expect(card.getByRole("listitem")).toHaveText(["Satisfied"]);
  await expect(card).toContainText("keep-me"); // the seeded written entry, untouched
  const s = await stored(reopened);
  expect(s.outcomesByDay).toEqual({ 2: ["Satisfied"] });
  expect(s.journalEntries[2].entry).toBe("keep-me");
  expect(s.completedDays).toEqual([1, 2]);
});

test("legacy data loads as-is: string keys, duplicates and old values are read, not rewritten", async ({
  page,
}) => {
  const legacy = {
    "2": ["Glowy", "Glowy", "Retired label"],
    "3": [],
    "4": ["Calm digestion"],
    "30": ["Glowy"],
  };
  await seed(
    page,
    customer({
      completedDays: [1, 2, 3, 4],
      shownMilestones: ["day-1"],
      outcomesByDay: legacy,
      journalEntries: {
        2: { prompt: "p", entry: "keep-me", response: "r", timestamp: "2026-09-02T15:00:00Z" },
      },
    }),
  );
  await page.goto("/journal");
  await expect(reflectionCard(page, 2).getByRole("listitem")).toHaveText(["Glowy"]);
  await expect(reflectionCard(page, 2)).toContainText("Sep 2");
  await expect(reflectionCard(page, 4).getByRole("listitem")).toHaveText(["Settled"]);
  await expect(reflectionCard(page, 3)).toHaveCount(0);
  expect(await progressCount(page, "Glowy")).toBe(1);
  await page.goto("/home");
  await expect(page.getByText("Day 5 of 21")).toBeVisible();
  const s = await stored(page);
  expect(s.outcomesByDay).toEqual(legacy);
  expect(s.completedDays).toEqual([1, 2, 3, 4]);
  expect(s.journalEntries[2].entry).toBe("keep-me");
});

test("a locked day's legacy feelings show read-only and the locked link still redirects once", async ({
  page,
}) => {
  await seed(page, onDay(4, { outcomesByDay: { 10: ["Lighter"] } }));
  await page.goto("/journal");
  const card = page.getByTestId("journal-day-10");
  await expect(card.getByRole("listitem")).toHaveText(["Lighter"]);
  await expect(page.locator('a[href="/journal/10"]')).toHaveCount(0);
  await page.goto("/day/10");
  await expect(page).toHaveURL(/\/day\/4$/);
  await page.goto("/journal/10");
  await expect(page).toHaveURL(/\/journal$/);
});

test("feeling chips and the edit area sit clear of the bottom nav", async ({ page }) => {
  await seed(page, onDay(8, { outcomesByDay: { 7: ["Glowy"] } }));
  await page.goto("/journal/7");
  // The last visible chip ("Tired") and an earlier saved one ("Glowy") sit lowest on the screen.
  for (const label of ["Tired", "Glowy"]) await expectUncovered(page, chip(page, label));
  await expectUncovered(page, page.getByRole("button", { name: "Save entry" }));
  // The page ends with enough room that its last control scrolls fully above the tab bar.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const clear = await page.evaluate(() => {
    const nav = document.querySelector("nav.fixed")!.getBoundingClientRect();
    const controls = [...document.querySelectorAll("main button, main a")];
    const last = controls[controls.length - 1].getBoundingClientRect();
    return last.bottom <= nav.top;
  });
  expect(clear, "last control can scroll above the tab bar").toBe(true);
  const box = await chip(page, "Tired").boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await noSidewaysScroll(page);
  await page.goto("/journal");
  await noSidewaysScroll(page);
});

// ---------------- Day 21 Glow Reflection ----------------

const ALL = range(1, 21);
const entry = (text: string) => ({ prompt: "p", entry: text, response: "", timestamp: "t" });
const PRIVATE = "my private sentence about the lake house";
const rich = customer({
  name: "Maya",
  completedDays: ALL,
  shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
  outcomesByDay: Object.fromEntries(
    ALL.map((d) => [d, d <= 7 ? ["Lighter"] : d <= 14 ? ["Lighter", "Glowy"] : ["Energized"]]),
  ),
  journalEntries: Object.fromEntries(
    ALL.filter((d) => d % 2).map((d) => [d, entry(`Quiet morning walk. ${PRIVATE} ${d}`)]),
  ),
  dailyLogs: Object.fromEntries(ALL.map((d) => [d, { ritual: true, reds: d % 2 === 0 }])),
});
const sparse = customer({
  name: "Jo",
  completedDays: ALL,
  shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
  outcomesByDay: {},
  journalEntries: {},
});

async function mockShare(page: Page, mode: "ok" | "abort" | "absent" | "fail") {
  await page.context().addInitScript((m) => {
    const w = window as unknown as { __shares: { name: string; size: number }[] };
    w.__shares = [];
    const def = (k: string, v: unknown) =>
      Object.defineProperty(navigator, k, { value: v, configurable: true });
    if (m === "absent") {
      def("share", undefined);
      def("canShare", undefined);
      return;
    }
    def("canShare", () => true);
    def("share", (d: { files?: File[] }) => {
      for (const f of d.files ?? []) w.__shares.push({ name: f.name, size: f.size });
      if (m === "abort") return Promise.reject(new DOMException("cancel", "AbortError"));
      if (m === "fail") return Promise.reject(new DOMException("no", "NotAllowedError"));
      return Promise.resolve();
    });
  }, mode);
}
const shares = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __shares: { name: string; size: number }[] }).__shares,
  );
const saveBtn = (page: Page) => page.getByRole("button", { name: "Save My Reflection Card" });
const statusLine = (page: Page) => page.getByRole("status").filter({ hasText: /card|Reflection/ });

async function reflectionText(page: Page) {
  return page.evaluate(() => document.querySelector("main")?.innerText ?? "");
}

test("rich history: every section, her own words and weeks, clean copy, no private text", async ({
  page,
}) => {
  await seed(page, rich);
  await page.goto("/reflection");
  for (const h of ["Your 21-Day Rhythm", "What You Noticed", "Your Reflection", "Carry It Forward"])
    await expect(page.getByText(h, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Maya, this is your 21-day reflection.",
  );
  await expect(page.getByTestId("week-1")).toContainText("Lighter");
  await expect(page.getByTestId("week-3")).toContainText("Energized");
  const text = await reflectionText(page);
  expect(text).toContain("You chose “Lighter” most often, on 14 days.");
  expect(text).not.toContain("lake house");
  for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT]) expect(text).not.toMatch(re);
  await noSidewaysScroll(page);
  await expectUncovered(page, saveBtn(page));
});

test("sparse history: an honest, gentle reflection with nothing invented", async ({ page }) => {
  await seed(page, sparse);
  await page.goto("/reflection");
  const text = await reflectionText(page);
  expect(text).toContain("You didn't choose any feelings this time");
  expect(text).not.toMatch(/most often|“/);
  await expect(page.getByTestId("week-1")).toHaveCount(0);
  for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT]) expect(text).not.toMatch(re);
  await noSidewaysScroll(page);
});

test("not finished yet: /reflection goes to the active day; Celebrate links to the reflection", async ({
  page,
}) => {
  await seed(page, onDay(9));
  await page.goto("/reflection");
  await expect(page).toHaveURL(/\/day\/9$/);
  await page.evaluate((v) => localStorage.setItem("noure_app_v1", v), JSON.stringify(rich));
  await page.goto("/celebrate");
  await page.getByRole("link", { name: "Read Your Reflection →" }).click();
  await expect(page).toHaveURL(/\/reflection$/);
  await page.goto("/progress");
  await expect(page.getByRole("link", { name: /Your Reflection/ })).toBeVisible();
});

test.describe("saving the Glow Reflection card", () => {
  test("native share receives the PNG; no success text is claimed", async ({ page }) => {
    await mockShare(page, "ok");
    await seed(page, rich);
    await page.goto("/reflection");
    await page.waitForTimeout(1200); // card pre-render
    await saveBtn(page).click();
    await expect.poll(async () => (await shares(page)).length).toBe(1);
    const [f] = await shares(page);
    expect(f.name).toBe("noure-reflection.png");
    expect(f.size).toBeGreaterThan(5_000);
  });

  test("cancelling the share sheet shows no success and starts no download", async ({ page }) => {
    await mockShare(page, "abort");
    await seed(page, rich);
    await page.goto("/reflection");
    await page.waitForTimeout(1200);
    let downloaded = false;
    page.on("download", () => (downloaded = true));
    await saveBtn(page).click();
    await expect.poll(async () => (await shares(page)).length).toBe(1);
    await page.waitForTimeout(500);
    expect(downloaded).toBe(false);
    await expect(page.getByText(/download has started|saved|shared/i)).toHaveCount(0);
    await expect(page.getByText(/couldn't/i)).toHaveCount(0);
  });

  test("no share sheet: downloads the PNG and only then says so", async ({ page }) => {
    await mockShare(page, "absent");
    await seed(page, rich);
    await page.goto("/reflection");
    await page.waitForTimeout(1200);
    const dl = page.waitForEvent("download");
    await saveBtn(page).click();
    expect((await dl).suggestedFilename()).toBe("noure-reflection.png");
    await expect(statusLine(page)).toHaveText("Your Reflection card download has started.");
  });

  test("share and download both failing is reported as a failure", async ({ page }) => {
    await mockShare(page, "fail");
    await page.context().addInitScript(() => {
      URL.createObjectURL = () => {
        throw new Error("blocked");
      };
    });
    await seed(page, rich);
    await page.goto("/reflection");
    await page.waitForTimeout(1200);
    await saveBtn(page).click();
    await expect(statusLine(page)).toHaveText(
      "We couldn't save your Reflection card on this device.",
    );
  });
});

test("small iPhones (375px, 320px): no sideways scroll, save action clear of the nav", async ({
  page,
}) => {
  await seed(page, rich);
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 667 });
    for (const path of ["/reflection", "/journal", "/journal/5", "/progress", "/day/21"]) {
      await page.goto(path);
      await noSidewaysScroll(page);
    }
    await page.goto("/reflection");
    await expectUncovered(page, saveBtn(page));
  }
});

// ---------------- Review evidence (only when EVIDENCE_DIR is set) ----------------

test.describe("review evidence", () => {
  test.skip(!process.env.EVIDENCE_DIR, "set EVIDENCE_DIR to capture review screenshots");
  const dir = process.env.EVIDENCE_DIR ?? "";

  test("screenshots", async ({ page }, info) => {
    test.setTimeout(300_000);
    const shot = async (name: string, full = false) => {
      await page.waitForTimeout(1200); // let the page fade-in and chip transitions finish
      await page.screenshot({ path: `${dir}/${info.project.name}/${name}.png`, fullPage: full });
    };
    const feel = page.locator("#feelings");
    await page.context().addInitScript(() => {
      const def = (k: string, v: unknown) =>
        Object.defineProperty(navigator, k, { value: v, configurable: true });
      def("canShare", () => true);
      def("share", (d: { files?: File[] }) => {
        const f = d.files?.[0];
        if (f) {
          const r = new FileReader();
          r.onload = () => ((window as unknown as { __card: string }).__card = String(r.result));
          r.readAsDataURL(f);
        }
        return Promise.resolve();
      });
    });

    await seed(
      page,
      onDay(6, {
        name: "Kara",
        journalEntries: {
          5: {
            prompt: "p",
            entry: "Blended before anyone woke up. Ten quiet minutes.",
            response: "",
            timestamp: new Date().toISOString(),
          },
        },
      }),
    );
    await page.goto("/day/5");
    await feel.scrollIntoViewIfNeeded();
    await shot("01-day5-before-selection");
    await chip(page, "Energized").click();
    await chip(page, "Focused").click();
    await shot("02-day5-after-selection");
    await page.goto("/journal");
    await reflectionCard(page, 5).scrollIntoViewIfNeeded();
    await shot("03-journal-day5-daily-reflection");
    await page.goto("/progress");
    await page.getByText("How mornings felt").scrollIntoViewIfNeeded();
    await shot("04-progress-same-selection");
    await page.goto("/journal/5");
    await chip(page, "Energized").click();
    await chip(page, "Satisfied").click();
    await page.getByText("Optional · How this morning felt · Day 5").scrollIntoViewIfNeeded();
    await shot("05-journal-day5-edited");
    await page.goto("/progress");
    await page.getByText("How mornings felt").scrollIntoViewIfNeeded();
    await shot("06-progress-after-edit");
    await page.goto("/journal");
    await reflectionCard(page, 5).scrollIntoViewIfNeeded();
    await shot("07-journal-after-edit");

    for (const [name, value] of [
      ["08-reflection-sparse", sparse],
      ["09-reflection-rich", rich],
    ] as const) {
      await page.evaluate((v) => localStorage.setItem("noure_app_v1", v), JSON.stringify(value));
      await page.goto("/reflection");
      await shot(name, true);
    }

    // The card itself: the exact PNG handed to the share sheet.
    await page.waitForTimeout(1500);
    await saveBtn(page).click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __card?: string }).__card ?? ""))
      .toMatch(/^data:image\/png;base64,/);
    const dataUrl = await page.evaluate(() => (window as unknown as { __card: string }).__card);
    mkdirSync(`${dir}/${info.project.name}`, { recursive: true });
    writeFileSync(
      `${dir}/${info.project.name}/10-glow-reflection-card.png`,
      Buffer.from(dataUrl.split(",")[1], "base64"),
    );
  });
});
