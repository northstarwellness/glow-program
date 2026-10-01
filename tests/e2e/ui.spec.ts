import type { Page } from "@playwright/test";
import type { ShareData } from "../../src/lib/share";
import { test, expect, customer, seed, range } from "./fixtures";
import { RECIPES } from "../../src/lib/content";
import { PRODUCT_URL } from "../../src/lib/share";
import { findIngredient } from "../../src/lib/ingredients";

/** Replace native share / clipboard with deterministic recorders. */
async function mockShare(
  page: Page,
  mode: { share?: "ok" | "abort" | "absent"; clipboard?: "ok" | "deny"; canShareFiles?: boolean },
) {
  await page.context().addInitScript((m) => {
    const w = window as unknown as Record<string, unknown[]>;
    w.__shares = [];
    w.__copies = [];
    const nav = navigator as unknown as Record<string, unknown>;
    const def = (k: string, v: unknown) =>
      Object.defineProperty(navigator, k, { value: v, configurable: true });
    if (m.share === "absent") {
      def("share", undefined);
      def("canShare", undefined);
    } else {
      def("share", (d: unknown) => {
        w.__shares.push({
          data: d,
          activation:
            (navigator as unknown as { userActivation?: { isActive: boolean } }).userActivation
              ?.isActive ?? null,
        });
        return m.share === "abort"
          ? Promise.reject(new DOMException("cancel", "AbortError"))
          : Promise.resolve();
      });
      def("canShare", (d: { files?: File[] }) => (d?.files ? !!m.canShareFiles : true));
    }
    def("clipboard", {
      writeText: (t: string) => {
        if (m.clipboard === "deny")
          return Promise.reject(new DOMException("denied", "NotAllowedError"));
        w.__copies.push(t);
        return Promise.resolve();
      },
    });
    if (m.clipboard === "deny") document.execCommand = () => false;
    void nav;
  }, mode);
}
type Recorded = {
  __shares: { data: ShareData & { files?: File[] }; activation: boolean | null }[];
  __copies: string[];
  __printed?: boolean;
};
const recorded = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as Recorded;
    return { shares: w.__shares, copies: w.__copies };
  });

test.describe("ingredient Why", () => {
  // One test per recipe: every Why control, each inside its own timeout.
  for (const r of RECIPES) {
    const expected = r.ingredients.filter((l) => findIngredient(l)).length;
    test(`Why controls on ${r.id} (${expected}) open inline, one at a time, clear of the nav, no overlay`, async ({
      page,
    }) => {
      await seed(page, customer());
      await page.goto(`/recipes/${r.id}`);
      const whys = page.locator('button[aria-controls][aria-expanded][aria-label^="Why "]');
      await expect(whys).toHaveCount(expected);
      for (let i = 0; i < expected; i++) {
        const btn = whys.nth(i);
        await btn.click();
        await expect(btn).toHaveAttribute("aria-expanded", "true");
        const panel = page.locator(
          `#${(await btn.getAttribute("aria-controls"))!.replace(/:/g, "\\:")}`,
        );
        await expect(panel).toBeVisible();
        await expect(page.locator('[role="region"][aria-label^="Why "]')).toHaveCount(1);
        await page.waitForTimeout(350); // allow the nearest-scroll to settle
        const geo = await panel.evaluate((el) => {
          const nav = document.querySelector("nav.fixed")!.getBoundingClientRect();
          const b = el.getBoundingClientRect();
          const covering = [...document.querySelectorAll<HTMLElement>("body *")].filter((n) => {
            const cs = getComputedStyle(n);
            const nb = n.getBoundingClientRect();
            return (
              cs.position === "fixed" &&
              n.tagName !== "NAV" &&
              nb.width * nb.height > innerWidth * innerHeight * 0.5
            );
          }).length;
          return { bottom: b.bottom, navTop: nav.top, covering };
        });
        expect(geo.covering, "full-screen overlay present").toBe(0);
        expect(geo.bottom, "card hidden behind bottom nav").toBeLessThanOrEqual(geo.navTop + 1);
      }
      if (expected) {
        // tapping the open control again closes it
        const last = whys.nth(expected - 1);
        await last.click();
        await expect(last).toHaveAttribute("aria-expanded", "false");
        await expect(page.locator('[role="region"][aria-label^="Why "]')).toHaveCount(0);
      }
    });
  }

  test("checkbox and Why are separate; checked ingredient keeps a readable card; keyboard works; scroll stays put", async ({
    page,
  }) => {
    await seed(page, customer());
    await page.goto("/recipes/pomegranate-elixir");
    const row = page.getByRole("button", { name: "Pomegranate", exact: true });
    await row.click(); // check it off
    const why = page.getByRole("button", { name: "Why Pomegranate" });
    await expect(why).toHaveAttribute("aria-expanded", "false"); // checking did not open Why
    // Put the row in the upper third so the card fits without any scrolling.
    await why.evaluate((el) =>
      window.scrollBy(0, el.getBoundingClientRect().top - innerHeight * 0.3),
    );
    await page.waitForTimeout(200);
    const y0 = await page.evaluate(() => scrollY);
    await why.focus();
    await page.keyboard.press("Enter");
    await expect(why).toHaveAttribute("aria-expanded", "true");
    const panel = page.getByRole("region", { name: "Why Pomegranate" });
    await expect(panel).toBeVisible();
    await page.waitForTimeout(350); // let the 200ms reveal finish
    const opacity = await panel.evaluate((el) => {
      let o = 1;
      for (let n: Element | null = el; n; n = n.parentElement) o *= +getComputedStyle(n).opacity;
      return o;
    });
    expect(opacity).toBe(1);
    await page.waitForTimeout(350);
    expect(Math.abs((await page.evaluate(() => scrollY)) - y0)).toBeLessThan(2);
    const box = await why.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
    await page.keyboard.press("Space");
    await expect(why).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("button", { name: "Pomegranate", exact: true })).toBeVisible();
  });

  test("screenshots: closed and expanded on a small phone", async ({ page }, info) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await seed(page, customer());
    await page.goto("/recipes/pomegranate-elixir");
    const why = page.locator('button[aria-controls][aria-expanded][aria-label^="Why "]').last();
    await why.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 120)); // put the row near the nav
    await page.waitForTimeout(400);
    await page.screenshot({ path: info.outputPath(`why-closed-${info.project.name}.png`) });
    await why.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: info.outputPath(`why-expanded-${info.project.name}.png`) });
  });
});

