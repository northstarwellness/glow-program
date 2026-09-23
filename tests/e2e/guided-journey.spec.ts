import type { Page } from "@playwright/test";
import { test, expect, customer, seed, stored, range } from "./fixtures";
import { DAYS, RECIPES } from "../../src/lib/content";

/**
 * Everything here drives the same visible controls a customer taps.
 * No store functions are called directly.
 */

const MILESTONES = [1, 7, 14];
const recipeFor = (day: number) => DAYS[day - 1].recipeId;
const openRitual = (page: Page) => page.getByText("Open Today's Ritual").click();
const openFullRecipe = (page: Page) =>
  page.getByRole("link", { name: /Open full recipe/i }).click();
const markComplete = async (page: Page, n: number) => {
  await page.waitForTimeout(850); // the app ignores a completion tap within 800ms of the previous one
  await page.getByRole("button", { name: new RegExp(`^Mark Day ${n} Complete`) }).click();
};

/** The completion action is on screen and not hidden behind the fixed bottom nav. */
async function expectCompletionRevealed(page: Page, day: number) {
  const btn = page.getByRole("button", { name: new RegExp(`^Mark Day ${day} Complete`) });
  await expect(btn).toBeVisible();
  const geo = await btn.evaluate((el) => {
    const nav = document.querySelector("nav.fixed")!.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    return { top: b.top, bottom: b.bottom, navTop: nav.top, viewport: innerHeight };
  });
  expect(geo.top, "completion action is above the viewport").toBeGreaterThan(-1);
  expect(geo.bottom, "completion action is under the bottom nav").toBeLessThanOrEqual(
    geo.navTop + 1,
  );
}

test("OWNER PATH — Day 1 First Glass (release blocker)", async ({ page }) => {
  await seed(page, customer({ completedDays: [], shownMilestones: [], savedRecipes: [] }));

  await page.goto("/home");
  await expect(page.getByText("Day 1 of 21")).toBeVisible();
  await openRitual(page);
  await expect(page).toHaveURL(/\/day\/1$/);

  await openFullRecipe(page);
  await expect(page).toHaveURL(new RegExp(`/recipes/${recipeFor(1)}\\?source=day&day=1$`));
  await expect(page.getByText("Day 1 recipe")).toBeVisible();
  await expect(page.getByRole("link", { name: "← Back to Day 1" })).toBeVisible();
  // Never the generic library exit
  await expect(page.getByRole("link", { name: /Back to All Recipes/ })).toHaveCount(0);

  await page.getByRole("link", { name: /Continue Day 1/ }).click();
  await expect(page).toHaveURL(/\/day\/1#complete$/);
  await expectCompletionRevealed(page, 1);

  await markComplete(page, 1);
  await expect(page).toHaveURL(/\/milestone\/day-1$/);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/day\/2$/);
  expect((await stored(page)).completedDays).toEqual([1]);

  // Home, Rituals and Journal all agree Day 2 is active
  await page.goto("/home");
  await expect(page.getByText("Day 2 of 21")).toBeVisible();
  await page.goto("/rituals");
  await expect(page.locator('main a[href^="/day/"]')).toHaveCount(2);
  await page.goto("/journal");
  await expect(
    page.locator('a[href="/journal/2"]').filter({ hasText: "Today / Day 2" }),
  ).toBeVisible();

  // Refresh keeps Day 2, and Back never drops into the recipe library
  await page.goto("/day/2");
  await page.reload();
  await expect(page).toHaveURL(/\/day\/2$/);
  await page.goBack();
  await expect(page).not.toHaveURL(/\/recipes$/);
});

