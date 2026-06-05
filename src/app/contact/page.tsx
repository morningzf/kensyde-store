import { ContactClient } from "@/components/ContactClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Contact KENSYDE",
  description: "Contact KENSYDE for product questions, order support, and wholesale inquiries.",
  path: "/contact"
});

export default function ContactPage() {
  return <ContactClient />;
}
