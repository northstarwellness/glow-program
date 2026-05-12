import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Frame({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="ivory-frame min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-5 pt-5"
           style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px) + 1.5rem)" }}>
        <main className="fade-rise flex-1">{children}</main>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

const NAV: { to: "/home" | "/recipes" | "/checklist" | "/grocery" | "/journal"; label: string; icon: ReactNode }[] = [
  { to: "/home",      label: "Home",      icon: <IconHome /> },
  { to: "/recipes",   label: "Recipes",   icon: <IconRecipes /> },
  { to: "/checklist", label: "Checklist", icon: <IconCheck /> },
  { to: "/grocery",   label: "Grocery",   icon: <IconBag /> },
  { to: "/journal",   label: "Journal",   icon: <IconBook /> },
];

function BottomNav() {
  const loc = useLocation();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/96 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-[440px] items-stretch justify-around px-1 py-2">
        {NAV.map((n) => {
          const active = loc.pathname === n.to || loc.pathname.startsWith(n.to + "/");
          return (
            <Link key={n.to} to={n.to} className="relative flex flex-1 flex-col items-center gap-1 py-1.5">
              <span className={`transition-colors ${active ? "text-[var(--plum)]" : "text-[var(--plum)]/38"}`}>{n.icon}</span>
              <span className={`text-[9.5px] tracking-[0.10em] uppercase font-medium transition-colors ${active ? "text-[var(--plum)]" : "text-[var(--plum)]/40"}`}>{n.label}</span>
              {active && <span className="absolute bottom-0 h-[2px] w-5 rounded-full bg-[var(--gold)]" />}
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
        <div className="flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-[var(--plum)]/65">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /> Day {day} of 21
          {name && <span className="ml-1 text-[var(--plum)]/35">· {name}</span>}
        </div>
      )}
    </div>
  );
}

export function GoldDivider() { return <div className="gold-divider my-6" />; }
export function WarmDivider() { return <div className="warm-divider my-5" />; }

function IconHome() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 11l9-8 9 8" /><path d="M5 9v12h14V9" /></svg>; }
function IconRecipes() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
function IconBook() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4z" /><path d="M4 16a4 4 0 014-4h12" /></svg>; }

export function GlowMark({ size = 140 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className="mx-auto" aria-hidden="true">
      {/* Thin outer ring — soft gold */}
      <circle cx="60" cy="60" r="56" fill="none" stroke="oklch(0.732 0.082 65)" strokeWidth="0.8" opacity="0.45" />
      {/* Hairline inner ring */}
      <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.732 0.082 65)" strokeWidth="0.4" opacity="0.22" />
      {/* Serif N monogram — deep plum, light weight */}
      <text
        x="60" y="83"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="66"
        fontWeight="300"
        letterSpacing="-0.02em"
        fill="oklch(0.388 0.108 354)"
        fillOpacity="0.82"
      >N</text>
    </svg>
  );
}
