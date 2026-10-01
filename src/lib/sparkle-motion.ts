import { useSyncExternalStore } from "react";

/**
 * The viewer's sparkle-motion choice for recipe headers: remembered on this device, and off by
 * default when the device asks for reduced motion.
 */
const MOTION_KEY = "noure_sparkle_motion";
const listeners = new Set<() => void>();
// The viewer's choice for this page view, so it still applies when storage is blocked.
let chosen: boolean | null = null;

function readMotion(): boolean {
  if (chosen !== null) return chosen;
  try {
    const v = localStorage.getItem(MOTION_KEY);
    if (v === "on") return true;
    if (v === "off") return false;
  } catch {
    /* storage unavailable: fall back to the device setting */
  }
  return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function useSparkleMotion(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
      mq?.addEventListener?.("change", cb);
      return () => {
        listeners.delete(cb);
        mq?.removeEventListener?.("change", cb);
      };
    },
    readMotion,
    () => false,
  );
  const set = (next: boolean) => {
    chosen = next;
    try {
      localStorage.setItem(MOTION_KEY, next ? "on" : "off");
    } catch {
      /* not remembered, but still applied for this page view */
    }
    listeners.forEach((l) => l());
  };
  return [on, set];
}
