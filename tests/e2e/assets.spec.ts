import { test, expect, customer, seed, range } from "./fixtures";
import { RECIPES } from "../../src/lib/content";

// Every customer-reachable route. The auto `errors` fixture fails the test on any 4xx/5xx response,
// console error or unhandled rejection, so this is the no-404 asset sweep.
const ROUTES = [
  "/",
  "/home",
  "/rituals",
  "/recipes",
  "/grocery",
  "/journal",
  "/journal/1",
  "/progress",
  "/boosts",
  "/bonuses",
  "/profile",
  "/celebrate",
  "/milestone/day-1",
  "/milestone/day-7",
  "/milestone/day-14",
  ...range(1, 21).map((n) => `/day/${n}`),
  ...RECIPES.map((r) => `/recipes/${r.id}`),
];

test("no missing assets or broken images on any route", async ({ page }) => {
  test.setTimeout(420_000); // visits every route on both engines
  await seed(
    page,
    customer({
      completedDays: range(1, 20),
      shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
    }),
  );
  for (const path of ROUTES) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("This page didn't load")).toHaveCount(0);
    const broken = await page.evaluate(() =>
      [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
    );
    expect(broken, `broken images on ${path}`).toEqual([]);
  }
});

test("public landing and verify pages load cleanly without progress", async ({ page }) => {
  for (const path of ["/landing", "/verify"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("This page didn't load")).toHaveCount(0);
  }
});
