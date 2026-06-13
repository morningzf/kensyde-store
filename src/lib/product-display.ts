import type { Product } from "@/data/products";

const colorNames: Record<Product["color"], string> = {
  Yellow: "Oat Cream",
  Pink: "Soft Rose",
  Green: "Sage Green",
  Black: "Matte Black",
  Brown: "Clay Brown",
  "Dark Green": "Forest Green",
};

const lifestyleTags: Record<Product["color"], string> = {
  Yellow: "Everyday Pick",
  Pink: "Gift Favorite",
  Green: "Outdoor Scene",
  Black: "Workday Essential",
  Brown: "Warm Neutral",
  "Dark Green": "Weekend Carry",
};

export function getBrandColorName(product: Product) {
  return colorNames[product.color];
}

export function getLifestyleTag(product: Product) {
  return lifestyleTags[product.color];
}