test.describe("recipe Share", () => {
  test.beforeEach(async ({ page }) => seed(page, customer()));
  const open = (page: Page) => page.goto("/recipes/pomegranate-elixir");
  const shareBtn = (page: Page) => page.getByRole("button", { name: "Share", exact: true });

  test("native share: valid payload, called from the tap, no false copy message", async ({
    page,
  }) => {
    await mockShare(page, { share: "ok", clipboard: "ok" });
    await open(page);
    await expect(shareBtn(page)).toHaveAttribute("type", "button");
    await shareBtn(page).click();
    await expect.poll(async () => (await recorded(page)).shares.length).toBe(1);
    const { shares, copies } = await recorded(page);
    expect(shares[0].data).toMatchObject({
      title: expect.stringMatching(/\S/),
      text: expect.stringMatching(/\S/),
      url: PRODUCT_URL,
    });
    if (shares[0].activation !== null) expect(shares[0].activation).toBe(true);
    expect(copies).toEqual([]);
    await expect(page.getByText("Link copied")).toHaveCount(0);
    await expect(page).toHaveURL(/\/recipes\/pomegranate-elixir$/);
  });

  test("user cancels the share sheet: no error, no success message", async ({ page }) => {
    await mockShare(page, { share: "abort", clipboard: "ok" });
    await open(page);
    await shareBtn(page).click();
    await expect.poll(async () => (await recorded(page)).shares.length).toBe(1);
    await page.waitForTimeout(300);
    expect((await recorded(page)).copies).toEqual([]);
    await expect(page.getByText("Link copied")).toHaveCount(0);
  });

  test("no native share: copies text + link and confirms", async ({ page }) => {
    await mockShare(page, { share: "absent", clipboard: "ok" });
    await open(page);
    await shareBtn(page).click();
    await expect(page.getByRole("status").filter({ hasText: "Link copied" })).toBeVisible();
    expect((await recorded(page)).copies[0]).toContain(PRODUCT_URL);
  });

  test("no native share and clipboard denied: manual copy, never 'copied'", async ({ page }) => {
    await mockShare(page, { share: "absent", clipboard: "deny" });
    await open(page);
    await shareBtn(page).click();
    await expect(page.getByRole("textbox", { name: "Text to copy" })).toHaveValue(
      new RegExp(PRODUCT_URL.replace(/[.]/g, "\\.")),
    );
    await expect(page.getByText("Link copied")).toHaveCount(0);
  });
});

