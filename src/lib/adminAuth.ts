import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "kensyde_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim() && getSessionSecret().length >= 32);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim() || "";
  return Boolean(expected && secureCompare(password, expected));
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token || !isAdminConfigured()) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");
  const expiresAtNumber = Number(expiresAt);

  if (!expiresAt || !signature || !Number.isFinite(expiresAtNumber) || expiresAtNumber <= Date.now() / 1000) {
    return false;
  }

  return secureCompare(signature, sign(expiresAt));
}

export function isAdminAuthenticated() {
  return verifyAdminSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value);
}
