import { useEffect, useState } from "react";

/** Returns true after first client render. Use to gate state that depends on localStorage. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
