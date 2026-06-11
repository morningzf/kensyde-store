import { ArrowRight, BarChart3, Boxes, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminFulfillmentBadge, AdminStatusBadge } from "@/components/AdminStatusBadge";
import { formatPrice } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { formatAdminDate } from "@/lib/adminLocale";
import { ensureInventoryRecords } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function startOfShanghaiDay(daysAgo = 0) {
  const shifted = new Date(Date.now() + 8 * 60 * 60 * 1000);
  shifted.setUTCHours(0, 0, 0, 0);
  shifted.setUTCDate(shifted.getUTCDate() - daysAgo);
  return new Date(shifted.getTime() - 8 * 60 * 60 * 1000);
}

export default async function AdminOverviewPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  await ensureInventoryRecords();
  const today = startOfShanghaiDay();
  const sevenDaysAgo = startOfShanghaiDay(6);

  const [todayPaid, allPaid, pendingFulfillment, inventory, recentOrders, pageViews, visitors] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "paid", paidAt: { gte: today } },
      _count: true,
      _sum: { total: true }
    }),
    prisma.order.aggregate({
      where: { status: "paid" },
      _count: true,
      _sum: { total: true }
    }),
    prisma.order.count({
      where: { status: "paid", fulfillmentStatus: { in: ["unfulfilled", "processing"] } }
    }),
    prisma.inventory.findMany({ orderBy: { quantity: "asc" } }),
    prisma.order.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.analyticsEvent.count({ where: { eventType: "page_view", createdAt: { gte: sevenDaysAgo } } }),
    prisma.analyticsEvent.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: true
    })
  ]);

  const lowStock = inventory.filter((item) => item.quantity > 0 && item.quantity <= item.lowStockThreshold);
  const outOfStock = inventory.filter((item) => item.quantity <= 0);
  const cards = [
    {
      label: "今日已付款销售额",
      value: formatPrice(Number(todayPaid._sum.total || 0)),
      note: `${todayPaid._count} 笔已付款订单`,
      icon: ShoppingBag,
      href: "/admin/orders?status=paid"
    },
    {
      label: "累计已付款销售额",
      value: formatPrice(Number(allPaid._sum.total || 0)),
      note: `${allPaid._count} 笔已付款订单`,
      icon: PackageCheck,
      href: "/admin/orders?status=paid"
    },
    {
      label: "待处理履约订单",
      value: pendingFulfillment.toLocaleString(),
      note: "已付款但尚未发货",
      icon: Truck,
      href: "/admin/orders?status=paid"
    },
    {
      label: "近 7 天网站流量",
      value: pageViews.toLocaleString(),
      note: `${visitors.length} 位访客`,
      icon: BarChart3,
      href: "/admin/analytics?range=7d"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-7 md:flex-row md:items-end">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">KENSYDE 管理后台</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">运营概览</h1>
          <p className="mt-2 text-sm text-muted">快速查看今天需要关注的订单、销售、流量和库存。</p>
        </div>
        <p className="text-sm text-muted">数据更新时间：{formatAdminDate(new Date())}</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group rounded border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-sand hover:shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-muted">{card.label}</p>
                  <p className="mt-3 font-heading text-2xl font-bold text-navy">{card.value}</p>
                  <p className="mt-2 text-xs text-muted">{card.note}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-cream text-navy group-hover:bg-sand">
                  <Icon size={18} aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_0.75fr]">
        <section className="overflow-hidden rounded border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="font-heading text-base font-semibold text-navy">最近订单</h2>
              <p className="mt-1 text-xs text-muted">最新创建的 5 笔订单</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 font-heading text-xs font-semibold text-navy hover:text-sand">
              查看全部 <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">暂时没有订单。</p>
          ) : (
            <div className="divide-y divide-line">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid gap-3 px-5 py-4 hover:bg-cream/70 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="font-heading text-sm font-semibold text-navy">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-muted">{order.customerName} · {formatAdminDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AdminStatusBadge status={order.status} />
                    <AdminFulfillmentBadge status={order.fulfillmentStatus} />
                  </div>
                  <p className="font-heading text-sm font-semibold text-navy">{formatPrice(Number(order.total))}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 className="font-heading text-base font-semibold text-navy">库存提醒</h2>
                <p className="mt-1 text-xs text-muted">{lowStock.length} 个低库存 · {outOfStock.length} 个售罄</p>
              </div>
              <Boxes size={18} className="text-navy" aria-hidden="true" />
            </div>
            <div className="divide-y divide-line">
              {[...outOfStock, ...lowStock].slice(0, 5).map((item) => (
                <div key={item.sku} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="font-heading text-sm font-semibold text-navy">{item.sku}</p>
                    <p className="mt-1 text-xs text-muted">提醒值：{item.lowStockThreshold}</p>
                  </div>
                  <span className={`font-heading text-sm font-bold ${item.quantity <= 0 ? "text-red-700" : "text-amber-700"}`}>
                    {item.quantity}
                  </span>
                </div>
              ))}
              {lowStock.length === 0 && outOfStock.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted">当前库存状态正常。</p>
              ) : null}
            </div>
            <Link href="/admin/inventory" className="flex items-center justify-between border-t border-line px-5 py-4 font-heading text-sm font-semibold text-navy hover:bg-cream">
              管理库存 <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </section>

          <section className="rounded border border-line bg-navy p-5 text-white">
            <h2 className="font-heading text-base font-semibold">快捷入口</h2>
            <div className="mt-4 grid gap-2">
              <Link href="/admin/orders" className="flex items-center justify-between rounded border border-white/15 px-4 py-3 text-sm hover:border-sand hover:text-sand">
                处理订单 <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/admin/analytics" className="flex items-center justify-between rounded border border-white/15 px-4 py-3 text-sm hover:border-sand hover:text-sand">
                查看数据分析 <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/admin/inventory" className="flex items-center justify-between rounded border border-white/15 px-4 py-3 text-sm hover:border-sand hover:text-sand">
                调整库存 <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
