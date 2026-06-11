"use client";

export type AnalyticsEventType =
  | "page_view"
  | "product_impression"
  | "product_click"
  | "product_view"
  | "add_to_cart"
  | "checkout_started";

type AnalyticsPayload = {
  eventType: AnalyticsEventType;
  productSku?: string;
  productSlug?: string;
  path?: string;
};

const SESSION_KEY = "kensyde-analytics-session";

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const created =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

export function trackEvent(payload: AnalyticsPayload) {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) {
    return;
  }

  const body = JSON.stringify({
    ...payload,
    path: payload.path || window.location.pathname,
    sessionId: getSessionId()
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  });
}
