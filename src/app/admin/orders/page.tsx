import { Prisma } from "@prisma/client";
import { ArrowRight, Download, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminStatusBadge } from "@/components/AdminStatusBadge";
import { formatPrice } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statuses = ["all", "pending", "paid", "failed", "cancelled", "refunded", "partially_refunded"] as const;

function getString(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: { status?: string; q?: string };
}) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const statusParam = getString(searchParams.status);
  const status = statuses.includes(statusParam as (typeof statuses)[number]) ? statusParam : "all";
  const query = getString(searchParams.q).slice(0, 120);
  const exportParams = new URLSearchParams();
  if (status !== "all") exportParams.set("status", status);
  if (query) exportParams.set("q", query);
  const exportHref = `/api/admin/orders/export${exportParams.size ? `?${exportParams.toString()}` : ""}`;
  const where: Prisma.OrderWhereInput = {
    ...(status !== "all" ? { status } : {}),
    ...(query
      ? {
          OR: [
            { orderNumber: { contains: query, mode: "insensitive" } },
            { customerEmail: { contains: query, mode: "insensitive" } },
            { customerName: { contains: query, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [orders, totalOrders, paidSummary] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
      take: 100
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: "paid" },
      _count: true,
      _sum: { total: true }
    })
  ]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-7 md:flex-row md:items-end">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">KENSYDE Admin</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">Orders</h1>
          <p className="mt-2 text-sm text-muted">Review customer, shipping, and Stripe payment details.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={exportHref}
            className="inline-flex min-h-10 items-center gap-2 rounded bg-sand px-4 font-heading text-sm font-semibold text-navy hover:bg-[#C7A975]"
          >
            <Download size={16} aria-hidden="true" />
            Export CSV
          </a>
          <form action="/api/admin/logout" method="post">
            <button className="inline-flex min-h-10 items-center gap-2 rounded border border-line bg-white px-4 font-heading text-sm font-semibold text-navy hover:border-sand">
              <LogOut size={16} aria-hidden="true" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-line bg-white p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">All Orders</p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{totalOrders}</p>
        </div>
        <div className="rounded border border-line bg-white p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">Paid Orders</p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{paidSummary._count}</p>
        </div>
        <div className="rounded border border-line bg-white p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">Paid Revenue</p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{formatPrice(Number(paidSummary._sum.total || 0))}</p>
        </div>
      </div>

      <form className="mt-7 grid gap-3 rounded border border-line bg-white p-4 md:grid-cols-[1fr_200px_auto]">
        <label className="relative">
          <Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-muted" aria-hidden="true" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search order number, customer, or email"
            className="min-h-11 w-full rounded border border-line bg-cream pl-10 pr-3 text-sm outline-none focus:border-sand"
          />
        </label>
        <select
          name="status"
          defaultValue={status}
          className="min-h-11 rounded border border-line bg-cream px-3 text-sm outline-none focus:border-sand"
        >
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value === "all" ? "All statuses" : value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button className="min-h-11 rounded bg-navy px-5 font-heading text-sm font-semibold text-white hover:bg-[#123C60]">
          Apply
        </button>
      </form>

      <div className="mt-5 overflow-hidden rounded border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-heading text-base font-semibold text-navy">Recent Orders</h2>
          <p className="text-xs text-muted">{orders.length} shown</p>
        </div>
        {orders.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">No orders match this search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.08em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-heading font-semibold">Order</th>
                  <th className="px-5 py-3 font-heading font-semibold">Customer</th>
                  <th className="px-5 py-3 font-heading font-semibold">Status</th>
                  <th className="px-5 py-3 font-heading font-semibold">Items</th>
                  <th className="px-5 py-3 font-heading font-semibold">Total</th>
                  <th className="px-5 py-3 font-heading font-semibold">Created</th>
                  <th className="px-5 py-3 font-heading font-semibold"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/70">
                    <td className="px-5 py-4 font-heading font-semibold text-navy">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-charcoal">{order.customerName}</p>
                      <p className="mt-1 text-xs text-muted">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4"><AdminStatusBadge status={order.status} /></td>
                    <td className="px-5 py-4 text-muted">{order._count.items}</td>
                    <td className="px-5 py-4 font-heading font-semibold text-navy">{formatPrice(Number(order.total))}</td>
                    <td className="px-5 py-4 text-muted">
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="inline-flex h-9 w-9 items-center justify-center rounded text-navy hover:bg-white">
                        <ArrowRight size={17} aria-label="View order" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
