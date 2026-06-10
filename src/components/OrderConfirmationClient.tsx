"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

type ConfirmedOrder = {
  orderNumber: string;
  status: string;
  customerEmail: string;
  total: number;
  currency: string;
  items: Array<{
    sku: string;
    productName: string;
    color: string;
    capacity: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
};

const statusMessages: Record<string, string> = {
  pending: "Payment confirmation is processing. Please refresh in a moment.",
  failed: "Payment was not completed. Please return to checkout and try another payment method.",
  cancelled: "This checkout was cancelled before payment was completed.",
  refunded: "This order has been fully refunded.",
  partially_refunded: "This order has been partially refunded."
};

export function OrderConfirmationClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    async function loadOrder() {
      try {
        const response = await fetch(`/api/orders/by-session?session_id=${encodeURIComponent(sessionId || "")}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load order.");
        }

        if (!cancelled) {
          setOrder(data);
          clearCart();
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load order.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [clearCart, sessionId]);

  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <div className="rounded-lg border border-line bg-white p-8 shadow-sm">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Order Confirmation</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-navy">Thank you for your order</h1>

          {loading && <p className="mt-6 text-muted">Loading your order details...</p>}

          {!loading && error && (
            <div className="mt-6 rounded border border-line bg-cream p-4 text-sm text-muted">
              Payment confirmation is processing. Please refresh in a moment.
            </div>
          )}

          {!loading && !sessionId && (
            <p className="mt-6 text-muted">
              Your order details will appear here after Stripe Checkout redirects back to KENSYDE.
            </p>
          )}

          {order && (
            <>
              <div className="mt-8 grid gap-4 rounded border border-line bg-cream p-5 md:grid-cols-3">
                <div>
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-muted">Order Number</p>
                  <p className="mt-2 font-heading font-semibold text-navy">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-muted">Payment Status</p>
                  <p className="mt-2 font-heading font-semibold capitalize text-navy">{order.status}</p>
                </div>
                <div>
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-muted">Total</p>
                  <p className="mt-2 font-heading font-semibold text-navy">{formatPrice(order.total)}</p>
                </div>
              </div>

              {statusMessages[order.status] && (
                <div className="mt-6 rounded border border-line bg-cream p-4 text-sm text-muted">
                  {statusMessages[order.status]}
                </div>
              )}

              <div className="mt-8">
                <h2 className="font-heading text-xl font-semibold text-navy">Items</h2>
                <div className="mt-4 divide-y divide-line rounded border border-line">
                  {order.items.map((item) => (
                    <div key={item.sku} className="flex justify-between gap-4 px-4 py-4 text-sm">
                      <div>
                        <p className="font-heading font-semibold text-charcoal">{item.productName}</p>
                        <p className="mt-1 text-muted">
                          {item.color} / {item.capacity} / Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-heading font-semibold text-navy">{formatPrice(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === "paid" && (
                <p className="mt-6 text-sm text-muted">A confirmation email will be sent to {order.customerEmail}.</p>
              )}
            </>
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
