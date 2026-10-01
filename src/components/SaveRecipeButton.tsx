import { useState } from "react";
import { useApp, isRecipeSavedPersisted } from "@/lib/store";

/**
 * The only save control in the app — it lives on the recipe detail page.
 * Recipe cards stay clean; saving and removing both happen here.
 * Saved recipes live on this device/browser (they are not synced), like the rest
 * of the app's stored progress.
 */
export function SaveRecipeButton({
  recipeId,
  tone = "dark",
  onResult,
  className = "",
}: {
  recipeId: string;
  /** "light" sits on the photo hero; "dark" sits on an ivory card. */
  tone?: "light" | "dark" | "ink";
  onResult?: (message: string) => void;
  className?: string;
}) {
  const saved = useApp((s) => s.savedRecipes.includes(recipeId));
  const [failed, setFailed] = useState(false);

  const toggle = () => {
    const next = !saved;
    setFailed(false);
    try {
      useApp.getState().setRecipeSaved(recipeId, next);
    } catch {
      /* storage write threw — verified below */
    }
    if (!isRecipeSavedPersisted(recipeId, next)) {
      // Keep the previous state rather than showing a save that did not happen.
      try {
        useApp.getState().setRecipeSaved(recipeId, !next);
      } catch {
        /* ignore — state is reported as failed either way */
      }
      setFailed(true);
      onResult?.("We couldn't save this recipe on this device.");
      return;
    }
    onResult?.(next ? "Saved to your recipes" : "Removed from saved recipes");
  };

  const colors =
    tone === "ink"
      ? "" // styled by .recipe-action in the recipe's own ink
      : tone === "light"
        ? "text-[var(--ivory)]/85 focus-visible:ring-[var(--ivory)]/70"
        : saved
          ? "text-[var(--berry)] focus-visible:ring-[var(--gold)]/60"
          : "text-[var(--ink-2)] focus-visible:ring-[var(--gold)]/60";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Save recipe"
      aria-pressed={saved}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[13px] font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 ${colors} ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
      {/* Wording and the filled/outline icon carry the state — never colour alone. */}
      <span>{failed ? "Not saved" : saved ? "Saved" : "Save Recipe"}</span>
    </button>
  );
}
