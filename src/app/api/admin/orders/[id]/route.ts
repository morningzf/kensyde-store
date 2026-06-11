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
    return NextResponse.json({ error: "未登录或登录已过期。" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as UpdateOrderBody;
    const fulfillmentStatus = body.fulfillmentStatus?.trim() || "";

    if (!fulfillmentStatuses.has(fulfillmentStatus)) {
      return NextResponse.json({ error: "履约状态无效。" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    });
    if (!existing) {
      return NextResponse.json({ error: "未找到该订单。" }, { status: 404 });
    }

    if ((fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered") && existing.status !== "paid") {
      return NextResponse.json({ error: "只有已付款订单才能标记为已发货或已送达。" }, { status: 400 });
    }

    const carrier = clean(body.carrier, 100);
    const trackingNumber = clean(body.trackingNumber, 160);

    if (fulfillmentStatus === "shipped" && (!carrier || !trackingNumber)) {
      return NextResponse.json(
        { error: "标记为已发货前，必须填写物流公司和物流单号。" },
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

    let message = "订单操作信息已更新。";
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
          warning = "订单已保存，但邮件服务尚未配置，未发送发货通知。";
        } else {
          await prisma.order.update({
            where: { id: existing.id },
            data: { shippingNotifiedAt: new Date() }
          });
          message = "订单已更新，发货通知邮件已发送。";
        }
      } catch (emailError) {
        console.error("Shipping notification email failed", emailError);
        warning = "订单已保存，但发货通知邮件发送失败。可再次保存重试。";
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
      { error: error instanceof Error ? error.message : "无法更新订单。" },
      { status: 400 }
    );
  }
}
