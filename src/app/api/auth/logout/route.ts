import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  sessionCookieOptions,
  usesSupabaseAuth,
} from "@/lib/auth";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth";

export async function POST() {
  if (usesSupabaseAuth()) {
    const supabase = await createSupabaseServerAuthClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Unable to sign out" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signed out",
    });
  }

  const response = NextResponse.json({
    success: true,
    message: "Signed out",
  });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...sessionCookieOptions(0),
    maxAge: 0,
  });

  return response;
}
