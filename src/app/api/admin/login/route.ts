import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  createAdminSessionToken,
  isAdminConfigured,
  verifyAdminPassword
} from "@/lib/adminAuth";

export const runtime = "nodejs";

const attemptWindowMs = 15 * 60 * 1000;
const maximumAttempts = 5;
const attempts = new Map<string, { count: number; startedAt: number }>();

function getClientKey(request: Request) {
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function getAttemptRecord(clientKey: string) {
  const existing = attempts.get(clientKey);

  if (!existing || Date.now() - existing.startedAt > attemptWindowMs) {
    const fresh = { count: 0, startedAt: Date.now() };
    attempts.set(clientKey, fresh);
    return fresh;
  }

  return existing;
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  const clientKey = getClientKey(request);
  const attemptRecord = getAttemptRecord(clientKey);

  if (attemptRecord.count >= maximumAttempts) {
    return NextResponse.json({ error: "Too many sign-in attempts. Please try again later." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password || !verifyAdminPassword(body.password)) {
    attemptRecord.count += 1;
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  attempts.delete(clientKey);
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS
  });

  return response;
}
