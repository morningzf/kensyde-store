import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPrice, products } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { colorLabel } from "@/lib/adminLocale";
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

type TrendPoint = {
  label: string;
  views: number;
  visitors: Set<string>;
  productViews: number;
  carts: number;
  checkouts: number;
  orders: number;
  revenue: number;
};

const ranges = [
  { value: "today", label: "今日", days: 1 },
  { value: "7d", label: "近 7 天", days: 7 },
  { value: "30d", label: "近 30 天", days: 30 },
  { value: "90d", label: "近 90 天", days: 90 }
] as const;

function percent(numerator: number, denominator: number) {
  return denominator > 0 ? `${((numerator / denominator) * 100).toFixed(1)}%` : "0.0%";
}

function changePercent(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const value = ((current - previous) / previous) * 100;
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function weekKey(date: Date) {
  const start = new Date(date);
  const day = start.getUTCDay();
  start.setUTCDate(start.getUTCDate() - day);
  return dateKey(start);
}

function createTrendPoint(label: string): TrendPoint {
  return { label, views: 0, visitors: new Set(), productViews: 0, carts: 0, checkouts: 0, orders: 0, revenue: 0 };
}

export default async function AdminAnalyticsPage({
  searchParams
}: {
  searchParams: { range?: string };
}) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const selectedRange = ranges.find((range) => range.value === searchParams.range) || ranges[2];
  const now = new Date();
  const since = new Date(now);
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (selectedRange.days - 1));
  const previousSince = new Date(since);
  previousSince.setUTCDate(previousSince.getUTCDate() - selectedRange.days);

  const [events, previousEvents, orders, previousOrders, pageGroups] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { eventType: true, sessionId: true, path: true, productSku: true, createdAt: true }
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: previousSince, lt: since } },
      select: { eventType: true, sessionId: true }
    }),
    prisma.order.findMany({
      where: { status: "paid", paidAt: { gte: since } },
      select: { paidAt: true, total: true }
    }),
    prisma.order.findMany({
      where: { status: "paid", paidAt: { gte: previousSince, lt: since } },
      select: { total: true }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since }, eventType: "page_view" },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 8
    })
  ]);

  const eventCount = (eventType: string, source: Array<{ eventType: string }> = events) =>
    source.filter((event) => event.eventType === eventType).length;
  const visitors = new Set(events.map((event) => event.sessionId)).size;
  const previousVisitors = new Set(previousEvents.map((event) => event.sessionId)).size;
  const checkoutStarts = eventCount("checkout_started");
  const paidRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const previousRevenue = previousOrders.reduce((sum, order) => sum + Number(order.total), 0);

  const productMetrics = new Map<string, ProductMetrics>(
    products.map((product) => [
      product.sku,
      { sku: product.sku, color: product.colorName, impressions: 0, clicks: 0, views: 0, carts: 0 }
    ])
  );

  events.forEach((event) => {
    if (!event.productSku) return;
    const metric = productMetrics.get(event.productSku);
    if (!metric) return;
    if (event.eventType === "product_impression") metric.impressions += 1;
    if (event.eventType === "product_click") metric.clicks += 1;
    if (event.eventType === "product_view") metric.views += 1;
    if (event.eventType === "add_to_cart") metric.carts += 1;
  });

  const metrics = Array.from(productMetrics.values()).sort((a, b) => b.impressions - a.impressions);
  const dailyPoints = new Map<string, TrendPoint>();
  for (let day = new Date(since); day <= now; day.setUTCDate(day.getUTCDate() + 1)) {
    const key = dateKey(day);
    dailyPoints.set(key, createTrendPoint(key));
  }

  events.forEach((event) => {
    const point = dailyPoints.get(dateKey(event.createdAt));
    if (!point) return;
    point.visitors.add(event.sessionId);
    if (event.eventType === "page_view") point.views += 1;
    if (event.eventType === "product_view") point.productViews += 1;
    if (event.eventType === "add_to_cart") point.carts += 1;
    if (event.eventType === "checkout_started") point.checkouts += 1;
  });
  orders.forEach((order) => {
    if (!order.paidAt) return;
    const point = dailyPoints.get(dateKey(order.paidAt));
    if (!point) return;
    point.orders += 1;
    point.revenue += Number(order.total);
  });

  const daily = Array.from(dailyPoints.values());
  const weeklyMap = new Map<string, TrendPoint>();
  daily.forEach((day) => {
    const key = weekKey(new Date(`${day.label}T00:00:00.000Z`));
    const point = weeklyMap.get(key) || createTrendPoint(key);
    point.views += day.views;
    point.productViews += day.productViews;
    point.carts += day.carts;
    point.checkouts += day.checkouts;
    point.orders += day.orders;
    point.revenue += day.revenue;
    day.visitors.forEach((session) => point.visitors.add(session));
    weeklyMap.set(key, point);
  });
  const weekly = Array.from(weeklyMap.values()).reverse();
  const maxDailyViews = Math.max(1, ...daily.map((day) => day.views));

  const cards = [
    { label: "访客数", value: visitors, previous: previousVisitors, note: "匿名浏览器访问会话" },
    { label: "页面浏览量", value: eventCount("page_view"), previous: eventCount("page_view", previousEvents), note: "页面打开次数" },
    { label: "商品详情浏览量", value: eventCount("product_view"), previous: eventCount("product_view", previousEvents), note: "商品详情页访问次数" },
    { label: "加入购物车", value: eventCount("add_to_cart"), previous: eventCount("add_to_cart", previousEvents), note: "加入购物车操作次数" },
    { label: "开始结账", value: checkoutStarts, previous: eventCount("checkout_started", previousEvents), note: "进入 Stripe 结账的次数" },
    { label: "已付款订单", value: orders.length, previous: previousOrders.length, note: `结账转化率 ${percent(orders.length, checkoutStarts)}` }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-7 md:flex-row md:items-end">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">KENSYDE 管理后台</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">数据分析</h1>
          <p className="mt-2 text-sm text-muted">查看网站访问、商品表现和销售转化，并与上一周期对比。</p>
        </div>
        <div className="flex flex-wrap rounded border border-line bg-white p-1">
          {ranges.map((range) => (
            <Link
              key={range.value}
              href={`/admin/analytics?range=${range.value}`}
              className={`rounded px-4 py-2 font-heading text-xs font-semibold ${
                selectedRange.value === range.value ? "bg-navy text-white" : "text-muted hover:text-navy"
              }`}
            >
              {range.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-muted">{card.label}</p>
              <span className={`text-xs font-semibold ${card.value >= card.previous ? "text-emerald-700" : "text-red-700"}`}>
                {changePercent(card.value, card.previous)}
              </span>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-navy">{card.value.toLocaleString()}</p>
            <p className="mt-2 text-xs text-muted">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded border border-line bg-navy p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-sand">已付款销售额</p>
            <p className="mt-2 font-heading text-3xl font-bold">{formatPrice(paidRevenue)}</p>
            <p className="mt-2 text-sm text-white/65">所选时间范围内已付款且未全额退款的订单金额。</p>
          </div>
          <span className={`text-sm font-semibold ${paidRevenue >= previousRevenue ? "text-emerald-300" : "text-red-300"}`}>
            {changePercent(paidRevenue, previousRevenue)}
          </span>
        </div>
      </div>

      <details className="group mt-7 rounded border border-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-heading text-base font-semibold text-navy">每日流量趋势</h2>
            <p className="mt-1 text-xs text-muted">{daily.length} 天 · {eventCount("page_view")} 次浏览 · {visitors} 位访客</p>
          </div>
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-muted group-open:text-navy">
            查看详情
          </span>
        </summary>
        <div className="border-t border-line p-5">
        <div className="flex h-36 items-end gap-1 overflow-hidden border-b border-line">
          {daily.map((day) => (
            <div key={day.label} className="group relative flex min-w-1 flex-1 items-end justify-center" title={`${day.label}: ${day.views} page views`}>
              <div className="w-full max-w-5 bg-sand transition hover:bg-navy" style={{ height: `${Math.max(3, (day.views / maxDailyViews) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-[0.08em] text-muted">
              <tr>
                <th className="px-4 py-3 font-heading font-semibold">日期</th>
                <th className="px-4 py-3 font-heading font-semibold">访客</th>
                <th className="px-4 py-3 font-heading font-semibold">页面浏览</th>
                <th className="px-4 py-3 font-heading font-semibold">商品浏览</th>
                <th className="px-4 py-3 font-heading font-semibold">加入购物车</th>
                <th className="px-4 py-3 font-heading font-semibold">开始结账</th>
                <th className="px-4 py-3 font-heading font-semibold">付款订单</th>
                <th className="px-4 py-3 font-heading font-semibold">销售额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...daily].reverse().slice(0, selectedRange.value === "90d" ? 31 : daily.length).map((day) => (
                <tr key={day.label}>
                  <td className="px-4 py-3 font-heading font-semibold text-navy">{day.label}</td>
                  <td className="px-4 py-3 text-muted">{day.visitors.size}</td>
                  <td className="px-4 py-3 text-muted">{day.views}</td>
                  <td className="px-4 py-3 text-muted">{day.productViews}</td>
                  <td className="px-4 py-3 text-muted">{day.carts}</td>
                  <td className="px-4 py-3 text-muted">{day.checkouts}</td>
                  <td className="px-4 py-3 text-muted">{day.orders}</td>
                  <td className="px-4 py-3 font-heading font-semibold text-navy">{formatPrice(day.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </details>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">
        <details className="group overflow-hidden rounded border border-line bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
            <div>
              <h2 className="font-heading text-base font-semibold text-navy">商品表现</h2>
              <p className="mt-1 text-xs text-muted">{eventCount("product_impression")} 次曝光 · {eventCount("product_click")} 次点击 · {eventCount("add_to_cart")} 次加购</p>
            </div>
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-muted group-open:text-navy">查看详情</span>
          </summary>
          <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.08em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-heading font-semibold">颜色</th>
                  <th className="px-5 py-3 font-heading font-semibold">曝光</th>
                  <th className="px-5 py-3 font-heading font-semibold">点击</th>
                  <th className="px-5 py-3 font-heading font-semibold">点击率</th>
                  <th className="px-5 py-3 font-heading font-semibold">详情浏览</th>
                  <th className="px-5 py-3 font-heading font-semibold">加入购物车</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {metrics.map((metric) => (
                  <tr key={metric.sku}>
                    <td className="px-5 py-4">
                      <p className="font-heading font-semibold text-navy">{colorLabel(metric.color)}</p>
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
        </details>

        <div className="space-y-6">
          <details className="group rounded border border-line bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div>
                <h2 className="font-heading text-base font-semibold text-navy">每周汇总</h2>
                <p className="mt-1 text-xs text-muted">共 {weekly.length} 个周周期</p>
              </div>
              <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-muted group-open:text-navy">查看</span>
            </summary>
            <div className="divide-y divide-line border-t border-line">
              {weekly.map((week) => (
                <div key={week.label} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-heading text-sm font-semibold text-navy">{week.label} 当周</span>
                    <span className="font-heading text-sm font-semibold text-navy">{formatPrice(week.revenue)}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{week.visitors.size} 位访客 · {week.views} 次浏览 · {week.orders} 笔订单</p>
                </div>
              ))}
            </div>
          </details>

          <details className="group rounded border border-line bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div>
                <h2 className="font-heading text-base font-semibold text-navy">热门页面</h2>
                <p className="mt-1 text-xs text-muted">按浏览量展示前 {pageGroups.length} 个页面</p>
              </div>
              <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-muted group-open:text-navy">查看</span>
            </summary>
            <div className="divide-y divide-line border-t border-line">
              {pageGroups.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-muted">产生新的访问后，这里会显示分析数据。</p>
              ) : (
                pageGroups.map((page) => (
                  <div key={page.path} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                    <span className="break-all text-charcoal">{page.path}</span>
                    <span className="font-heading font-semibold text-navy">{page._count._all}</span>
                  </div>
                ))
              )}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
