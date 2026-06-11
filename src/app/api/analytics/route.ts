import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const eventTypes = new Set([
  "page_view",
  "product_impression",
  "product_click",
  "product_view",
  "add_to_cart",
  "checkout_started"
]);
const minuteMs = 60 * 1000;
const eventLimit = 120;
const eventWindows = new Map<string, { count: number; startedAt: number }>();

type AnalyticsBody = {
  eventType?: string;
  sessionId?: string;
  path?: string;
  productSku?: string;
  productSlug?: string;
};

function clean(value: string | undefined, maxLength: number) {
  return value?.trim().slice(0, maxLength) || null;
}

export async function POST(request: Request) {
  try {
    const clientKey = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const existingWindow = eventWindows.get(clientKey);
    const eventWindow =
      !existingWindow || Date.now() - existingWindow.startedAt > minuteMs
        ? { count: 0, startedAt: Date.now() }
        : existingWindow;

    if (eventWindow.count >= eventLimit) {
      return new NextResponse(null, { status: 429 });
    }
    eventWindow.count += 1;
    eventWindows.set(clientKey, eventWindow);

    const body = (await request.json()) as AnalyticsBody;
    const eventType = clean(body.eventType, 40);
    const sessionId = clean(body.sessionId, 100);
    const path = clean(body.path, 500);

    if (!eventType || !eventTypes.has(eventType) || !sessionId || !path || !path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        sessionId,
        path,
        productSku: clean(body.productSku, 100),
        productSlug: clean(body.productSlug, 200)
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics event failed", error);
    return NextResponse.json({ error: "Unable to record analytics event." }, { status: 400 });
  }
}
