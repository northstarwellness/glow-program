import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const hydrated = useHydrated();
  const s = useApp();
  const navigate = useNavigate();
  if (hydrated && !s.name) return <Navigate to="/" />;
  const [name, setName] = useState(s.name ?? "");
  const [time, setTime] = useState(s.notificationTime);
  const [confirm, setConfirm] = useState(0);

  const reset = () => {
    if (confirm < 2) { setConfirm(confirm + 1); return; }
    s.resetAll();
    navigate({ to: "/" });
  };

  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/home" className="text-[12px] text-[var(--plum)]/60">← Home</Link>
      <h1 className="mt-3 font-serif text-[32px] text-[var(--plum)]">Your profile.</h1>

      <div className="mt-6 space-y-5">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => s.setName(name || s.name || "")}
            className="w-full border-b border-[var(--plum)]/20 bg-transparent py-2 font-serif text-[20px] text-[var(--plum)] focus:border-[var(--gold)] focus:outline-none" />
        </Field>

        <Field label="Start date">
          <p className="font-serif text-[16px] text-[var(--plum)]">{s.startDate ? new Date(s.startDate).toLocaleDateString() : "—"}</p>
        </Field>

        <Field label="Daily reminder">
          <input type="time" value={time} onChange={(e) => { setTime(e.target.value); s.setNotificationTime(e.target.value); }}
            className="rounded-lg border border-[var(--plum)]/15 bg-[var(--card)] px-3 py-2 font-serif text-[16px] text-[var(--plum)]" />
        </Field>

        <Field label="Badges earned">
          <div className="flex flex-wrap gap-2">
            {s.badgesEarned.length === 0 ? <p className="text-[13px] text-[var(--plum)]/50">None yet — keep showing up.</p>
              : s.badgesEarned.map((b) => <span key={b} className="rounded-full bg-[var(--gold)]/15 px-3 py-1 text-[11px] tracking-wide text-[var(--gold)]">{b}</span>)}
          </div>
        </Field>
      </div>

      <GoldDivider />
      <button onClick={reset} className={`w-full rounded-full border px-4 py-3 font-serif text-[14px] ${
        confirm === 0 ? "border-[var(--plum)]/20 text-[var(--plum)]/60"
        : confirm === 1 ? "border-[var(--berry)] text-[var(--berry)]"
        : "bg-[var(--berry)] text-[var(--ivory)]"
      }`}>
        {confirm === 0 ? "Reset my progress"
          : confirm === 1 ? "Are you sure? This clears all 21 days. Tap again to confirm."
          : "Tap once more — this can't be undone."}
      </button>
    </Frame>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="sand-card p-4">
      <p className="label-caps text-[var(--gold)]">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
