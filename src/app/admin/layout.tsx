import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <Link href="/admin/orders" className="font-heading text-lg font-extrabold tracking-[0.08em] text-navy">
            KENSYDE <span className="font-medium tracking-normal text-muted">Admin</span>
          </Link>
          <nav className="flex items-center gap-5 font-heading text-sm font-semibold text-navy">
            <Link href="/admin/orders" className="hover:text-sand">Orders</Link>
            <Link href="/admin/analytics" className="hover:text-sand">Analytics</Link>
            <Link href="/admin/inventory" className="hover:text-sand">Inventory</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
