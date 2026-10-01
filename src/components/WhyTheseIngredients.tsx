import { useEffect, useId, useRef, useState } from "react";
import { RECIPE_WHY, WHY_SOURCES } from "@/lib/recipe-why";

/**
 * "Why these ingredients": a recipe-specific, sourced explanation. Closed by default so the
 * recipe itself leads; opens inline (no overlay) with an obvious Close at top and bottom.
 */
export function WhyTheseIngredients({ recipeId }: { recipeId: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const opened = useRef(false);
  const why = RECIPE_WHY[recipeId];

  // Move focus with the panel: into its heading on open, back to the button on close.
  useEffect(() => {
    if (open) {
      opened.current = true;
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    } else if (opened.current) {
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  if (!why) return null;
  const panelId = `${id}-panel`;
  const headingId = `${id}-heading`;
  const close = () => setOpen(false);

  return (
    <section className="mt-6" data-testid="why-these-ingredients">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full min-h-[64px] items-center justify-between gap-4 rounded-2xl border border-[var(--taupe)]/40 bg-white px-5 py-4 text-left shadow-sm transition-colors cursor-pointer hover:border-[var(--gold)]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 motion-reduce:transition-none"
      >
        <span className="min-w-0">
          <span className="block font-serif text-[20px] leading-tight text-[var(--plum)]">
            Why these ingredients
          </span>
          <span className="mt-1 block text-[13px] text-[var(--plum)]/70">
            {open
              ? "Tap to close"
              : `What this glass brings, in ${why.points.length} short notes with sources`}
          </span>
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
          className={`flex-shrink-0 text-[var(--ink-2)] transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          className="why-reveal mt-2 scroll-mt-4 rounded-2xl border border-[var(--taupe)]/30 bg-[var(--ivory)] px-5 pt-5 pb-4 shadow-sm"
          data-testid="why-panel"
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="scroll-mt-4 font-serif text-[24px] leading-tight text-[var(--plum)] outline-none"
            >
              Why these ingredients
            </h2>
            <CloseButton onClick={close} />
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--plum)]/85">{why.intro}</p>

          <ol className="mt-4 space-y-3">
            {why.points.map((p, i) => (
              <li
                key={p.title}
                className="rounded-xl border border-[var(--taupe)]/25 bg-white px-4 py-4"
                data-testid="why-point"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-2)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-serif text-[19px] leading-snug text-[var(--plum)]">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--plum)]/85">
                  {p.summary}
                </p>
                <details className="group mt-2">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-[13px] font-medium text-[var(--plum)] underline decoration-[var(--taupe)]/60 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">More detail and sources</span>
                    <span className="hidden group-open:inline">Less detail</span>
                  </summary>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--plum)]/80">
                    {p.detail}
                  </p>
                  {p.sources.length > 0 && (
                    <ul
                      className="mt-3 space-y-1.5 border-t border-[var(--taupe)]/20 pt-2.5"
                      aria-label="Sources"
                    >
                      {p.sources.map((slug) => {
                        const src = WHY_SOURCES[slug];
                        if (!src) return null;
                        return (
                          <li key={slug} className="text-[12.5px] leading-snug">
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block py-1 text-[var(--plum)]/80"
                            >
                              <span className="underline decoration-[var(--taupe)]/60 underline-offset-2">
                                {src.title}
                              </span>
                              <span className="mt-0.5 block text-[11.5px] text-[var(--ink-2)]">
                                {src.publisher}
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </details>
              </li>
            ))}
          </ol>

          <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--plum)]/65">
            General nutrition information about this recipe's foods, not medical advice.
          </p>
          <button
            type="button"
            onClick={close}
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--taupe)]/50 bg-white text-[14px] font-medium text-[var(--plum)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60"
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close why these ingredients"
      className="-mr-2 -mt-1 flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center gap-1 rounded-full text-[13px] font-medium text-[var(--plum)]/75 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60"
    >
      Close
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
