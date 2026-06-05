import { CheckoutClient } from "@/components/CheckoutClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Checkout",
  description: "Enter shipping information and choose Stripe or PayPal for your KENSYDE order.",
  path: "/checkout"
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
