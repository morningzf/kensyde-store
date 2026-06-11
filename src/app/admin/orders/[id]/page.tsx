import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminStatusBadge } from "@/components/AdminStatusBadge";
import { formatPrice } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[160px_1fr]">
      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="break-words text-sm text-charcoal">{value || "Not provided"}</dd>
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
        Back to Orders
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Order Detail</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-muted">
            Created {new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" }).format(order.createdAt)}
          </p>
        </div>
        <AdminStatusBadge status={order.status} />
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded border border-line bg-white">
            <h2 className="border-b border-line px-5 py-4 font-heading text-base font-semibold text-navy">Items</h2>
            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-4 p-5 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                  <div className="relative h-20 w-16 rounded border border-line bg-cream">
                    <Image src={item.image} alt={`${item.productName} in ${item.color}`} fill sizes="64px" className="object-contain p-1" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-charcoal">{item.productName}</p>
                    <p className="mt-1 text-sm text-muted">{item.color} / {item.capacity} / Qty {item.quantity}</p>
                    <p className="mt-1 text-xs text-muted">SKU: {item.sku}</p>
                  </div>
                  <p className="font-heading font-semibold text-navy">{formatPrice(Number(item.totalPrice))}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-line bg-white p-5">
            <h2 className="font-heading text-base font-semibold text-navy">Customer & Shipping</h2>
            <dl className="mt-3">
              <DetailRow label="Customer" value={order.customerName} />
              <DetailRow label="Email" value={order.customerEmail} />
              <DetailRow label="Phone" value={order.phone} />
              <DetailRow label="Ship To" value={shippingAddress} />
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded border border-line bg-white p-5">
            <h2 className="font-heading text-base font-semibold text-navy">Payment Summary</h2>
            <dl className="mt-3">
              <DetailRow label="Subtotal" value={formatPrice(Number(order.subtotal))} />
              <DetailRow label="Shipping" value={formatPrice(Number(order.shipping))} />
              <DetailRow label="Total" value={formatPrice(Number(order.total))} />
              <DetailRow label="Refunded" value={formatPrice(Number(order.refundedAmount))} />
              <DetailRow label="Currency" value={order.currency.toUpperCase()} />
              <DetailRow label="Provider" value={order.paymentProvider} />
            </dl>
          </section>

          <section className="rounded border border-line bg-white p-5">
            <h2 className="font-heading text-base font-semibold text-navy">Stripe References</h2>
            <dl className="mt-3">
              <DetailRow label="Session ID" value={order.stripeSessionId || ""} />
              <DetailRow label="Payment Intent" value={order.stripePaymentIntentId || ""} />
              <DetailRow label="Paid At" value={order.paidAt ? order.paidAt.toISOString() : ""} />
              <DetailRow label="Updated At" value={order.updatedAt.toISOString()} />
            </dl>
          </section>
        </div>
      </div>
    </section>
  );
}
