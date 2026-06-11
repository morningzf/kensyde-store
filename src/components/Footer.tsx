import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-heading text-2xl font-extrabold tracking-[0.08em]">
            KENSYDE
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/72">
            Designed for daily carry, built for everyday use.
          </p>
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-sand">Shop</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link href="/shop">All Drinkware</Link>
            <Link href="/shop?scene=Travel">Travel</Link>
            <Link href="/shop?scene=Office">Office</Link>
            <Link href="/shop?scene=Outdoor">Outdoor</Link>
          </div>
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-sand">Company</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
            <Link href="/return-policy">Return Policy</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-sand">Contact</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <a href="mailto:support@kensyde.com">support@kensyde.com</a>
            <span>Markets: United States / United Kingdom / Germany / France</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/55">
        &copy; {new Date().getFullYear()} KENSYDE. All rights reserved.
      </div>
    </footer>
  );
}
