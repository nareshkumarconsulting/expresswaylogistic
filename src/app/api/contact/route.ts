import { NextResponse } from "next/server";
import { quoteFormSchema } from "@/features/contact/schemas";
import { notifyLead } from "@/lib/lead-notify";
import { logger } from "@/lib/logger";
import { createQuoteReferenceId } from "@/lib/reference-id";
import {
  insertQuoteRequest,
  mapContactFormToQuoteInsert,
} from "@/services/leads-repository";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body: unknown = await request.json();
    const parsed = quoteFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const referenceId = createQuoteReferenceId();

    await insertQuoteRequest(mapContactFormToQuoteInsert(parsed.data, referenceId));

    logger.info("quote.request.received", {
      company: parsed.data.company,
      serviceType: parsed.data.serviceType,
      origin: parsed.data.origin,
      destination: parsed.data.destination,
      referenceId,
    });

    await notifyLead({
      type: "quote_request",
      subject: `[Quote] ${parsed.data.company} · ${parsed.data.origin} → ${parsed.data.destination}`,
      summaryLines: [
        `Contact: ${parsed.data.name} <${parsed.data.email}>`,
        parsed.data.phone ? `Phone: ${parsed.data.phone}` : "Phone: —",
        `Service: ${parsed.data.serviceType}`,
        `Product: ${parsed.data.productType}`,
        `Lane: ${parsed.data.origin} → ${parsed.data.destination}`,
        `Packages: ${parsed.data.totalPackages} · Weight: ${parsed.data.approxWeight}`,
        `Value: ₹${parsed.data.valueInr}`,
      ],
      payload: parsed.data as unknown as Record<string, unknown>,
      referenceId,
    });

    return NextResponse.json({
      success: true,
      message: "Quote request submitted successfully",
      data: { referenceId },
    });
  } catch (error) {
    logger.error("quote.request.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
