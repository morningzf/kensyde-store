import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminFulfillmentBadge, AdminStatusBadge } from "@/components/AdminStatusBadge";
import { AdminFulfillmentForm } from "@/components/AdminFulfillmentForm";
import { formatPrice } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { colorLabel, formatAdminDate, fulfillmentStatusLabel } from "@/lib/adminLocale";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[160px_1fr]">
      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="break-words text-sm text-charcoal">{value || "未提供"}</dd>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true }
  });

  if (!order) {
    notFound();
  }

  const shippingAddress = [order.shippingAddress, order.city, order.state, order.postalCode, order.country]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-navy hover:text-sand">
        <ArrowLeft size={17} aria-hidden="true" />
        返回订单列表
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">订单详情</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-muted">
            创建时间：{formatAdminDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminStatusBadge status={order.status} />
          <AdminFulfillmentBadge status={order.fulfillmentStatus} />
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded border border-line bg-white">
            <h2 className="border-b border-line px-5 py-4 font-heading text-base font-semibold text-navy">商品明细</h2>
            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-4 p-5 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                  <div className="relative h-20 w-16 rounded border border-line bg-cream">
                    <Image src={item.image} alt={`${item.productName} in ${item.color}`} fill sizes="64px" className="object-contain p-1" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-charcoal">{item.productName}</p>
                    <p className="mt-1 text-sm text-muted">{colorLabel(item.color)} / {item.capacity} / 数量 {item.quantity}</p>
                    <p className="mt-1 text-xs text-muted">SKU: {item.sku}</p>
                  </div>
                  <p className="font-heading font-semibold text-navy">{formatPrice(Number(item.totalPrice))}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-line bg-white p-5">
            <h2 className="font-heading text-base font-semibold text-navy">客户与收货信息</h2>
            <dl className="mt-3">
              <DetailRow label="客户姓名" value={order.customerName} />
              <DetailRow label="邮箱" value={order.customerEmail} />
              <DetailRow label="电话" value={order.phone} />
              <DetailRow label="收货地址" value={shippingAddress} />
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <AdminFulfillmentForm
            orderId={order.id}
            initialStatus={order.fulfillmentStatus}
            initialCarrier={order.carrier || ""}
            initialTrackingNumber={order.trackingNumber || ""}
            initialNote={order.adminNote || ""}
          />

          <section className="rounded border border-line bg-white p-5">
            <h2 className="font-heading text-base font-semibold text-navy">付款汇总</h2>
            <dl className="mt-3">
              <DetailRow label="商品小计" value={formatPrice(Number(order.subtotal))} />
              <DetailRow label="运费" value={formatPrice(Number(order.shipping))} />
              <DetailRow label="订单总额" value={formatPrice(Number(order.total))} />
              <DetailRow label="已退款金额" value={formatPrice(Number(order.refundedAmount))} />
              <DetailRow label="币种" value={order.currency.toUpperCase()} />
              <DetailRow label="支付渠道" value={order.paymentProvider} />
              <DetailRow label="履约状态" value={fulfillmentStatusLabel(order.fulfillmentStatus)} />
              <DetailRow label="履约时间" value={formatAdminDate(order.fulfilledAt)} />
              <DetailRow label="发货邮件" value={order.shippingNotifiedAt ? `已发送，${formatAdminDate(order.shippingNotifiedAt)}` : "未发送"} />
            </dl>
          </section>

          <section className="rounded border border-line bg-white p-5">
            <h2 className="font-heading text-base font-semibold text-navy">Stripe 付款参考信息</h2>
            <dl className="mt-3">
              <DetailRow label="Session ID" value={order.stripeSessionId || ""} />
              <DetailRow label="付款意图 ID" value={order.stripePaymentIntentId || ""} />
              <DetailRow label="付款时间" value={formatAdminDate(order.paidAt)} />
              <DetailRow label="更新时间" value={formatAdminDate(order.updatedAt)} />
            </dl>
          </section>
        </div>
      </div>
    </section>
  );
}
