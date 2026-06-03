import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOURÉ — Unlock Your Ritual" },
      { name: "description", content: "Enter the email you used at checkout to begin your 21-day morning ritual." },
    ],
  }),
  component: UnlockGate,
});

type Status = "idle" | "loading" | "error";

function UnlockGate() {
  const hydrated = useHydrated();
  const { unlocked, seenWelcome } = useApp();
  const setUnlocked = useApp((s) => s.setUnlocked);
  const startReset = useApp((s) => s.startReset);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (hydrated && unlocked && seenWelcome) return <Navigate to="/home" />;
  if (hydrated && unlocked && !seenWelcome) return <Navigate to="/welcome" />;

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/verify-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok && res.status !== 400 && res.status !== 404) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as { unlocked: boolean; name?: string | null; error?: string };

      if (data.unlocked) {
        setUnlocked(email.trim().toLowerCase(), data.name ?? null);
        startReset();
        navigate({ to: "/welcome" });
        return;
      }

      setStatus("error");
      if (data.error === "no-orders") {
        setErrorMsg(
          "We couldn't find a purchase with that email. Please use the exact email from your order confirmation."
        );
      } else if (data.error === "wrong-product") {
        setErrorMsg(
          "We found your order, but it doesn't include the NOURÉ Ritual App or Radiant Reds. Please use the email from those purchases."
        );
      } else if (data.error === "config-missing") {
        setErrorMsg("Access verification is temporarily unavailable. Please try again shortly.");
      } else if (data.error === "invalid-email") {
        setErrorMsg("Please enter a valid email address.");
      } else {
        setErrorMsg("Something went wrong. Please check your connection and try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please check your connection and try again.");
    }
  };

  return (
    <div className="ivory-frame min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-6 pt-10 pb-12">
        <p className="text-center font-serif text-[13px] tracking-[0.4em] text-[var(--plum)]/60">
          RITUAL APP
        </p>

        <div className="mt-10">
          <h1 className="font-serif text-[46px] leading-[1.05] text-[var(--plum)]">
            Unlock your<br />ritual.
          </h1>
          <p className="mt-3 font-serif italic text-[18px] leading-relaxed text-[var(--plum)]/70">
            Your glow begins within.
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--plum)]/60">
            Enter the email you used at checkout to begin your 21 days.
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 w-full">
          <p className="label-caps text-[var(--plum)]/55">Purchase email</p>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="your@email.com"
            className="mt-2 w-full border-0 border-b border-[var(--plum)]/30 bg-transparent px-1 py-3 font-serif text-[22px] text-[var(--plum)] placeholder:text-[var(--plum)]/30 focus:border-[var(--gold)] focus:outline-none"
          />

          {status === "error" && (
            <p className="mt-4 rounded-2xl bg-[var(--berry)]/8 px-4 py-3 text-[13px] leading-relaxed text-[var(--berry)]">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid || status === "loading"}
            className="gold-pill-btn mt-8 w-full disabled:opacity-40"
          >
            {status === "loading" ? "Checking..." : "Unlock My Reset"}
          </button>
        </form>

        <div className="mt-auto">
          <div className="warm-divider mt-16" />
          <p className="mt-8 label-caps text-center text-[var(--plum)]/45">
            Don't have access yet?
          </p>
          <a
            href="https://nourewellness.com"
            target="_blank"
            rel="noreferrer"
            className="mt-4 block w-full rounded-full bg-[var(--plum)] px-6 py-4 text-center font-serif text-[17px] text-[var(--ivory)]"
          >
            Get The Inner Glow Reset
          </a>
          <p className="mt-4 text-center font-serif italic text-[12px] text-[var(--plum)]/45">
            Use the exact email from your order confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
