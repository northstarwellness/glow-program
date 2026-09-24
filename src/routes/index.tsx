import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ritual App — The Inner Glow Reset" },
      { name: "description", content: "A 21-day morning ritual for radiant skin, a calm gut, and steady energy." },
    ],
  }),
  component: NameCapture,
});

function NameCapture() {
  const hydrated = useHydrated();
  const verifiedEmail = useApp((s) => s.verifiedEmail);
  const name = useApp((s) => s.name);
  const seenWelcome = useApp((s) => s.seenWelcome);
  const setName = useApp((s) => s.setName);
  const startReset = useApp((s) => s.startReset);
  const navigate = useNavigate();
  const [val, setVal] = useState("");

  if (hydrated && !verifiedEmail) return <Navigate to="/verify" />;
  if (hydrated && name && seenWelcome) return <Navigate to="/home" />;
  if (hydrated && name && !seenWelcome) return <Navigate to="/welcome" />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = val.trim();
    if (!v) return;
    setName(v);
    startReset();
    navigate({ to: "/welcome" });
  };

  return (
    <div className="ivory-frame min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-8">

        {/* Top wordmark */}
        <div className="pt-14 pb-0">
          <p className="font-serif text-[11px] tracking-[0.55em] text-[var(--charcoal)]/40 uppercase">
            RITUAL APP
          </p>
        </div>

        {/* Main content — vertically centered */}
        <div className="flex flex-1 flex-col justify-center pb-16">

          {/* Thin gold rule */}
          <div className="mb-10 h-px w-10 bg-[var(--gold)]/50" />

          <h1 className="font-serif text-[46px] leading-[1.05] text-[var(--charcoal)]">
            Your skin notices<br />everything.
          </h1>

          <p className="mt-5 font-serif italic text-[16px] leading-relaxed text-[var(--charcoal)]/50 max-w-[30ch]">
            The Inner Glow Reset is a 21-day morning ritual built for the woman who's doing everything right and still not seeing it on her face.
          </p>

          <form onSubmit={submit} className="mt-12">
            <label className="block font-serif text-[11px] tracking-[0.38em] uppercase text-[var(--charcoal)]/40 mb-5">
              Who's doing this reset?
            </label>
            <input
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Your first name"
              maxLength={32}
              className="w-full border-0 border-b border-[var(--taupe)]/40 bg-transparent pb-3 font-serif text-[28px] text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/20 focus:border-[var(--gold)] focus:outline-none transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={!val.trim()}
              className="gold-pill-btn mt-10 w-full disabled:opacity-30"
            >
              Begin My Reset
            </button>
          </form>

          {/* Bottom note */}
          <p className="mt-8 font-serif italic text-[12px] text-[var(--charcoal)]/30 text-center">
            21 days. One morning ritual. No shortcuts.
          </p>
        </div>

      </div>
    </div>
  );
}
