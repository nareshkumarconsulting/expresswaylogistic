/** Shared auth helpers — safe for Edge middleware and Node route handlers. */

import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

/** Legacy demo session cookie (used only when Supabase Auth is not configured). */
export const AUTH_COOKIE_NAME = "ew_cc_session";

const SESSION_TOKEN =
  process.env.AUTH_SESSION_SECRET ?? "ew-command-center-demo-session";

/** Demo credentials — fallback when Supabase Auth env vars are missing. */
export const DEMO_AUTH = {
  email: process.env.AUTH_EMAIL ?? "ops@expresswaylogistic.com",
  password: process.env.AUTH_PASSWORD ?? "expressway",
} as const;

export function usesSupabaseAuth(): boolean {
  return isSupabaseAuthConfigured();
}

export function getSessionToken(): string {
  return SESSION_TOKEN;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === SESSION_TOKEN;
}

export function verifyCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_AUTH.email.toLowerCase() &&
    password === DEMO_AUTH.password
  );
}

export function sessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export const PROTECTED_API_PREFIXES = [
  "/api/shipments",
  "/api/quotes",
  "/api/calendar",
  "/api/ai",
  "/api/email-intelligence",
] as const;

export function isProtectedPath(pathname: string): boolean {
  if (pathname === "/api/email-intelligence/ingest") return false;
  if (pathname.startsWith("/command-center")) return true;
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
