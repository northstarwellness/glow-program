/**
 * One share/copy path for every control in the app.
 *
 * Call shareOrCopy / copyText directly inside the click handler (no awaits
 * before it) so iOS Safari still counts navigator.share as a user gesture.
 * Every outcome is reported honestly — "copied" only after a confirmed write.
 */

/**
 * The public sales page shared with friends: canonical, signed-out-accessible, and
 * one tap from purchase ($21). The app itself is email-gated, so its own URLs
 * (glow.nourewellness.com, preview versions, recipe routes) are never shared.
 * Verified live 2026-09-23. The former /products/inner-glow-reset returned 404.
 */
export const PRODUCT_URL = "https://nourewellness.com/products/21-day-beauty-ritual-app";

export type ShareData = { title?: string; text: string; url?: string; files?: File[] };

export type ShareOutcome =
  | { status: "shared" }
  | { status: "cancelled" }
  | { status: "copied" }
  /** Nothing could be copied automatically — show `text` for manual copy. */
  | { status: "manual"; text: string };

type Nav = Partial<Pick<Navigator, "share" | "canShare" | "clipboard">>;
const nav = (): Nav | undefined => (typeof navigator === "undefined" ? undefined : navigator);

export const isAbortError = (e: unknown) =>
  typeof e === "object" && e !== null && (e as { name?: string }).name === "AbortError";

/** Text copied when native sharing isn't available. */
export const shareText = (d: ShareData) => [d.text, d.url].filter(Boolean).join("\n");

/** Legacy synchronous copy for browsers without the async Clipboard API. */
function execCommandCopy(text: string): boolean {
  if (typeof document === "undefined" || typeof document.execCommand !== "function") return false;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  document.body.appendChild(ta);
  try {
    ta.select();
    ta.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    ta.remove();
  }
}

/** Resolves true only when the text was actually written to the clipboard. */
export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  const clip = nav()?.clipboard;
  if (clip?.writeText) {
    try {
      await clip.writeText(text);
      return true;
    } catch {
      /* permission denied / not focused — try legacy path */
    }
  }
  return execCommandCopy(text);
}

export async function shareOrCopy(data: ShareData): Promise<ShareOutcome> {
  const n = nav();
  const payload: ShareData = { ...data };
  if (!payload.files?.length) delete payload.files;

  const canNative =
    typeof n?.share === "function" && (typeof n.canShare !== "function" || n.canShare(payload));

  if (canNative) {
    try {
      await n!.share!(payload);
      return { status: "shared" };
    } catch (e) {
      if (isAbortError(e)) return { status: "cancelled" };
      /* NotAllowedError / TypeError etc. — fall through to copy */
    }
  }

  const text = shareText(data);
  return (await copyText(text)) ? { status: "copied" } : { status: "manual", text };
}
