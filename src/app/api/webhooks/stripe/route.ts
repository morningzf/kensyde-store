import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  sendCustomerOrderConfirmation,
  sendCustomerRefundNotification,
  sendOrderNotification
} from "@/lib/email";
import { products } from "@/data/products";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function updateOrderStatus(orderId: string | undefined, status: string) {
  if (!orderId) {
    return false;
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.status === "paid" || order.status === "refunded") {
    return false;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });

  return true;
}

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

      const paidOrder = await prisma.$transaction(async (transaction) => {
        const inventoryClaim = await transaction.order.updateMany({
          where: { id: orderId, inventoryDeductedAt: null },
          data: { inventoryDeductedAt: new Date() }
        });
        const order = await transaction.order.update({
          where: { id: orderId },
          data: {
            status: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntent,
            paidAt: new Date()
          },
          include: { items: true }
        });

        if (inventoryClaim.count === 1) {
          for (const item of existingOrder.items) {
            const initialQuantity = products.find((product) => product.sku === item.sku)?.inventoryQuantity || 0;
            await transaction.inventory.upsert({
              where: { sku: item.sku },
              update: { quantity: { decrement: item.quantity } },
              create: { sku: item.sku, quantity: Math.max(0, initialQuantity - item.quantity), lowStockThreshold: 10 }
            });
          }
        }

        return order;
      });

      try {
        const emailOrder = {
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
        };

        const emailResults = await Promise.allSettled([
          sendOrderNotification(emailOrder),
          sendCustomerOrderConfirmation(emailOrder)
        ]);

        emailResults.forEach((result) => {
          if (result.status === "rejected") {
            console.error("Paid order email failed", result.reason);
          }
        });
      } catch (emailError) {
        console.error("Order notification email failed", emailError);
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await updateOrderStatus(session.metadata?.orderId, "cancelled");
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await updateOrderStatus(paymentIntent.metadata?.orderId, "failed");
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;

      if (paymentIntentId) {
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: paymentIntentId },
          include: { items: true }
        });

        const refundedAmount = charge.amount_refunded / 100;

        if (order && Number(order.refundedAmount) < refundedAmount) {
          const status = charge.amount_refunded >= charge.amount ? "refunded" : "partially_refunded";
          await prisma.order.update({
            where: { id: order.id },
            data: { status, refundedAmount }
          });

          try {
            await sendCustomerRefundNotification(
              {
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                phone: order.phone,
                shippingAddress: order.shippingAddress,
                city: order.city,
                state: order.state,
                postalCode: order.postalCode,
                country: order.country,
                total: order.total,
                currency: order.currency,
                stripeSessionId: order.stripeSessionId,
                items: order.items
              },
              status,
              refundedAmount
            );
          } catch (emailError) {
            console.error("Customer refund email failed", emailError);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
