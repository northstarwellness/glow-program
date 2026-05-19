import { createServerFn } from "@tanstack/react-start";

type VerifyResult = { verified: boolean; error?: string };

export const verifyPurchase = createServerFn({ method: "POST" })
  .validator((email: unknown) => {
    if (typeof email !== "string" || !email.includes("@")) throw new Error("Invalid email");
    return email.toLowerCase().trim();
  })
  .handler(async ({ data: email }): Promise<VerifyResult> => {
    const store = process.env.SHOPIFY_STORE;
    const token = process.env.SHOPIFY_TOKEN;

    // Dev mode: skip verification if env vars not set
    if (!store || !token) return { verified: true };

    try {
      const url = new URL(`https://${store}/admin/api/2024-10/orders.json`);
      url.searchParams.set("email", email);
      url.searchParams.set("financial_status", "paid");
      url.searchParams.set("status", "any");
      url.searchParams.set("fields", "id,email");
      url.searchParams.set("limit", "1");

      const res = await fetch(url.toString(), {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) return { verified: false, error: "Could not reach store." };

      const data = await res.json() as { orders: Array<{ id: number }> };
      return { verified: data.orders.length > 0 };
    } catch {
      return { verified: false, error: "Verification failed. Try again." };
    }
  });
