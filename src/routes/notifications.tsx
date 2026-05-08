import { createFileRoute } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { CTA } from "@/components/CTA";
import { useGlow } from "@/lib/glow-store";
import { useState } from "react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Morning reminder — NOURÉ" }] }),
  component: Notifications,
});

function Notifications() {
  const reminder = useGlow((s) => s.reminderTime);
  const setReminder = useGlow((s) => s.setReminderTime);
  const [time, setTime] = useState(reminder ?? "07:30");
  const [saved, setSaved] = useState(false);

  return (
    <Shell>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">A gentle nudge</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-primary">
        Your morning <em>reminder.</em>
      </h1>
      <p className="mt-4 font-serif italic text-muted-foreground">
        Pick a time that feels like yours. Web reminders are coming soon — for now we'll save your time.
      </p>

      <GoldDivider />

      <label className="block text-[11px] uppercase tracking-[0.25em] text-accent">Reminder time</label>
      <input
        type="time"
        value={time}
        onChange={(e) => { setTime(e.target.value); setSaved(false); }}
        className="mt-2 w-full rounded-2xl border border-border bg-card px-5 py-4 font-serif text-2xl outline-none focus:border-accent focus:ring-2 focus:ring-accent/40"
      />

      <div className="mt-6">
        <CTA variant="primary" onClick={() => { setReminder(time); setSaved(true); }}>
          Save my time
        </CTA>
        {saved && (
          <p className="mt-3 font-serif italic text-[var(--berry)]">Saved. {time} it is.</p>
        )}
      </div>
    </Shell>
  );
}
