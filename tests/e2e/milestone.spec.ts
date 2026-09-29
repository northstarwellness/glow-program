import { test, expect, customer, seed, range } from "./fixtures";

for (const n of [1, 7, 14]) {
  test(`direct /milestone/day-${n} renders for a signed-in customer and Continue goes to the active day`, async ({
    page,
  }) => {
    await seed(page, customer({ completedDays: range(1, n) }));
    await page.goto(`/milestone/day-${n}`);
    await expect(page.getByText("Milestone", { exact: true })).toBeVisible();
    await expect(page.getByText("This page didn't load")).toHaveCount(0);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page).toHaveURL(new RegExp(`/day/${n + 1}$`));
  });

  test(`direct /milestone/day-${n} with no saved progress redirects instead of crashing`, async ({
    page,
  }) => {
    await page.goto(`/milestone/day-${n}`);
    await expect(page).not.toHaveURL(/\/milestone\//);
    await expect(page.getByText("This page didn't load")).toHaveCount(0);
  });
}

test("unknown milestone id returns home", async ({ page }) => {
  await seed(page, customer({ completedDays: [1], shownMilestones: ["day-1"] }));
  await page.goto("/milestone/day-99");
  await expect(page).toHaveURL(/\/home$/);
});

test("reached milestones are recorded and not shown again", async ({ page }) => {
  await seed(page, customer({ completedDays: range(1, 7) }));
  await page.goto("/milestone/day-7");
  await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  const s = await page.evaluate(() => JSON.parse(localStorage.getItem("noure_app_v1")!).state);
  expect(s.shownMilestones).toContain("day-7");
  expect(s.badgesEarned).toContain("day-7");
});

// Same hook-order defect class as the milestone page (hooks after an early return).
for (const path of ["/bonuses", "/profile"]) {
  test(`direct ${path} with no saved progress redirects instead of crashing`, async ({ page }) => {
    await page.goto(path);
    await expect(page).not.toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByText("This page didn't load")).toHaveCount(0);
  });
}

test("Profile → Reset my progress (three taps) clears progress without an error page", async ({
  page,
}) => {
  await seed(page, customer({ completedDays: range(1, 5) }));
  await page.goto("/profile");
  await page.getByRole("button", { name: "Reset my progress" }).click();
  await page.getByRole("button", { name: /Are you sure/ }).click();
  await page.getByRole("button", { name: /Tap once more/ }).click();
  await expect(page).not.toHaveURL(/\/profile$/);
  await expect(page.getByText("This page didn't load")).toHaveCount(0);
  const s = await page.evaluate(() => JSON.parse(localStorage.getItem("noure_app_v1")!).state);
  expect(s.completedDays).toEqual([]);
});

test("a milestone not yet reached redirects to the active day and is not recorded", async ({
  page,
}) => {
  await seed(page, customer({ completedDays: range(1, 3), shownMilestones: ["day-1"] }));
  await page.goto("/milestone/day-7");
  await expect(page).toHaveURL(/\/day\/4$/);
  const s = await page.evaluate(() => JSON.parse(localStorage.getItem("noure_app_v1")!).state);
  expect(s.shownMilestones).not.toContain("day-7");
  expect(s.badgesEarned).not.toContain("day-7");
});

test("Celebrate before the program is complete redirects to the active day and records nothing", async ({
  page,
}) => {
  await seed(page, customer({ completedDays: range(1, 3), shownMilestones: ["day-1"] }));
  await page.goto("/celebrate");
  await expect(page).toHaveURL(/\/day\/4$/);
  const s = await page.evaluate(() => JSON.parse(localStorage.getItem("noure_app_v1")!).state);
  expect(s.shownMilestones).not.toContain("day-21");
});

test("after all 21 days, Home sends the customer to Celebrate once, then stays on Home", async ({
  page,
}) => {
  await seed(
    page,
    customer({ completedDays: range(1, 21), shownMilestones: ["day-1", "day-7", "day-14"] }),
  );
  await page.goto("/home");
  await expect(page).toHaveURL(/\/celebrate$/);
  await page.goto("/home");
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText("Complete · 21 of 21")).toBeVisible();
});

test("bonuses are available (no unlock point exists in the product)", async ({ page }) => {
  await seed(page, customer());
  await page.goto("/bonuses");
  await expect(page).toHaveURL(/\/bonuses$/);
  await expect(page.getByText("Everything inside.")).toBeVisible();
});
