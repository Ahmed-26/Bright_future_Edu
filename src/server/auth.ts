import { getRequest, setResponseHeader } from "@tanstack/react-start/server";

import { getDb, signValue, unsignValue, verifyPassword } from "./db";

const COOKIE = "bf_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function cookies(): Record<string, string> {
  const header = getRequest().headers.get("cookie") ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function readSession(): { email: string } | null {
  const token = cookies()[COOKIE];
  if (!token) return null;
  const db = getDb();
  const raw = unsignValue(token, db.sessionSecret);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email?: unknown; exp?: unknown };
    if (typeof parsed.email !== "string" || typeof parsed.exp !== "number") return null;
    if (parsed.exp < Date.now()) return null;
    if (parsed.email !== db.admin.email) return null;
    return { email: parsed.email };
  } catch {
    return null;
  }
}

export function requireAdmin() {
  const session = readSession();
  if (!session) {
    const error = new Error("Unauthorized");
    (error as Error & { status?: number }).status = 401;
    throw error;
  }
  return session;
}

export function loginAdmin(email: string, password: string) {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  if (normalized !== db.admin.email) return false;
  if (!verifyPassword(password, db.admin.salt, db.admin.hash)) return false;
  const payload = JSON.stringify({
    email: db.admin.email,
    exp: Date.now() + MAX_AGE * 1000,
  });
  const token = signValue(payload, db.sessionSecret);
  setResponseHeader(
    "Set-Cookie",
    `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}`,
  );
  return true;
}

export function logoutAdmin() {
  setResponseHeader(
    "Set-Cookie",
    `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
  );
}
