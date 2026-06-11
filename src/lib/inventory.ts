import { products } from "@/data/products";
import { prisma } from "@/lib/prisma";

export async function ensureInventoryRecords() {
  await prisma.$transaction(
    products.map((product) =>
      prisma.inventory.upsert({
        where: { sku: product.sku },
        update: {},
        create: {
          sku: product.sku,
          quantity: product.inventoryQuantity,
          lowStockThreshold: 10
        }
      })
    )
  );
}

export async function validateInventory(items: Array<{ product: { sku: string }; quantity: number }>) {
  await ensureInventoryRecords();

  const requested = new Map<string, number>();
  items.forEach((item) => requested.set(item.product.sku, (requested.get(item.product.sku) || 0) + item.quantity));

  const inventory = await prisma.inventory.findMany({
    where: { sku: { in: Array.from(requested.keys()) } }
  });
  const bySku = new Map(inventory.map((item) => [item.sku, item.quantity]));

  for (const [sku, quantity] of Array.from(requested.entries())) {
    if ((bySku.get(sku) || 0) < quantity) {
      throw new Error("One or more items do not have enough inventory.");
    }
  }
}
