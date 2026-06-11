"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/Button";
import { trackEvent } from "@/lib/analytics";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent({ eventType: "product_impression", productSku: product.sku, productSlug: product.slug });
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [product.sku, product.slug]);

  return (
    <article ref={cardRef} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link
        href={`/product/${product.slug}`}
        className="block bg-cream"
        onClick={() => trackEvent({ eventType: "product_click", productSku: product.sku, productSlug: product.slug })}
      >
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.altText || product.name}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-contain p-2 transition duration-500 group-hover:scale-[1.06]"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded bg-cream px-2.5 py-1 font-heading text-xs font-semibold text-navy">
            {product.capacity}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <Star size={15} className="fill-sand text-sand" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <Link
          href={`/product/${product.slug}`}
          onClick={() => trackEvent({ eventType: "product_click", productSku: product.sku, productSlug: product.slug })}
        >
          <h3 className="font-heading text-lg font-semibold leading-7 text-charcoal hover:text-navy">
            12oz Ring Handle Tumbler
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border border-line"
              style={{ backgroundColor: product.colorHex }}
            />
            {product.colorName}
          </span>
        </div>
        <p className="mt-2 text-sm leading-5 text-muted">304 Stainless Steel</p>
        <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-heading text-xl font-semibold text-navy">{formatPrice(product.price)}</span>
          <Button
            variant="secondary"
            className="min-h-10 px-4 py-2"
            onClick={() => {
              addItem(product);
              trackEvent({ eventType: "add_to_cart", productSku: product.sku, productSlug: product.slug });
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
