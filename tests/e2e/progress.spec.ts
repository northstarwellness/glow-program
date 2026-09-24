import type { Page } from "@playwright/test";
import {
  test,
  expect,
  customer,
  seed,
  stored,
  range,
  markComplete,
  ready,
  rawGoto,
} from "./fixtures";

// Real routing + real localStorage throughout — nothing about progression is mocked.

const MILESTONES = [1, 7, 14];
const shownFor = (completedUpTo: number) =>
  MILESTONES.filter((m) => m <= completedUpTo).map((m) => `day-${m}`);
const withMilestones = (days: number[]) =>
  customer({ completedDays: days, shownMilestones: shownFor(Math.max(0, ...days)) });

/** The primary action is on screen, enabled, and not covered by the fixed nav or anything else. */
async function expectUncovered(page: Page, name: RegExp) {
  const btn = page.getByRole("button", { name });
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
  await btn.scrollIntoViewIfNeeded();
  const hit = await btn.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!top && (top === el || el.contains(top));
  });
  expect(hit, "primary action is covered").toBe(true);
}

async function expectNotBlank(page: Page) {
  // Poll: a redirect or the loading skeleton can be on screen for an instant.
  await expect
    .poll(async () => (await page.locator("body").innerText()).trim().length, { timeout: 10_000 })
    .toBeGreaterThan(20);
  await expect(page.getByText("This page didn't load")).toHaveCount(0);
}

