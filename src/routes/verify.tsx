import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { verifyPurchase } from "@/lib/shopify";
import { Pomegranate } from "@/components/Frame";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [{ title: "Access Your Reset — NOURÉ" }],
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
      const result = await verifyPurchase({ data: val });
      if (result.verified) {
        setVerifiedEmail(val);
        navigate({ to: "/" });
      } else {
        setError(
          "We couldn't find a purchase for this email. Use the email you checked out with, or visit nourewellness.com/products/inner-glow-reset to get access."
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
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center px-6 pt-10 pb-12">
        <p className="font-serif text-[15px] tracking-[0.4em] text-[var(--plum)]">NOURÉ</p>

        <div className="mt-8">
          <Pomegranate size={180} />
        </div>

        <h1 className="mt-6 text-center font-serif text-[36px] leading-tight text-[var(--plum)]">
          Welcome to your reset.
        </h1>
        <p className="mt-3 max-w-[32ch] text-center text-[15px] leading-relaxed text-[var(--plum)]/65">
          Enter the email you used to purchase the Inner Glow Reset to unlock your 21 days.
        </p>

        <form onSubmit={submit} className="mt-10 w-full">
          <input
            type="email"
            autoFocus
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="your@email.com"
            className="w-full border-0 border-b border-[var(--plum)]/30 bg-transparent px-1 py-3 text-center font-serif text-xl text-[var(--plum)] placeholder:text-[var(--plum)]/30 focus:border-[var(--gold)] focus:outline-none"
          />
          {error && (
            <p className="mt-4 text-center text-[13px] leading-relaxed text-[var(--berry)]">{error}</p>
          )}
          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="gold-pill-btn mt-8 w-full disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Unlock My Reset →"}
          </button>
        </form>

        <div className="mt-10 w-full rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] p-5">
          <p className="label-caps text-[var(--gold)]">Don't have the Inner Glow Reset yet?</p>
          <a
            href="https://nourewellness.com/products/inner-glow-reset"
            className="mt-3 block w-full rounded-full bg-[var(--plum)] px-6 py-3 text-center font-serif text-[16px] text-[var(--ivory)]"
          >
            Get Access →
          </a>
        </div>

        <p className="mt-8 text-center text-[12px] text-[var(--plum)]/40">
          Already purchased? Use the exact email from your order confirmation.
        </p>
      </div>
    </div>
  );
}
