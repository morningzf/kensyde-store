import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white bg-warm text-ink">
      <div className="mx-auto flex max-w-[112rem] flex-col gap-6 px-5 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Link href="/" className="block shrink-0" aria-label="KENSYDE home">
          <Image
            src="/brand/kensyde-logo-black.png"
            alt="KENSYDE — By Your Syde"
            width={144}
            height={84}
            className="h-auto w-36 object-contain object-left"
          />
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
