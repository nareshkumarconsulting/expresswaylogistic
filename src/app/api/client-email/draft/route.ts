import { NextResponse } from "next/server";
import { clientEmailDraftSchema } from "@/features/client-email/schemas";
import { draftClientEmail } from "@/services/client-email-draft";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = clientEmailDraftSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid draft request",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const draft = await draftClientEmail(parsed.data);
    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to draft email",
      },
      { status: 500 },
    );
  }
}
