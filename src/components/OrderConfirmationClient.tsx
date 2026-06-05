"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { formatPrice, numericPrice } from "@/data/products";
import type { CartItem } from "@/context/CartContext";

type StoredOrder = {
  orderNo: string;
  total: number;
  payment: string;
  items: CartItem[];
  customer: Record<string, string>;
};

export function OrderConfirmationClient() {
  const params = useSearchParams();
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("kensyde-last-order");
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  const orderNo = params.get("order") || order?.orderNo || "KEN-PENDING";

  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <div className="rounded-lg border border-line bg-white p-8 shadow-sm">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Order Confirmed</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-navy">Thank you for choosing KENSYDE.</h1>
          <p className="mt-4 text-muted">Order number: {orderNo}</p>

          {order ? (
            <>
              <div className="mt-8">
                <h2 className="font-heading text-xl font-semibold text-navy">Purchased Products</h2>
                <div className="mt-4 divide-y divide-line rounded border border-line">
                  {order.items.map((item) => (
                    <div key={item.sku} className="flex justify-between gap-4 px-4 py-4 text-sm">
                      <div>
                        <p className="font-heading font-semibold text-charcoal">{item.name}</p>
                        <p className="mt-1 text-muted">
                          {item.color} / {item.capacity} / Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-heading font-semibold text-navy">{formatPrice(numericPrice(item.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-navy">Total Amount</h2>
                  <p className="mt-3 font-heading text-2xl font-semibold text-navy">{formatPrice(order.total)}</p>
                  <p className="mt-2 text-sm text-muted">Payment method: {order.payment}</p>
                </div>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-navy">Shipping Information</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {order.customer.name}
                    <br />
                    {order.customer.address}
                    <br />
                    {order.customer.city}, {order.customer.state} {order.customer.postal}
                    <br />
                    {order.customer.country}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-8 text-muted">
              Your order details will appear here after checkout. Confirmation data is stored locally in this demo.
            </p>
          )}

          <div className="mt-8">
            <Button href="/shop" variant="secondary">
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
