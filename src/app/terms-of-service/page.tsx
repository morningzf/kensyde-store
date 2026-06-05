import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Terms of Service",
  description: "KENSYDE terms of service for using the store and purchasing products.",
  path: "/terms-of-service"
});

export default function TermsOfServicePage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <h1 className="font-heading text-4xl font-extrabold text-navy">Terms of Service</h1>
        <div className="mt-8 space-y-4 rounded-lg border border-line bg-white p-8 leading-7 text-muted">
          <p>
            By using the KENSYDE store, customers agree to provide accurate order and shipping information and to
            use the website for lawful personal or business purchasing purposes.
          </p>
          <p>
            Product availability, pricing, shipping options, and return eligibility may be updated as the store
            develops. For order support, contact support@kensyde.com.
          </p>
        </div>
      </div>
    </section>
  );
}
