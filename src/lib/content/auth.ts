/**
 * SERVER-ONLY admin authentication.
 *
 * Replaces the phase-1 browser passcode with a real server session:
 *   - the passcode is compared on the server and never shipped to the client
 *   - the session lives in an encrypted, signed, httpOnly cookie
 *   - every mutating server function calls `requireAdmin()` before touching data
 *
 * Configuration (set these before exposing /admin publicly):
 *   ADMIN_PASSCODE  — the passcode editors type on the sign-in screen
 *   SESSION_SECRET  — >=32 char random string used to encrypt the session cookie
 *
 * If either is missing the server falls back to a development default and
 * `authIsHardened()` reports false, which the admin UI surfaces as a warning.
 * Deploying without setting both leaves the panel guessable.
 */

import { useSession } from "@tanstack/react-start/server";

const SESSION_NAME = "bfge_admin";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/** Development-only fallbacks; both are overridden by env in any real deploy. */
const DEV_PASSCODE = "bfge-admin";
const DEV_SECRET = "bfge-development-session-secret-change-me";

type AdminSessionData = {
  admin?: boolean;
  since?: number;
};

function env(name: string): string | undefined {
  // Cloudflare Workers and Node both expose process.env through the Nitro
  // preset; guard anyway so this never throws in an unusual runtime.
  const value = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return value && value.length > 0 ? value : undefined;
}

function passcode(): string {
  return env("ADMIN_PASSCODE") ?? DEV_PASSCODE;
}

function secret(): string {
  return env("SESSION_SECRET") ?? DEV_SECRET;
}

/** False when either secret is still the development default. */
export function authIsHardened(): boolean {
  return env("ADMIN_PASSCODE") !== undefined && env("SESSION_SECRET") !== undefined;
}

function session() {
  return useSession<AdminSessionData>({
    name: SESSION_NAME,
    password: secret(),
    maxAge: SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    },
  });
}

/**
 * Length-independent comparison to avoid leaking the passcode length or a
 * matching prefix through response timing.
 */
function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

export async function isAdmin(): Promise<boolean> {
  const store = await session();
  return store.data.admin === true;
}

/** Throws a 401 unless the caller holds a valid admin session. */
export async function requireAdmin(): Promise<void> {
  if (await isAdmin()) return;
  throw new Response("Unauthorized", { status: 401 });
}

export async function signInWithPasscode(input: string): Promise<boolean> {
  if (!safeEqual(input, passcode())) return false;
  const store = await session();
  await store.update({ admin: true, since: Date.now() });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  const store = await session();
  await store.clear();
}
