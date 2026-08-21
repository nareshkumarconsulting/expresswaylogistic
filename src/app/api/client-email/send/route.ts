import { NextResponse } from "next/server";
import { clientEmailSendSchema } from "@/features/client-email/schemas";
import { sendClientEmailMessage } from "@/services/client-email-send";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = clientEmailSendSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid send request",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await sendClientEmailMessage(parsed.data);
    return NextResponse.json({
      success: result.ok,
      data: result.message,
      error: result.error,
      message: result.ok ? "Email sent" : "Email failed to send",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    );
  }
}
