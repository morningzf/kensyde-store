import Image from "next/image";
import Link from "next/link";
import { Hand, ShieldCheck, Thermometer, Waves } from "lucide-react";
import { Button } from "@/components/Button";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { pageSeo } from "@/lib/seo";
import { products } from "@/data/products";
import { getBrandColorName } from "@/lib/product-display";

export const metadata = pageSeo({
  title: "KENSYDE | 12oz Ring Handle Insulated Tumbler",
  description:
    "Shop the KENSYDE 12oz ring handle insulated tumbler made with 304 stainless steel for coffee, commute, travel, and quiet outdoor moments.",
});

const details = [
  { title: "Double-Wall Insulation", text: "Helps maintain drink temperature.", icon: Thermometer },
  { title: "304 Stainless Steel", text: "Made for steady everyday use.", icon: ShieldCheck },
  { title: "Easy Ring Handle", text: "Comfortable to carry anywhere.", icon: Hand },
  { title: "Leak-Resistant Lid", text: "Reliable carry for daily routines.", icon: Waves },
];

const scenes = [
  { title: "Morning Coffee", image: "/lifestyle/scene-daily.jpg", alt: "KENSYDE tumbler in a quiet morning coffee setting" },
  { title: "Work Desk", image: "/lifestyle/scene-office.jpg", alt: "KENSYDE tumbler on a naturally lit work desk" },
  { title: "Daily Commute", image: "/lifestyle/scene-travel.jpg", alt: "KENSYDE tumbler prepared for a daily commute" },
  { title: "Outdoor Rest", image: "/lifestyle/scene-outdoor.jpg", alt: "KENSYDE tumbler in a quiet outdoor setting" },
];

export default function HomePage() {
  return (
    <div className="bg-warm text-ink">
      <section className="relative overflow-hidden border-b border-white/70">
        <div className="relative mx-auto min-h-[35rem] max-w-[100rem] lg:min-h-[42rem]">
          <Image
            src="/hero/kensyde-12oz-hero.png"
            alt="Six KENSYDE ring handle tumblers in a warm, naturally lit setting"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[64%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm/95 via-warm/70 to-transparent lg:via-warm/20" />
          <div className="relative flex min-h-[35rem] items-center px-5 py-16 sm:px-10 lg:min-h-[42rem] lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <h1 className="font-editorial text-5xl font-semibold leading-[0.94] text-ink sm:text-6xl lg:text-7xl">
                Made for
                <br />
                Everyday Flow.
              </h1>
              <p className="mt-7 max-w-md text-sm leading-7 text-ink/75 sm:text-base">
                Compact insulated drinkware for coffee, commute, travel, and quiet outdoor moments.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/shop" className="rounded-none bg-ink px-6 text-white hover:bg-clay">
                  Shop 12oz Tumblers
                </Button>
                <Button href="/#colors" variant="outline" className="rounded-none border-ink/45 bg-transparent px-6 text-ink">
                  Explore Colors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="colors" className="scroll-mt-24 bg-[#F8F4ED]">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center lg:px-8 lg:py-20">
          <h2 className="font-editorial text-4xl font-semibold text-ink md:text-5xl">Find Your Everyday Color.</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
            Six calm shades designed for workdays, weekends, and everything in between.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
            {products.map((product) => (
              <Link key={product.sku} href={`/product/${product.slug}`} className="group">
                <div className="relative mx-auto aspect-[3/4] max-w-[10rem]">
                  <Image
                    src={product.image}
                    alt={`${getBrandColorName(product)} 12oz Ring Handle Tumbler`}
                    fill
                    sizes="(min-width: 1024px) 14vw, 30vw"
                    className="object-contain transition duration-500 group-hover:-translate-y-1"
                  />
                </div>
                <p className="mt-3 font-heading text-xs font-medium text-ink">{getBrandColorName(product)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/80 bg-warm">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
          <h2 className="font-editorial text-4xl font-semibold text-ink">Best Sellers.</h2>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} presentation="editorial" />
            ))}
          </div>
        </div>
      </section>

      <section id="details" className="scroll-mt-24 bg-[#F3EEE6]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Details</p>
            <h2 className="mt-3 font-editorial text-4xl font-semibold leading-none text-ink md:text-5xl">
              Small Details.
              <br />
              Daily Difference.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {details.map(({ title, text, icon: Icon }) => (
              <div key={title} className="text-center">
                <Icon className="mx-auto text-ink" size={30} strokeWidth={1.4} aria-hidden="true" />
                <h3 className="mx-auto mt-5 max-w-[10rem] font-heading text-sm font-semibold text-ink">{title}</h3>
                <p className="mx-auto mt-3 max-w-[12rem] text-xs leading-5 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="scenes" className="scroll-mt-24 bg-warm">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="font-editorial text-4xl font-semibold text-ink md:text-5xl">From Desk to Weekend.</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {scenes.map((scene) => (
              <article key={scene.title} className="group relative aspect-[4/3] overflow-hidden bg-[#E7DED2]">
                <Image
                  src={scene.image}
                  alt={scene.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                <h3 className="absolute inset-x-0 bottom-0 p-4 text-center font-heading text-xs font-medium text-white">
                  {scene.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="philosophy" className="scroll-mt-24 border-y border-white/80 bg-[#EEE8DE]">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="flex items-center px-5 py-14 sm:px-10 lg:px-14 lg:py-16">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Philosophy</p>
              <h2 className="mt-4 font-editorial text-4xl font-semibold leading-none text-ink md:text-5xl">
                Designed for
                <br />
                Small Escapes.
              </h2>
              <p className="mt-6 text-sm leading-7 text-ink/70">
                KENSYDE creates clean, functional drinkware for quiet routines and open-air moments, from the
                first coffee at home to the last stop on the road.
              </p>
              <Link href="/about" className="mt-7 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-ink underline decoration-clay underline-offset-8">
                Read Our Story
              </Link>
            </div>
          </div>
          <div className="relative min-h-[25rem]">
            <Image
              src="/lifestyle/scene-outdoor.jpg"
              alt="KENSYDE tumbler resting in a quiet outdoor scene"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
