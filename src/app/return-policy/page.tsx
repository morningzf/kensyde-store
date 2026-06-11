import type { Metadata } from "next";
import Link from "next/link";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Return Policy",
  description: "Learn about the KENSYDE return window, return requests, damaged items, and refund review.",
  path: "/return-policy",
});

export default function ReturnPolicyPage() {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase text-sand">Customer Care</p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-navy">Return Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: June 11, 2026</p>

        <div className="mt-8 space-y-8 border border-border bg-white p-6 text-charcoal sm:p-10">
          <PolicySection title="30-Day Return Window">
            Returns may be requested within 30 days of delivery. Items must be unused, in their
            original condition and packaging, with proof of purchase or the order number.
          </PolicySection>

          <PolicySection title="Requesting a Return">
            Contact us before sending an item back. Include your order number and reason for the
            return. Return instructions will be provided after the request is reviewed.
          </PolicySection>

          <PolicySection title="Damaged or Incorrect Items">
            If an item arrives damaged or incorrect, please contact us promptly with your order
            number and clear photos so we can review the issue.
          </PolicySection>

          <PolicySection title="Refund Review">
            Approved refunds are returned to the original payment method after the returned item is
            received and reviewed. Processing times may vary by payment provider.
          </PolicySection>

          <PolicySection title="Product Support">
            Please email{" "}
            <Link className="font-semibold text-navy underline" href="mailto:support@kensyde.com">
              support@kensyde.com
            </Link>{" "}
            with your order details for return or product support.
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
