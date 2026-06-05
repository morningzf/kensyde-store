import { NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutItem = {
  name: string;
  price: number | null;
  quantity: number;
};

export async function POST(request: Request) {
  const { items } = (await request.json()) as { items: CheckoutItem[] };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || secretKey.includes("replace_me")) {
    return NextResponse.json({
      mode: "demo",
      checkoutUrl: `${siteUrl}/order-confirmation?order=KEN-DEMO-STRIPE`,
      message: "Set STRIPE_SECRET_KEY to create a live Stripe Checkout session."
    });
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/order-confirmation?order={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cart`,
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round((item.price ?? 0) * 100),
        product_data: { name: item.name }
      }
    }))
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
