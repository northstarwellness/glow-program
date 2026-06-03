import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: Env, ctx: unknown) => Promise<Response> | Response;
};

interface Env {
  SHOPIFY_STORE_DOMAIN?: string;
  SHOPIFY_ADMIN_TOKEN?: string;
  SHOPIFY_PRODUCT_ID?: string;
}

interface ShopifyLineItem {
  product_id: number | null;
  title: string;
}

interface ShopifyCustomer {
  first_name?: string;
}

interface ShopifyOrder {
  line_items?: ShopifyLineItem[];
  customer?: ShopifyCustomer;
}

// Product names that grant access — case-insensitive substring match on line item title
const APPROVED_KEYWORDS = [
  "radiant reds",
  "inner glow reset",
  "ritual app",
  "glow reset",
  "21-day",
  "21 day",
  "beauty ritual",
  "smoothie system",
  "noure",
  "nourè",
];

function lineItemApproved(item: ShopifyLineItem, allowedId?: string): boolean {
  if (allowedId && item.product_id && String(item.product_id) === allowedId) return true;
  const t = (item.title ?? "").toLowerCase();
  return APPROVED_KEYWORDS.some((kw) => t.includes(kw));
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function handleVerifyPurchase(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: JSON_HEADERS });
  }

  try {
    const body = await request.json() as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ unlocked: false, error: "invalid-email" }, { status: 400, headers: JSON_HEADERS });
    }

    if (!env.SHOPIFY_STORE_DOMAIN || !env.SHOPIFY_ADMIN_TOKEN) {
      console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN env vars");
      return Response.json({ unlocked: false, error: "config-missing" }, { status: 503, headers: JSON_HEADERS });
    }

    const domain = env.SHOPIFY_STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const params = new URLSearchParams({
      email,
      financial_status: "paid",
      status: "any",
      limit: "10",
      fields: "id,line_items,customer",
    });

    const shopifyRes = await fetch(
      `https://${domain}/admin/api/2024-01/orders.json?${params}`,
      {
        headers: {
          "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_TOKEN,
          "Content-Type": "application/json",
        },
      },
    );

    if (!shopifyRes.ok) {
      const errText = await shopifyRes.text();
      console.error("Shopify API error", shopifyRes.status, errText);
      return Response.json({ unlocked: false, error: "shopify-error" }, { status: 502, headers: JSON_HEADERS });
    }

    const data = await shopifyRes.json() as { orders: ShopifyOrder[] };
    const orders = data.orders ?? [];

    if (orders.length === 0) {
      console.log("verify-purchase: no paid orders found for email");
      return Response.json({ unlocked: false, error: "no-orders" }, { headers: JSON_HEADERS });
    }

    const productId = env.SHOPIFY_PRODUCT_ID;
    const hasProduct = orders.some((order) =>
      order.line_items?.some((item) => lineItemApproved(item, productId))
    );

    if (!hasProduct) {
      const titles = orders.flatMap((o) => o.line_items?.map((i) => i.title) ?? []);
      console.log("verify-purchase: orders found but no approved product. Titles:", titles.join(", "));
      return Response.json({ unlocked: false, error: "wrong-product" }, { headers: JSON_HEADERS });
    }

    const firstName = orders[0]?.customer?.first_name ?? null;
    console.log("verify-purchase: access granted, name:", firstName ?? "(none)");
    return Response.json({ unlocked: true, name: firstName }, { headers: JSON_HEADERS });

  } catch (err) {
    console.error("verify-purchase handler error:", err);
    return Response.json({ unlocked: false, error: "server-error" }, { status: 500, headers: JSON_HEADERS });
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: unknown) {
    const url = new URL(request.url);

    if (url.pathname === "/api/verify-purchase") {
      return handleVerifyPurchase(request, env);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env as unknown, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
