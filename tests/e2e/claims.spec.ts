import { test, expect, customer, seed, range, ready, stored } from "./fixtures";
import type { Page } from "@playwright/test";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

// Every screen whose copy changed in the claim-safe release.
const ROUTES = [
  "/home",
  "/rituals",
  "/recipes",
  "/progress",
  "/celebrate",
  "/milestone/day-7",
  "/journal/1",
  "/boosts",
  "/recipes/build",
  "/recipes/pomegranate-elixir",
  "/recipes/cherry-cacao",
  "/recipes/golden-turmeric",
  "/recipes/honey-almond",
  "/recipes/watermelon-reds",
  "/recipes/bonus-rose-collagen",
  "/recipes/bonus-green-glow",
  ...range(1, 21).map((n) => `/day/${n}`),
];

/** All text in the page, including collapsed <details>, minus scripts and styles. */
const pageText = (page: Page) =>
  page.evaluate(() => {
    const c = document.body.cloneNode(true) as HTMLElement;
    c.querySelectorAll("script,style,noscript").forEach((n) => n.remove());
    return c.textContent ?? "";
  });

async function expectClean(page: Page, where: string) {
  await expect(page.getByText("This page didn't load")).toHaveCount(0);
  const text = await pageText(page);
  for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT])
    expect(text, `${where} shows ${re}`).not.toMatch(re);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow, `${where} scrolls sideways`).toBeLessThanOrEqual(1);
}

test("changed screens render clean copy with no sideways overflow", async ({ page }) => {
  test.setTimeout(420_000);
  await seed(
    page,
    customer({
      completedDays: range(1, 20),
      shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
    }),
  );
  for (const path of ROUTES) {
    await page.goto(path);
    await ready(page);
    await expectClean(page, path);
  }
});

test("Glow Guide tabs render clean copy and the new ingredient labels", async ({ page }) => {
  await seed(page, customer());
  await page.goto("/bonuses");
  await ready(page);
  for (const tab of ["Polyphenols", "Ingredients", "Glow Guide"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    await expectClean(page, `/bonuses › ${tab}`);
  }
  await page.getByRole("button", { name: "Ingredients", exact: true }).click();
  await expect(page.getByText("Nutrition note:").first()).toBeAttached();
  await expect(page.getByText("In the glass:").first()).toBeAttached();
  await expect(page.getByText("Gut:", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Skin:", { exact: true })).toHaveCount(0);
});

test("recipe page uses the new labels and keeps the Beet line", async ({ page }) => {
  await seed(page, customer());
  await page.goto("/recipes/beet-glow");
  await ready(page);
  await expect(page.getByText("Why this glass", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Why Beet" }).click();
  const why = page.getByRole("region", { name: "Why Beet" });
  await expect(why.getByText("In the glass", { exact: true })).toBeVisible();
  await expect(why.getByText("Nutrition note", { exact: true })).toBeVisible();
  await expect(why.getByText("Supports a calm, well-fed gut environment.")).toBeVisible();
});

test("onboarding and landing render clean copy", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  await expectClean(page, "/");
  await page.goto("/landing");
  await ready(page);
  await expectClean(page, "/landing");
});

test("welcome shows Your Glow Reflection and no Boosts or photo promise", async ({ page }) => {
  await seed(page, customer({ seenWelcome: false }));
  await page.goto("/welcome");
  await ready(page);
  await expectClean(page, "/welcome");
  await expect(page.getByText("Your Glow Reflection")).toBeVisible();
  await expect(page.getByText(/Photo Timeline|Boosts/)).toHaveCount(0);
});

test("stored check-ins keep their values and read with the new display text", async ({ page }) => {
  await seed(
    page,
    customer({
      completedDays: [1, 2],
      outcomesByDay: { 1: ["Less bloated"], 2: ["Calm digestion", "Glowy"] },
    }),
  );
  await page.goto("/progress");
  await ready(page);
  await expect(page.getByText(/^Comfortable/)).toBeVisible(); // shares a line with the "Most felt" badge
  await expect(page.getByText("Settled", { exact: true })).toBeVisible();
  await expect(page.getByText("Less bloated", { exact: true })).toHaveCount(0);
  await page.goto("/day/3");
  await ready(page);
  await page.getByRole("button", { name: "Comfortable" }).click();
  await expect.poll(async () => (await stored(page)).outcomesByDay[3]).toEqual(["Less bloated"]);
});

test("a saved recipe still opens under its new name", async ({ page }) => {
  await seed(page, customer({ savedRecipes: ["bonus-rose-collagen"] }));
  await page.goto("/recipes/bonus-rose-collagen");
  await ready(page);
  await expect(page.getByRole("heading", { name: "Rose Strawberry Float" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save recipe" }).first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
