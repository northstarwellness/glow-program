import { describe, expect, it } from "vitest";
import { PRODUCT_URL, shareText } from "@/lib/share";

/**
 * The Share button exists for referral: a friend who does not own the app must land
 * on the public sales page. These tests pin that destination.
 */
const VERIFIED_SALES_URL = "https://nourewellness.com/products/21-day-beauty-ritual-app";

describe("the shared destination", () => {
  it("is exactly the verified canonical sales page", () => {
    expect(PRODUCT_URL).toBe(VERIFIED_SALES_URL);
  });

  it("is never the dead product handle that returned 404", () => {
    expect(PRODUCT_URL).not.toContain("/products/inner-glow-reset");
  });

  it("is never a private app, preview, recipe or checkout URL", () => {
    for (const forbidden of [
      "glow.nourewellness.com", // the email-gated app itself
      "workers.dev", // preview versions
      "/recipes/", // a recipe route
      "/cart", // direct checkout
      "myshopify.com", // internal store domain
      "localhost",
      "127.0.0.1",
    ]) {
      expect(PRODUCT_URL, `shared URL must not contain ${forbidden}`).not.toContain(forbidden);
    }
  });

  it("is an absolute https link on the public storefront", () => {
    const u = new URL(PRODUCT_URL);
    expect(u.protocol).toBe("https:");
    expect(u.hostname).toBe("nourewellness.com");
    expect(u.search).toBe(""); // no tracking or session parameters
  });

  it("is what the share/copy payload carries", () => {
    const text = shareText({ title: "A recipe", text: "Recipe — tag. benefit", url: PRODUCT_URL });
    expect(text).toContain(VERIFIED_SALES_URL);
    expect(text).not.toContain("glow.nourewellness.com");
  });
});
