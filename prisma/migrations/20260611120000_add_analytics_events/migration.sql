CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "productSku" TEXT,
  "productSlug" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_eventType_createdAt_idx"
ON "AnalyticsEvent"("eventType", "createdAt");

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_productSku_eventType_createdAt_idx"
ON "AnalyticsEvent"("productSku", "eventType", "createdAt");

CREATE INDEX IF NOT EXISTS "AnalyticsEvent_sessionId_createdAt_idx"
ON "AnalyticsEvent"("sessionId", "createdAt");
