import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// ─── Types ────────────────────────────────────────────────────────────────────

type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

type Env = {
  SHOPIFY_STORE?: string;
  // Secrets — set via: npx wrangler secret put <NAME>
  SHOPIFY_WEBHOOK_SECRET?: string; // Shopify webhook signing secret
  ALLOWED_EMAILS?: string;         // Comma-separated manual override list
  // KV binding — see wrangler.jsonc
  GLOW_PURCHASERS?: KVNamespace;
};

// Products whose purchase grants app access.
// Checked by product_id (most reliable) and title substring (fallback).
const VALID_PRODUCT_IDS = new Set([
  9678764441845, // The Inner Glow Reset — 21-Day Beauty Ritual Program
  9538643656949, // Radiant Reds Polyphenol Glow Blend
]);

const VALID_PRODUCT_TITLE_FRAGMENTS = [
  "inner glow reset",
  "21-day beauty ritual",
  "21 day beauty ritual",
  "radiant reds",
];

// ─── SSR scaffolding ──────────────────────────────────────────────────────────

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

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
  try { payload = JSON.parse(body); } catch { return false; }
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return false;
  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) return false;
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
  if (!isCatastrophicSsrErrorBody(body, response.status)) return response;
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// ─── HMAC verification ────────────────────────────────────────────────────────

async function verifyShopifyHmac(rawBody: string, hmacHeader: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
    const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
    return computed === hmacHeader;
  } catch {
    return false;
  }
}

// ─── Shopify orders/paid webhook ──────────────────────────────────────────────

type ShopifyOrder = {
  id: number;
  order_number?: number;
  name?: string;
  email?: string;
  contact_email?: string;
  created_at?: string;
  customer?: { email?: string };
  line_items?: Array<{
    product_id?: number;
    variant_id?: number;
    title?: string;
    product_title?: string;
    handle?: string;
  }>;
};

function extractOrderEmail(order: ShopifyOrder): string | null {
  const raw = order.email ?? order.contact_email ?? order.customer?.email ?? "";
  const email = raw.toLowerCase().trim();
  return email.includes("@") ? email : null;
}

function orderContainsGlowProduct(order: ShopifyOrder): boolean {
  const items = order.line_items ?? [];
  // Test webhook sends empty line_items — approve to confirm setup works
  if (items.length === 0) return true;
  for (const item of items) {
    // Primary check: product_id (never changes even if title is edited)
    if (item.product_id && VALID_PRODUCT_IDS.has(item.product_id)) return true;
    // Fallback: title substring match
    const title = (item.title ?? item.product_title ?? "").toLowerCase();
    if (VALID_PRODUCT_TITLE_FRAGMENTS.some((f) => title.includes(f))) return true;
  }
  return false;
}

async function handleShopifyWebhook(request: Request, env: Env): Promise<Response> {
  const cors = { "Content-Type": "application/json" };

  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256") ?? "";

  // Verify HMAC signature if secret is configured
  if (env.SHOPIFY_WEBHOOK_SECRET) {
    const valid = await verifyShopifyHmac(rawBody, hmacHeader, env.SHOPIFY_WEBHOOK_SECRET);
    if (!valid) {
      console.error("Shopify webhook HMAC verification failed");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
    }
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody) as ShopifyOrder;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: cors });
  }

  const email = extractOrderEmail(order);
  if (!email) {
    console.error("Shopify webhook: no email found in order", order.id);
    return new Response(JSON.stringify({ ok: true, note: "no email" }), { status: 200, headers: cors });
  }

  if (!orderContainsGlowProduct(order)) {
    console.log(`Shopify webhook: order ${order.id} does not contain Glow product — skipping`);
    return new Response(JSON.stringify({ ok: true, note: "product not matched" }), { status: 200, headers: cors });
  }

  // Store in KV
  const record = JSON.stringify({
    email,
    order_id: order.id,
    order_name: order.name ?? String(order.order_number ?? order.id),
    purchased_at: order.created_at ?? new Date().toISOString(),
    source: "shopify_webhook",
  });

  if (env.GLOW_PURCHASERS) {
    await env.GLOW_PURCHASERS.put(`purchaser:${email}`, record);
    console.log(`Verified purchaser stored: ${email}`);
  } else {
    console.error("GLOW_PURCHASERS KV binding not available");
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
}

// ─── /api/verify — login gate ─────────────────────────────────────────────────

async function handleVerifyApi(request: Request, env: Env): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").toLowerCase().trim();
    if (!email || !email.includes("@")) {
      return Response.json({ verified: false }, { status: 400, headers: cors });
    }

    // 1. KV — verified via Shopify webhook
    if (env.GLOW_PURCHASERS) {
      const record = await env.GLOW_PURCHASERS.get(`purchaser:${email}`);
      if (record) {
        return Response.json({ verified: true }, { headers: cors });
      }
    }

    // 2. ALLOWED_EMAILS manual override (comma-separated Wrangler secret)
    if (env.ALLOWED_EMAILS) {
      const list = env.ALLOWED_EMAILS.split(",").map((e) => e.toLowerCase().trim()).filter(Boolean);
      if (list.includes(email)) {
        return Response.json({ verified: true }, { headers: cors });
      }
      // Override list is set but email not in it — deny
      return Response.json({ verified: false }, { headers: cors });
    }

    // 3. No verification configured — open (remove before full launch)
    return Response.json({ verified: true }, { headers: cors });
  } catch {
    return Response.json({ verified: false }, { status: 500, headers: cors });
  }
}

// ─── Worker entry ─────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    if (url.pathname === "/api/verify") {
      return handleVerifyApi(request, env as Env);
    }

    if (url.pathname === "/webhooks/shopify/orders-paid" && request.method === "POST") {
      return handleShopifyWebhook(request, env as Env);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
