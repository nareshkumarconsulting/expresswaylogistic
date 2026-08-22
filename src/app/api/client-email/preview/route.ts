import { NextResponse } from "next/server";
import { z } from "zod";
import { renderClientEmailFromPlainBody } from "@/features/client-email/email-render";
import { getEmailBranding } from "@/services/client-email-repository";

const previewSchema = z.object({
  bodyText: z.string().trim().min(1).max(20_000),
  subject: z.string().trim().min(1).max(300).optional(),
  senderName: z.string().trim().max(120).optional(),
});

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = previewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid preview request",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const branding = await getEmailBranding();
    const rendered = renderClientEmailFromPlainBody(
      parsed.data.bodyText,
      branding,
      parsed.data.senderName,
    );
    return NextResponse.json({
      success: true,
      data: {
        subject: parsed.data.subject,
        html: rendered.html,
        text: rendered.text,
        branding,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to build preview",
      },
      { status: 500 },
    );
  }
}
