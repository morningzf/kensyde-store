import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendCustomerShippingNotification } from "@/lib/email";
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

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if ((fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered") && existing.status !== "paid") {
      return NextResponse.json({ error: "Only paid orders can be marked as shipped or delivered." }, { status: 400 });
    }

    const carrier = clean(body.carrier, 100);
    const trackingNumber = clean(body.trackingNumber, 160);

    if (fulfillmentStatus === "shipped" && (!carrier || !trackingNumber)) {
      return NextResponse.json(
        { error: "Carrier and tracking number are required before marking an order as shipped." },
        { status: 400 }
      );
    }

    const fulfilledAt =
      fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered"
        ? existing.fulfilledAt || new Date()
        : null;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        fulfillmentStatus,
        carrier,
        trackingNumber,
        adminNote: clean(body.adminNote, 2000),
        fulfilledAt
      }
    });

    let message = "Order operations updated.";
    let warning = "";

    if (fulfillmentStatus === "shipped" && !existing.shippingNotifiedAt && carrier && trackingNumber) {
      try {
        const emailResult = await sendCustomerShippingNotification(
          {
            orderNumber: existing.orderNumber,
            customerName: existing.customerName,
            customerEmail: existing.customerEmail,
            phone: existing.phone,
            shippingAddress: existing.shippingAddress,
            city: existing.city,
            state: existing.state,
            postalCode: existing.postalCode,
            country: existing.country,
            total: existing.total,
            currency: existing.currency,
            stripeSessionId: existing.stripeSessionId,
            items: existing.items
          },
          carrier,
          trackingNumber
        );

        if ("skipped" in emailResult && emailResult.skipped) {
          warning = "Order saved, but shipping email was not sent because email service is not configured.";
        } else {
          await prisma.order.update({
            where: { id: existing.id },
            data: { shippingNotifiedAt: new Date() }
          });
          message = "Order updated and shipping email sent.";
        }
      } catch (emailError) {
        console.error("Shipping notification email failed", emailError);
        warning = "Order saved, but shipping email could not be sent. Save again to retry.";
      }
    }

    return NextResponse.json({
      success: true,
      message,
      warning,
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