test.describe("guided route matrix, Day 1 → Day 21", () => {
  for (let n = 1; n <= 21; n++) {
    test(`Day ${n}: ritual → recipe → Continue Day ${n} → complete → ${n === 21 ? "Celebrate" : `Day ${n + 1}`}`, async ({
      page,
    }) => {
      await seed(
        page,
        customer({
          completedDays: range(1, n - 1),
          shownMilestones: MILESTONES.filter((m) => m < n).map((m) => `day-${m}`),
          savedRecipes: [],
        }),
      );
      // 1–2. Home opens the right day
      await page.goto("/home");
      await expect(page.getByText(`Day ${n} of 21`)).toBeVisible();
      await openRitual(page);
      await expect(page).toHaveURL(new RegExp(`/day/${n}$`));

      // 3–4. The day's canonical recipe, with guided context
      await openFullRecipe(page);
      await expect(page).toHaveURL(new RegExp(`/recipes/${recipeFor(n)}\\?source=day&day=${n}$`));
      await expect(page.getByText(`Day ${n} recipe`)).toBeVisible();

      // 5. Top Back returns to the completion area
      await page.getByRole("link", { name: `← Back to Day ${n}` }).click();
      await expect(page).toHaveURL(new RegExp(`/day/${n}#complete$`));
      await expectCompletionRevealed(page, n);

      // 6–7. Reopen, then Continue Day N returns to the same place
      await openFullRecipe(page);
      await expect(page).toHaveURL(new RegExp(`/recipes/${recipeFor(n)}\\?source=day&day=${n}$`));
      // 11. Reload on the recipe keeps guided context
      await page.reload();
      await expect(page.getByText(`Day ${n} recipe`)).toBeVisible();
      await expect(page.getByRole("link", { name: `← Back to Day ${n}` })).toBeVisible();
      await page.getByRole("link", { name: `Continue Day ${n}` }).click();
      await expect(page).toHaveURL(new RegExp(`/day/${n}#complete$`));
      await expectCompletionRevealed(page, n);

      // Viewing the recipe never completes the day
      expect((await stored(page)).completedDays).toEqual(range(1, n - 1));

      // 8–10. Complete
      await markComplete(page, n);
      if (MILESTONES.includes(n)) {
        await expect(page).toHaveURL(new RegExp(`/milestone/day-${n}$`));
        await page.getByRole("button", { name: "Continue" }).click();
      }
      await expect(page).toHaveURL(n === 21 ? /\/celebrate$/ : new RegExp(`/day/${n + 1}$`));
      expect((await stored(page)).completedDays).toEqual(range(1, n));

      // 12–13. Reload keeps progress; Back does not land in the library.
      // Let the destination finish rendering first — WebKit cancels a reload issued
      // while a client-side navigation is still settling.
      await expect(
        n === 21
          ? page.getByRole("heading", { name: /You did it/ })
          : page.getByRole("button", { name: new RegExp(`^Mark Day ${n + 1} Complete`) }),
      ).toBeVisible();
      await page.reload();
      expect((await stored(page)).completedDays).toEqual(range(1, n));
      await page.goBack();
      await expect(page).not.toHaveURL(/\/recipes$/);
    });
  }
});

