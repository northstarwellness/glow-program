import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Shell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="ivory-frame min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col px-5 pb-28 pt-6">
        <TopBar />
        <main className="fade-rise flex-1">{children}</main>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function TopBar() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link to="/" className="font-serif text-xl tracking-[0.3em] text-primary">
        NOURÉ
      </Link>
      <span className="font-serif text-sm italic text-muted-foreground">Inner Glow Reset</span>
    </div>
  );
}

const NAV = [
  { to: "/today",    label: "Today" },
  { to: "/progress", label: "Progress" },
  { to: "/journal",  label: "Journal" },
  { to: "/grocery",  label: "Grocery" },
] as const;

function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-[480px] items-center justify-around px-2 py-3">
        {NAV.map((n) => {
          const active = loc.pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`text-[11px] uppercase tracking-[0.2em] transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Placeholder({ label, ratio = "aspect-[4/5]" }: { label: string; ratio?: string }) {
  return (
    <div
      className={`relative w-full ${ratio} overflow-hidden rounded-2xl border border-dashed border-accent/60 bg-[var(--ivory)] flex items-center justify-center`}
      data-image-placeholder="true"
    >
      <BotanicalSvg />
      <span className="absolute bottom-2 right-3 font-serif text-[11px] italic text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function BotanicalSvg() {
  return (
    <svg viewBox="0 0 200 240" className="h-3/4 w-3/4 opacity-60">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.732 0.082 65)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.388 0.108 354)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d="M100 30 C 70 90, 70 150, 100 210" stroke="url(#g)" strokeWidth="1.2" fill="none" />
      <g fill="url(#g)">
        <ellipse cx="80"  cy="80"  rx="14" ry="6"  transform="rotate(-30 80 80)" />
        <ellipse cx="120" cy="105" rx="14" ry="6"  transform="rotate(30 120 105)" />
        <ellipse cx="78"  cy="135" rx="14" ry="6"  transform="rotate(-30 78 135)" />
        <ellipse cx="122" cy="165" rx="14" ry="6"  transform="rotate(30 122 165)" />
        <circle cx="100" cy="210" r="6" />
      </g>
    </svg>
  );
}

export function GoldDivider() {
  return <div className="gold-divider my-6" />;
}
