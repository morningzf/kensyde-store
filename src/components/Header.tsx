"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Colors", href: "/#colors" },
  { label: "Scenes", href: "/#scenes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/80 bg-warm/95 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="font-heading text-xl font-semibold tracking-[0.12em] text-ink">
          KENSYDE
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-transparent py-2 font-heading text-[11px] font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-clay hover:text-clay"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center text-ink"
            aria-label={`Cart with ${itemCount} items`}
          >
            <ShoppingBag size={21} aria-hidden="true" />
            <span className="absolute right-0 top-0 min-w-5 rounded-full bg-sage px-1 py-0.5 text-center text-[10px] font-bold text-white">
              {itemCount}
            </span>
          </Link>
          <button
            className="inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu size={23} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/25 lg:hidden">
          <div className="ml-auto flex h-full w-[min(24rem,90vw)] flex-col bg-warm p-6 shadow-soft">
            <div className="mb-10 flex items-center justify-between">
              <span className="font-heading text-xl font-semibold tracking-[0.1em] text-ink">KENSYDE</span>
              <button
                className="inline-flex h-10 w-10 items-center justify-center text-ink"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-col border-t border-line">
              {[...navItems, { label: `Cart (${itemCount})`, href: "/cart" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-line py-5 font-heading text-base font-semibold uppercase tracking-[0.06em] text-charcoal"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
