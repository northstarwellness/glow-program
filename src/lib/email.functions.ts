import { createServerFn } from "@tanstack/react-start";

/**
 * Stub email capture. Fire-and-forget from the client.
 * Tag every payload with `inner-glow-reset-app` so it's filterable in Klaviyo
 * once the live integration is wired.
 */
export const captureEmail = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; glowType?: string | null }) => d)
  .handler(async ({ data }) => {
    const payload = {
      email: data.email,
      glowType: data.glowType ?? null,
      tag: "inner-glow-reset-app",
      capturedAt: new Date().toISOString(),
    };
    // TODO: replace with Klaviyo subscribe call.
    console.log("[noure] email capture", payload);
    return { ok: true };
  });
