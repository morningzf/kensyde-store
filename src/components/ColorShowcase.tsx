"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { formatPrice, type Product } from "@/data/products";
import { getBrandColorName, getLifestyleTag } from "@/lib/product-display";
import { trackEvent } from "@/lib/analytics";

const cardBackgrounds: Record<Product["color"], string> = {
  Yellow: "#E9E3C9",
  Pink: "#EBCBD1",
  Green: "#D6E1C9",
  Black: "#D8D6D0",
  Brown: "#DDC8B7",
  "Dark Green": "#C8D6CD",
};

export function ColorShowcase({ products }: { products: Product[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const move = (direction: number) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.82, 620), behavior: "smooth" });
  };

  return (
    <section id="colors" className="scroll-mt-24 border-y border-black/10 bg-[#F4F1EB] py-10 lg:py-14">
      <div className="mx-auto max-w-[112rem] px-5 lg:px-10">
        <div className="mb-7 flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between lg:mb-9">
          <div>
            <p className="font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-clay">Six everyday shades</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold leading-none tracking-[-0.03em] text-black lg:text-5xl">
              Shop Your Color.
            </h2>
            <p className="mt-3 max-w-lg text-xs leading-5 text-muted sm:text-sm">
              Calm shades for workdays, weekends, and everything in between.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              className="inline-flex h-11 w-11 items-center justify-center border border-black/20 bg-transparent text-black transition hover:border-black hover:bg-black hover:text-white"
              aria-label="Previous colors"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="inline-flex h-11 w-11 items-center justify-center border border-black/20 bg-transparent text-black transition hover:border-black hover:bg-black hover:text-white"
              aria-label="Next colors"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-4 lg:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <article
              key={product.sku}
              className="group w-[82vw] max-w-[21rem] shrink-0 snap-start sm:w-[43vw] lg:w-[23.6%] lg:max-w-none"
            >
              <Link
                href={`/product/${product.slug}`}
                className="block border border-black/10 bg-white transition-colors hover:border-black/35"
                onClick={() =>
                  trackEvent({ eventType: "product_click", productSku: product.sku, productSlug: product.slug })
                }
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <div
                    className="absolute inset-x-0 top-0 z-10 h-2.5"
                    style={{ backgroundColor: cardBackgrounds[product.color] }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
                    <span className="font-heading text-[9px] font-bold uppercase tracking-[0.12em] text-black/65">
                      {product.capacity}
                    </span>
                    <span
                      className="h-4 w-4 rounded-full border border-black/10"
                      style={{ backgroundColor: product.colorHex }}
                      aria-hidden="true"
                    />
                  </div>
                  <Image
                    src={product.image}
                    alt={`${getBrandColorName(product)} 12oz Ring Handle Tumbler`}
                    fill
                    sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 27vw, (min-width: 640px) 45vw, 82vw"
                    className="scale-[1.14] object-contain p-2 transition duration-500 group-hover:scale-[1.17] sm:p-4 lg:p-3"
                  />
                </div>
                <div
                  className="flex min-h-[5.75rem] items-start justify-between gap-4 border-t border-black/10 px-4 py-4"
                  style={{ backgroundColor: cardBackgrounds[product.color] }}
                >
                  <div>
                    <h3 className="font-heading text-sm font-bold text-black sm:text-base">{getBrandColorName(product)}</h3>
                    <p className="mt-1 text-[11px] text-black/55">{getLifestyleTag(product)}</p>
                  </div>
                  <p className="font-heading text-xs font-semibold text-black sm:text-sm">{formatPrice(product.price)}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
