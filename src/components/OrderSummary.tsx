"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice, numericPrice } from "@/data/products";

export function OrderSummary() {
  const { items, subtotal } = useCart();
  const shipping = items.length > 0 ? 6.95 : 0;
  const total = subtotal + shipping;

  return (
    <aside className="rounded-lg border border-line bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-navy">Order Summary</h2>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.sku} className="flex gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-cream">
              <Image src={item.image} alt={item.name} fill sizes="72px" className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-heading text-sm font-semibold text-charcoal">{item.name}</p>
              <p className="mt-1 text-xs text-muted">
                {item.color} / {item.capacity} / Qty {item.quantity}
              </p>
            </div>
            <p className="font-heading text-sm font-semibold text-navy">{formatPrice(numericPrice(item.price) * item.quantity)}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-heading text-lg font-semibold text-navy">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </aside>
  );
}