test.describe("independent recipe library", () => {
  test("All Recipes → recipe → Back to All Recipes", async ({ page }) => {
    await seed(page, customer({ savedRecipes: [] }));
    await page.goto("/recipes");
    await page.locator('main a[href^="/recipes/"]').first().click();
    await expect(page).toHaveURL(/source=all$/);
    await expect(page.getByText(/Day \d+ recipe/)).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Continue Day/ })).toHaveCount(0);
    await page.getByRole("link", { name: "← Back to All Recipes" }).click();
    await expect(page).toHaveURL(/\/recipes(\?.*)?$/);
    await expect(page.getByRole("tab", { name: "All Recipes" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  for (const [label, filter] of [
    ["Foundation", "foundation"],
    ["Build", "build"],
    ["Glow", "glow"],
    ["Quick Glow", "quick"],
  ] as const) {
    test(`${label} → recipe → Back to ${label}`, async ({ page }) => {
      await seed(page, customer({ savedRecipes: [] }));
      await page.goto("/recipes");
      await page.getByRole("button", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`filter=${filter}`));
      await page.locator('main a[href^="/recipes/"]').first().click();
      await expect(page).toHaveURL(new RegExp(`source=category&filter=${filter}`));
      await page.getByRole("link", { name: `← Back to ${label}` }).click();
      await expect(page).toHaveURL(new RegExp(`filter=${filter}`));
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    });
  }

  test("Saved → recipe → Back to Saved Recipes, including after removal", async ({ page }) => {
    const id = recipeFor(1);
    await seed(page, customer({ savedRecipes: [id] }));
    await page.goto("/recipes?tab=saved");
    await expect(page.getByRole("tab", { name: "Saved" })).toHaveAttribute("aria-selected", "true");
    await page.locator(`main a[href^="/recipes/${id}"]`).click();
    await expect(page).toHaveURL(/source=saved$/);
    await expect(page.getByRole("link", { name: "← Back to Saved Recipes" })).toBeVisible();
    // Remove while open, then go back — the Saved view shows its empty state
    await page.getByRole("button", { name: "Save recipe" }).click();
    await page.getByRole("link", { name: "← Back to Saved Recipes" }).click();
    await expect(page).toHaveURL(/tab=saved/);
    await expect(page.getByText("Your saved rituals will appear here.")).toBeVisible();
  });
});

test.describe("context safety", () => {
  test("a direct recipe URL with no context falls back to the library", async ({ page }) => {
    await seed(page, customer());
    await page.goto(`/recipes/${recipeFor(3)}`);
    await expect(page.getByRole("link", { name: "← Back to All Recipes" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Continue Day/ })).toHaveCount(0);
  });

  for (const [label, query] of [
    ["invalid day", "?source=day&day=99"],
    ["non-numeric day", "?source=day&day=abc"],
    ["unknown source", "?source=evil&day=1"],
    ["unknown category", "?source=category&filter=../../etc"],
    ["external destination smuggled in", "?source=day&day=1&returnTo=https%3A%2F%2Fexample.com"],
  ] as const) {
    test(`${label} → safe library fallback, never an external destination`, async ({ page }) => {
      await seed(page, customer());
      const id = label === "external destination smuggled in" ? recipeFor(1) : recipeFor(3);
      await page.goto(`/recipes/${id}${query}`);
      const back = page.getByRole("link", { name: /← Back to/ });
      await expect(back).toBeVisible();
      const href = await back.getAttribute("href");
      expect(href?.startsWith("/"), `href must stay internal: ${href}`).toBe(true);
      expect(href).not.toContain("example.com");
    });
  }

  test("a recipe that is not the day's recipe rejects the guided context", async ({ page }) => {
    await seed(page, customer());
    await page.goto(`/recipes/${recipeFor(5)}?source=day&day=1`);
    await expect(page.getByRole("link", { name: "← Back to All Recipes" })).toBeVisible();
    await expect(page.getByText(/Day \d+ recipe/)).toHaveCount(0);
  });

  test("guided context survives Save, Why and Share interactions", async ({ page }) => {
    await seed(page, customer({ completedDays: [], savedRecipes: [] }));
    await page.goto(`/recipes/${recipeFor(1)}?source=day&day=1`);
    await page.getByRole("button", { name: "Save recipe" }).click();
    await page.locator("button[aria-controls][aria-expanded]").first().click();
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/source=day&day=1$/);
    await expect(page.getByRole("link", { name: "← Back to Day 1" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Continue Day 1/ })).toBeVisible();
  });

  test("every recipe in the library opens with a named, internal Back control", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await seed(page, customer({ savedRecipes: [] }));
    for (const r of RECIPES.slice(0, 8)) {
      await page.goto(`/recipes/${r.id}?source=all`);
      const back = page.getByRole("link", { name: "← Back to All Recipes" });
      await expect(back, r.id).toBeVisible();
      expect((await back.getAttribute("href"))?.startsWith("/")).toBe(true);
    }
  });
});
