import { NextResponse } from "next/server";
import {
  formatQuoteAddOns,
  quoteWizardSchema,
  TRANSPORT_MODE_LABELS,
} from "@/features/quote/schemas";
import { notifyLead } from "@/lib/lead-notify";
import { logger } from "@/lib/logger";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 6;
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
    const parsed = quoteWizardSchema.safeParse(body);

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

    const referenceId = `QW-${Date.now().toString(36).toUpperCase()}`;
    const addOns = formatQuoteAddOns(parsed.data);

    logger.info("quote.wizard.received", {
      company: parsed.data.company,
      transportMode: parsed.data.transportMode,
      origin: parsed.data.origin,
      destination: parsed.data.destination,
      cargoItems: parsed.data.cargoItems.length,
      insurance: parsed.data.insurance,
      projectCargo: parsed.data.projectCargo,
      packingRequired: parsed.data.packingRequired,
      customsBrokerage: parsed.data.customsBrokerage,
      referenceId,
    });

    await notifyLead({
      type: "quote_wizard_request",
      subject: `[Quote Wizard] ${parsed.data.company} · ${parsed.data.origin} → ${parsed.data.destination}`,
      summaryLines: [
        `Contact: ${parsed.data.firstName} ${parsed.data.lastName} <${parsed.data.email}>`,
        parsed.data.phone ? `Phone: ${parsed.data.phone}` : "Phone: —",
        `Mode: ${TRANSPORT_MODE_LABELS[parsed.data.transportMode]}`,
        `Lane: ${parsed.data.origin} → ${parsed.data.destination}`,
        `Cargo ready: ${parsed.data.cargoReadyDate}`,
        `Line items: ${parsed.data.cargoItems.length}`,
        `Add-ons: ${addOns.join(", ") || "None"}`,
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
    logger.error("quote.wizard.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
