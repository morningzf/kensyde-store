import type { Metadata } from "next";
import Link from "next/link";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Shipping Policy",
  description: "Learn about KENSYDE order processing, delivery, tracking, and supported shipping markets.",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase text-sand">Customer Care</p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-navy">Shipping Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: June 11, 2026</p>

        <div className="mt-8 space-y-8 border border-border bg-white p-6 text-charcoal sm:p-10">
          <PolicySection title="Supported Markets">
            KENSYDE currently supports shipping to the United States, United Kingdom, Germany,
            and France. Available shipping options and charges are shown during checkout.
          </PolicySection>

          <PolicySection title="Order Processing">
            Orders normally ship within 1-2 business days after order confirmation. Orders placed
            on weekends or holidays begin processing on the next business day.
          </PolicySection>

          <PolicySection title="Delivery & Tracking">
            Delivery timing depends on the destination and carrier. When tracking is available, it
            will be sent to the email address used for the order. Carrier delays may occasionally
            affect estimated delivery dates.
          </PolicySection>

          <PolicySection title="Shipping Information">
            Please review the recipient name, shipping address, postal code, and contact details
            before placing your order. Contact us as soon as possible if an address correction is
            needed.
          </PolicySection>

          <PolicySection title="Questions">
            Please email{" "}
            <Link className="font-semibold text-navy underline" href="mailto:support@kensyde.com">
              support@kensyde.com
            </Link>{" "}
            with your order number for shipping support.
          </PolicySection>
        </div>
      </div>
    </section>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-xl font-semibold text-navy">{title}</h2>
      <p className="mt-3 leading-7 text-charcoal">{children}</p>
    </section>
  );
}
