"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

const capacities = ["All", "12oz"];
const colors = ["All", "Yellow", "Pink", "Green", "Black", "Brown", "Dark Green"];
const scenes = ["All", "Office", "Travel", "Outdoor", "Daily"];

export function ShopClient() {
  const [query, setQuery] = useState("");
  const [capacity, setCapacity] = useState("All");
  const [color, setColor] = useState("All");
  const [scene, setScene] = useState("All");
  const [price, setPrice] = useState("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalized ||
        [product.name, product.sku, product.category, product.description, ...product.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesCapacity = capacity === "All" || product.capacity === capacity;
      const matchesColor = color === "All" || product.color === color;
      const matchesScene = scene === "All" || product.scenes.includes(scene);
      const matchesPrice =
        price === "All" ||
        (product.price !== null &&
          ((price === "Under $30" && product.price < 30) ||
            (price === "$30 - $40" && product.price >= 30 && product.price <= 40)));

      return matchesQuery && matchesCapacity && matchesColor && matchesScene && matchesPrice;
    });
  }, [capacity, color, price, query, scene]);

  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Shop</p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold text-navy md:text-5xl">KENSYDE Drinkware</h1>
            <p className="mt-4 max-w-2xl text-muted">
              12oz ring handle insulated tumblers in six colors, made with 304 stainless steel for coffee, tea, water, and daily drinks.
            </p>
          </div>
        </div>

        <div className="mt-10 lg:hidden">
          <details className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer items-center gap-2 font-heading text-lg font-semibold text-navy">
              <SlidersHorizontal size={18} aria-hidden="true" />
              Filters
            </summary>
            <div className="mt-5">
              <FilterPanel
                query={query}
                setQuery={setQuery}
                capacity={capacity}
                setCapacity={setCapacity}
                color={color}
                setColor={setColor}
                scene={scene}
                setScene={setScene}
                price={price}
                setPrice={setPrice}
              />
            </div>
          </details>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-7 lg:mt-10 lg:grid-cols-[14.5rem_1fr]">
          <aside className="hidden h-fit rounded-lg border border-line bg-white p-5 shadow-sm lg:block">
            <div className="mb-6 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-navy" aria-hidden="true" />
              <h2 className="font-heading text-lg font-semibold text-navy">Filters</h2>
            </div>
            <FilterPanel
              query={query}
              setQuery={setQuery}
              capacity={capacity}
              setCapacity={setCapacity}
              color={color}
              setColor={setColor}
              scene={scene}
              setScene={setScene}
              price={price}
              setPrice={setPrice}
            />
          </aside>

          <div>
            <div className="mb-4 flex justify-end text-sm text-muted">{filtered.length} products shown</div>
            <div className="grid h-fit gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="mt-7 rounded-lg border border-line bg-white p-10 text-center text-muted">
                No products match the current filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterPanel({
  query,
  setQuery,
  capacity,
  setCapacity,
  color,
  setColor,
  scene,
  setScene,
  price,
  setPrice
}: {
  query: string;
  setQuery: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  scene: string;
  setScene: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
}) {
  return (
    <>
      <label className="block">
        <span className="font-heading text-sm font-semibold text-charcoal">Search</span>
        <div className="mt-2 flex items-center gap-2 rounded border border-line bg-cream px-3">
          <Search size={17} className="text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, SKU, keyword"
            className="min-h-11 w-full bg-transparent text-sm outline-none"
          />
        </div>
      </label>

      <FilterGroup label="Capacity" value={capacity} setValue={setCapacity} options={capacities} />
      <FilterGroup label="Color" value={color} setValue={setColor} options={colors} />
      <FilterGroup label="Scene" value={scene} setValue={setScene} options={scenes} />
      <FilterGroup label="Price" value={price} setValue={setPrice} options={["All", "Under $30", "$30 - $40"]} />
    </>
  );
}

function FilterGroup({
  label,
  value,
  setValue,
  options
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="mt-6">
      <p className="font-heading text-sm font-semibold text-charcoal">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setValue(option)}
            className={`rounded border px-3 py-2 text-sm transition ${
              value === option
                ? "border-navy bg-navy text-white"
                : "border-line bg-white text-muted hover:border-sand hover:text-navy"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
