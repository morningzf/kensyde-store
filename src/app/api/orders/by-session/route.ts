import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    currency: order.currency,
    items: order.items.map((item) => ({
      sku: item.sku,
      productName: item.productName,
      color: item.color,
      capacity: item.capacity,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      image: item.image
    }))
  });
}
