import { CartClient } from "@/components/CartClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Cart",
  description: "Review KENSYDE drinkware in your cart, update quantities, and continue to checkout.",
  path: "/cart"
});

export default function CartPage() {
  return <CartClient />;
}
