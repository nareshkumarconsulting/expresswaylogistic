import { NextResponse } from "next/server";
import { emailIngestSchema } from "@/features/email-intelligence/schemas";
import { logger } from "@/lib/logger";
import { insertEmailIntelligence } from "@/services/email-intelligence-repository";

function verifyIngestSecret(request: Request): boolean {
  const secret = process.env.EMAIL_INGEST_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7) === secret;
  }

  return request.headers.get("x-email-ingest-secret") === secret;
}

export async function POST(request: Request) {
  if (!verifyIngestSecret(request)) {
    const configured = Boolean(process.env.EMAIL_INGEST_SECRET);
    return NextResponse.json(
      {
        success: false,
        error: configured
          ? "Unauthorized"
          : "Email ingest is not configured (EMAIL_INGEST_SECRET missing)",
      },
      { status: configured ? 401 : 503 },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = emailIngestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const saved = await insertEmailIntelligence(parsed.data);

    return NextResponse.json({
      success: true,
      data: { id: saved?.id ?? null },
      message: saved ? "Email intelligence stored" : "Duplicate skipped",
    });
  } catch (error) {
    logger.error("email_intelligence.ingest.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Failed to process email intelligence" },
      { status: 500 },
    );
  }
}
