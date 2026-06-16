import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Hand, ShieldCheck, Thermometer, Waves } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { ColorShowcase } from "@/components/ColorShowcase";
import { pageSeo } from "@/lib/seo";
import { products } from "@/data/products";

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
  {
    title: "Morning Coffee",
    image: "/lifestyle/quiet-carry-v2/scene-morning.jpg",
    alt: "Oat Cream KENSYDE tumbler beside an open book in soft morning light",
    position: "object-[54%_52%]",
  },
  {
    title: "Work Desk",
    image: "/lifestyle/quiet-carry-v2/scene-work.jpg",
    alt: "Matte Black KENSYDE tumbler beside a laptop and work bag",
    position: "object-[52%_52%]",
  },
  {
    title: "Daily Commute",
    image: "/lifestyle/quiet-carry-v2/scene-commute.jpg",
    alt: "Soft Rose KENSYDE tumbler ready for a quiet daily commute",
    position: "object-[58%_52%]",
  },
  {
    title: "Outdoor Rest",
    image: "/lifestyle/quiet-carry-v2/scene-outdoor.jpg",
    alt: "Forest Green KENSYDE tumbler resting beside a park lake",
    position: "object-[46%_52%]",
  },
];

export default function HomePage() {
  return (
    <div className="bg-warm text-ink">
      <div className="mx-auto max-w-[112rem]">
        <section className="relative min-h-[38rem] overflow-hidden bg-[#C8B59A] sm:min-h-[43rem] lg:min-h-[calc(100vh-6.5rem)]">
          <Image
            src="/lifestyle/quiet-carry-v2/quiet-carry-hero.jpg"
            alt="Oat Cream KENSYDE Quiet Carry tumbler beside a tote bag and daily essentials"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] sm:object-[58%_center]"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative z-10 flex min-h-[38rem] items-end px-5 pb-9 sm:min-h-[43rem] sm:px-10 sm:pb-12 lg:min-h-[calc(100vh-6.5rem)] lg:px-14 lg:pb-14">
            <div className="max-w-xl text-white">
              <p className="mb-4 font-heading text-[11px] font-bold uppercase tracking-[0.12em]">Quiet Carry Collection</p>
              <h1 className="font-heading text-[2.8rem] font-extrabold leading-[0.96] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
                Made for Everyday Flow.
              </h1>
              <p className="mt-5 max-w-lg text-sm font-medium leading-6 text-white/95 sm:text-base">
                Compact insulated drinkware for coffee, commute, travel, and quiet outdoor moments.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex min-h-11 items-center justify-center border border-white bg-white px-7 py-3 font-heading text-sm font-bold text-black transition hover:border-black hover:bg-black hover:text-white"
                >
                  Shop Now
                </Link>
                <Link
                  href="/#colors"
                  className="inline-flex min-h-11 items-center justify-center border border-white bg-black/15 px-7 py-3 font-heading text-sm font-bold text-white transition hover:bg-white hover:text-black"
                >
                  Explore Colors
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ColorShowcase products={products} />

        <div className="grid border-b border-white/80 lg:grid-cols-[1.7fr_1fr]">
          <section id="scenes" className="scroll-mt-24 border-white/80 px-5 py-10 lg:border-r lg:px-10">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-heading text-[9px] font-semibold uppercase tracking-[0.18em] text-clay">One cup, many rhythms</p>
                <h2 className="mt-2 font-editorial text-4xl font-semibold text-ink">From Desk to Weekend.</h2>
              </div>
              <Link href="/shop" className="hidden items-center gap-2 font-heading text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/60 hover:text-clay sm:inline-flex">
                Explore the collection <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {scenes.map((scene) => (
                <article key={scene.title} className="group relative aspect-[4/5] overflow-hidden bg-[#E7DED2] sm:aspect-[3/4] lg:aspect-[4/5]">
                  <Image
                    src={scene.image}
                    alt={scene.alt}
                    fill
                    sizes="(min-width: 1024px) 16vw, 50vw"
                    className={`object-cover transition duration-700 group-hover:scale-[1.025] ${scene.position}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                  <h3 className="absolute inset-x-0 bottom-0 p-3 text-left font-heading text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                    {scene.title}
                  </h3>
                </article>
              ))}
            </div>
          </section>

          <section id="details" className="scroll-mt-24 bg-[#E9EDE6] px-5 py-10 sm:px-8 lg:flex lg:flex-col lg:justify-center">
            <p className="text-center font-heading text-[9px] font-semibold uppercase tracking-[0.18em] text-sage">Made to move quietly</p>
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
            <div className="flex items-end justify-between">
              <div>
                <p className="font-heading text-[9px] font-semibold uppercase tracking-[0.18em] text-clay">Quiet Carry, six ways</p>
                <h2 className="mt-2 font-editorial text-4xl font-semibold text-ink">Best Sellers.</h2>
              </div>
              <Link href="/shop" className="hidden font-heading text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/60 hover:text-clay sm:block">
                Shop all
              </Link>
            </div>
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
                  <p className="font-heading text-[9px] font-semibold uppercase tracking-[0.18em] text-clay">The KENSYDE idea</p>
                  <h2 className="font-editorial text-4xl font-semibold leading-[0.95] text-ink">
                    Designed around
                    <br />
                    Everyday Flow.
                  </h2>
                  <p className="mt-5 text-xs leading-6 text-ink/70">
                    One calm design language, made to move from compact coffee cups to larger daily and outdoor
                    drinkware as your routine changes.
                  </p>
                  <Link href="/about" className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink underline decoration-clay underline-offset-6">
                    Our Story
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[18rem]">
                <Image
                  src="/lifestyle/quiet-carry-v2/quiet-carry-landscape.jpg"
                  alt="Forest Green KENSYDE tumbler in a quiet open-air landscape"
                  fill
                  sizes="(min-width: 1280px) 15vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-[62%_52%]"
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
