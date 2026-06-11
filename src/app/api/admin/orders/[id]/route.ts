import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const fulfillmentStatuses = new Set(["unfulfilled", "processing", "shipped", "delivered"]);

type UpdateOrderBody = {
  fulfillmentStatus?: string;
  carrier?: string;
  trackingNumber?: string;
  adminNote?: string;
};

function clean(value: string | undefined, maxLength: number) {
  const normalized = value?.trim() || "";
  if (normalized.length > maxLength) {
    throw new Error("One or more fields are too long.");
  }
  return normalized || null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as UpdateOrderBody;
    const fulfillmentStatus = body.fulfillmentStatus?.trim() || "";

    if (!fulfillmentStatuses.has(fulfillmentStatus)) {
      return NextResponse.json({ error: "Invalid fulfillment status." }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if ((fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered") && existing.status !== "paid") {
      return NextResponse.json({ error: "Only paid orders can be marked as shipped or delivered." }, { status: 400 });
    }

    const fulfilledAt =
      fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered"
        ? existing.fulfilledAt || new Date()
        : null;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        fulfillmentStatus,
        carrier: clean(body.carrier, 100),
        trackingNumber: clean(body.trackingNumber, 160),
        adminNote: clean(body.adminNote, 2000),
        fulfilledAt
      }
    });

    return NextResponse.json({
      success: true,
      fulfillmentStatus: order.fulfillmentStatus,
      fulfilledAt: order.fulfilledAt?.toISOString() || null
    });
  } catch (error) {
    console.error("Admin order update failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update order." },
      { status: 400 }
    );
  }
}
