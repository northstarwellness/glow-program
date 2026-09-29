import type { Page } from "@playwright/test";
import { test, expect, customer, seed, stored, rawGoto, range } from "./fixtures";

const KEY = "noure_grocery_custom";
const custom = (page: Page) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), KEY);
const list = (page: Page) => page.getByTestId("custom-items");
const status = (page: Page) => page.getByTestId("custom-item-status");

async function add(page: Page, text: string, via: "tap" | "return" = "tap") {
  const box = page.getByLabel("Add a custom item");
  await box.fill(text);
  if (via === "tap") await page.getByRole("button", { name: "Add", exact: true }).click();
  else await box.press("Enter");
}

test.describe("Grocery: custom items", () => {
  test("add → shows immediately → check off → reload → reopen", async ({ page, context }) => {
    await seed(page, customer());
    await page.goto("/grocery");
    await add(page, "Oat milk");
    await expect(list(page).getByRole("checkbox", { name: "Oat milk" })).toBeVisible();
    await expect(status(page)).toHaveText("Added “Oat milk” to your list.");
    await expect(page.getByLabel("Add a custom item")).toHaveValue("");
    expect(await custom(page)).toEqual(["Oat milk"]);

    await add(page, "Dates", "return");
    await expect(list(page).getByRole("checkbox", { name: "Dates" })).toBeVisible();

    await list(page).getByRole("checkbox", { name: "Oat milk" }).click();
    await expect(list(page).getByRole("checkbox", { name: "Oat milk" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect((await stored(page)).groceryChecked["custom:Oat milk"]).toBe(true);

    await page.reload();
    await expect(list(page).getByRole("checkbox", { name: "Oat milk" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(list(page).getByRole("checkbox", { name: "Dates" })).toHaveAttribute(
      "aria-checked",
      "false",
    );

    const again = await context.newPage();
    await again.goto("/home");
    await again
      .getByRole("link", { name: /Grocery/ })
      .first()
      .click();
    await expect(again).toHaveURL(/\/grocery$/);
    await expect(list(again).getByRole("checkbox", { name: "Oat milk" })).toBeVisible();
    await expect(list(again).getByRole("checkbox", { name: "Dates" })).toBeVisible();
  });

  test("existing customer: earlier items and all progress/journal data are kept", async ({
    page,
  }) => {
    const profile = customer({
      completedDays: range(1, 6),
      shownMilestones: ["day-1"],
      groceryChecked: { beet: true, "custom:Honey": true },
    });
    await page.context().addInitScript((k) => {
      if (!localStorage.getItem(k))
        localStorage.setItem(k, JSON.stringify(["Honey", "Almond butter"]));
    }, KEY);
    await seed(page, profile);
    await page.goto("/grocery");
    const before = await stored(page);
    await expect(list(page).getByRole("checkbox", { name: "Honey" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await add(page, "Coconut water");
    await expect(list(page).getByRole("checkbox", { name: "Coconut water" })).toBeVisible();
    expect(await custom(page)).toEqual(["Honey", "Almond butter", "Coconut water"]);
    const after = await stored(page);
    for (const k of [
      "completedDays",
      "journalEntries",
      "outcomesByDay",
      "savedRecipes",
      "name",
      "startDate",
      "verifiedEmail",
    ])
      expect(after[k], k).toEqual(before[k]);
    expect(after.groceryChecked).toEqual({ beet: true, "custom:Honey": true });
    // Removing an item clears only its own tick.
    await list(page).getByRole("button", { name: "Remove Honey" }).click();
    await expect(list(page).getByRole("checkbox", { name: "Honey" })).toHaveCount(0);
    expect((await stored(page)).groceryChecked).toEqual({ beet: true, "custom:Honey": false });
    expect(await custom(page)).toEqual(["Almond butter", "Coconut water"]);
  });

  test("duplicate and empty entries get a clear message, not silence", async ({ page }) => {
    await seed(page, customer());
    await page.goto("/grocery");
    await add(page, "Oat milk");
    await add(page, "oat milk");
    await expect(status(page)).toHaveText("“oat milk” is already on your list.");
    await expect(list(page).getByRole("checkbox")).toHaveCount(1);
    await add(page, "   ");
    await expect(status(page)).toHaveText("Type an item first, then tap Add.");
  });

  test("a failed save shows an error and never claims success", async ({ page }) => {
    await seed(page, customer());
    await page.addInitScript((k) => {
      const orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key: string, v: string) {
        if (key === k) throw new DOMException("full", "QuotaExceededError");
        return orig.call(this, key, v);
      };
    }, KEY);
    await page.goto("/grocery");
    await add(page, "Oat milk");
    await expect(page.getByRole("alert")).toHaveText(
      "Couldn’t save that item on this device. Please try again.",
    );
    await expect(page.getByTestId("custom-items")).toHaveCount(0);
    await expect(page.getByText(/Added/)).toHaveCount(0);
  });

  // Cold start: the app's scripts are held back, so the page is visible but not yet running.
  async function coldStart(page: Page) {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    await page.route("**/assets/*.js", async (r) => {
      await gate;
      await r.continue();
    });
    await rawGoto(page, "/grocery", { waitUntil: "domcontentloaded" });
    return async () => {
      release();
      await page.waitForSelector("html[data-hydrated]", { state: "attached", timeout: 30_000 });
    };
  }

  test("cold start: text typed while loading is kept, then Add saves it", async ({ page }) => {
    await seed(page, customer());
    const finish = await coldStart(page);
    await page.getByPlaceholder("Add a custom item…").fill("Oat milk");
    await finish();
    await expect(page.getByLabel("Add a custom item")).toHaveValue("Oat milk");
    await expect(page.getByTestId("custom-item-status")).toHaveText("");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(list(page).getByRole("checkbox", { name: "Oat milk" })).toBeVisible();
    await expect(status(page)).toHaveText("Added “Oat milk” to your list.");
  });

  for (const how of ["Return", "Add"] as const) {
    test(`cold start: pressing ${how} before the app has loaded still saves the item`, async ({
      page,
    }) => {
      await page.context().addInitScript((k) => {
        if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(["Honey"]));
      }, KEY);
      await seed(page, customer({ groceryChecked: { beet: true, "custom:Honey": true } }));
      const finish = await coldStart(page);
      await page.getByPlaceholder("Add a custom item…").fill("Oat milk");
      if (how === "Return") await page.getByPlaceholder("Add a custom item…").press("Enter");
      else await page.getByRole("button", { name: "Add", exact: true }).click();
      await finish();
      await expect(list(page).getByRole("checkbox", { name: "Oat milk" })).toBeVisible();
      await expect(status(page)).toHaveText("Added “Oat milk” to your list.");
      expect(await custom(page)).toEqual(["Honey", "Oat milk"]);
      expect((await stored(page)).groceryChecked).toEqual({ beet: true, "custom:Honey": true });
      await expect(page).toHaveURL(/\/grocery$/); // no ?item= left behind
      await page.reload(); // reloading does not add it twice
      expect(await custom(page)).toEqual(["Honey", "Oat milk"]);
      await expect(status(page)).toHaveText("");
    });
  }

  test("cold start: if saving fails, it says so and never claims success", async ({ page }) => {
    await seed(page, customer());
    await page.addInitScript((k) => {
      const orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key: string, v: string) {
        if (key === k) throw new DOMException("full", "QuotaExceededError");
        return orig.call(this, key, v);
      };
    }, KEY);
    const finish = await coldStart(page);
    await page.getByPlaceholder("Add a custom item…").fill("Oat milk");
    await page.getByPlaceholder("Add a custom item…").press("Enter");
    await finish();
    await expect(page.getByRole("alert")).toHaveText(
      "Couldn’t save that item on this device. Please try again.",
    );
    await expect(page.getByTestId("custom-items")).toHaveCount(0);
    await expect(page.getByText(/Added/)).toHaveCount(0);
  });

  test("recipe ‘Add ingredients’ shows on the list and reloads cleanly (no hydration error)", async ({
    page,
  }) => {
    await seed(page, customer());
    await page.goto("/recipes/pomegranate-elixir");
    await page.getByRole("button", { name: "Add ingredients to grocery list" }).click();
    await expect(page.getByRole("button", { name: "Added to grocery list ✓" })).toBeVisible();
    await page.goto("/grocery");
    await expect(list(page).getByRole("checkbox", { name: "Pomegranate" })).toBeVisible();
    await page.reload(); // the errors fixture fails on any React hydration error
    await expect(list(page).getByRole("checkbox", { name: "Lime" })).toBeVisible();
  });
});
