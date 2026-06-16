"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { products } from "@/data/products";
import { getBrandColorName } from "@/lib/product-display";

const capacities = ["All", "12oz"];
const colors = ["All", "Yellow", "Pink", "Green", "Black", "Brown", "Dark Green"];

type ProductFamily = {
  key: string;
  title: string;
  variants: Product[];
};

function groupProducts(items: Product[]): ProductFamily[] {
  const groups = new Map<string, ProductFamily>();

  items.forEach((product) => {
    const key = product.productSeries || product.category;
    const existing = groups.get(key);

    if (existing) {
      existing.variants.push(product);
    } else {
      groups.set(key, {
        key,
        title: product.productSeries || product.productName,
        variants: [product],
      });
    }
  });

  return Array.from(groups.values()).map((group) => ({
    ...group,
    variants: group.variants.sort((a, b) => colors.indexOf(a.color) - colors.indexOf(b.color)),
  }));
}

export function ShopClient({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [capacity, setCapacity] = useState("All");
  const [color, setColor] = useState("All");

  const productFamilies = useMemo(() => groupProducts(products), []);

  const filteredFamilies = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return productFamilies.filter((family) => {
      const matchesQuery =
        !normalized ||
        family.variants.some((product) =>
          [product.productSeries, product.name, product.sku, product.category, product.description, ...product.keywords]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        );
      const matchesCapacity = capacity === "All" || family.variants.some((product) => product.capacity === capacity);
      const matchesColor = color === "All" || family.variants.some((product) => product.color === color);

      return matchesQuery && matchesCapacity && matchesColor;
    });
  }, [capacity, color, productFamilies, query]);

  return (
    <div className="bg-white text-ink">
      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="border-b border-black/10 pb-8">
          <div className="text-xs font-medium text-muted">
            <Link href="/" className="underline-offset-4 hover:underline">
              Home
            </Link>{" "}
            / Shop
          </div>
          <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-ink md:text-5xl">Shop KENSYDE Products</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-charcoal/70">
                Compact insulated drinkware in calm everyday colors, grouped by cup style for easier browsing.
              </p>
            </div>
            <p className="text-sm text-charcoal/75">
              {filteredFamilies.length} {filteredFamilies.length === 1 ? "product family" : "product families"} shown
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <details className="group relative w-full lg:w-auto">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 border border-ink bg-ink px-6 text-sm font-bold text-white transition hover:bg-charcoal [&::-webkit-details-marker]:hidden">
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filter
            </summary>
            <div className="mt-4 w-full border border-black/10 bg-white p-5 shadow-soft lg:absolute lg:left-0 lg:z-20 lg:w-[30rem]">
              <FilterPanel
                query={query}
                setQuery={setQuery}
                capacity={capacity}
                setCapacity={setCapacity}
                color={color}
                setColor={setColor}
              />
            </div>
          </details>

          <label className="flex min-h-11 w-full items-center border border-black/25 bg-white px-4 lg:max-w-sm">
            <Search size={17} className="mr-3 text-charcoal/60" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </label>
        </div>

        <div className="mt-9 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFamilies.map((family) => (
            <ProductFamilyCard
              key={`${family.key}-${color}`}
              family={family}
              preferredColor={color === "All" ? undefined : color}
            />
          ))}
        </div>

        {filteredFamilies.length === 0 && (
          <div className="mt-10 border border-black/10 bg-[#F7F4EE] p-12 text-center text-sm text-charcoal/70">
            No product family matches the current filters.
          </div>
        )}
      </section>
    </div>
  );
}

function ProductFamilyCard({
  family,
  preferredColor,
}: {
  family: ProductFamily;
  preferredColor?: string;
}) {
  const initialVariant =
    family.variants.find((variant) => variant.color === preferredColor) ?? family.variants[0];
  const [selectedSku, setSelectedSku] = useState(initialVariant.sku);
  const selected = family.variants.find((variant) => variant.sku === selectedSku) ?? initialVariant;

  return (
    <article className="group">
      <Link
        href={`/product/${selected.slug}`}
        className="block overflow-hidden rounded-[2px] bg-[#F7F7F5] transition group-hover:bg-[#F2F0EA]"
      >
        <div className="relative aspect-[5/6]">
          <Image
            src={selected.image}
            alt={selected.altText || selected.name}
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
            className="object-contain p-10 transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="mt-3 flex items-center gap-2">
        {family.variants.map((variant) => {
          const active = variant.sku === selected.sku;
          return (
            <button
              key={variant.sku}
              type="button"
              onClick={() => setSelectedSku(variant.sku)}
              className={`h-7 w-7 rounded-[3px] border p-0.5 transition ${
                active ? "border-ink" : "border-black/20 hover:border-ink/60"
              }`}
              aria-label={`View ${getBrandColorName(variant)}`}
            >
              <span
                className="block h-full w-full rounded-[2px]"
                style={{ backgroundColor: variant.colorHex }}
              />
            </button>
          );
        })}
      </div>

      <Link href={`/product/${selected.slug}`} className="mt-3 block">
        <p className="text-xs font-medium text-charcoal/70">
          {selected.capacity} | {getBrandColorName(selected)}
        </p>
        <h2 className="mt-1 text-lg font-semibold leading-6 tracking-[-0.02em] text-ink transition group-hover:text-clay">
          {family.title}
        </h2>
        <p className="mt-1 text-xs text-charcoal/60">{family.variants.length} colors available</p>
      </Link>
    </article>
  );
}

function FilterPanel({
  query,
  setQuery,
  capacity,
  setCapacity,
  color,
  setColor,
}: {
  query: string;
  setQuery: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[1.1fr_0.8fr_1.2fr]">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/70">Search</span>
        <div className="mt-2 flex min-h-11 items-center gap-2 border border-black/15 bg-[#F7F4EE] px-3">
          <Search size={17} className="text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, SKU, keyword"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </label>

      <FilterGroup label="Capacity" value={capacity} setValue={setCapacity} options={capacities} />
      <FilterGroup label="Color" value={color} setValue={setColor} options={colors} />
    </div>
  );
}

function FilterGroup({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/70">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setValue(option)}
            className={`min-h-10 border px-3 text-sm transition ${
              value === option
                ? "border-ink bg-ink text-white"
                : "border-black/15 bg-white text-charcoal/70 hover:border-ink hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