/** Home, Rituals and Journal all agree on the active day and what is open. */
async function expectDerivedState(page: Page, active: number, completedUpTo: number) {
  await page.goto("/home");
  await expect(page.getByText(`Day ${active} of 21`)).toBeVisible();
  await expect(page.getByText(`${Math.round((completedUpTo / 21) * 100)}% complete`)).toBeVisible();
  await expect(page.locator(`a[href="/day/${active}"]`).first()).toBeVisible();

  await page.goto("/rituals");
  const openDays = await page
    .locator('main a[href^="/day/"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(openDays).toEqual(range(1, Math.max(active, completedUpTo)).map((d) => `/day/${d}`));

  await page.goto("/journal");
  await expect(
    page.locator(`a[href="/journal/${active}"]`).filter({ hasText: `Today / Day ${active}` }),
  ).toBeVisible();
}

test.describe("every day, Day 1 → Day 21 (table-driven)", () => {
  for (let n = 1; n <= 21; n++) {
    const next = n === 21 ? "/celebrate" : `/day/${n + 1}`;
    test(`Day ${n} → ${n === 21 ? "Celebrate" : `Day ${n + 1}`}${MILESTONES.includes(n) ? " (via milestone)" : ""}`, async ({
      page,
    }) => {
      await seed(page, withMilestones(range(1, n - 1)));

      if (n > 1) {
        // earlier completed day stays viewable, shown as complete
        await page.goto(`/day/${n - 1}`);
        await expect(page).toHaveURL(new RegExp(`/day/${n - 1}$`));
        await expect(page.getByRole("button", { name: `Day ${n - 1} complete` })).toBeVisible();
      }
      if (n < 21) {
        // the next day is locked → safe redirect to the active day
        await page.goto(`/day/${n + 1}`);
        await expect(page).toHaveURL(new RegExp(`/day/${n}$`));
      }
      await page.goto(`/day/${n}`); // direct navigation to the unlocked day
      await expect(page).toHaveURL(new RegExp(`/day/${n}$`));
      await expectNotBlank(page);

      // Owner path: Home → Open Today's Ritual → Mark complete
      await page.goto("/home");
      await expect(page.getByText(`Day ${n} of 21`)).toBeVisible();
      await page.getByText("Open Today's Ritual").click();
      await expect(page).toHaveURL(new RegExp(`/day/${n}$`));
      await expectUncovered(page, new RegExp(`^Mark Day ${n} Complete`));
      await markComplete(page, n);

      if (MILESTONES.includes(n)) {
        await expect(page).toHaveURL(new RegExp(`/milestone/day-${n}$`));
        await page.getByRole("button", { name: "Continue" }).click();
      }
      await expect(page).toHaveURL(new RegExp(`${next}$`));
      await expectNotBlank(page);
      const s = await stored(page);
      expect(s.completedDays).toEqual(range(1, n));

      if (n < 21) {
        await expectUncovered(page, new RegExp(`^Mark Day ${n + 1} Complete`));
        // Back / Forward never reactivate Day N
        await page.goBack();
        await ready(page);
        await expect(page).not.toHaveURL(new RegExp(`/day/${n}$`));
        await expect(page.getByText(`Day ${n + 1} of 21`)).toBeVisible();
        await page.goForward();
        await ready(page);
        await expect(page).toHaveURL(new RegExp(`/day/${n + 1}$`));
        // Refresh keeps the new day
        await page.reload();
        await expect(page).toHaveURL(new RegExp(`/day/${n + 1}$`));
        await expect(
          page.getByRole("button", { name: new RegExp(`^Mark Day ${n + 1} Complete`) }),
        ).toBeVisible();
        await expectDerivedState(page, n + 1, n);
      } else {
        await expect(page.getByRole("heading", { name: /You did it/ })).toBeVisible();
        await page.reload();
        await expect(page).toHaveURL(/\/celebrate$/);
        await expectDerivedState(page, 21, 21);
        expect((await stored(page)).shownMilestones).toContain("day-21");
      }
      expect((await stored(page)).completedDays).toEqual(range(1, n)); // unchanged by all the navigation
    });
  }
});

test("every future day is locked and redirects to the active day", async ({ page }) => {
  test.setTimeout(180_000); // 40 navigations
  await seed(page, withMilestones(range(1, 4)));
  for (let d = 6; d <= 21; d++) {
    await page.goto(`/day/${d}`);
    await expect(page, `Day ${d} should be locked`).toHaveURL(/\/day\/5$/);
    await page.goto(`/journal/${d}`);
    await expect(page, `Journal ${d} should be locked`).toHaveURL(/\/journal$/);
  }
  for (const bad of ["22", "0", "abc", "5.5"]) {
    await page.goto(`/day/${bad}`);
    await expect(page, `/day/${bad}`).toHaveURL(/\/day\/5$/);
  }
});

test("uninterrupted journey: fresh customer completes Days 1 → 21", async ({ page }) => {
  test.setTimeout(300_000);
  await seed(page, customer());
  await page.goto("/home");
  await page.getByText("Open Today's Ritual").click();
  for (let n = 1; n <= 21; n++) {
    await expect(page).toHaveURL(new RegExp(`/day/${n}$`));
    await markComplete(page, n);
    if (MILESTONES.includes(n)) {
      await expect(page).toHaveURL(new RegExp(`/milestone/day-${n}$`));
      await page.getByRole("button", { name: "Continue" }).click();
    }
    expect((await stored(page)).completedDays).toEqual(range(1, n));
  }
  await expect(page).toHaveURL(/\/celebrate$/);
  expect((await stored(page)).journalEntries[2].entry).toBe("keep-me");
});

test("journey with a reload between every day", async ({ page }) => {
  test.setTimeout(480_000); // 21 days x (navigate + reload) — slow on a loaded machine
  await seed(page, customer());
  await page.goto("/home");
  for (let n = 1; n <= 21; n++) {
    await page.reload();
    await expect(page.getByText(`Day ${n} of 21`)).toBeVisible();
    await page.getByText("Open Today's Ritual").click();
    await expect(page).toHaveURL(new RegExp(`/day/${n}$`));
    await markComplete(page, n);
    if (MILESTONES.includes(n)) {
      await expect(page).toHaveURL(new RegExp(`/milestone/day-${n}$`));
      await page.getByRole("button", { name: "Continue" }).click();
    }
    // Let the app's own navigation fully render the next step before refreshing
    // (WebKit cancels a reload issued while a client-side navigation is still settling).
    await expect(page).toHaveURL(new RegExp(n === 21 ? "/celebrate$" : `/day/${n + 1}$`));
    await expect(
      n === 21
        ? page.getByRole("heading", { name: /You did it/ })
        : page.getByRole("button", { name: new RegExp(`^Mark Day ${n + 1} Complete`) }),
    ).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(new RegExp(n === 21 ? "/celebrate$" : `/day/${n + 1}$`));
    expect((await stored(page)).completedDays).toEqual(range(1, n));
    if (n < 21) await page.goto("/home");
  }
});

test("close and reopen (new tab, same device) keeps progress", async ({ page, context }) => {
  await seed(page, withMilestones(range(1, 5)));
  await page.goto("/home");
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto("/");
  await ready(reopened);
  await expect(reopened).toHaveURL(/\/home$/);
  await expect(reopened.getByText("Day 6 of 21")).toBeVisible();
});

test.describe("legacy and non-sequential saved states", () => {
  const cases: [string, unknown[], number][] = [
    ["no completed days", [], 1],
    ["Days 1–4", range(1, 4), 5],
    ["Days 1–5", range(1, 5), 6],
    ["Days 1–6", range(1, 6), 7],
    ["Days 1–13", range(1, 13), 14],
    ["Days 1–20", range(1, 20), 21],
    ["duplicates", [1, 1, 2, 3, 3, 4], 5],
    ["out of order", [4, 1, 3, 2], 5],
    ["legacy strings", ["1", "2", "3", "4"], 5],
  ];
  for (const [label, days, active] of cases) {
    test(`${label} → Home shows Day ${active}`, async ({ page }) => {
      await seed(
        page,
        customer({ completedDays: days, shownMilestones: ["day-1", "day-7", "day-14"] }),
      );
      await page.goto("/home");
      await expect(page.getByText(`Day ${active} of 21`)).toBeVisible();
      await page.getByText("Open Today's Ritual").click();
      await expect(page).toHaveURL(new RegExp(`/day/${active}$`));
    });
  }

  test("all 21 complete → consistent everywhere, no Day 22", async ({ page }) => {
    await seed(
      page,
      customer({
        completedDays: range(1, 21),
        shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
      }),
    );
    await expectDerivedState(page, 21, 21);
    await page.goto("/day/22");
    await expect(page).toHaveURL(/\/day\/21$/);
    await expect(page.getByRole("button", { name: "Day 21 complete" })).toBeVisible();
    await page.goto("/celebrate");
    await expect(page.getByRole("heading", { name: /You did it/ })).toBeVisible();
  });

  test("gap Days 1–4 + 6 → Day 5 active; completing it goes to Day 7; Day 6 progress kept", async ({
    page,
  }) => {
    await seed(page, customer({ completedDays: [1, 2, 3, 4, 6], shownMilestones: ["day-1"] }));
    await page.goto("/home");
    await expect(page.getByText("Day 5 of 21")).toBeVisible();
    await page.getByText("Open Today's Ritual").click();
    await markComplete(page, 5);
    await expect(page).toHaveURL(/\/day\/7$/);
    expect((await stored(page)).completedDays).toEqual(range(1, 6));
  });

  test("recoverable malformed fields load without crashing", async ({ page }) => {
    await page.context().addInitScript(() => {
      if (!localStorage.getItem("noure_app_v1"))
        localStorage.setItem(
          "noure_app_v1",
          JSON.stringify({
            state: {
              verifiedEmail: "q@x.test",
              name: "QA",
              seenWelcome: true,
              completedDays: [2, "1", 2, null, 3],
              dailyLogs: null,
              journalEntries: "x",
              outcomesByDay: [],
              shownMilestones: ["day-1"],
            },
            version: 0,
          }),
        );
    });
    for (const path of ["/home", "/rituals", "/journal", "/progress", "/day/4"]) {
      await page.goto(path);
      await expectNotBlank(page);
    }
    await page.goto("/home");
    await expect(page.getByText("Day 4 of 21")).toBeVisible();
  });

  test("unreadable saved JSON: no crash, no false completion, original kept in a backup key", async ({
    page,
  }) => {
    await page.context().addInitScript(() => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem("noure_app_v1", "{broken json");
        sessionStorage.setItem("seeded", "1");
      }
    });
    await page.goto("/home");
    // No readable customer → the email verification screen (never a crash, never "complete").
    await expect(page).toHaveURL(/\/verify$/);
    await expectNotBlank(page);
    expect(await page.evaluate(() => localStorage.getItem("noure_app_v1_unreadable_backup"))).toBe(
      "{broken json",
    );
  });
});

