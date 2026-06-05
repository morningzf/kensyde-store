# KENSYDE Ecommerce Store

KENSYDE is a premium DTC drinkware storefront built with Next.js, React, TypeScript, Tailwind CSS, API routes, Prisma, SQLite, Stripe, and PayPal examples.

## Project Structure

```text
kensyde-store/
  prisma/
    schema.prisma
    seed.ts
  public/
    images/
      kensyde-hero.png
      kensyde-products.png
      kensyde-lifestyle.png
  src/
    app/
      api/
      about/
      cart/
      checkout/
      contact/
      order-confirmation/
      product/[slug]/
      shop/
      layout.tsx
      page.tsx
      globals.css
    components/
    context/
    data/
    lib/
  Dockerfile
  package.json
  tailwind.config.ts
  .env.example
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

For local SQLite development:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_OG_IMAGE="/images/kensyde-hero.png"
```

## Database Setup

```bash
npm run db:push
npm run db:seed
```

The current storefront reads from `src/data/products.ts` for a simple editable demo. Prisma models are included so the project can be moved to database-driven product and order storage.

## Local Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Stripe Configuration

1. Create a Stripe account and get test keys from the Stripe dashboard.
2. Add these values to `.env.local`:

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

3. The example route is:

```text
POST /api/checkout/stripe
```

When keys are missing, the route returns a demo checkout URL. With keys configured, it creates a Stripe Checkout Session.

## PayPal Configuration

1. Create a PayPal developer app.
2. Add sandbox credentials:

```env
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."
```

3. The example route is:

```text
POST /api/checkout/paypal
```

When credentials are missing, the route returns a demo approval URL. With credentials configured, it creates a PayPal sandbox order.

## Replace Product Data

Edit:

```text
src/data/products.ts
```

Each product supports SKU, slug, name, price, capacity, color, category, scenes, description, gallery images, rating, specifications, and search keywords.

To replace images, add files to:

```text
public/images/
```

Then update each product `image` and `gallery` path.

## Contact Form

The form posts to:

```text
POST /api/contact
```

Set the destination placeholder:

```env
CONTACT_TO_EMAIL="support@kensyde.com"
```

Connect the route to Resend, SendGrid, Postmark, or another email provider before production launch.

## Deploy To Vercel

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Set environment variables in Vercel Project Settings.
4. Use the default build command:

```bash
npm run build
```

5. Use the default output handled by Next.js.

## Bind A Domain

1. In Vercel, open Project Settings > Domains.
2. Add your domain, for example:

```text
kensyde.com
www.kensyde.com
```

3. Update your domain DNS records as instructed by Vercel.
4. Set:

```env
NEXT_PUBLIC_SITE_URL="https://www.kensyde.com"
```

## Docker

```bash
docker build -t kensyde-store .
docker run -p 3000:3000 --env-file .env.local kensyde-store
```

## Production Notes

- Replace placeholder legal pages with final privacy and terms content.
- Connect checkout buttons to the Stripe or PayPal API flow before accepting real payments.
- Move orders from demo session storage into the Prisma `Order` and `OrderItem` models.
- Review taxes, shipping rates, returns, and regional compliance for the US, UK, Germany, and France.
