import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";

export async function POST() {
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
