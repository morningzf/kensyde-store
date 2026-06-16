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
import { getBrandColorName, getLifestyleTag } from "@/lib/product-display";

export function ProductCard({
  product,
  presentation = "default",
}: {
  product: Product;
  presentation?: "default" | "editorial" | "catalog";
}) {
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

  if (presentation === "editorial") {
    return (
      <article ref={cardRef} className="group flex h-full min-w-0 flex-col border-t border-ink/10 pt-2">
        <Link
          href={`/product/${product.slug}`}
          className="block overflow-hidden border border-ink/10 bg-white"
          onClick={() => trackEvent({ eventType: "product_click", productSku: product.sku, productSlug: product.slug })}
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={product.image}
              alt={product.altText || product.name}
              fill
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-1 transition duration-500 group-hover:-translate-y-1"
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col pt-3">
          <Link
            href={`/product/${product.slug}`}
            onClick={() => trackEvent({ eventType: "product_click", productSku: product.sku, productSlug: product.slug })}
          >
            <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.04em] text-ink transition group-hover:text-clay">
              {getBrandColorName(product)}
            </h3>
          </Link>
          <p className="mt-1 text-[10px] leading-4 text-muted">{getLifestyleTag(product)}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span className="text-xs font-medium text-ink">{formatPrice(product.price)}</span>
            <button
              className="text-xs font-semibold uppercase tracking-[0.08em] text-ink underline decoration-sand underline-offset-4 transition hover:text-clay"
              onClick={() => {
                addItem(product);
                trackEvent({ eventType: "add_to_cart", productSku: product.sku, productSlug: product.slug });
              }}
            >
              Add
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (presentation === "catalog") {
    return (
      <article
        ref={cardRef}
        className="group flex h-full flex-col overflow-hidden border border-line bg-white transition hover:-translate-y-1 hover:border-charcoal/30"
      >
        <Link
          href={`/product/${product.slug}`}
          className="block bg-white"
          onClick={() => trackEvent({ eventType: "product_click", productSku: product.sku, productSlug: product.slug })}
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={product.image}
              alt={product.altText || product.name}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
              className="object-contain p-4 transition duration-500 group-hover:scale-[1.04]"
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="bg-cream px-2.5 py-1 text-xs font-semibold text-navy">{product.capacity}</span>
            <span
              className="h-4 w-4 rounded-full border border-line"
              style={{ backgroundColor: product.colorHex }}
              aria-label={product.colorName}
            />
          </div>
          <Link
            href={`/product/${product.slug}`}
            onClick={() => trackEvent({ eventType: "product_click", productSku: product.sku, productSlug: product.slug })}
          >
            <h3 className="text-lg font-bold leading-7 tracking-[-0.02em] text-charcoal hover:text-navy">
              12oz Ring Handle Tumbler
            </h3>
          </Link>
          <p className="mt-2 text-sm text-muted">{product.colorName}</p>
          <p className="mt-2 text-sm leading-5 text-muted">304 Stainless Steel</p>
          <div className="mt-auto pt-5">
            <Button
              variant="secondary"
              className="min-h-10 w-full px-4 py-2"
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

  return (
    <article ref={cardRef} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:-translate-y-1 hover:border-charcoal/30">
      <Link
        href={`/product/${product.slug}`}
        className="block bg-white"
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
