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

const NAV: {
  to: "/home" | "/rituals" | "/recipes" | "/journal" | "/grocery";
  label: string;
  icon: ReactNode;
  activeIcon: ReactNode;
}[] = [
  { to: "/home",    label: "Today",     icon: <IconHome />,  activeIcon: <IconHome filled /> },
  { to: "/rituals", label: "Rituals",   icon: <IconLeaf />,  activeIcon: <IconLeaf filled /> },
  { to: "/recipes", label: "Smoothies", icon: <IconGlass />, activeIcon: <IconGlass filled /> },
  { to: "/journal", label: "Journal",   icon: <IconBook />,  activeIcon: <IconBook filled /> },
  { to: "/grocery", label: "Grocery",   icon: <IconList />,  activeIcon: <IconList filled /> },
];

function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--taupe)]/25"
         style={{ background: "var(--ivory)" }}>
      <div className="mx-auto flex max-w-[440px] items-stretch justify-around px-0.5 py-1.5">
        {NAV.map((n) => {
          const active = loc.pathname === n.to || loc.pathname.startsWith(n.to + "/");
          return (
            <Link
              key={n.to}
              to={n.to}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5 cursor-pointer transition-all duration-200"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-[var(--gold)]" />
              )}
              <span className={`transition-colors duration-200 ${active ? "text-[var(--charcoal)]" : "text-[var(--taupe)]"}`}>
                {active ? n.activeIcon : n.icon}
              </span>
              <span className={`text-[9px] tracking-[0.12em] uppercase font-medium transition-colors duration-200 ${
                active ? "text-[var(--charcoal)]" : "text-[var(--taupe)]"
              }`}>{n.label}</span>
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
      <Link to="/home" className="font-serif text-base tracking-[0.32em] text-[var(--charcoal)]">RITUAL APP</Link>
      {typeof day === "number" && (
        <div className="flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-[var(--charcoal)]/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /> Day {day} of 21
          {name && <span className="ml-1 text-[var(--taupe)]">/ {name}</span>}
        </div>
      )}
    </div>
  );
}

export function GoldDivider() { return <div className="gold-divider my-6" />; }
export function WarmDivider() { return <div className="warm-divider my-5" />; }

function IconHome({ filled }: { filled?: boolean }) {
  return filled
    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 11l9-8 9 8" /><path d="M5 9v12h14V9" /></svg>;
}
function IconLeaf({ filled }: { filled?: boolean }) {
  return filled
    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 5.5-8 5.5L17 8Z"/></svg>
    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 21c0-9 7-16 16-16-1 9-7 16-16 16z" /><path d="M5 21c4-4 8-8 12-12" /></svg>;
}
function IconGlass({ filled }: { filled?: boolean }) {
  return filled
    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12l-2 13a4 4 0 01-8 0L6 2zm3 16h6M9 21h6"/></svg>
    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h12l-2 12a4 4 0 01-8 0L6 3z" /><path d="M9 21h6" /></svg>;
}
function IconBook({ filled }: { filled?: boolean }) {
  return filled
    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 8H13V3.5z"/></svg>
    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4z" /><path d="M4 16a4 4 0 014-4h12" /></svg>;
}
function IconList({ filled }: { filled?: boolean }) {
  return filled
    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
}

export function GlowMark({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 24" width={size * (80 / 24)} height={size * (24 / 80)} className="mx-auto" aria-hidden="true">
      <line x1="0" y1="12" x2="28" y2="12" stroke="oklch(0.720 0.082 65)" strokeWidth="0.6" strokeOpacity="0.5" />
      <polygon
        points="40,4 43.5,12 40,20 36.5,12"
        fill="none"
        stroke="oklch(0.720 0.082 65)"
        strokeWidth="0.7"
        strokeOpacity="0.7"
      />
      <line x1="52" y1="12" x2="80" y2="12" stroke="oklch(0.720 0.082 65)" strokeWidth="0.6" strokeOpacity="0.5" />
    </svg>
  );
}
