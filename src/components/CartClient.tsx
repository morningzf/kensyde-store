"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { formatPrice, numericPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function CartClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = items.length > 0 ? 6.95 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <h1 className="font-heading text-4xl font-extrabold text-navy md:text-5xl">Cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-lg border border-line bg-white p-10 text-center">
            <h2 className="font-heading text-2xl font-semibold text-navy">Your cart is empty.</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Explore the KENSYDE 12oz collection and choose your everyday carry color.
            </p>
            <Button href="/shop" variant="secondary" className="mt-6">
              Shop Collection
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.sku} className="grid gap-4 rounded-lg border border-line bg-white p-4 shadow-sm md:grid-cols-[7rem_1fr_auto]">
                  <div className="relative aspect-square overflow-hidden rounded bg-cream">
                    <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                  </div>
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-heading text-lg font-semibold text-navy">
                      {item.name}
                    </Link>
                    <p className="mt-2 text-sm text-muted">
                      {item.color} / {item.capacity}
                    </p>
                    <p className="mt-3 font-heading text-sm font-semibold text-charcoal">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                    <div className="inline-flex items-center rounded border border-line bg-cream">
                      <button
                        className="h-10 w-10 text-navy"
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} className="mx-auto" aria-hidden="true" />
                      </button>
                      <span className="w-10 text-center font-heading text-sm font-semibold">{item.quantity}</span>
                      <button
                        className="h-10 w-10 text-navy"
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} className="mx-auto" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg font-semibold text-navy">{formatPrice(numericPrice(item.price) * item.quantity)}</p>
                      <button
                        className="mt-2 inline-flex items-center gap-1 text-sm text-muted hover:text-navy"
                        onClick={() => removeItem(item.sku)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-line bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-navy">Summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-line pt-4">
                  <div className="flex justify-between font-heading text-xl font-semibold text-navy">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <Button href="/checkout" variant="secondary" className="mt-6 w-full">
                Checkout
              </Button>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
