import Image from "next/image";
import Link from "next/link";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "About KENSYDE",
  description:
    "Learn about KENSYDE, a modern drinkware brand focused on clean, durable, everyday insulated drinkware.",
  path: "/about",
});

const values = [
  {
    title: "Clean by design",
    text: "Simple silhouettes, calm colors, and quiet details that fit into work, travel, and daily routines.",
  },
  {
    title: "Made for daily use",
    text: "Compact stainless steel drinkware made to feel reliable from the first coffee to the last errand.",
  },
  {
    title: "Built around carry",
    text: "Ring-handle lids, useful sizes, and easy-to-pack forms designed for movement without extra noise.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-ink">
      <section className="relative min-h-[22rem] overflow-hidden sm:min-h-[30rem] lg:min-h-[34rem]">
        <Image
          src="/lifestyle/quiet-carry-v2/quiet-carry-landscape.jpg"
          alt="KENSYDE drinkware in a quiet outdoor landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_48%]"
        />
        <div className="absolute inset-0 bg-black/38" />
        <div className="relative z-10 mx-auto flex min-h-[22rem] max-w-[112rem] items-end px-5 pb-10 sm:min-h-[30rem] sm:px-10 lg:min-h-[34rem] lg:pb-14">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/80">About KENSYDE</p>
            <h1 className="text-5xl font-extrabold leading-none tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Built for everyday movement.
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-cream">
          <Image
            src="/lifestyle/quiet-carry-v2/scene-commute.jpg"
            alt="KENSYDE tumbler styled with quiet daily carry essentials"
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover object-[58%_50%]"
          />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">Who we are</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
            Clean drinkware for the way real days move.
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-7 text-charcoal/80 sm:text-base">
            <p>
              KENSYDE focuses on functional, durable, and modern drinkware for people who move between work,
              travel, fitness, and outdoor life. Our products are designed to look clean, feel reliable, and
              perform every day.
            </p>
            <p>
              We believe a good cup should fit naturally into your routine: on a desk, beside a travel bag,
              in a car cupholder, or at a quiet outdoor stop. The result is practical drinkware with a calm,
              modern point of view.
            </p>
            <p>
              The 12oz Ring Handle Tumbler is our first everyday carry piece, with more sizes and forms planned
              around the same simple idea: useful objects, made to move well.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#F4F1EB]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="border-t border-black/20 pt-5">
              <h3 className="text-xl font-bold tracking-[-0.02em] text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-charcoal/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">Our direction</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
            Quiet outdoor minimalism, made practical.
          </h2>
          <p className="mt-6 text-sm leading-7 text-charcoal/80 sm:text-base">
            KENSYDE is building a family of insulated drinkware with warm neutrals, soft outdoor tones, clean
            construction, and everyday usability. The goal is not to be loud. It is to be the cup you keep
            reaching for.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-11 items-center justify-center bg-ink px-7 text-sm font-bold text-white transition hover:bg-clay"
          >
            Shop KENSYDE
          </Link>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-cream">
          <Image
            src="/lifestyle/quiet-carry-v2/scene-outdoor.jpg"
            alt="KENSYDE tumbler in a soft outdoor scene"
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-[48%_50%]"
          />
        </div>
      </section>
    </div>
  );
}
