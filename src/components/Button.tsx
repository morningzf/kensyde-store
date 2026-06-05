import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
};

const base =
  "inline-flex min-h-11 items-center justify-center rounded px-5 py-3 font-heading text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const styles = {
  primary: "bg-navy text-white hover:bg-[#123C60]",
  secondary: "bg-sand text-navy hover:bg-[#C7A975]",
  outline: "border border-navy/20 bg-white text-navy hover:border-sand hover:text-navy"
};

export function Button({ href, variant = "primary", className = "", children, ...props }: ButtonProps) {
  const classes = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
