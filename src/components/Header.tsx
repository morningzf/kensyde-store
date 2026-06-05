"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop?section=collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="font-heading text-2xl font-extrabold tracking-[0.08em] text-navy">
          KENSYDE
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="font-heading text-sm font-semibold text-charcoal hover:text-navy">
              {item.label}
            </Link>
          ))}
          <Link href="/cart" className="relative inline-flex items-center gap-2 font-heading text-sm font-semibold text-charcoal hover:text-navy">
            <ShoppingBag size={18} aria-hidden="true" />
            Cart
            <span className="min-w-5 rounded-full bg-sand px-1.5 py-0.5 text-center text-xs text-navy">
              {itemCount}
            </span>
          </Link>
        </nav>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded border border-line bg-white text-navy lg:hidden"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy/30 lg:hidden">
          <div className="ml-auto flex h-full w-[min(22rem,88vw)] flex-col bg-cream p-6 shadow-soft">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-heading text-xl font-extrabold tracking-[0.08em] text-navy">KENSYDE</span>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded border border-line bg-white text-navy"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {[...navItems, { label: `Cart (${itemCount})`, href: "/cart" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-heading text-lg font-semibold text-charcoal"
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
