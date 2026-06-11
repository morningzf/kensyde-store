import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function parseInteger(value: FormDataEntryValue | null, label: string, min: number, max: number) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${label} must be a whole number between ${min} and ${max}.`);
  }
  return number;
}

export async function POST(request: Request, { params }: { params: { sku: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const sku = decodeURIComponent(params.sku);
    if (!products.some((product) => product.sku === sku)) {
      return NextResponse.json({ error: "Product SKU not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const quantity = parseInteger(formData.get("quantity"), "Quantity", 0, 999999);
    const lowStockThreshold = parseInteger(formData.get("lowStockThreshold"), "Low-stock alert", 0, 999999);

    await prisma.inventory.upsert({
      where: { sku },
      update: { quantity, lowStockThreshold },
      create: { sku, quantity, lowStockThreshold }
    });

    return NextResponse.redirect(new URL("/admin/inventory?updated=1", request.url), 303);
  } catch (error) {
    console.error("Admin inventory update failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update inventory." },
      { status: 400 }
    );
  }
}
