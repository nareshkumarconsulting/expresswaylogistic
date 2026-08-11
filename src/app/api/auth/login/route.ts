import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AUTH_COOKIE_NAME,
  getSessionToken,
  sessionCookieOptions,
  usesSupabaseAuth,
  verifyCredentials,
} from "@/lib/auth";
import {
  getPublicSupabaseUrl,
  getSupabaseServiceRoleKey,
} from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";
import { isStaffSession } from "@/lib/supabase/staff";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Enter a valid email and password" },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  if (usesSupabaseAuth()) {
    const cookieStore = await cookies();
    const response = NextResponse.json({
      success: true,
      message: "Signed in",
    });

    const supabase = createServerClient<Database>(
      getPublicSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const message =
        process.env.NODE_ENV === "development" && signInError.message
          ? `Sign-in failed: ${signInError.message}`
          : "Invalid email or password";
      return NextResponse.json(
        { success: false, error: message },
        { status: 401 },
      );
    }

    const isStaff = await isStaffSession(supabase);
    if (!isStaff) {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account is not authorized for Command Center access. Contact an administrator.",
        },
        { status: 403 },
      );
    }

    return response;
  }

  if (!verifyCredentials(email, password)) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Signed in",
  });

  response.cookies.set(
    AUTH_COOKIE_NAME,
    getSessionToken(),
    sessionCookieOptions(),
  );

  return response;
}
