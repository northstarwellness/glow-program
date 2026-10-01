import type { Page } from "@playwright/test";
import { test, expect, customer, seed, stored, range } from "./fixtures";
import { RECIPES } from "../../src/lib/content";

const ID = "pomegranate-elixir";
const OTHER = "berry-bloom";
const savedTab = (page: Page) => page.getByRole("tab", { name: "Saved" });
const allTab = (page: Page) => page.getByRole("tab", { name: "All Recipes" });
const saveButtons = (page: Page) => page.getByRole("button", { name: "Save recipe" });
const cardLinks = (page: Page) => page.locator('main a[href^="/recipes/"]');

const base = (savedRecipes: string[]) =>
  customer({ savedRecipes, completedDays: range(1, 3), shownMilestones: ["day-1"] });

test.describe("Saved Recipes", () => {
  test("empty state, then saving from the detail page fills Saved", async ({ page }) => {
    await seed(page, base([]));
    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(page.getByRole("heading", { name: "Saved Recipes" })).toBeVisible();
    await expect(page.getByText("Your saved rituals will appear here.")).toBeVisible();
    await expect(cardLinks(page)).toHaveCount(0);

    await page.goto(`/recipes/${ID}`);
    const btn = saveButtons(page).first();
    await expect(btn).toHaveAttribute("aria-pressed", "false");
    await btn.click();
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("status").filter({ hasText: "Saved to your recipes" }),
    ).toBeVisible();
    expect((await stored(page)).savedRecipes).toEqual([ID]);

    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(page.getByText("Your favorite blends, gathered in one place.")).toBeVisible();
    await expect(cardLinks(page)).toHaveCount(1);
    await expect(page.locator(`main a[href^="/recipes/${ID}"]`)).toBeVisible();
  });

  test("recipe cards carry no save/bookmark/remove control anywhere", async ({ page }) => {
    await seed(page, base([ID, OTHER]));
    await page.goto("/recipes");
    // All Recipes grid, every category filter, and the Saved grid
    const noCardMarkers = async (where: string) => {
      await expect(saveButtons(page), where).toHaveCount(0);
      await expect(page.locator("main button[aria-pressed]"), where).toHaveCount(0);
      await expect(page.locator("main a svg"), where).toHaveCount(0); // no icon in any card
      await expect(page.locator("main a button"), where).toHaveCount(0); // no control in any card
      // No saved marker text on any card — cards show tag, name and prep time only
      for (const text of await cardLinks(page).allInnerTexts()) {
        expect(text.toLowerCase(), `${where}: card text "${text}"`).not.toContain("saved");
      }
    };
    for (const label of ["All", "Foundation", "Build", "Glow", "Bonus", "Quick Mornings"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await expect(cardLinks(page).first()).toBeVisible();
      await noCardMarkers(`filter ${label}`);
    }
    await savedTab(page).click();
    await expect(cardLinks(page)).toHaveCount(2);
    await noCardMarkers("Saved grid");

    // The detail page holds the only save control
    await page.goto(`/recipes/${ID}`);
    await expect(saveButtons(page)).toHaveCount(1);
  });

  test("All Recipes stays complete and Saved lists only saved recipes", async ({ page }) => {
    await seed(page, base([ID]));
    await page.goto("/recipes");
    await expect(cardLinks(page)).toHaveCount(RECIPES.filter((r) => !r.bonus).length); // 21 core + 7 quick
    await savedTab(page).click();
    await expect(cardLinks(page)).toHaveCount(1);
    await expect(page.locator(`main a[href^="/recipes/${ID}"]`)).toBeVisible();
  });

  test("open a saved recipe from Saved, remove it there, and Saved updates on return", async ({
    page,
  }) => {
    await seed(page, base([ID, OTHER]));
    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(cardLinks(page)).toHaveCount(2);
    await page.locator(`main a[href^="/recipes/${ID}"]`).click();
    const btn = saveButtons(page).first();
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(btn).toHaveText(/Saved/);
    await btn.click();
    await expect(
      page.getByRole("status").filter({ hasText: "Removed from saved recipes" }),
    ).toBeVisible();
    await expect(btn).toHaveAttribute("aria-pressed", "false");
    await expect(btn).toHaveText(/Save Recipe/);
    expect((await stored(page)).savedRecipes).toEqual([OTHER]);
    // Back in Saved, it is gone; the recipe itself still exists in All Recipes
    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(cardLinks(page)).toHaveCount(1);
    await allTab(page).click();
    await expect(page.locator(`main a[href^="/recipes/${ID}"]`)).toBeVisible();
  });

  test("rapid double-tap leaves a single id and a truthful state", async ({ page }) => {
    await seed(page, base([]));
    await page.goto(`/recipes/${ID}`);
    const btn = saveButtons(page).first();
    await btn.click();
    await btn.click();
    await btn.click();
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    expect((await stored(page)).savedRecipes).toEqual([ID]);
  });

  test("saved recipes survive reload and reopening, and progress is untouched", async ({
    page,
    context,
  }) => {
    await seed(page, base([]));
    await page.goto(`/recipes/${ID}`);
    await saveButtons(page).first().click();
    await page.reload();
    await expect(saveButtons(page).first()).toHaveAttribute("aria-pressed", "true");
    await page.close();

    const reopened = await context.newPage();
    await reopened.goto("/recipes");
    await reopened.waitForSelector("html[data-hydrated]");
    await savedTab(reopened).click();
    await expect(reopened.locator(`main a[href^="/recipes/${ID}"]`)).toBeVisible();
    const s = await stored(reopened);
    expect(s.savedRecipes).toEqual([ID]);
    expect(s.completedDays).toEqual(range(1, 3));
  });

  test("every recipe saved → Saved lists them all", async ({ page }) => {
    const all = RECIPES.map((r) => r.id);
    await seed(page, base(all));
    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(cardLinks(page)).toHaveCount(all.length);
  });

  test("legacy data with no saved list, plus stale and duplicate ids", async ({ page }) => {
    await page.context().addInitScript(() => {
      if (!localStorage.getItem("noure_app_v1"))
        localStorage.setItem(
          "noure_app_v1",
          JSON.stringify({
            state: { verifiedEmail: "q@x.test", name: "QA", seenWelcome: true, completedDays: [1] },
            version: 0,
          }),
        );
    });
    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(page.getByText("Your saved rituals will appear here.")).toBeVisible();

    // Stale + duplicate ids: only real recipes are listed, nothing crashes
    await page.evaluate((id) => {
      const raw = JSON.parse(localStorage.getItem("noure_app_v1")!);
      raw.state.savedRecipes = ["retired-recipe", id, id];
      localStorage.setItem("noure_app_v1", JSON.stringify(raw));
    }, ID);
    await page.reload();
    await savedTab(page).click();
    await expect(cardLinks(page)).toHaveCount(1);
  });

  test("blocked storage: no false success, state stays as it was", async ({ page }) => {
    await seed(page, base([]));
    await page.goto(`/recipes/${ID}`);
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException("blocked", "QuotaExceededError");
      };
    });
    const btn = saveButtons(page).first();
    await btn.click();
    await expect(
      page.getByRole("status").filter({ hasText: "couldn't save this recipe" }),
    ).toBeVisible();
    await expect(page.getByText("Saved to your recipes")).toHaveCount(0);
    await expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  test("keyboard, focus and touch target", async ({ page }) => {
    await seed(page, base([]));
    await page.goto(`/recipes/${ID}`);
    const btn = saveButtons(page).first();
    const box = (await btn.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
    const y0 = await page.evaluate(() => scrollY);
    await btn.focus();
    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))).toBe(
      "Save recipe",
    );
    expect(Math.abs((await page.evaluate(() => scrollY)) - y0)).toBeLessThan(2); // no page jump
    await page.keyboard.press("Space");
    await expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  test("back and forward keep the saved state, no overlay or covered control", async ({ page }) => {
    await seed(page, base([]));
    await page.goto(`/recipes/${ID}`);
    const btn = saveButtons(page).first();
    await btn.click();
    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(cardLinks(page)).toHaveCount(1);
    await page.goBack();
    await page.waitForSelector("html[data-hydrated]");
    await page.goForward();
    await page.waitForSelector("html[data-hydrated]");
    expect((await stored(page)).savedRecipes).toEqual([ID]);

    // The detail control is reachable and nothing covers it
    await page.goto(`/recipes/${ID}`);
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    const covering = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>("body *")].filter((n) => {
          const cs = getComputedStyle(n);
          const b = n.getBoundingClientRect();
          return (
            cs.position === "fixed" &&
            n.tagName !== "NAV" &&
            b.width * b.height > innerWidth * innerHeight * 0.5
          );
        }).length,
    );
    expect(covering).toBe(0);
    await btn.scrollIntoViewIfNeeded();
    const hit = await btn.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!top && (top === el || el.contains(top));
    });
    expect(hit).toBe(true);
  });

  test("long recipe names stay readable on a small phone", async ({ page }) => {
    const longest = [...RECIPES].sort((a, b) => b.name.length - a.name.length)[0];
    await seed(page, base([longest.id]));
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/recipes");
    await savedTab(page).click();
    await expect(page.getByText(longest.name)).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1); // no horizontal scroll
  });
});
