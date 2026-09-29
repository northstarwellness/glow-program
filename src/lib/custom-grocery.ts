/**
 * Custom grocery items the customer adds (from the Grocery list or a recipe).
 *
 * Stored on the device under `noure_grocery_custom` as a JSON array of strings, the same
 * format as before. Every save is read back, so the app only reports "added" once the item is
 * really stored, and says so when the browser refuses to save.
 */
import { useCallback, useEffect, useState } from "react";

export const CUSTOM_GROCERY_KEY = "noure_grocery_custom";
/** Key for a custom item's tick in `groceryChecked` (same map as the built-in items). */
export const customCheckId = (item: string) => `custom:${item}`;

const clean = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

export function readCustomGrocery(): string[] {
  try {
    return clean(JSON.parse(localStorage.getItem(CUSTOM_GROCERY_KEY) ?? "[]"));
  } catch {
    return [];
  }
}

/** Writes the list and confirms it by reading it back. */
export function writeCustomGrocery(list: string[]): boolean {
  try {
    const json = JSON.stringify(list);
    localStorage.setItem(CUSTOM_GROCERY_KEY, json);
    return localStorage.getItem(CUSTOM_GROCERY_KEY) === json;
  } catch {
    return false;
  }
}

export const sameItem = (a: string, b: string) =>
  a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();

export type AddResult =
  | { ok: true; item: string }
  | { ok: false; reason: "empty" | "duplicate" | "storage" };

/** Adds one item to `current` and saves the result; `next` is unchanged when nothing was saved. */
export function addCustomGrocery(
  current: string[],
  raw: string,
): { result: AddResult; next: string[] } {
  const item = raw.trim().replace(/\s+/g, " ");
  if (!item) return { result: { ok: false, reason: "empty" }, next: current };
  if (current.some((x) => sameItem(x, item)))
    return { result: { ok: false, reason: "duplicate" }, next: current };
  const next = [...current, item];
  if (!writeCustomGrocery(next)) return { result: { ok: false, reason: "storage" }, next: current };
  return { result: { ok: true, item }, next };
}

/**
 * The list as React state. It is read after the first client render (never during server
 * rendering), so the server page and the phone agree and nothing is lost on hydration.
 */
export function useCustomGrocery() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    setItems(readCustomGrocery());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CUSTOM_GROCERY_KEY || e.key === null) setItems(readCustomGrocery());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((raw: string): AddResult => {
    // Start from what is stored now, so an add on another screen is never overwritten.
    const { result, next } = addCustomGrocery(readCustomGrocery(), raw);
    setItems(next);
    return result;
  }, []);

  const remove = useCallback((item: string): boolean => {
    const next = readCustomGrocery().filter((x) => x !== item);
    const ok = writeCustomGrocery(next);
    setItems(ok ? next : readCustomGrocery());
    return ok;
  }, []);

  return { items, add, remove };
}
