import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AUTH_COOKIE_NAME,
  getSessionToken,
  sessionCookieOptions,
  verifyCredentials,
} from "@/lib/auth";

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
