import type { Page } from "@playwright/test";
import { test, expect, customer, seed, range } from "./fixtures";
import { RECIPES } from "../../src/lib/content";
import { RECIPE_WHY } from "../../src/lib/recipe-why";

const shown = (n: number) => [1, 7, 14].filter((d) => d <= n).map((d) => `day-${d}`);
const onDay = (day: number) =>
  customer({ completedDays: range(1, day - 1), shownMilestones: shown(day - 1) });

const top = (page: Page, testId: string) =>
  page.getByTestId(testId).evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
const topOfHeading = (page: Page, name: string) =>
  page
    .getByRole("heading", { name, exact: true })
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

test.describe("recipe-first layout on every recipe", () => {
  test("ingredients and method lead; Why and the optional Radiant Reds follow", async ({
    page,
  }) => {
    await seed(page, onDay(6));
    for (const r of RECIPES) {
      await page.goto(`/recipes/${r.id}`);
      const ingredients = await topOfHeading(page, "Ingredients");
      const method = await topOfHeading(page, "Method");
      const why = await top(page, "why-these-ingredients");
      const reds = await top(page, "optional-reds");
      expect(ingredients, r.id).toBeLessThan(method);
      expect(method, r.id).toBeLessThan(why);
      expect(why, r.id).toBeLessThan(reds);
      // Radiant Reds is never one of the ingredients needed to make the smoothie.
      const main = await page.locator("main").innerText();
      const beforeWhy = main.split(/Why these ingredients/i)[0];
      expect(beforeWhy, r.id).not.toMatch(/radiant reds|glow boost/i);
      // No big promotional block, no purchase button, one quiet link at most (inside Details).
      await expect(page.getByText(/Shop Radiant Reds|Radiant Reds Glow Boost/)).toHaveCount(0);
      await expect(page.getByTestId("recipe-description")).toHaveText(r.benefit);
    }
  });
});

