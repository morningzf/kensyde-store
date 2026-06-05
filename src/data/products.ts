export type Product = {
  productSeries: string;
  sku: string;
  slug: string;
  name: string;
  productName: string;
  pageTitle: string;
  price: number;
  compareAtPrice: number;
  capacity: "12oz";
  color: "Yellow" | "Pink" | "Green" | "Black" | "Brown" | "Dark Green";
  colorName: "Yellow" | "Pink" | "Green" | "Black" | "Brown" | "Dark Green";
  colorHex: string;
  category: string;
  collection: string;
  status: string;
  inventoryQuantity: number;
  scenes: string[];
  description: string;
  shortDescription: string;
  longDescription: string;
  material: string;
  lidType: string;
  handleType: string;
  strawIncluded: boolean;
  image: string;
  primaryImage: string;
  gallery: string[];
  galleryImages: string[];
  featureBullets: string[];
  bullets: string[];
  rating: number;
  dimensions: string;
  weight: string;
  insulationTime: string;
  specifications: string;
  care: string;
  careInstructions: string;
  shippingReturnsNote: string;
  warrantyNote: string;
  altText: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
};

const collectionGallery = [
  "/products/ken-12-ring-yellow-main.png",
  "/products/ken-12-ring-pink-main.png",
  "/products/ken-12-ring-green-main.png",
  "/products/ken-12-ring-black-main.png",
  "/products/ken-12-ring-brown-main.png",
  "/products/ken-12-ring-darkgreen-main.png"
];

const common = {
  productSeries: "12oz Ring Handle Tumbler",
  capacity: "12oz" as const,
  category: "Vacuum Tumbler",
  collection: "12oz Ring Handle Collection",
  status: "Active",
  inventoryQuantity: 100,
  scenes: ["Office", "Travel", "Outdoor", "Daily"],
  shortDescription: "A compact 12oz insulated tumbler with a clean ring handle lid for daily drinks.",
  longDescription:
    "Meet the KENSYDE 12oz Ring Handle Insulated Tumbler, a compact stainless steel cup designed for coffee, tea, water, and daily hydration. The double-wall vacuum construction helps keep drinks at a steady temperature, while the ring handle lid makes it easy to carry between work, travel, errands, and outdoor moments. Its clean silhouette and six simple colors make it a practical first choice for the KENSYDE drinkware line.",
  description: "A compact 12oz insulated tumbler with a clean ring handle lid for daily drinks.",
  material: "304 Stainless Steel",
  lidType: "Ring Handle Lid",
  handleType: "Ring Handle Lid",
  strawIncluded: false,
  gallery: collectionGallery,
  galleryImages: collectionGallery,
  featureBullets: [
    "Double-wall vacuum insulation",
    "304 stainless steel",
    "Leak-resistant ring handle lid",
    "Compact 12oz size",
    "Easy daily carry"
  ],
  bullets: [
    "Double-wall vacuum insulation helps keep drinks cold or warm for daily use.",
    "Made with 304 stainless steel for a durable, clean, reusable drinkware experience.",
    "Ring handle lid is easy to grip, carry, and attach to a bag for short trips.",
    "Leak-resistant design helps support office, travel, outdoor, and daily carry use.",
    "Compact 12oz capacity is ideal for coffee, tea, water, and everyday beverages."
  ],
  rating: 4.8,
  dimensions: "Compact 12oz carry-friendly profile",
  weight: "TBD",
  insulationTime: "Double-wall vacuum insulation",
  specifications:
    "Capacity: 12oz; Material: 304 Stainless Steel; Structure: Double-wall vacuum insulated; Lid Type: Ring Handle Lid; Use: Coffee, tea, water, daily drinks; Dishwasher Safe: Hand wash recommended",
  care: "Hand wash recommended. Do not microwave. Do not freeze. Keep lid open when storing. Clean lid and seal regularly for best performance.",
  careInstructions:
    "Hand wash recommended. Do not microwave. Keep lid open when storing. Clean lid and seal regularly for best performance.",
  shippingReturnsNote:
    "Ships in 1-2 business days after order confirmation. Returns accepted within 30 days for unused items in original condition.",
  warrantyNote: "For product support, please contact support@kensyde.com with your order details."
};

