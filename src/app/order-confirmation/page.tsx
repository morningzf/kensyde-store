import { Suspense } from "react";
import { OrderConfirmationClient } from "@/components/OrderConfirmationClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Order Confirmation",
  description: "Thank you for choosing KENSYDE. Review your order confirmation details.",
  path: "/order-confirmation"
});

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationClient />
    </Suspense>
  );
}
