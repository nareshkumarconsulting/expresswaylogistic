import { NextResponse } from "next/server";
import { emailIngestSchema } from "@/features/email-intelligence/schemas";
import { logger } from "@/lib/logger";
import { insertEmailIntelligence } from "@/services/email-intelligence-repository";
import { processEmailQuoteIntelligence } from "@/services/email-quote-intelligence";

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
    const quote =
      saved.created && saved.email
        ? await processEmailQuoteIntelligence(saved.email, parsed.data)
        : null;

    return NextResponse.json({
      success: true,
      data: {
        id: saved.email?.id ?? null,
        quote: quote
          ? {
              id: quote.quoteId ?? null,
              action: quote.action,
              subtype: quote.subtype ?? null,
            }
          : null,
      },
      message: saved.created
        ? "Email intelligence stored"
        : saved.email
          ? "Duplicate skipped"
          : "Email intelligence stored",
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
