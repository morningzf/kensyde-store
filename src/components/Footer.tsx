import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white bg-warm text-ink">
      <div className="mx-auto flex max-w-[112rem] flex-col gap-7 px-5 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Link href="/" className="font-heading text-lg font-semibold tracking-[0.12em]">
          KENSYDE
        </Link>
        <div className="flex flex-wrap gap-x-7 gap-y-3 font-heading text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          <Link href="/shop">Shop</Link>
          <Link href="/#colors">Colors</Link>
          <Link href="/about">About</Link>
          <Link href="/shipping-policy">Shipping & Returns</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-of-service">Terms</Link>
        </div>
      </div>
      <div className="border-t border-white px-5 py-4 text-center text-[10px] text-muted">
        &copy; {new Date().getFullYear()} KENSYDE. All rights reserved.
      </div>
    </footer>
  );
}
