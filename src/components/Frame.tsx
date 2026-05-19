import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Frame({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="ivory-frame min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-5 pb-28 pt-5">
        <main className="fade-rise flex-1">{children}</main>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

const NAV: { to: "/home" | "/rituals" | "/recipes" | "/journal" | "/grocery"; label: string; icon: ReactNode }[] = [
  { to: "/home",     label: "Home",     icon: <IconHome /> },
  { to: "/rituals",  label: "Rituals",  icon: <IconLeaf /> },
  { to: "/recipes",  label: "Recipes",  icon: <IconGlass /> },
  { to: "/journal",  label: "Journal",  icon: <IconBook /> },
  { to: "/grocery",  label: "Grocery",  icon: <IconList /> },
];

function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-[440px] items-stretch justify-around px-1 py-2">
        {NAV.map((n) => {
          const active = loc.pathname === n.to || loc.pathname.startsWith(n.to + "/");
          return (
            <Link key={n.to} to={n.to} className="relative flex flex-1 flex-col items-center gap-1 py-1.5">
              <span className={active ? "text-[var(--plum)]" : "text-[var(--plum)]/40"}>{n.icon}</span>
              <span className={`text-[10px] tracking-[0.14em] uppercase ${active ? "text-[var(--plum)]" : "text-[var(--plum)]/45"}`}>{n.label}</span>
              {active && <span className="absolute bottom-0 h-[2px] w-8 rounded-full bg-[var(--gold)]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({ name, day }: { name?: string | null; day?: number }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <Link to="/home" className="font-serif text-base tracking-[0.32em] text-[var(--plum)]">NOURÉ</Link>
      {typeof day === "number" && (
        <div className="flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-[var(--plum)]/70">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /> Day {day} of 21
          {name && <span className="ml-1 text-[var(--plum)]/40">/ {name}</span>}
        </div>
      )}
    </div>
  );
}

export function GoldDivider() { return <div className="gold-divider my-6" />; }
export function WarmDivider() { return <div className="warm-divider my-5" />; }

function IconHome() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 11l9-8 9 8" /><path d="M5 9v12h14V9" /></svg>; }
function IconLeaf() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 21c0-9 7-16 16-16-1 9-7 16-16 16z" /><path d="M5 21c4-4 8-8 12-12" /></svg>; }
function IconGlass() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h12l-2 12a4 4 0 01-8 0L6 3z" /><path d="M9 21h6" /></svg>; }
function IconBook() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4z" /><path d="M4 16a4 4 0 014-4h12" /></svg>; }
function IconList() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>; }

export function Pomegranate({ size = 180 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size} className="mx-auto">
      <defs>
        <radialGradient id="pomFill" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="oklch(0.55 0.16 18)" />
          <stop offset="100%" stopColor="oklch(0.32 0.12 354)" />
        </radialGradient>
        <linearGradient id="leaf" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.09 130)" />
          <stop offset="100%" stopColor="oklch(0.42 0.10 354)" />
        </linearGradient>
      </defs>
      <path d="M100 55 C 60 60, 45 110, 65 165 C 80 200, 120 200, 135 165 C 155 110, 140 60, 100 55 Z" fill="url(#pomFill)" />
      <path d="M100 55 C 100 40, 90 30, 80 30 C 90 38, 95 48, 100 55 Z" fill="url(#leaf)" />
      <path d="M100 55 C 105 38, 118 28, 130 28 C 118 40, 110 50, 100 55 Z" fill="url(#leaf)" />
      <g fill="oklch(0.55 0.16 18)" opacity="0.55">
        <circle cx="88" cy="105" r="3.2" /><circle cx="100" cy="115" r="3" /><circle cx="112" cy="105" r="3.2" />
        <circle cx="92" cy="130" r="3" /><circle cx="108" cy="130" r="3" /><circle cx="100" cy="145" r="3.2" />
      </g>
      <ellipse cx="86" cy="95" rx="10" ry="14" fill="oklch(0.99 0 0)" opacity="0.12" />
    </svg>
  );
}
