import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addCustomGrocery,
  CUSTOM_GROCERY_KEY,
  readCustomGrocery,
  writeCustomGrocery,
} from "@/lib/custom-grocery";

const mem = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k),
});
afterEach(() => mem.clear());

describe("custom grocery items", () => {
  it("adds, trims and saves in the existing format (a JSON array of strings)", () => {
    const { result, next } = addCustomGrocery(["Honey"], "  Oat   milk ");
    expect(result).toEqual({ ok: true, item: "Oat milk" });
    expect(next).toEqual(["Honey", "Oat milk"]);
    expect(JSON.parse(mem.get(CUSTOM_GROCERY_KEY)!)).toEqual(["Honey", "Oat milk"]);
  });

  it("reports empty and duplicate (any letter case) without saving", () => {
    expect(addCustomGrocery([], "   ").result).toEqual({ ok: false, reason: "empty" });
    expect(addCustomGrocery(["Oat milk"], "oat MILK").result).toEqual({
      ok: false,
      reason: "duplicate",
    });
    expect(mem.has(CUSTOM_GROCERY_KEY)).toBe(false);
  });

  it("reports a storage failure instead of claiming success", () => {
    const spy = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const { result, next } = addCustomGrocery(["Honey"], "Dates");
    expect(result).toEqual({ ok: false, reason: "storage" });
    expect(next).toEqual(["Honey"]);
    expect(writeCustomGrocery(["x"])).toBe(false);
    spy.mockRestore();
  });

  it("reads old or damaged data safely", () => {
    mem.set(CUSTOM_GROCERY_KEY, '["Honey", 3, "", null, "Dates"]');
    expect(readCustomGrocery()).toEqual(["Honey", "Dates"]);
    mem.set(CUSTOM_GROCERY_KEY, "not json");
    expect(readCustomGrocery()).toEqual([]);
  });
});
