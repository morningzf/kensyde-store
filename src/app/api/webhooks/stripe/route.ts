import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || secretKey.includes("replace_me") || !webhookSecret || webhookSecret.includes("replace_me")) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("Stripe session is missing orderId metadata", session.id);
        return NextResponse.json({ error: "Missing order metadata." }, { status: 400 });
      }

      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!existingOrder) {
        console.error("Order not found for Stripe session", session.id);
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }

      if (existingOrder.status === "paid") {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const paymentIntent =
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;

      const paidOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "paid",
          stripeSessionId: session.id,
          stripePaymentIntentId: paymentIntent,
          paidAt: new Date()
        },
        include: { items: true }
      });

      try {
        await sendOrderNotification({
          orderNumber: paidOrder.orderNumber,
          customerName: paidOrder.customerName,
          customerEmail: paidOrder.customerEmail,
          phone: paidOrder.phone,
          shippingAddress: paidOrder.shippingAddress,
          city: paidOrder.city,
          state: paidOrder.state,
          postalCode: paidOrder.postalCode,
          country: paidOrder.country,
          total: paidOrder.total,
          currency: paidOrder.currency,
          stripeSessionId: paidOrder.stripeSessionId,
          items: paidOrder.items
        });
      } catch (emailError) {
        console.error("Order notification email failed", emailError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
