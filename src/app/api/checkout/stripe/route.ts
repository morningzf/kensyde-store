import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";
import { validateInventory } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CheckoutItem = {
  slug?: string;
  sku?: string;
  quantity?: number;
};

type CheckoutCustomer = {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
};

const requiredCustomerFields: Array<keyof CheckoutCustomer> = [
  "email",
  "name",
  "phone",
  "address",
  "city",
  "state",
  "postal",
  "country"
];
const supportedCountries = new Set(["United States", "United Kingdom", "Germany", "France"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fieldLimits: Record<keyof CheckoutCustomer, number> = {
  email: 254,
  name: 120,
  phone: 40,
  address: 240,
  city: 100,
  state: 100,
  postal: 30,
  country: 50
};

const generateOrderNumber = () => `KEN-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

function validateCustomer(customer: CheckoutCustomer | undefined) {
  const missing = requiredCustomerFields.filter((field) => !customer?.[field]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing checkout fields: ${missing.join(", ")}`);
  }

  const normalized = Object.fromEntries(
    requiredCustomerFields.map((field) => [field, customer?.[field]?.trim() || ""])
  ) as Required<CheckoutCustomer>;

  const tooLong = requiredCustomerFields.find((field) => normalized[field].length > fieldLimits[field]);
  if (tooLong) {
    throw new Error(`Checkout field is too long: ${tooLong}`);
  }

  if (!emailPattern.test(normalized.email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (!supportedCountries.has(normalized.country)) {
    throw new Error("Shipping country is not supported.");
  }

  return normalized;
}

function validateItems(items: CheckoutItem[] | undefined) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const validated = items.map((item) => {
    const product =
      products.find((candidate) => candidate.slug === item.slug) ||
      products.find((candidate) => item.sku?.startsWith(candidate.sku));
    const quantity = Number(item.quantity);

    if (!product) {
      throw new Error("One or more cart items are no longer available.");
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error("Invalid item quantity.");
    }

    return {
      product,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity
    };
  });

  return validated;
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey || secretKey.includes("replace_me")) {
      return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const { items, customer } = (await request.json()) as {
      items?: CheckoutItem[];
      customer?: CheckoutCustomer;
    };

    const checkoutCustomer = validateCustomer(customer);
    const validatedItems = validateItems(items);
    await validateInventory(validatedItems);
    const subtotal = validatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = validatedItems.length > 0 ? 6.95 : 0;
    const total = subtotal + shipping;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "pending",
        customerEmail: checkoutCustomer.email,
        customerName: checkoutCustomer.name,
        phone: checkoutCustomer.phone,
        shippingAddress: checkoutCustomer.address,
        city: checkoutCustomer.city,
        state: checkoutCustomer.state,
        postalCode: checkoutCustomer.postal,
        country: checkoutCustomer.country,
        subtotal,
        shipping,
        total,
        currency: "usd",
        paymentProvider: "stripe",
        items: {
          create: validatedItems.map((item) => ({
            sku: item.product.sku,
            productName: item.product.productSeries,
            color: item.product.colorName,
            capacity: item.product.capacity,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            image: item.product.image
          }))
        }
      }
    });

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: checkoutCustomer.email,
      success_url: `${siteUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        orderId: order.id,
        orderNumber
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
          orderNumber
        }
      },
      line_items: [
        ...validatedItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.unitPrice * 100),
            product_data: {
              name: item.product.productSeries,
              images: [`${siteUrl}${item.product.image}`],
              metadata: {
                sku: item.product.sku,
                color: item.product.colorName,
                capacity: item.product.capacity
              }
            }
          }
        })),
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(shipping * 100),
            product_data: { name: "Shipping" }
          }
        }
      ]
    });

    if (!session.url) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "failed" }
      });
      return NextResponse.json({ error: "Unable to create Stripe Checkout session." }, { status: 500 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout." },
      { status: 400 }
    );
  }
}
