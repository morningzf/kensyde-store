import { NextResponse } from "next/server";

type CheckoutItem = {
  name: string;
  price: number | null;
  quantity: number;
};

export async function POST(request: Request) {
  const { items } = (await request.json()) as { items: CheckoutItem[] };
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0).toFixed(2);

  if (!clientId || !clientSecret || clientId.includes("replace_me")) {
    return NextResponse.json({
      mode: "demo",
      approveUrl: `${siteUrl}/order-confirmation?order=KEN-DEMO-PAYPAL`,
      message: "Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to create a PayPal order."
    });
  }

  const authResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const auth = await authResponse.json();
  const orderResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: total } }],
      application_context: {
        return_url: `${siteUrl}/order-confirmation`,
        cancel_url: `${siteUrl}/cart`
      }
    })
  });

  const order = await orderResponse.json();
  const approveUrl = order.links?.find((link: { rel: string; href: string }) => link.rel === "approve")?.href;

  return NextResponse.json({ orderId: order.id, approveUrl });
}
