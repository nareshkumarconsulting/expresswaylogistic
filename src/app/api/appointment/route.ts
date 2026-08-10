import { NextResponse } from "next/server";
import {
  APPOINTMENT_TYPE_LABELS,
  appointmentFormSchema,
  MEETING_MODE_LABELS,
  TIME_SLOT_LABELS,
} from "@/features/appointment/schemas";
import { notifyLead } from "@/lib/lead-notify";
import { logger } from "@/lib/logger";

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
    const parsed = appointmentFormSchema.safeParse(body);

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

    const referenceId = `AP-${Date.now().toString(36).toUpperCase()}`;
    const typeLabel =
      APPOINTMENT_TYPE_LABELS[parsed.data.appointmentType] ??
      parsed.data.appointmentType;

    logger.info("appointment.request.received", {
      company: parsed.data.company,
      appointmentType: parsed.data.appointmentType,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      meetingMode: parsed.data.meetingMode,
      referenceId,
    });

    await notifyLead({
      type: "appointment_request",
      subject: `[Appointment] ${parsed.data.company} · ${typeLabel}`,
      summaryLines: [
        `Contact: ${parsed.data.name} <${parsed.data.email}>`,
        `Phone: ${parsed.data.phone}`,
        `Meeting: ${typeLabel}`,
        `When: ${parsed.data.preferredDate} ${TIME_SLOT_LABELS[parsed.data.preferredTime]} IST`,
        `Mode: ${MEETING_MODE_LABELS[parsed.data.meetingMode]}`,
        parsed.data.notes ? `Notes: ${parsed.data.notes}` : "Notes: —",
      ],
      payload: parsed.data as unknown as Record<string, unknown>,
      referenceId,
    });

    return NextResponse.json({
      success: true,
      message: "Appointment request submitted successfully",
      data: { referenceId },
    });
  } catch (error) {
    logger.error("appointment.request.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
