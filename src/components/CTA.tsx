import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "gold" | "outline";

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all active:scale-[0.98] disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-[var(--plum-deep)]",
  gold: "bg-accent text-gold-foreground hover:opacity-90",
  outline: "border border-primary/40 text-primary hover:bg-primary/5",
  ghost: "text-muted-foreground hover:text-primary",
};

export function CTA({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function CTALink({
  to,
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: {
  to?: string;
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to as string} className={cls} {...rest}>
      {children}
    </Link>
  );
}
