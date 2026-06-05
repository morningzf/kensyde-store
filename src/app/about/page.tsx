import Image from "next/image";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "About KENSYDE",
  description:
    "Learn about KENSYDE, a modern drinkware brand focused on durable, functional, and clean stainless steel hydration products.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-sand">About</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Modern Drinkware For Days In Motion
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            KENSYDE focuses on functional, durable, and modern drinkware for people who move between work,
            travel, fitness, and outdoor life. Our products are designed to look clean, feel reliable, and
            perform every day.
          </p>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-white shadow-soft">
          <Image
            src="/images/kensyde-lifestyle.png"
            alt="KENSYDE drinkware lifestyle scene"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-3 lg:px-8">
          {[
            ["Clean", "Quiet design language that fits modern homes, offices, and travel setups."],
            ["Durable", "Stainless steel construction chosen for repeated use and daily reliability."],
            ["Useful", "Capacities, lids, handles, and carry details made around real routines."]
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-line bg-white p-6">
              <h2 className="font-heading text-xl font-semibold text-navy">{title}</h2>
              <p className="mt-3 leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
