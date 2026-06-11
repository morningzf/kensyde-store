import Image from "next/image";
import Link from "next/link";
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
    "Shop the KENSYDE 12oz ring handle insulated tumbler made with 304 stainless steel for coffee, tea, water, and daily drinks.",
});

const values = [
  { title: "Double-Wall Insulation", text: "Helps maintain drink temperature.", icon: Thermometer },
  { title: "304 Stainless Steel", text: "Durable construction for daily use.", icon: ShieldCheck },
  { title: "Leak-Resistant", text: "Reliable carry for everyday routines.", icon: Snowflake },
  { title: "Cupholder-Friendly", text: "Compact proportions for daily commutes.", icon: Truck },
];

const lifestyleScenes = [
  {
    title: "Work",
    text: "A compact desk-side companion for coffee breaks and focused afternoons.",
    image: "/lifestyle/scene-office.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler on a warm office desk",
  },
  {
    title: "Travel",
    text: "Easy to carry between commutes, day trips, and simple travel routines.",
    image: "/lifestyle/scene-travel.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a travel setup",
  },
  {
    title: "Outdoor",
    text: "Made for park days, quiet trails, and open-air moments.",
    image: "/lifestyle/scene-outdoor.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in an outdoor setting",
  },
  {
    title: "At Home",
    text: "Keep it nearby for slow mornings, reading time, and everyday hydration.",
    image: "/lifestyle/scene-daily.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a warm home setting",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-cream">
        <div className="relative mx-auto max-w-[90rem] overflow-hidden lg:min-h-[35rem]">
          <div className="relative aspect-[16/10] min-h-[20rem] lg:absolute lg:inset-0 lg:aspect-auto">
            <Image
              src="/hero/kensyde-12oz-hero.png"
              alt="Six KENSYDE 12oz ring handle tumblers in a warm neutral lifestyle scene"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[68%_center] lg:object-center"
            />
          </div>
          <div className="relative bg-cream px-5 py-9 sm:px-8 lg:flex lg:min-h-[35rem] lg:items-center lg:bg-transparent lg:px-14 lg:py-12 xl:px-20">
            <div className="max-w-lg lg:w-[42%]">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">
                The 12oz Collection
              </p>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] text-navy sm:text-5xl lg:text-6xl">
                Small Cup. Clean Carry. Everyday Ready.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-charcoal/75">
                Meet the KENSYDE 12oz ring handle insulated tumbler, crafted with 304 stainless steel for coffee,
                tea, water, and daily drinks.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/shop" variant="secondary">
                  Shop The Collection
                </Button>
                <Button href="/#colors" variant="outline">
                  Explore Colors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="colors" className="scroll-mt-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Shop By Color</p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">Find your everyday shade.</h2>
            </div>
            <Link href="/shop" className="font-heading text-sm font-semibold text-navy underline decoration-sand underline-offset-8">
              View all colors
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {products.map((product) => (
              <Link key={product.sku} href={`/product/${product.slug}`} className="group text-center">
                <div className="relative aspect-square overflow-hidden rounded-full bg-cream">
                  <Image
                    src={product.image}
                    alt={`${product.colorName} 12oz Ring Handle Tumbler`}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-contain p-3 transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 font-heading text-sm font-semibold text-charcoal group-hover:text-navy">
                  {product.colorName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cream">
        <div className="mx-auto grid max-w-7xl divide-y divide-line px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          {values.map(({ title, text, icon: Icon }) => (
            <div key={title} className="flex gap-4 px-2 py-7 sm:px-5">
              <Icon className="mt-1 shrink-0 text-sand" size={23} aria-hidden="true" />
              <div>
                <h2 className="font-heading text-sm font-semibold text-navy">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <SectionHeader
            eyebrow="Customer Favorites"
            title="One shape. Six ways to carry it."
            text="The same compact everyday tumbler, finished in colors made for work, travel, and everything between."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="carry-anywhere" className="scroll-mt-28 bg-navy text-white">
        <div className="mx-auto grid max-w-[90rem] lg:grid-cols-2">
          <div className="relative min-h-[22rem] lg:min-h-[34rem]">
            <Image
              src="/lifestyle/scene-travel.jpg"
              alt="KENSYDE tumbler prepared for everyday travel"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
            <div className="max-w-xl">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">Everyday Carry</p>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-4xl">
                Built for the small moments you carry every day.
              </h2>
              <p className="mt-5 leading-7 text-white/70">
                A compact 12oz shape, easy ring handle, and clean stainless steel construction make it simple to
                move from desk to commute to weekend.
              </p>
              <Button href="/shop" variant="secondary" className="mt-7">
                Explore The Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <SectionHeader
            eyebrow="Carry It Anywhere"
            title="Made to move through your day."
            text="From focused mornings to weekends outside, KENSYDE keeps everyday hydration close."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {lifestyleScenes.map((scene) => (
              <article key={scene.title} className="group relative min-h-[22rem] overflow-hidden bg-navy">
                <Image
                  src={scene.image}
                  alt={scene.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <h3 className="font-heading text-2xl font-bold">{scene.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{scene.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
          <div className="relative aspect-[4/3] overflow-hidden bg-cream">
            <Image
              src="/lifestyle/scene-daily.jpg"
              alt="KENSYDE tumbler in an everyday home routine"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">The KENSYDE Approach</p>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Clean design for products that move with you.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted">
              KENSYDE focuses on functional, durable, and modern drinkware for people who move between work,
              travel, fitness, and outdoor life. Each product is designed to look clean, feel reliable, and
              perform every day.
            </p>
            <Button href="/about" variant="outline" className="mt-7">
              Our Story
            </Button>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
