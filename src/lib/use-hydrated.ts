import { useEffect, useState } from "react";
import { useApp } from "./store";

/** Returns true after first client render and Zustand rehydration from localStorage. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    void Promise.resolve(useApp.persist.rehydrate()).then(() => setH(true));
  }, []);
  return h;
}
