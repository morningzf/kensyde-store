import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const statuses = new Set(["pending", "paid", "failed", "cancelled", "refunded", "partially_refunded"]);

function csvCell(value: string | number | null | undefined) {
  let text = String(value ?? "");

  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim() || "";
  const query = searchParams.get("q")?.trim().slice(0, 120) || "";
  const where: Prisma.OrderWhereInput = {
    ...(statuses.has(status) ? { status } : {}),
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
    "Order Number",
    "Status",
    "Created At",
    "Paid At",
    "Customer Name",
    "Customer Email",
    "Phone",
    "Shipping Address",
    "City",
    "State",
    "Postal Code",
    "Country",
    "Items",
    "Subtotal",
    "Shipping",
    "Total",
    "Refunded Amount",
    "Currency",
    "Payment Provider",
    "Stripe Session ID",
    "Stripe Payment Intent ID"
    ,"Fulfillment Status"
    ,"Carrier"
    ,"Tracking Number"
    ,"Internal Note"
    ,"Fulfilled At"
  ];

  const rows = orders.map((order) => [
    order.orderNumber,
    order.status,
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
      .map((item) => `${item.sku} | ${item.color} | ${item.capacity} | Qty ${item.quantity}`)
      .join("; "),
    Number(order.subtotal).toFixed(2),
    Number(order.shipping).toFixed(2),
    Number(order.total).toFixed(2),
    Number(order.refundedAmount).toFixed(2),
    order.currency.toUpperCase(),
    order.paymentProvider,
    order.stripeSessionId || "",
    order.stripePaymentIntentId || "",
    order.fulfillmentStatus,
    order.carrier || "",
    order.trackingNumber || "",
    order.adminNote || "",
    order.fulfilledAt?.toISOString() || ""
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
