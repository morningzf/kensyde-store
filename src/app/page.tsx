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
    "Compact insulated drinkware for coffee, commute, travel, and quiet outdoor moments.",
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
      <div className="mx-auto max-w-[112rem] border-x border-white/80">
        <div className="grid border-b border-white/80 lg:grid-cols-[1.7fr_1fr]">
          <section className="relative min-h-[34rem] overflow-hidden border-white/80 lg:min-h-[39rem] lg:border-r">
            <Image
              src="/lifestyle/scene-office.jpg"
              alt="KENSYDE tumblers in a naturally lit everyday work setting"
              fill
              priority
              sizes="(min-width: 1024px) 64vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-warm/95 via-warm/75 to-transparent" />
            <div className="relative flex min-h-[34rem] items-center px-6 py-14 sm:px-12 lg:min-h-[39rem] lg:px-16 xl:px-24">
              <div className="max-w-[29rem]">
                <h1 className="font-editorial text-5xl font-semibold leading-[0.92] text-ink sm:text-6xl xl:text-7xl">
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
                  <Button href="/#colors" variant="outline" className="rounded-none border-ink/40 bg-warm/50 px-6 text-ink">
                    Explore Colors
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section id="colors" className="scroll-mt-24 bg-[#F8F4ED] px-5 py-12 text-center sm:px-8 lg:flex lg:flex-col lg:justify-center lg:py-10">
            <h2 className="font-editorial text-4xl font-semibold text-ink xl:text-5xl">Find Your Everyday Color.</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">
              Six calm shades designed for workdays, weekends, and everything in between.
            </p>
            <div className="mt-9 grid grid-cols-3 gap-x-3 gap-y-7">
              {products.map((product) => (
                <Link key={product.sku} href={`/product/${product.slug}`} className="group min-w-0">
                  <div className="relative mx-auto aspect-[3/4] max-w-[7.5rem]">
                    <Image
                      src={product.image}
                      alt={`${getBrandColorName(product)} 12oz Ring Handle Tumbler`}
                      fill
                      sizes="(min-width: 1024px) 10vw, 30vw"
                      className="object-contain transition duration-500 group-hover:-translate-y-1"
                    />
                  </div>
                  <p className="mt-2 truncate font-heading text-[11px] font-medium text-ink">{getBrandColorName(product)}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="grid border-b border-white/80 lg:grid-cols-[1.7fr_1fr]">
          <section id="scenes" className="scroll-mt-24 border-white/80 px-5 py-10 lg:border-r lg:px-10">
            <h2 className="font-editorial text-4xl font-semibold text-ink">From Desk to Weekend.</h2>
            <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {scenes.map((scene) => (
                <article key={scene.title} className="group relative aspect-[4/3] overflow-hidden bg-[#E7DED2]">
                  <Image
                    src={scene.image}
                    alt={scene.alt}
                    fill
                    sizes="(min-width: 1024px) 16vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                  <h3 className="absolute inset-x-0 bottom-0 p-3 text-center font-heading text-[11px] font-medium text-white">
                    {scene.title}
                  </h3>
                </article>
              ))}
            </div>
          </section>

          <section id="details" className="scroll-mt-24 bg-[#F3EEE6] px-5 py-10 sm:px-8 lg:flex lg:flex-col lg:justify-center">
            <h2 className="text-center font-editorial text-4xl font-semibold leading-[0.95] text-ink xl:text-5xl">
              Small Details.
              <br />
              Daily Difference.
            </h2>
            <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-8">
              {details.map(({ title, text, icon: Icon }) => (
                <div key={title} className="text-center">
                  <Icon className="mx-auto text-ink" size={27} strokeWidth={1.4} aria-hidden="true" />
                  <h3 className="mx-auto mt-4 max-w-[9rem] font-heading text-xs font-semibold text-ink">{title}</h3>
                  <p className="mx-auto mt-2 max-w-[10rem] text-[11px] leading-5 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid border-b border-white/80 lg:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <section className="border-white/80 px-5 py-10 lg:border-r lg:px-10">
            <h2 className="font-editorial text-4xl font-semibold text-ink">Best Sellers.</h2>
            <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-6">
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} presentation="editorial" />
              ))}
            </div>
          </section>

          <section id="philosophy" className="scroll-mt-24 border-white/80 bg-[#EEE8DE] lg:border-r">
            <div className="grid h-full sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="flex items-center px-6 py-10">
                <div>
                  <h2 className="font-editorial text-4xl font-semibold leading-[0.95] text-ink">
                    Designed for
                    <br />
                    Small Escapes.
                  </h2>
                  <p className="mt-5 text-xs leading-6 text-ink/70">
                    Clean, functional drinkware for quiet routines and open-air moments, from the first coffee at
                    home to the last stop on the road.
                  </p>
                  <Link href="/about" className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink underline decoration-clay underline-offset-6">
                    Our Story
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[18rem]">
                <Image
                  src="/lifestyle/scene-outdoor.jpg"
                  alt="KENSYDE tumbler resting in a quiet outdoor scene"
                  fill
                  sizes="(min-width: 1280px) 15vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <Newsletter compact />
        </div>
      </div>
    </div>
  );
}
