import { useEffect, useRef } from "react";

/**
 * Accessible result line for share/copy controls.
 * `message` is announced politely; `manualText` shows a selectable fallback
 * when nothing could be copied automatically.
 */
export function ShareStatus({
  message,
  manualText,
  tone = "muted",
  className = "",
}: {
  message: string;
  manualText?: string | null;
  tone?: "muted" | "light";
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (manualText) ref.current?.select();
  }, [manualText]);
  const color = tone === "light" ? "text-[var(--ivory)]/85" : "text-[var(--charcoal)]/60";

  return (
    <div className={className}>
      <p role="status" aria-live="polite" className={`font-serif italic text-[12.5px] ${color}`}>
        {message}
      </p>
      {manualText && (
        <textarea
          ref={ref}
          readOnly
          value={manualText}
          aria-label="Text to copy"
          rows={Math.min(8, manualText.split("\n").length + 1)}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-2 w-full rounded-xl border border-[var(--taupe)]/30 bg-white p-3 text-left text-[13px] leading-relaxed text-[var(--charcoal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60"
        />
      )}
    </div>
  );
}
