import Image from "next/image";
import { Hand, ShieldCheck, Snowflake, Thermometer, Truck } from "lucide-react";
import { Button } from "@/components/Button";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { pageSeo } from "@/lib/seo";
import { products } from "@/data/products";

export const metadata = pageSeo({
  title: "KENSYDE | 12oz Ring Handle Insulated Tumbler",
  description:
    "Shop the KENSYDE 12oz ring handle insulated tumbler made with 304 stainless steel for coffee, tea, water, and daily drinks."
});

const values = [
  { title: "Double-Wall Insulation", icon: Thermometer },
  { title: "304 Stainless Steel", icon: ShieldCheck },
  { title: "Leak-Resistant", icon: Snowflake },
  { title: "Cupholder-Friendly", icon: Truck }
];

const productFeatures = [
  {
    title: "12oz Daily Size",
    text: "Compact for coffee, tea, water, and desk-side drinks.",
    icon: Thermometer
  },
  {
    title: "Ring Handle Lid",
    text: "Easy to pick up, carry, and take on the go.",
    icon: Hand
  },
  {
    title: "304 Stainless Steel",
    text: "Durable construction for everyday use.",
    icon: ShieldCheck
  },
  {
    title: "Leak-Resistant Design",
    text: "Made for commuting, office, travel, and daily routines.",
    icon: Snowflake
  }
];

const trustItems = ["30-day returns", "Secure checkout", "Ships in 1-2 business days", "Support at support@kensyde.com"];

const lifestyleScenes = [
  {
    title: "Office",
    text: "Desk-side hydration for focused work, coffee breaks, and daily planning.",
    image: "/lifestyle/scene-office.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler on a warm office desk with laptop and notebook"
  },
  {
    title: "Travel",
    text: "Compact carry for commutes, overnight bags, and simple travel routines.",
    image: "/lifestyle/scene-travel.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a warm travel setup with bag and accessories"
  },
  {
    title: "Outdoor",
    text: "A small-format tumbler for park days, picnic cloths, and open-air moments.",
    image: "/lifestyle/scene-outdoor.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a clean outdoor picnic-style scene"
  },
  {
    title: "Daily / Home",
    text: "Easy to keep nearby for morning drinks, reading time, and home routines.",
    image: "/lifestyle/scene-daily.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a cozy home setup with book and soft cloth"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-8 pt-4 md:min-h-[30rem] md:grid-cols-[0.4fr_0.6fr] md:pb-9 md:pt-5 lg:px-8">
          <div className="z-10">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-sand">
              Premium Insulated Drinkware
            </p>
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-extrabold leading-tight text-navy md:text-5xl lg:text-6xl">
              Small Cup. Clean Carry. Everyday Ready.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted md:text-lg md:leading-8">
              Meet the KENSYDE 12oz ring handle insulated tumbler, crafted with 304 stainless steel for coffee, tea, water, and daily drinks.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/shop" variant="secondary">
                Shop 12oz Collection
              </Button>
              <Button href="/shop" variant="outline">
                Explore Colors
              </Button>
            </div>
          </div>
          <div className="relative min-h-[20rem] overflow-hidden rounded-lg bg-white shadow-sm md:min-h-[24rem] lg:min-h-[26rem]">
            <Image
              src="/hero/kensyde-12oz-hero.png"
              alt="KENSYDE 12oz ring handle insulated tumbler color collection in a refined lifestyle scene"
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-contain object-center"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Colors</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Six clean colors for daily carry.
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                Choose a shade that fits your desk, commute, bag, or weekend routine.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {products.map((product) => (
              <a
                key={product.sku}
                href={`/product/${product.slug}`}
                className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 shadow-sm transition hover:border-sand hover:shadow-soft"
              >
                <span className="h-8 w-8 rounded-full border border-line" style={{ backgroundColor: product.colorHex }} />
                <span className="font-heading text-sm font-semibold text-charcoal">{product.colorName}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {values.map(({ title, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-line bg-white p-6">
              <Icon className="text-sand" size={28} aria-hidden="true" />
              <h2 className="mt-5 font-heading text-lg font-semibold text-navy">{title}</h2>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <SectionHeader
            eyebrow="Best Sellers"
            title="Six Colors, One Everyday Carry"
            text="Choose the 12oz ring handle tumbler color that fits office, travel, outdoor, and daily routines."
          />
          <div className="mx-auto mt-12 grid max-w-6xl gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <div className="grid gap-3 rounded-lg border border-line bg-white p-4 text-sm text-muted shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center justify-center rounded bg-cream px-3 py-3 text-center">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <SectionHeader
            eyebrow="Details"
            title="Built for the small moments you carry every day."
            text="A compact tumbler with clean proportions, practical details, and materials made for daily routines."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {productFeatures.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
                <Icon size={26} className="text-sand" aria-hidden="true" />
                <h3 className="mt-5 font-heading text-lg font-semibold text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <SectionHeader
            eyebrow="Scenes"
            title="Carry It Anywhere"
            text="Built for work, travel, outdoor moments, and everyday routines."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {lifestyleScenes.map((scene) => (
              <article key={scene.title} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-cream">
                  <Image
                    src={scene.image}
                    alt={scene.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-navy">{scene.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{scene.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Our Philosophy</p>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy md:text-4xl">
            Clean Design For Products That Move With You
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            KENSYDE focuses on functional, durable, and modern drinkware for people who move between work,
            travel, fitness, and outdoor life. Each product is designed to look clean, feel reliable, and
            perform every day.
          </p>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
