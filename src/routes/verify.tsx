import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { verifyPurchase } from "@/lib/shopify";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [{ title: "Access Your Reset — Ritual App" }],
  }),
  component: VerifyGate,
});

function VerifyGate() {
  const hydrated = useHydrated();
  const verifiedEmail = useApp((s) => s.verifiedEmail);
  const setVerifiedEmail = useApp((s) => s.setVerifiedEmail);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (hydrated && verifiedEmail) return <Navigate to="/" />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = email.toLowerCase().trim();
    if (!val || !val.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      const result = await verifyPurchase(val);
      if (result.verified) {
        setVerifiedEmail(val);
        navigate({ to: "/" });
      } else {
        setError(
          "We couldn't find a purchase for that email. Please use the email from your order confirmation, or contact support@nourewellness.com."
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ivory-frame min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-8">

        {/* Wordmark */}
        <div className="pt-14">
          <p className="font-serif text-[11px] tracking-[0.55em] text-[var(--charcoal)]/40 uppercase">
            RITUAL APP
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center pb-16">

          <div className="mb-10 h-px w-10 bg-[var(--gold)]/50" />

          <h1 className="font-serif text-[42px] leading-[1.05] text-[var(--charcoal)]">
            Unlock your<br />ritual.
          </h1>
          <p className="mt-3 font-serif italic text-[17px] leading-relaxed text-[var(--charcoal)]/50">
            Your glow begins within.
          </p>
          <p className="mt-1 font-serif text-[14px] leading-relaxed text-[var(--charcoal)]/45 max-w-[32ch]">
            Enter the email you used at checkout to begin your 21 days.
          </p>

          <form onSubmit={submit} className="mt-12">
            <label className="block font-serif text-[11px] tracking-[0.38em] uppercase text-[var(--charcoal)]/40 mb-5">
              Purchase email
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              className="w-full border-0 border-b border-[var(--taupe)]/40 bg-transparent pb-3 font-serif text-[24px] text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/20 focus:border-[var(--gold)] focus:outline-none transition-colors duration-300"
            />
            {error && (
              <p className="mt-4 font-serif italic text-[13px] leading-relaxed text-[var(--berry)]">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!email.trim() || loading}
              className="gold-pill-btn mt-10 w-full disabled:opacity-30"
            >
              {loading ? "Verifying..." : "Unlock My Reset"}
            </button>
          </form>

          {/* Purchase CTA */}
          <div className="mt-10 border-t border-[var(--taupe)]/20 pt-8">
            <p className="font-serif text-[11px] tracking-[0.3em] uppercase text-[var(--charcoal)]/35 mb-4">
              Don't have access yet?
            </p>
            <a
              href="https://nourewellness.com/products/21-day-beauty-ritual-app"
              className="block w-full rounded-full bg-[var(--charcoal)] px-6 py-3.5 text-center font-serif text-[15px] text-[var(--ivory)]"
            >
              Get The Inner Glow Reset
            </a>
          </div>

          <p className="mt-8 text-center font-serif italic text-[11px] text-[var(--charcoal)]/30">
            Use the exact email from your order confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