test.describe("taps and timing", () => {
  test.beforeEach(async ({ page }) => seed(page, withMilestones(range(1, 4))));

  test("rapid double-tap records Day 5 once and never completes Day 6", async ({ page }) => {
    await page.goto("/day/5");
    const btn = page.getByRole("button", { name: /^Mark Day 5 Complete/ });
    await btn.scrollIntoViewIfNeeded();
    const box = (await btn.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(300);
    // Whatever the extra taps landed on, Day 6 was never recorded and no day was skipped.
    expect((await stored(page)).completedDays).toEqual(range(1, 5));
    await expect(page).not.toHaveURL(/\/day\/7$/);
  });

  test("reload during completion keeps Day 5 recorded and opens Day 6", async ({ page }) => {
    await page.goto("/day/5");
    await page.getByRole("button", { name: /^Mark Day 5 Complete/ }).click({ noWaitAfter: true });
    await page.reload();
    expect((await stored(page)).completedDays).toEqual(range(1, 5));
    await page.goto("/home");
    await expect(page.getByText("Day 6 of 21")).toBeVisible();
  });

  test("storage write failure shows an honest error and does not advance", async ({ page }) => {
    await page.goto("/day/5");
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException("full", "QuotaExceededError");
      };
    });
    await markComplete(page, 5);
    await expect(page.getByRole("alert")).toHaveText(/couldn't save your progress/);
    await expect(page).toHaveURL(/\/day\/5$/);
  });
});