test.describe("Why these ingredients", () => {
  test("opens with the recipe's own notes, keeps details on demand, closes cleanly", async ({
    page,
  }) => {
    await seed(page, onDay(6));
    await page.goto("/recipes/pomegranate-elixir");
    const toggle = page.getByRole("button", { name: /^Why these ingredients/ });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("why-panel")).toHaveCount(0);
    await toggle.click();
    const panel = page.getByTestId("why-panel");
    await expect(panel).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Why these ingredients" }),
    ).toBeFocused();
    const why = RECIPE_WHY["pomegranate-elixir"];
    await expect(panel.getByTestId("why-point")).toHaveCount(why.points.length);
    await expect(panel).toContainText(why.intro);
    // Details and sources stay hidden until asked for.
    const firstDetail = panel.getByText(why.points[0].detail);
    await expect(firstDetail).toBeHidden();
    await panel.getByText("More detail and sources").first().click();
    await expect(firstDetail).toBeVisible();
    await expect(
      panel.getByRole("list", { name: "Sources" }).first().getByRole("link").first(),
    ).toHaveAttribute("href", /^https:\/\//);
    // Escape closes, and focus returns to the button.
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(toggle).toBeFocused();
    // The bottom Close works too, and its tap target is comfortable.
    await toggle.click();
    const close = page.getByTestId("why-panel").getByRole("button", { name: "Close", exact: true });
    expect((await close.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await close.click();
    await expect(page.getByTestId("why-panel")).toHaveCount(0);
  });

  test("each recipe shows its own explanation", async ({ page }) => {
    await seed(page, onDay(6));
    for (const id of ["beet-glow", "mocha-reds-morning", "bonus-warm-elixir"]) {
      await page.goto(`/recipes/${id}`);
      await page.getByRole("button", { name: /^Why these ingredients/ }).click();
      await expect(page.getByTestId("why-panel")).toContainText(RECIPE_WHY[id].intro);
    }
  });
});

test.describe("Optional addition: Radiant Reds", () => {
  test("closed by default: label, one short note, works-without line, a visible Get link; label details on demand", async ({
    page,
  }) => {
    await seed(page, onDay(6));
    await page.goto("/recipes/golden-turmeric");
    const reds = page.getByTestId("optional-reds");
    await expect(reds.getByRole("heading", { name: "Add Radiant Reds · optional" })).toBeVisible();
    await expect(reds).toContainText("This recipe is complete without it.");
    // One visible link to the verified product page; never an add-to-cart.
    const get = reds.getByRole("link", { name: "Get Radiant Reds" });
    await expect(get).toBeVisible();
    await expect(reds.getByRole("link")).toHaveCount(1);
    await expect(get).toHaveAttribute("href", "https://nourewellness.com/products/reds-superfood");
    expect((await get.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const details = reds.getByRole("button", { name: "Label details" });
    await expect(details).toHaveAttribute("aria-expanded", "false");
    expect((await details.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect(reds).not.toContainText("From the label");
    await details.click();
    await expect(reds.getByRole("button", { name: "Hide label details" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(reds).toContainText("cold water to enjoy alongside");
    await expect(reds).toContainText("consumed within 10 minutes of mixing");
    await expect(reds).toContainText("every recipe here is complete without it");
    await expect(reds.getByRole("link")).toHaveCount(1);
    // Its original plum gradient, with ivory text.
    const bg = await reds.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bg).toContain("rgb(92, 37, 65)");
  });

  test("Get Radiant Reds: the whole label is the link, and focus and press give feedback", async ({
    page,
    browserName,
  }) => {
    await seed(page, onDay(6));
    await page.goto("/recipes/pomegranate-elixir");
    const get = page.getByTestId("get-reds");
    // An editorial text link: the label and one slender arrow inside the one link element; no
    // star, orb, capsule or light trail.
    await expect(get).toHaveText("Get Radiant Reds");
    expect(await get.locator("svg").count()).toBe(1);
    await expect(
      page.locator(".reds-cta, .reds-cta-star, .reds-cta-arrow, .reds-cta-trail"),
    ).toHaveCount(0);
    const look = await get.evaluate((el) => {
      const cs = getComputedStyle(el);
      const rule = getComputedStyle(el.querySelector(".reds-link-label")!, "::before");
      return {
        bg: cs.backgroundImage,
        bgColor: cs.backgroundColor,
        border: cs.borderTopWidth,
        font: cs.fontFamily,
        rule: rule.height,
        ruleColor: rule.backgroundColor,
      };
    });
    expect(look.bg).toBe("none");
    expect(look.bgColor).toBe("rgba(0, 0, 0, 0)");
    expect(look.border).toBe("0px");
    expect(look.font.toLowerCase()).toContain("cormorant");
    expect(look.rule).toBe("1px");
    expect(Math.round((await get.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
    // Arrow moves about 2px over 200 to 300 ms on focus; the link itself never shrinks.
    const arrowMotion = await get
      .locator(".reds-link-arrow")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(arrowMotion) * 1000).toBeGreaterThanOrEqual(200);
    expect(parseFloat(arrowMotion) * 1000).toBeLessThanOrEqual(300);
    // Hover sends one sheen along the underline, about 600 ms, once.
    const sheen = await get.locator(".reds-link-label").evaluate((el) => {
      const cs = getComputedStyle(el, "::after");
      return { opacity: cs.opacity, height: cs.height };
    });
    expect(sheen).toEqual({ opacity: "0", height: "1px" });
    const sheenRule = await page.evaluate(() => {
      // Rules can sit inside @layer and @media blocks, so walk them all.
      const walk = (rules: CSSRuleList): string => {
        for (const r of [...rules]) {
          if (
            r instanceof CSSStyleRule &&
            r.selectorText.includes(".reds-link:hover .reds-link-label::after")
          )
            return r.style.animation;
          const inner = (r as CSSGroupingRule).cssRules;
          if (inner) {
            const found = walk(inner);
            if (found) return found;
          }
        }
        return "";
      };
      for (const sheet of [...document.styleSheets]) {
        const found = walk(sheet.cssRules);
        if (found) return found;
      }
      return "";
    });
    expect(sheenRule).toMatch(/redsSheen/);
    expect(sheenRule).toMatch(/\b(0\.6s|600ms)\b/);
    expect(sheenRule).not.toMatch(/infinite/);
    // No box in any state: no outline, border, background, shadow or radius on the link.
    const noBox = (el: Element) => {
      const c = getComputedStyle(el);
      return [
        c.outlineStyle,
        c.borderTopWidth + c.borderRightWidth + c.borderBottomWidth + c.borderLeftWidth,
        c.backgroundColor + c.backgroundImage,
        c.boxShadow,
        c.borderRadius,
      ];
    };
    const flat = ["none", "0px0px0px0px", "rgba(0, 0, 0, 0)none", "none", "0px"];
    expect(await get.evaluate(noBox)).toEqual(flat);
    const focusLine = () =>
      get.locator(".reds-link-inner").evaluate((el) => getComputedStyle(el, "::after").opacity);
    expect(await focusLine()).toBe("0");
    await page.getByTestId("optional-reds").getByRole("button", { name: "Label details" }).focus();
    if (browserName === "webkit") {
      // Safari only tabs to links when the user turns that on; focus it the way a keyboard would.
      await get.focus();
    } else {
      await page.keyboard.press("Shift+Tab");
      // Keyboard focus: a stronger underline under the whole text and arrow, never a ring or box.
      await expect.poll(focusLine).toBe("1");
      expect(await get.evaluate(noBox)).toEqual(flat);
      const inner = await get.locator(".reds-link-inner").evaluate((el) => ({
        w: parseFloat(getComputedStyle(el, "::after").width),
        h: getComputedStyle(el, "::after").height,
      }));
      const [label, arrow] = await Promise.all([
        get.locator(".reds-link-label").boundingBox(),
        get.locator(".reds-link-arrow").boundingBox(),
      ]);
      expect(inner.h).toBe("2px");
      // The underline spans the text and the arrow.
      expect(inner.w).toBeGreaterThanOrEqual(arrow!.x + arrow!.width - label!.x - 1);
    }
    await expect(get).toBeFocused();
    await expect
      .poll(() =>
        get
          .locator(".reds-link-arrow")
          .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
      )
      .toBeCloseTo(2, 0);
    expect(await get.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    // Focus keeps it clear of the fixed bottom navigation.
    const navTop = await page.evaluate(
      () => document.querySelector("nav.fixed")?.getBoundingClientRect().top ?? Infinity,
    );
    const box = (await get.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(navTop);
    // Clicking navigates to the product page only (no cart request is made).
    const cartCalls: string[] = [];
    page.on("request", (r) => {
      if (/\/cart/.test(r.url())) cartCalls.push(r.url());
    });
    await page.route("https://nourewellness.com/**", (r) =>
      r.fulfill({ status: 200, contentType: "text/html", body: "<p>product</p>" }),
    );
    await get.click();
    await expect(page).toHaveURL("https://nourewellness.com/products/reds-superfood");
    expect(cartCalls).toEqual([]);
  });

  test("on the Day page it follows the recipe and check-ins, before Finish today", async ({
    page,
  }) => {
    await seed(page, onDay(4));
    await page.goto("/day/4");
    await expect(page.getByText("Radiant Reds Boost")).toHaveCount(0);
    const reds = await top(page, "optional-reds");
    const recipe = await top(page, "open-recipe");
    const finish = await page
      .getByText("Finish today")
      .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    expect(recipe).toBeLessThan(reds);
    expect(reds).toBeLessThan(finish);
  });
});

test("quick recipes read as complete smoothies without the scoop", async ({ page }) => {
  await seed(page, onDay(6));
  await page.goto("/recipes/berry-reds-yogurt-shake");
  const list = page
    .locator("main section")
    .filter({ has: page.getByRole("heading", { name: "Ingredients" }) });
  await expect(list).toContainText("1 cup frozen mixed berries");
  await expect(list).not.toContainText(/Radiant Reds|Glow Boost/);
  await expect(page.getByText("Add your Glow Boost", { exact: false })).toHaveCount(0);
});

test.describe("recipe header (gray block removed, original colors)", () => {
  test("every recipe: its original gradient through the title, readable text, sparkle border, 44px actions, no overflow", async ({
    page,
  }) => {
    await seed(page, onDay(6));
    for (const r of RECIPES) {
      await page.goto(`/recipes/${r.id}`);
      const header = page.getByTestId("recipe-header");
      await expect(header).toBeVisible();
      // The whole header paints the recipe's own, unchanged gradient (the last background layer).
      await expect(header).toHaveAttribute("data-gradient", r.gradient);
      const bg = await header.evaluate((el) => getComputedStyle(el).backgroundImage);
      const layers = bg.split(/,\s*(?=linear-gradient)/);
      const original = layers[layers.length - 1];
      for (const hex of r.gradient.match(/#[0-9A-Fa-f]{6}/g)!) {
        const [x, y, z] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
        expect(original, r.id).toContain(`rgb(${x}, ${y}, ${z})`);
      }
      // No fade to white: nothing masks the header.
      const mask = await header.evaluate((el) => getComputedStyle(el).maskImage ?? "none");
      expect(mask === "none" || mask === "", r.id).toBe(true);
      // Title and details line measured against every composited point behind the text.
      for (const el of [page.getByRole("heading", { level: 1 }), header.locator("p").first()]) {
        const ratio = await el.evaluate((node) => {
          const lum = (rgb: number[]) => {
            const f = (v: number) =>
              (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
            return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
          };
          const fg = lum(getComputedStyle(node).color.match(/\d+/g)!.slice(0, 3).map(Number));
          const samples = node.closest("header")!.getAttribute("data-text-samples")!.split(" ");
          return Math.min(
            ...samples.map((h) => {
              const bgL = lum([1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
              const [hi, lo] = [Math.max(fg, bgL), Math.min(fg, bgL)];
              return (hi + 0.05) / (lo + 0.05);
            }),
          );
        });
        expect(ratio, `${r.id} text contrast`).toBeGreaterThanOrEqual(4.5);
      }
      await expect(header.getByTestId("sparkle-border")).toBeAttached();
      for (const name of ["Save recipe", "Share", "Edge light motion"]) {
        const box = await header.getByRole("button", { name }).boundingBox();
        expect(Math.round(box!.height), `${r.id} ${name}`).toBeGreaterThanOrEqual(44);
      }
      // Header stays compact on a phone.
      expect((await header.boundingBox())!.height, `${r.id} header height`).toBeLessThan(260);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${r.id} sideways overflow`).toBeLessThanOrEqual(0);
    }
  });

  test("edge light: two tiny fixed highlights, low opacity, slow; pauses off screen; toggle remembered", async ({
    page,
  }) => {
    await seed(page, onDay(6));
    await page.goto("/recipes/cherry-cacao");
    const header = page.getByTestId("recipe-header");
    const border = page.getByTestId("sparkle-border");
    await expect(border).toHaveAttribute("data-running", "true");
    // No travelling dots and no star anywhere in the header.
    await expect(page.locator(".sparkle-points")).toHaveCount(0);
    await expect(header.locator('path[d*="1.9"]')).toHaveCount(0);
    const glints = page.getByTestId("edge-glint");
    await expect(glints).toHaveCount(2);
    const specs = await glints.evaluateAll((els) =>
      els.map((el) => {
        const cs = getComputedStyle(el);
        const core = el.querySelectorAll("ellipse")[1] as SVGEllipseElement;
        return {
          name: cs.animationName,
          duration: parseFloat(cs.animationDuration),
          play: cs.animationPlayState,
          peak: parseFloat(cs.getPropertyValue("--g-peak")),
          core: Math.max(core.rx.baseVal.value, core.ry.baseVal.value) * 2,
          // Only opacity is keyframed: the element never moves.
          keyframes: el
            .getAnimations()
            .flatMap((a) => (a.effect as KeyframeEffect).getKeyframes())
            .flatMap((k) => Object.keys(k))
            .filter((k) => !["offset", "easing", "composite", "computedOffset"].includes(k)),
        };
      }),
    );
    for (const g of specs) {
      expect(g.name).toBe("edgeGlint");
      expect(g.duration).toBeGreaterThanOrEqual(8);
      expect(g.duration).toBeLessThanOrEqual(14);
      expect(g.play).toBe("running");
      expect(g.peak).toBeGreaterThanOrEqual(0.1);
      expect(g.peak).toBeLessThanOrEqual(0.25);
      expect(g.core).toBeLessThanOrEqual(4);
      expect([...new Set(g.keyframes)]).toEqual(["opacity"]);
    }
    expect(specs[0].duration).not.toBe(specs[1].duration);
    // Scrolled away: paused.
    await page.getByTestId("optional-reds").scrollIntoViewIfNeeded();
    await expect(border).toHaveAttribute("data-running", "false");
    expect(await glints.first().evaluate((el) => getComputedStyle(el).animationPlayState)).toBe(
      "paused",
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(border).toHaveAttribute("data-running", "true");
    // Text, fill and controls never animate.
    for (const el of [page.getByRole("heading", { level: 1 }), header]) {
      expect(await el.evaluate((n) => n.getAnimations().length)).toBe(0);
    }
    // Toggle off, remembered on other recipes; with motion off no highlight shows.
    const toggle = page.getByTestId("sparkle-toggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(border).toHaveAttribute("data-running", "false");
    expect(await glints.first().evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await page.goto("/recipes/plum-rose");
    await expect(page.getByTestId("sparkle-toggle")).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByTestId("sparkle-border")).toHaveAttribute("data-running", "false");
    await page.getByTestId("sparkle-toggle").click();
    await expect(page.getByTestId("sparkle-border")).toHaveAttribute("data-running", "true");
  });

  test("reduced motion: the edge light stays off until the viewer turns it on", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await seed(page, onDay(6));
    await page.goto("/recipes/berry-bloom");
    await expect(page.getByTestId("sparkle-toggle")).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByTestId("sparkle-border")).toHaveAttribute("data-running", "false");
    const glint = page.getByTestId("edge-glint").first();
    expect(await glint.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    expect(await glint.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    // The link's hover and focus movement is also off.
    const d = await page
      .getByTestId("get-reds")
      .locator(".reds-link-arrow")
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(d)).toBe(0);
  });

  test("Save and Share still work from the header", async ({ page }) => {
    await seed(page, onDay(6));
    await page.goto("/recipes/bonus-cacao-tonic");
    const save = page.getByTestId("recipe-header").getByRole("button", { name: "Save recipe" });
    await expect(save).toHaveAttribute("aria-pressed", "false");
    await save.click();
    await expect(save).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(
      page.getByTestId("recipe-header").getByRole("button", { name: "Save recipe" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