export const products: Product[] = [
  {
    ...common,
    productName: "KENSYDE 12oz Ring Handle Insulated Tumbler - Yellow",
    name: "KENSYDE 12oz Ring Handle Insulated Tumbler - Yellow",
    pageTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Yellow",
    slug: "12oz-ring-handle-insulated-tumbler-yellow",
    sku: "KEN-12-RING-YELLOW",
    price: 24.99,
    compareAtPrice: 29.99,
    color: "Yellow",
    colorName: "Yellow",
    colorHex: "#F3E58C",
    image: "/products/ken-12-ring-yellow-main.png",
    primaryImage: "/products/ken-12-ring-yellow-main.png",
    altText: "KENSYDE 12oz Yellow ring handle insulated tumbler made with 304 stainless steel",
    seoTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Yellow | KENSYDE",
    seoDescription:
      "Shop the KENSYDE 12oz yellow ring handle insulated tumbler made with 304 stainless steel, double-wall vacuum insulation, and a compact carry-friendly design.",
    ogTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Yellow | KENSYDE",
    ogDescription:
      "Premium 12oz insulated tumbler in yellow with a ring handle lid for office, travel, outdoor, and daily drinks.",
    keywords: [
      "12oz tumbler",
      "ring handle tumbler",
      "insulated tumbler",
      "304 stainless steel cup",
      "yellow tumbler",
      "coffee cup",
      "travel drinkware",
      "KENSYDE"
    ]
  },
  {
    ...common,
    productName: "KENSYDE 12oz Ring Handle Insulated Tumbler - Pink",
    name: "KENSYDE 12oz Ring Handle Insulated Tumbler - Pink",
    pageTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Pink",
    slug: "12oz-ring-handle-insulated-tumbler-pink",
    sku: "KEN-12-RING-PINK",
    price: 24.99,
    compareAtPrice: 29.99,
    color: "Pink",
    colorName: "Pink",
    colorHex: "#F5B6C8",
    image: "/products/ken-12-ring-pink-main.png",
    primaryImage: "/products/ken-12-ring-pink-main.png",
    altText: "KENSYDE 12oz Pink ring handle insulated tumbler made with 304 stainless steel",
    seoTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Pink | KENSYDE",
    seoDescription:
      "Shop the KENSYDE 12oz pink ring handle insulated tumbler made with 304 stainless steel, double-wall vacuum insulation, and a compact carry-friendly design.",
    ogTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Pink | KENSYDE",
    ogDescription:
      "Premium 12oz insulated tumbler in pink with a ring handle lid for office, travel, outdoor, and daily drinks.",
    keywords: [
      "12oz tumbler",
      "ring handle tumbler",
      "insulated tumbler",
      "304 stainless steel cup",
      "pink tumbler",
      "coffee cup",
      "travel drinkware",
      "KENSYDE"
    ]
  },
  {
    ...common,
    productName: "KENSYDE 12oz Ring Handle Insulated Tumbler - Green",
    name: "KENSYDE 12oz Ring Handle Insulated Tumbler - Green",
    pageTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Green",
    slug: "12oz-ring-handle-insulated-tumbler-green",
    sku: "KEN-12-RING-GREEN",
    price: 24.99,
    compareAtPrice: 29.99,
    color: "Green",
    colorName: "Green",
    colorHex: "#A8D86F",
    image: "/products/ken-12-ring-green-main.png",
    primaryImage: "/products/ken-12-ring-green-main.png",
    altText: "KENSYDE 12oz Green ring handle insulated tumbler made with 304 stainless steel",
    seoTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Green | KENSYDE",
    seoDescription:
      "Shop the KENSYDE 12oz green ring handle insulated tumbler made with 304 stainless steel, double-wall vacuum insulation, and a compact carry-friendly design.",
    ogTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Green | KENSYDE",
    ogDescription:
      "Premium 12oz insulated tumbler in green with a ring handle lid for office, travel, outdoor, and daily drinks.",
    keywords: [
      "12oz tumbler",
      "ring handle tumbler",
      "insulated tumbler",
      "304 stainless steel cup",
      "green tumbler",
      "coffee cup",
      "travel drinkware",
      "KENSYDE"
    ]
  },
  {
    ...common,
    productName: "KENSYDE 12oz Ring Handle Insulated Tumbler - Black",
    name: "KENSYDE 12oz Ring Handle Insulated Tumbler - Black",
    pageTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Black",
    slug: "12oz-ring-handle-insulated-tumbler-black",
    sku: "KEN-12-RING-BLACK",
    price: 24.99,
    compareAtPrice: 29.99,
    color: "Black",
    colorName: "Black",
    colorHex: "#111111",
    image: "/products/ken-12-ring-black-main.png",
    primaryImage: "/products/ken-12-ring-black-main.png",
    altText: "KENSYDE 12oz Black ring handle insulated tumbler made with 304 stainless steel",
    seoTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Black | KENSYDE",
    seoDescription:
      "Shop the KENSYDE 12oz black ring handle insulated tumbler made with 304 stainless steel, double-wall vacuum insulation, and a compact carry-friendly design.",
    ogTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Black | KENSYDE",
    ogDescription:
      "Premium 12oz insulated tumbler in black with a ring handle lid for office, travel, outdoor, and daily drinks.",
    keywords: [
      "12oz tumbler",
      "ring handle tumbler",
      "insulated tumbler",
      "304 stainless steel cup",
      "black tumbler",
      "coffee cup",
      "travel drinkware",
      "KENSYDE"
    ]
  },
  {
    ...common,
    productName: "KENSYDE 12oz Ring Handle Insulated Tumbler - Brown",
    name: "KENSYDE 12oz Ring Handle Insulated Tumbler - Brown",
    pageTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Brown",
    slug: "12oz-ring-handle-insulated-tumbler-brown",
    sku: "KEN-12-RING-BROWN",
    price: 24.99,
    compareAtPrice: 29.99,
    color: "Brown",
    colorName: "Brown",
    colorHex: "#3B1718",
    image: "/products/ken-12-ring-brown-main.png",
    primaryImage: "/products/ken-12-ring-brown-main.png",
    altText: "KENSYDE 12oz Brown ring handle insulated tumbler made with 304 stainless steel",
    seoTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Brown | KENSYDE",
    seoDescription:
      "Shop the KENSYDE 12oz brown ring handle insulated tumbler made with 304 stainless steel, double-wall vacuum insulation, and a compact carry-friendly design.",
    ogTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Brown | KENSYDE",
    ogDescription:
      "Premium 12oz insulated tumbler in brown with a ring handle lid for office, travel, outdoor, and daily drinks.",
    keywords: [
      "12oz tumbler",
      "ring handle tumbler",
      "insulated tumbler",
      "304 stainless steel cup",
      "brown tumbler",
      "coffee cup",
      "travel drinkware",
      "KENSYDE"
    ]
  },
  {
    ...common,
    productName: "KENSYDE 12oz Ring Handle Insulated Tumbler - Dark Green",
    name: "KENSYDE 12oz Ring Handle Insulated Tumbler - Dark Green",
    pageTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Dark Green",
    slug: "12oz-ring-handle-insulated-tumbler-dark-green",
    sku: "KEN-12-RING-DARKGREEN",
    price: 24.99,
    compareAtPrice: 29.99,
    color: "Dark Green",
    colorName: "Dark Green",
    colorHex: "#0E3B32",
    image: "/products/ken-12-ring-darkgreen-main.png",
    primaryImage: "/products/ken-12-ring-darkgreen-main.png",
    altText: "KENSYDE 12oz Dark Green ring handle insulated tumbler made with 304 stainless steel",
    seoTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Dark Green | KENSYDE",
    seoDescription:
      "Shop the KENSYDE 12oz dark green ring handle insulated tumbler made with 304 stainless steel, double-wall vacuum insulation, and a compact carry-friendly design.",
    ogTitle: "KENSYDE 12oz Ring Handle Insulated Tumbler - Dark Green | KENSYDE",
    ogDescription:
      "Premium 12oz insulated tumbler in dark green with a ring handle lid for office, travel, outdoor, and daily drinks.",
    keywords: [
      "12oz tumbler",
      "ring handle tumbler",
      "insulated tumbler",
      "304 stainless steel cup",
      "dark green tumbler",
      "coffee cup",
      "travel drinkware",
      "KENSYDE"
    ]
  }
];

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) {
    return "Price TBD";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);
};

export const numericPrice = (price: number | null | undefined) => price ?? 0;
