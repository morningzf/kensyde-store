import { ShopClient } from "@/components/ShopClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Shop 12oz Ring Handle Insulated Tumblers",
  description:
    "Browse KENSYDE 12oz ring handle insulated tumblers in yellow, pink, green, black, brown, and dark green.",
  path: "/shop"
});

export default function ShopPage() {
  return <ShopClient />;
}
