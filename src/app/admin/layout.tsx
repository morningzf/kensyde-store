import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/admin/orders" className="font-heading text-lg font-extrabold tracking-[0.08em] text-navy">
            KENSYDE <span className="font-medium tracking-normal text-muted">Admin</span>
          </Link>
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-muted">Private Workspace</span>
        </div>
      </header>
      {children}
    </div>
  );
}
