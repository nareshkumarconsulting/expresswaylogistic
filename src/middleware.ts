import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  isProtectedPath,
  isValidSessionToken,
  usesSupabaseAuth,
} from "@/lib/auth";
import {
  copySupabaseCookies,
  createSupabaseMiddlewareClient,
} from "@/lib/supabase/middleware-client";
import { isStaffSession } from "@/lib/supabase/staff";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
  return response;
}

async function resolveStaffAccess(request: NextRequest): Promise<{
  isAuthed: boolean;
  supabaseResponse: NextResponse | null;
}> {
  const { supabase, getResponse } = createSupabaseMiddlewareClient(request);
  const isAuthed = await isStaffSession(supabase);
  return { isAuthed, supabaseResponse: getResponse() };
}

function resolveDemoAccess(request: NextRequest): boolean {
  const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return isValidSessionToken(session);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuthCheck =
    isProtectedPath(pathname) || pathname === "/login";

  if (!needsAuthCheck) {
    const response = NextResponse.next();
    if (pathname.startsWith("/api/")) {
      response.headers.set("Cache-Control", "no-store");
    }
    return withSecurityHeaders(response);
  }

  let isAuthed = false;
  let supabaseResponse: NextResponse | null = null;

  if (usesSupabaseAuth()) {
    const staffAccess = await resolveStaffAccess(request);
    isAuthed = staffAccess.isAuthed;
    supabaseResponse = staffAccess.supabaseResponse;
  } else {
    isAuthed = resolveDemoAccess(request);
  }

  if (isProtectedPath(pathname) && !isAuthed) {
    if (pathname.startsWith("/api/")) {
      return withSecurityHeaders(
        NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 },
        ),
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    if (supabaseResponse) {
      copySupabaseCookies(supabaseResponse, redirect);
    }
    return withSecurityHeaders(redirect);
  }

  if (pathname === "/login" && isAuthed) {
    const redirect = NextResponse.redirect(
      new URL("/command-center", request.url),
    );
    if (supabaseResponse) {
      copySupabaseCookies(supabaseResponse, redirect);
    }
    return withSecurityHeaders(redirect);
  }

  const response = supabaseResponse ?? NextResponse.next();

  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
  }

  return withSecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.svg|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
