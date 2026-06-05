import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getProductBySlug, products } from "@/data/products";
import { pageSeo } from "@/lib/seo";

const lifestyleScenes = [
  {
    title: "Office",
    text: "Keeps daily drinks close without crowding your desk setup.",
    image: "/lifestyle/scene-office.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler on a warm office desk with laptop and notebook"
  },
  {
    title: "Travel",
    text: "Compact enough for carry bags, commutes, and short day trips.",
    image: "/lifestyle/scene-travel.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a warm travel setup with bag and accessories"
  },
  {
    title: "Outdoor",
    text: "Designed for simple outdoor moments, from parks to picnic setups.",
    image: "/lifestyle/scene-outdoor.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a clean outdoor picnic-style scene"
  },
  {
    title: "Daily / Home",
    text: "A small, easy-carry format for morning routines and everyday hydration.",
    image: "/lifestyle/scene-daily.jpg",
    alt: "KENSYDE 12oz Ring Handle Tumbler in a cozy home setup with book and soft cloth"
  }
];

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return pageSeo({
      title: "Product Not Found",
      description: "The requested KENSYDE product could not be found.",
      path: `/product/${params.slug}`
    });
  }

  return pageSeo({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/product/${product.slug}`
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const related = products.filter((item) => item.sku !== product.sku).slice(0, 3);

  return (
    <div className="bg-cream">
      <ProductDetailClient product={product} />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <SectionHeader
            eyebrow="Lifestyle"
            title="See It In Your Day"
            text="From desk to day trip, the 12oz Ring Handle Tumbler is designed for practical daily use."
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
                  <h2 className="font-heading text-lg font-semibold text-navy">{scene.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{scene.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Related Products"
          title="Complete Your Carry"
          text="Explore other colors designed for the way you move through the day."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.sku} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
