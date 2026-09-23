import { Frame } from "@/components/Frame";

/**
 * Shown on progress-driven screens until saved progress (noure_app_v1) has loaded,
 * so nothing day-specific is displayed or tappable before the real day is known.
 * Same frame and footprint as the page — no overlay, no layout jump.
 */
export function ProgressSkeleton() {
  return (
    <Frame>
      <div
        aria-busy="true"
        aria-label="Loading your ritual"
        className="animate-pulse motion-reduce:animate-none"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="h-3 w-28 rounded-full bg-[var(--taupe)]/20" />
          <div className="h-3 w-16 rounded-full bg-[var(--taupe)]/20" />
        </div>
        <div className="h-3 w-24 rounded-full bg-[var(--taupe)]/15" />
        <div className="mt-3 h-8 w-40 rounded-full bg-[var(--taupe)]/20" />
        <div className="mt-6 h-44 w-full rounded-3xl bg-[var(--beige)] border border-[var(--taupe)]/15" />
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="h-20 rounded-xl bg-[var(--beige)]" />
          <div className="h-20 rounded-xl bg-[var(--beige)]" />
          <div className="h-20 rounded-xl bg-[var(--beige)]" />
        </div>
      </div>
    </Frame>
  );
}
