import { Button } from "@/components/Button";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section className="flex min-h-[22rem] items-center bg-[#F5F1E9] px-6 py-10">
        <div className="w-full">
          <h2 className="font-editorial text-4xl font-semibold text-ink">Stay in the Flow.</h2>
          <p className="mt-4 max-w-sm text-xs leading-6 text-muted">
            New colors, early access, and quiet inspiration. Straight to your inbox.
          </p>
          <form className="mt-6 flex">
            <label className="sr-only" htmlFor="newsletter-email-compact">
              Email
            </label>
            <input
              id="newsletter-email-compact"
              type="email"
              placeholder="Your email"
              className="min-h-11 min-w-0 flex-1 rounded-none border border-white bg-white/75 px-3 text-sm text-charcoal outline-none focus:border-clay"
            />
            <Button type="submit" variant="primary" className="min-h-11 rounded-none bg-ink px-5 text-xs hover:bg-clay">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F5F1E9]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-editorial text-4xl font-semibold text-ink md:text-5xl">Stay in the Flow.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              New colors, early access, and quiet inspiration. Straight to your inbox.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email"
              className="min-h-12 flex-1 rounded-none border border-white bg-white/70 px-4 text-charcoal outline-none focus:border-clay"
            />
            <Button type="submit" variant="primary" className="rounded-none bg-ink px-7 hover:bg-clay">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
