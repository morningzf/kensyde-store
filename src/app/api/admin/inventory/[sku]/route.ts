import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function parseInteger(value: FormDataEntryValue | null, label: string, min: number, max: number) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${label}必须是 ${min} 到 ${max} 之间的整数。`);
  }
  return number;
}

export async function POST(request: Request, { params }: { params: { sku: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "未登录或登录已过期。" }, { status: 401 });
  }

  try {
    const sku = decodeURIComponent(params.sku);
    if (!products.some((product) => product.sku === sku)) {
      return NextResponse.json({ error: "未找到该商品 SKU。" }, { status: 404 });
    }

    const formData = await request.formData();
    const quantity = parseInteger(formData.get("quantity"), "库存数量", 0, 999999);
    const lowStockThreshold = parseInteger(formData.get("lowStockThreshold"), "低库存提醒值", 0, 999999);

    await prisma.inventory.upsert({
      where: { sku },
      update: { quantity, lowStockThreshold },
      create: { sku, quantity, lowStockThreshold }
    });

    return NextResponse.redirect(new URL("/admin/inventory?updated=1", request.url), 303);
  } catch (error) {
    console.error("Admin inventory update failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "无法更新库存。" },
      { status: 400 }
    );
  }
}
