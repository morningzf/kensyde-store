"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Colors", href: "/#colors" },
  { label: "Everyday Carry", href: "/#scenes" },
  { label: "About", href: "/about" },
];

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`flex items-center ${compact ? "gap-2" : "gap-2.5"}`} aria-hidden="true">
      <Image
        src="/brand/kensyde-symbol.png"
        alt=""
        width={341}
        height={379}
        priority={!compact}
        className={compact ? "h-8 w-auto object-contain" : "h-9 w-auto object-contain xl:h-10"}
      />
      <Image
        src="/brand/kensyde-wordmark.png"
        alt=""
        width={1126}
        height={125}
        priority={!compact}
        className={compact ? "h-auto w-[6.75rem] object-contain" : "h-auto w-[7.75rem] object-contain xl:w-[8.5rem]"}
      />
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white text-ink">
      <div className="border-b border-black/10">
        <div className="mx-auto flex h-[4.5rem] max-w-[112rem] items-center gap-7 px-5 lg:px-8">
          <Link href="/" className="flex h-[4.5rem] shrink-0 items-center" aria-label="KENSYDE home">
            <BrandLockup />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b-2 border-transparent py-6 font-heading text-[12px] font-semibold text-black transition hover:border-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <form action="/shop" className="relative hidden lg:block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/55" size={16} aria-hidden="true" />
              <input
                type="search"
                name="search"
                placeholder="What are you looking for?"
                className="h-10 w-[18rem] border border-black/45 bg-white pl-11 pr-4 text-[11px] outline-none transition focus:border-black xl:w-[22rem]"
              />
            </form>
            <Link href="/contact" className="hidden h-10 w-10 items-center justify-center text-black lg:inline-flex" aria-label="Contact support">
              <UserRound size={18} strokeWidth={1.7} aria-hidden="true" />
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center text-black"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute right-0 top-0 min-w-4 bg-black px-1 py-0.5 text-center text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="inline-flex h-11 w-11 items-center justify-center text-black lg:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu size={23} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/25 lg:hidden">
          <div className="ml-auto flex min-h-screen w-[min(24rem,90vw)] flex-col bg-white p-6 shadow-soft">
            <div className="mb-10 flex items-center justify-between">
              <BrandLockup compact />
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