test.describe("Grocery Copy list", () => {
  test.beforeEach(async ({ page }) => seed(page, customer()));
  test("success path confirms only after the write", async ({ page }) => {
    await mockShare(page, { share: "absent", clipboard: "ok" });
    await page.goto("/grocery");
    await page.getByRole("button", { name: "Copy list" }).click();
    await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "List copied" })).toBeVisible();
    expect((await recorded(page)).copies[0].length).toBeGreaterThan(10);
  });
  test("failure path is honest and offers manual copy", async ({ page }) => {
    await mockShare(page, { share: "absent", clipboard: "deny" });
    await page.goto("/grocery");
    await page.getByRole("button", { name: "Copy list" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Couldn't copy automatically" }),
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Text to copy" })).not.toHaveValue("");
    await expect(page.getByRole("button", { name: "Copied!" })).toHaveCount(0);
    await expect(page.getByText("List copied")).toHaveCount(0);
  });
});

test.describe("Save My Ritual Card", () => {
  test.beforeEach(async ({ page }) =>
    seed(
      page,
      customer({
        completedDays: range(1, 21),
        shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
      }),
    ),
  );

  test("shares a PNG through the native sheet when files are supported", async ({ page }) => {
    await mockShare(page, { share: "ok", clipboard: "ok", canShareFiles: true });
    await page.goto("/celebrate");
    await page.waitForTimeout(1200); // card pre-render
    await page.getByRole("button", { name: "Save My Ritual Card" }).click();
    await expect.poll(async () => (await recorded(page)).shares.length).toBe(1);
    const info = await page.evaluate(() => {
      const f = (window as unknown as Recorded).__shares[0].data.files![0];
      return { type: f.type, size: f.size, name: f.name };
    });
    expect(info).toMatchObject({ type: "image/png", name: "noure-ritual-card.png" });
    expect(info.size).toBeGreaterThan(5_000);
  });

  test("downloads the PNG when file sharing is unavailable; never calls print", async ({
    page,
  }) => {
    await mockShare(page, { share: "absent", clipboard: "ok" });
    await page.addInitScript(() => {
      const w = window as unknown as Recorded;
      w.__printed = false;
      window.print = () => {
        w.__printed = true;
      };
    });
    await page.goto("/celebrate");
    await page.waitForTimeout(1200);
    const dl = page.waitForEvent("download");
    await page.getByRole("button", { name: "Save My Ritual Card" }).click();
    expect((await dl).suggestedFilename()).toBe("noure-ritual-card.png");
    await expect(
      page.getByRole("status").filter({ hasText: "download has started" }),
    ).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as Recorded).__printed)).toBe(false);
  });
});

test.describe("share destination (referral)", () => {
  const SALES_URL = "https://nourewellness.com/products/21-day-beauty-ritual-app";

  test("the shared link is live, public and not a 404", async ({ request }) => {
    // Hits the real storefront: this is the guarantee that a friend can open what we send.
    const res = await request.get(SALES_URL, { maxRedirects: 5 });
    expect(res.status(), `${SALES_URL} must not be a dead link`).toBe(200);
    expect(res.url()).toBe(SALES_URL); // no redirect away from the canonical page
    const body = await res.text();
    expect(body).toMatch(/21[-\s]day/i);
    expect(body).toMatch(/\$\s?21|"price":\s*"?21/);
    expect(body).toContain("/cart/add"); // a purchase path exists on the page
  });

  test("the old product handle really is dead (regression guard)", async ({ request }) => {
    const res = await request.get("https://nourewellness.com/products/inner-glow-reset", {
      maxRedirects: 5,
    });
    expect(res.status()).toBe(404);
  });

  test("sharing sends the sales page, never the app, preview or recipe URL", async ({ page }) => {
    await mockShare(page, { share: "ok", clipboard: "ok" });
    await seed(page, customer());
    await page.goto("/recipes/pomegranate-elixir?source=all");
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await expect.poll(async () => (await recorded(page)).shares.length).toBe(1);
    const payload = (await recorded(page)).shares[0].data;
    expect(payload.url).toBe(SALES_URL);
    const asText = JSON.stringify(payload);
    for (const forbidden of ["127.0.0.1", "workers.dev", "glow.nourewellness.com", "/recipes/"]) {
      expect(asText, `payload must not contain ${forbidden}`).not.toContain(forbidden);
    }
  });

  test("clipboard fallback copies the sales page and only then says copied", async ({ page }) => {
    await mockShare(page, { share: "absent", clipboard: "ok" });
    await seed(page, customer());
    await page.goto("/recipes/pomegranate-elixir?source=all");
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Link copied" })).toBeVisible();
    expect((await recorded(page)).copies[0]).toContain(SALES_URL);
  });
});
