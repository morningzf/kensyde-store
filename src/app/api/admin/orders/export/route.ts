import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { fulfillmentStatusLabel, paymentStatusLabel } from "@/lib/adminLocale";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const statuses = new Set(["pending", "paid", "failed", "cancelled", "refunded", "partially_refunded"]);
const fulfillmentStatuses = new Set(["unfulfilled", "processing", "shipped", "delivered"]);

function getDate(value: string, endOfDay = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  return new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+08:00`);
}

function csvCell(value: string | number | null | undefined) {
  let text = String(value ?? "");

  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "未登录或登录已过期。" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim() || "";
  const fulfillment = searchParams.get("fulfillment")?.trim() || "";
  const query = searchParams.get("q")?.trim().slice(0, 120) || "";
  const from = searchParams.get("from")?.trim() || "";
  const to = searchParams.get("to")?.trim() || "";
  const createdAt = {
    ...(getDate(from) ? { gte: getDate(from) } : {}),
    ...(getDate(to, true) ? { lte: getDate(to, true) } : {})
  };
  const where: Prisma.OrderWhereInput = {
    ...(statuses.has(status) ? { status } : {}),
    ...(fulfillmentStatuses.has(fulfillment) ? { fulfillmentStatus: fulfillment } : {}),
    ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
    ...(query
      ? {
          OR: [
            { orderNumber: { contains: query, mode: "insensitive" } },
            { customerEmail: { contains: query, mode: "insensitive" } },
            { customerName: { contains: query, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 5000
  });

  const headers = [
    "订单号",
    "付款状态",
    "创建时间",
    "付款时间",
    "客户姓名",
    "客户邮箱",
    "电话",
    "收货地址",
    "城市",
    "州/省",
    "邮编",
    "国家",
    "商品明细",
    "商品小计",
    "运费",
    "订单总额",
    "退款金额",
    "币种",
    "支付渠道",
    "Stripe Session ID",
    "Stripe Payment Intent ID"
    ,"履约状态"
    ,"物流公司"
    ,"物流单号"
    ,"内部备注"
    ,"履约时间"
    ,"发货邮件发送时间"
  ];

  const rows = orders.map((order) => [
    order.orderNumber,
    paymentStatusLabel(order.status),
    order.createdAt.toISOString(),
    order.paidAt?.toISOString() || "",
    order.customerName,
    order.customerEmail,
    order.phone,
    order.shippingAddress,
    order.city,
    order.state,
    order.postalCode,
    order.country,
    order.items
      .map((item) => `${item.sku} | ${item.color} | ${item.capacity} | 数量 ${item.quantity}`)
      .join("; "),
    Number(order.subtotal).toFixed(2),
    Number(order.shipping).toFixed(2),
    Number(order.total).toFixed(2),
    Number(order.refundedAmount).toFixed(2),
    order.currency.toUpperCase(),
    order.paymentProvider,
    order.stripeSessionId || "",
    order.stripePaymentIntentId || "",
    fulfillmentStatusLabel(order.fulfillmentStatus),
    order.carrier || "",
    order.trackingNumber || "",
    order.adminNote || "",
    order.fulfilledAt?.toISOString() || "",
    order.shippingNotifiedAt?.toISOString() || ""
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kensyde-orders-${date}.csv"`,
      "Cache-Control": "private, no-store"
    }
  });
}