test.describe("before saved progress loads (hydration)", () => {
  const PAGES = ["/home", "/rituals", "/journal", "/journal/3", "/day/5"];

  test("server first paint shows a skeleton and no day links (JavaScript off)", async ({
    browser,
    baseURL,
  }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await ctx.newPage();
    for (const path of PAGES) {
      await page.goto(path);
      await expect(page.locator('[aria-busy="true"]'), path).toHaveCount(1);
      await expect(page.locator('a[href^="/day/"], a[href^="/journal/"]'), path).toHaveCount(0);
      await expect(page.getByText(/Day \d+ of 21|Mark Day \d+ Complete/), path).toHaveCount(0);
    }
    await ctx.close();
  });

  test("slow script load: nothing day-specific is tappable, then the real day appears", async ({
    page,
  }) => {
    await seed(page, withMilestones(range(1, 4)));
    let hold = true;
    await page.route("**/assets/*.js", async (route) => {
      while (hold) await new Promise((r) => setTimeout(r, 100));
      await route.continue();
    });
    for (const path of PAGES) {
      hold = true;
      await rawGoto(page, path, { waitUntil: "commit" });
      await page.waitForSelector('[aria-busy="true"]');
      await expect(page.locator('a[href^="/day/"], a[href^="/journal/"]')).toHaveCount(0);
      await page.mouse.click(200, 300); // a stray early tap does nothing
      expect(page.url()).toContain(path);
      hold = false;
      await ready(page);
    }
    await page.goto("/home");
    await expect(page.getByText("Day 5 of 21")).toBeVisible();
    expect((await stored(page)).completedDays).toEqual(range(1, 4));
  });

  test("saved journal entry and profile values appear after a hard load", async ({ page }) => {
    await seed(
      page,
      customer({
        completedDays: [1],
        shownMilestones: ["day-1"],
        notificationTime: "06:30",
        journalEntries: {
          1: { prompt: "p", entry: "My saved Day 1 entry", response: "", timestamp: "t" },
        },
      }),
    );
    await page.goto("/journal/1");
    await expect(page.locator("textarea").first()).toHaveValue("My saved Day 1 entry");
    await page.goto("/profile");
    await expect(page.locator("input").first()).toHaveValue("QA");
    await expect(page.locator('input[type="time"]')).toHaveValue("06:30");
  });
});
