"use client";

import Image from "next/image";
import { Minus, Plus, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { formatPrice, products, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { trackEvent } from "@/lib/analytics";

const displayFeatures = [
  "Double-Wall Insulation",
  "304 Stainless Steel",
  "Leak-Resistant Lid",
  "Easy Ring Handle",
  "Daily 12oz Size"
];

const trustNotes = ["30-day returns", "Secure checkout", "Ships in 1-2 business days"];
const descriptionText =
  "Meet the KENSYDE 12oz Ring Handle Tumbler, a compact stainless steel cup designed for coffee, tea, water, and daily hydration. The double-wall insulated construction helps maintain drink temperature, while the ring-handle lid makes it easy to carry between work, travel, errands, and outdoor moments. Its clean shape and everyday-ready size make it a practical addition to your daily routine.";
const shippingReturnsText =
  "Ships in 1-2 business days after order confirmation. Returns accepted within 30 days for unused items in original condition.";
const careText =
  "Hand wash recommended. Do not microwave. Keep lid open when storing. Clean lid and seal regularly for best performance.";
const warrantyText = "For product support, please contact support@kensyde.com with your order details.";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    setSelectedImage(product.image);
    setSelectedColor(product.color);
    trackEvent({ eventType: "product_view", productSku: product.sku, productSlug: product.slug });
  }, [product]);

  const specs = [
    ["Capacity", product.capacity],
    ["Material", product.material],
    ["Structure", "Double-wall insulated"],
    ["Lid Type", product.lidType],
    ["Use", "Coffee, tea, water, daily drinks"],
    ["Care", "Hand wash recommended"]
  ];

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:py-12 lg:grid-cols-[1.08fr_0.82fr] lg:gap-10 lg:px-8">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-soft">
          <Image
            src={selectedImage}
            alt={product.altText || product.name}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="scale-[1.18] object-contain p-3 md:p-5"
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
          {product.gallery.map((image) => (
            <button
              key={image}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-[4/3] overflow-hidden rounded border bg-white ${
                selectedImage === image ? "border-navy" : "border-line"
              }`}
              aria-label={`View ${product.name} image`}
            >
              <Image src={image} alt="" fill sizes="180px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-line bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-24 lg:self-start">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-muted">SKU: {product.sku}</p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-navy md:text-4xl">
          12oz Ring Handle Tumbler
        </h1>
        <p className="mt-2 text-sm text-muted">{product.colorName}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="font-heading text-2xl font-semibold text-navy">{formatPrice(product.price)}</span>
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <Star size={17} className="fill-sand text-sand" aria-hidden="true" />
            {product.rating.toFixed(1)} rating
          </span>
        </div>

        <div className="mt-8">
          <p className="font-heading text-sm font-semibold text-charcoal">Color</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {products.map((option) => (
              <button
                key={option.sku}
                onClick={() => {
                  setSelectedColor(option.color);
                  setSelectedImage(option.image);
                  router.push(`/product/${option.slug}`);
                }}
                className={`rounded border px-4 py-2 text-sm ${
                  selectedColor === option.color ? "border-navy bg-navy text-white" : "border-line text-muted"
                }`}
              >
                {option.colorName}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="font-heading text-sm font-semibold text-charcoal">Capacity</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded border border-navy bg-navy px-4 py-2 text-sm text-white">{product.capacity}</span>
            <span className="rounded border border-line px-4 py-2 text-sm text-muted">{product.handleType}</span>
            <span className="rounded border border-line px-4 py-2 text-sm text-muted">
              {product.strawIncluded ? "Straw Included" : "No Straw"}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-heading text-sm font-semibold text-charcoal">Quantity</p>
          <div className="mt-3 inline-flex items-center rounded border border-line bg-cream">
            <button className="h-11 w-11 text-navy" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
              <Minus size={17} className="mx-auto" aria-hidden="true" />
            </button>
            <span className="w-10 text-center font-heading text-sm font-semibold text-charcoal">{quantity}</span>
            <button className="h-11 w-11 text-navy" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
              <Plus size={17} className="mx-auto" aria-hidden="true" />
            </button>
          </div>
        </div>

        <Button
          className="mt-8 w-full"
          variant="secondary"
          onClick={() => {
            addItem(product, quantity, { color: selectedColor, capacity: product.capacity });
            trackEvent({ eventType: "add_to_cart", productSku: product.sku, productSlug: product.slug });
          }}
        >
          Add to Cart
        </Button>

        <div className="mt-5 grid gap-2 text-sm text-muted sm:grid-cols-3">
          {trustNotes.map((note) => (
            <div key={note} className="rounded border border-line bg-cream px-3 py-2 text-center">
              {note}
            </div>
          ))}
        </div>

        <ul className="mt-8 grid gap-3 border-y border-line py-6 text-sm text-muted sm:grid-cols-2">
          {displayFeatures.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-sand" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h2 className="font-heading text-lg font-semibold text-navy">Scenes</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.scenes.map((scene) => (
              <span key={scene} className="rounded bg-cream px-3 py-2 text-sm text-muted">
                {scene}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-heading text-lg font-semibold text-navy">Product Description</h2>
          <p className="mt-3 leading-7 text-muted">{descriptionText}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-navy">Specifications</h2>
          <dl className="mt-4 divide-y divide-line rounded border border-line">
            {specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[9rem_1fr] gap-4 px-4 py-3 text-sm">
                <dt className="font-heading font-semibold text-charcoal">{label}</dt>
                <dd className="text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 rounded bg-cream p-5">
          <h2 className="font-heading text-lg font-semibold text-navy">Shipping & Returns</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{shippingReturnsText}</p>
          <h3 className="mt-5 font-heading text-sm font-semibold text-charcoal">Care Instructions</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{careText}</p>
          <h3 className="mt-5 font-heading text-sm font-semibold text-charcoal">Warranty</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{warrantyText}</p>
        </div>
      </div>
    </section>
  );
}
