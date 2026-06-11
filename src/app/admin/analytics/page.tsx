import { redirect } from "next/navigation";
import { formatPrice, products } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductMetrics = {
  sku: string;
  color: string;
  impressions: number;
  clicks: number;
  views: number;
  carts: number;
};

function percent(numerator: number, denominator: number) {
  return denominator > 0 ? `${((numerator / denominator) * 100).toFixed(1)}%` : "0.0%";
}

export default async function AdminAnalyticsPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [eventGroups, uniqueSessions, productEvents, pageGroups, paidOrders, paidRevenue] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: { createdAt: { gte: since } },
      _count: { _all: true }
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { sessionId: true },
      distinct: ["sessionId"]
    }),
    prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: since },
        productSku: { not: null },
        eventType: { in: ["product_impression", "product_click", "product_view", "add_to_cart"] }
      },
      select: { eventType: true, productSku: true }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since }, eventType: "page_view" },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 8
    }),
    prisma.order.count({ where: { status: "paid", paidAt: { gte: since } } }),
    prisma.order.aggregate({
      where: { status: "paid", paidAt: { gte: since } },
      _sum: { total: true }
    })
  ]);

  const counts = Object.fromEntries(eventGroups.map((group) => [group.eventType, group._count._all])) as Record<string, number>;
  const checkoutStarts = counts.checkout_started || 0;
  const productMetrics = new Map<string, ProductMetrics>(
    products.map((product) => [
      product.sku,
      {
        sku: product.sku,
        color: product.colorName,
        impressions: 0,
        clicks: 0,
        views: 0,
        carts: 0
      }
    ])
  );

  productEvents.forEach((event) => {
    if (!event.productSku) return;
    const metric = productMetrics.get(event.productSku);
    if (!metric) return;

    if (event.eventType === "product_impression") metric.impressions += 1;
    if (event.eventType === "product_click") metric.clicks += 1;
    if (event.eventType === "product_view") metric.views += 1;
    if (event.eventType === "add_to_cart") metric.carts += 1;
  });

  const metrics = Array.from(productMetrics.values()).sort((a, b) => b.impressions - a.impressions);
  const cards = [
    { label: "Visitors", value: uniqueSessions.length.toLocaleString(), note: "Anonymous browser sessions" },
    { label: "Page Views", value: (counts.page_view || 0).toLocaleString(), note: "Pages opened" },
    { label: "Product Views", value: (counts.product_view || 0).toLocaleString(), note: "Product detail visits" },
    { label: "Add to Cart", value: (counts.add_to_cart || 0).toLocaleString(), note: "Cart actions" },
    { label: "Checkout Starts", value: checkoutStarts.toLocaleString(), note: "Stripe checkout attempts" },
    { label: "Paid Orders", value: paidOrders.toLocaleString(), note: `${percent(paidOrders, checkoutStarts)} of checkout starts` }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="border-b border-line pb-7">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">KENSYDE Admin</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">Analytics</h1>
        <p className="mt-2 text-sm text-muted">First-party performance from the last 30 days. No customer names, emails, or full IP addresses are recorded.</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded border border-line bg-white p-5">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">{card.label}</p>
            <p className="mt-2 font-heading text-2xl font-bold text-navy">{card.value}</p>
            <p className="mt-2 text-xs text-muted">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded border border-line bg-navy p-6 text-white">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-sand">Paid Revenue</p>
        <p className="mt-2 font-heading text-3xl font-bold">{formatPrice(Number(paidRevenue._sum.total || 0))}</p>
        <p className="mt-2 text-sm text-white/65">Paid, non-refunded orders recorded during this period.</p>
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">
        <section className="overflow-hidden rounded border border-line bg-white">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-heading text-base font-semibold text-navy">Product Performance</h2>
            <p className="mt-1 text-xs text-muted">Exposure means the product card entered the visitor&apos;s screen.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.08em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-heading font-semibold">Color</th>
                  <th className="px-5 py-3 font-heading font-semibold">Exposure</th>
                  <th className="px-5 py-3 font-heading font-semibold">Clicks</th>
                  <th className="px-5 py-3 font-heading font-semibold">Click Rate</th>
                  <th className="px-5 py-3 font-heading font-semibold">Detail Views</th>
                  <th className="px-5 py-3 font-heading font-semibold">Add to Cart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {metrics.map((metric) => (
                  <tr key={metric.sku}>
                    <td className="px-5 py-4">
                      <p className="font-heading font-semibold text-navy">{metric.color}</p>
                      <p className="mt-1 text-xs text-muted">{metric.sku}</p>
                    </td>
                    <td className="px-5 py-4 text-muted">{metric.impressions}</td>
                    <td className="px-5 py-4 text-muted">{metric.clicks}</td>
                    <td className="px-5 py-4 font-heading font-semibold text-navy">{percent(metric.clicks, metric.impressions)}</td>
                    <td className="px-5 py-4 text-muted">{metric.views}</td>
                    <td className="px-5 py-4 text-muted">{metric.carts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded border border-line bg-white">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-heading text-base font-semibold text-navy">Top Pages</h2>
          </div>
          <div className="divide-y divide-line">
            {pageGroups.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted">Analytics will appear after new visits.</p>
            ) : (
              pageGroups.map((page) => (
                <div key={page.path} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                  <span className="break-all text-charcoal">{page.path}</span>
                  <span className="font-heading font-semibold text-navy">{page._count._all}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
