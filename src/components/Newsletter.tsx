import { Button } from "@/components/Button";

export function Newsletter() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid items-center gap-8 border-y border-line py-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-heading text-3xl font-bold text-navy">Stay In The Flow</h2>
            <p className="mt-3 text-muted">Subscribe for product updates and exclusive offers.</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email address"
              className="min-h-12 flex-1 rounded border border-line bg-cream px-4 text-charcoal outline-none focus:border-sand"
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
