import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        slug: product.slug,
        name: product.name,
        price: product.price,
        capacity: product.capacity,
        color: product.color,
        category: product.category,
        scenes: product.scenes.join("/"),
        description: product.description,
        image: product.image,
        rating: product.rating
      },
      create: {
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        price: product.price,
        capacity: product.capacity,
        color: product.color,
        category: product.category,
        scenes: product.scenes.join("/"),
        description: product.description,
        image: product.image,
        rating: product.rating
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
