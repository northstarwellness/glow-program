import { useId, useState } from "react";
import { REDS_URL } from "@/lib/content";
import { REDS_BY_RECIPE, REDS_SECTION } from "@/lib/recipe-reds";

/** The Radiant Reds card's own gradient and gold accent, as in the original Glow Boost card. */
const REDS_GRADIENT = "linear-gradient(145deg, #5C2541 0%, #7B2D4E 60%, #9B1B3A 100%)";

/**
 * The optional Radiant Reds addition for one recipe. It sits after the method, stays compact,
 * and keeps the label details behind one toggle (closed by default). Text is ivory for contrast
 * on the plum gradient (7.5:1 or better); gold is used only as an accent. One visible editorial
 * "Get Radiant Reds" text link to the product page (never an add-to-cart), and the label details
 * behind their own disclosure, closed by default.
 */
export function OptionalReds({
  recipeId,
  className = "",
}: {
  recipeId: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const r = REDS_BY_RECIPE[recipeId];
  if (!r) return null;
  const headingId = `${id}-heading`;
  const panelId = `${id}-details`;

  return (
    <section
      aria-labelledby={headingId}
      data-testid="optional-reds"
      className={`overflow-hidden rounded-3xl text-[var(--ivory)] ${className}`}
      style={{
        background: REDS_GRADIENT,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 2px rgba(92,37,65,0.18), 0 16px 32px -20px rgba(92,37,65,0.6)",
      }}
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
          <h2
            id={headingId}
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ivory)]/90"
          >
            Add Radiant Reds · optional
          </h2>
        </div>
        <p className="mt-2.5 font-serif text-[19px] leading-snug text-[var(--ivory)]">
          {r.headline}
        </p>
        <ul className="mt-2.5 space-y-1.5" data-testid="reds-points">
          {r.points.map((pt) => (
            <li
              key={pt}
              className="flex gap-2.5 text-[13.5px] leading-relaxed text-[var(--ivory)]/90"
            >
              <span
                aria-hidden="true"
                className="mt-[8px] h-1 w-1 flex-shrink-0 rounded-full bg-[var(--gold)]"
              />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-[12.5px] text-[var(--ivory)]/80">
          This recipe is complete without it.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-1">
          {/* The whole labeled link is the target. It opens the product page only; nothing is
              added to a cart. */}
          <a
            href={REDS_URL}
            target="_top"
            className="reds-link"
            data-testid="get-reds"
            onTouchStart={() => {
              /* lets iOS apply the :active press state */
            }}
          >
            <span className="reds-link-inner">
              <span className="reds-link-label">Get Radiant Reds</span>
              <svg
                className="reds-link-arrow"
                width="18"
                height="10"
                viewBox="0 0 18 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5h15M12.5 1.5L16 5l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full text-[13px] font-medium text-[var(--ivory)]/90 underline decoration-white/40 underline-offset-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ivory)]/70"
          >
            {open ? "Hide label details" : "Label details"}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
              className={`transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div id={panelId} className="why-reveal space-y-2 border-t border-white/15 px-6 pt-4 pb-5">
          <Detail label="How to add it">{r.howTo}</Detail>
          <Detail label="What one scoop adds">{REDS_SECTION.whatItAdds}</Detail>
          <Detail label="From the label">{REDS_SECTION.labelDetails}</Detail>
          <Detail label="Caution on the label">{REDS_SECTION.caution}</Detail>
        </div>
      )}
    </section>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/[0.08] px-4 py-3">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ivory)]/80">
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--gold)]" />
        {label}
      </p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--ivory)]/90">{children}</p>
    </div>
  );
}
