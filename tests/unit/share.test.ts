import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText, shareOrCopy, shareText } from "@/lib/share";

const data = {
  title: "T",
  text: "Recipe — tag. benefit",
  url: "https://nourewellness.com/products/inner-glow-reset",
};
const setNav = (o: Record<string, unknown>) => {
  for (const [k, v] of Object.entries(o))
    Object.defineProperty(navigator, k, { value: v, configurable: true });
};
afterEach(() => {
  setNav({ share: undefined, canShare: undefined, clipboard: undefined });
  vi.restoreAllMocks();
});
const noExec = () => {
  (document as unknown as { execCommand: () => boolean }).execCommand = () => false;
};

describe("shareOrCopy", () => {
  it("uses native share with valid non-empty data", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    setNav({ share });
    expect(await shareOrCopy(data)).toEqual({ status: "shared" });
    expect(share).toHaveBeenCalledWith(data);
  });
  it("treats AbortError as cancellation, not failure, and does not copy", async () => {
    const writeText = vi.fn();
    setNav({
      share: vi.fn().mockRejectedValue(new DOMException("x", "AbortError")),
      clipboard: { writeText },
    });
    expect(await shareOrCopy(data)).toEqual({ status: "cancelled" });
    expect(writeText).not.toHaveBeenCalled();
  });
  it("falls back to clipboard when native share fails for a real reason", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNav({
      share: vi.fn().mockRejectedValue(new DOMException("x", "NotAllowedError")),
      clipboard: { writeText },
    });
    expect(await shareOrCopy(data)).toEqual({ status: "copied" });
    expect(writeText).toHaveBeenCalledWith(shareText(data));
  });
  it("respects canShare=false", async () => {
    const share = vi.fn();
    setNav({
      share,
      canShare: () => false,
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    expect(await shareOrCopy(data)).toEqual({ status: "copied" });
    expect(share).not.toHaveBeenCalled();
  });
  it("copies text + URL when native share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNav({ clipboard: { writeText } });
    expect(await shareOrCopy(data)).toEqual({ status: "copied" });
    expect(writeText.mock.calls[0][0]).toContain(data.url);
  });
  it("never claims success when every copy path fails → manual", async () => {
    noExec();
    setNav({
      clipboard: { writeText: vi.fn().mockRejectedValue(new DOMException("x", "NotAllowedError")) },
    });
    expect(await shareOrCopy(data)).toEqual({ status: "manual", text: shareText(data) });
  });
});

describe("copyText", () => {
  it("true only after a confirmed write", async () => {
    setNav({ clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    expect(await copyText("list")).toBe(true);
  });
  it("false when clipboard is denied and legacy copy fails", async () => {
    noExec();
    setNav({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    expect(await copyText("list")).toBe(false);
  });
  it("false for empty text", async () => expect(await copyText("")).toBe(false));
});
