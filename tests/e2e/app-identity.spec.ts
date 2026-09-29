import { test, expect, customer, seed, stored, range } from "./fixtures";

// Installed Home Screen identity: "RITUAL APP" (all caps, as installed) with the RA icon; the
// website keeps descriptive text.

const pngSize = (buf: Buffer) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];

test("the manifest installs as exactly “RITUAL APP” with the new RA icons", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.status()).toBe(200);
  const m = await res.json();
  expect(m.name).toBe("RITUAL APP");
  expect(m.short_name).toBe("RITUAL APP");
  // Identity unchanged, so Android treats it as the same installed app.
  expect(m.start_url).toBe("/");
  expect(m.scope).toBe("/");
  expect(m.id).toBeUndefined();
  for (const icon of m.icons) {
    expect(icon.src).toMatch(/^\/icons\/ritual-app\//);
    const img = await request.get(icon.src);
    expect(img.status(), icon.src).toBe(200);
    expect(img.headers()["content-type"]).toContain("image/png");
    const [w, h] = pngSize(await img.body());
    expect(`${w}x${h}`).toBe(icon.sizes);
  }
  expect(JSON.stringify(m)).not.toMatch(/Inner Glow|NOURÉ/);
});

test("iPhone tags: Home Screen title “RITUAL APP”, new 180px touch icon; website title stays descriptive", async ({
  page,
  request,
}) => {
  await seed(page, customer());
  await page.goto("/home");
  const head = page.locator("head");
  await expect(head.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute(
    "content",
    "RITUAL APP",
  );
  const touch = head.locator('link[rel="apple-touch-icon"]');
  await expect(touch).toHaveAttribute("href", "/icons/ritual-app/icon-180.png");
  const img = await request.get("/icons/ritual-app/icon-180.png");
  expect(pngSize(await img.body())).toEqual([180, 180]);
  // Search and sharing metadata stay descriptive for people discovering the app.
  await expect(page).toHaveTitle("Ritual App — The Inner Glow Reset");
  await expect(head.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /21-day beauty-from-within morning ritual/,
  );
  for (const href of await head
    .locator('link[rel="icon"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
    expect(href).toMatch(/^\/icons\/ritual-app\//);
    expect((await request.get(href!)).status(), href!).toBe(200);
  }
  // The old N / NOURÉ icons are no longer referenced anywhere in the head.
  expect(await head.innerHTML()).not.toMatch(/\/icons\/icon-180\.png|\/icons\/favicon/);
});

test("changing the icon and name leaves saved progress, journal and storage key untouched", async ({
  page,
}) => {
  await seed(page, customer({ completedDays: range(1, 5), shownMilestones: ["day-1"] }));
  await page.goto("/home");
  const s = await stored(page);
  expect(s.completedDays).toEqual(range(1, 5));
  expect(s.journalEntries[2].entry).toBe("keep-me");
  expect(await page.evaluate(() => Object.keys(localStorage))).toContain("noure_app_v1");
});

test("the earlier icon files are still served for anything that already points at them", async ({
  request,
}) => {
  for (const f of ["icon-180.png", "icon-192.png", "icon-512.png", "favicon.ico"])
    expect((await request.get(`/icons/${f}`)).status(), f).toBe(200);
});
