import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kensyde.com";
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || "/images/kensyde-hero.png";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
};

export function pageSeo({ title, description, path = "/" }: SeoInput): Metadata {
  const canonical = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "KENSYDE",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "KENSYDE drinkware" }],
      type: "website"
    }
  };
}
