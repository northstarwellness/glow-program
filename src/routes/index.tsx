import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { Pomegranate } from "@/components/Frame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOURÉ — The Inner Glow Reset" },
      { name: "description", content: "A 21-day morning ritual for radiant skin, a calm gut, and steady energy." },
    ],
  }),
  component: NameCapture,
});

function NameCapture() {
  const hydrated = useHydrated();
  const name = useApp((s) => s.name);
  const seenWelcome = useApp((s) => s.seenWelcome);
  const setName = useApp((s) => s.setName);
  const startReset = useApp((s) => s.startReset);
  const navigate = useNavigate();
  const [val, setVal] = useState("");

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
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center px-6 pt-10 pb-12">
        <p className="font-serif text-[15px] tracking-[0.4em] text-[var(--plum)]">NOURÉ</p>

        <div className="mt-8">
          <Pomegranate size={200} />
        </div>

        <h1 className="mt-6 text-center font-serif text-[40px] leading-tight text-[var(--plum)]">
          Before we begin.
        </h1>
        <p className="mt-3 max-w-[30ch] text-center text-[15px] leading-relaxed text-[var(--plum)]/65">
          This ritual is yours. Tell us your name.
        </p>

        <form onSubmit={submit} className="mt-10 w-full">
          <input
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Your first name"
            className="w-full border-0 border-b border-[var(--plum)]/30 bg-transparent px-1 py-3 text-center font-serif text-2xl text-[var(--plum)] placeholder:text-[var(--plum)]/30 focus:border-[var(--gold)] focus:outline-none"
            maxLength={32}
          />
          <button type="submit" disabled={!val.trim()} className="gold-pill-btn mt-10 w-full disabled:opacity-50">
            Begin My Reset →
          </button>
        </form>
      </div>
    </div>
  );
}
