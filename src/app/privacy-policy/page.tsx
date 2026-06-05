import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Privacy Policy",
  description: "KENSYDE privacy policy for customer information and store support.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <h1 className="font-heading text-4xl font-extrabold text-navy">Privacy Policy</h1>
        <div className="mt-8 space-y-4 rounded-lg border border-line bg-white p-8 leading-7 text-muted">
          <p>
            KENSYDE collects the information needed to process orders, provide customer support, and improve the
            shopping experience. This may include contact details, shipping details, order information, and basic
            website analytics.
          </p>
          <p>
            For privacy questions or support requests, contact support@kensyde.com.
          </p>
        </div>
      </div>
    </section>
  );
}
