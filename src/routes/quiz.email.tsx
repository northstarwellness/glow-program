import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { CTA } from "@/components/CTA";
import { useGlow } from "@/lib/glow-store";
import { useState } from "react";
import { captureEmail } from "@/lib/email.functions";

export const Route = createFileRoute("/quiz/email")({
  head: () => ({ meta: [{ title: "Save your ritual — NOURÉ" }] }),
  component: EmailStep,
});

function EmailStep() {
  const navigate = useNavigate();
  const setEmail = useGlow((s) => s.setEmail);
  const glowType = useGlow((s) => s.glowType);
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");

  function handleContinue() {
    const v = value.trim();
    if (v.length === 0) {
      navigate({ to: "/result" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setErr("That email looks off. You can also skip.");
      return;
    }
    setEmail(v);
    // Fire-and-forget — never gate navigation
    void captureEmail({ data: { email: v, glowType } }).catch(() => {});
    navigate({ to: "/result" });
  }

  return (
    <Shell hideNav>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Almost there</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-primary">
        Want your ritual <em>saved?</em>
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        Drop your email and we'll send your Glow Plan and a gentle nudge each morning.
        Or skip — your progress saves on this device.
      </p>
      <GoldDivider />
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@yours.com"
        value={value}
        onChange={(e) => { setValue(e.target.value); setErr(""); }}
        className="w-full rounded-2xl border border-border bg-card px-5 py-4 font-serif text-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/40"
      />
      {err && <p className="mt-2 text-xs text-[var(--berry)]">{err}</p>}

      <div className="mt-6 flex flex-col gap-3">
        <CTA variant="primary" onClick={handleContinue}>Save & Continue</CTA>
        <button
          onClick={() => navigate({ to: "/result" })}
          className="text-center font-serif text-sm italic text-muted-foreground"
        >
          Skip for now
        </button>
      </div>
    </Shell>
  );
}
