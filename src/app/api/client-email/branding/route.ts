import { NextResponse } from "next/server";
import { emailBrandingUpdateSchema } from "@/features/client-email/schemas";
import {
  getEmailBranding,
  saveEmailBranding,
} from "@/services/client-email-repository";

export async function GET() {
  try {
    const data = await getEmailBranding();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to load branding",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = emailBrandingUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid branding payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const data = await saveEmailBranding(parsed.data);
    return NextResponse.json({
      success: true,
      data,
      message: "Branding saved",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to save branding",
      },
      { status: 500 },
    );
  }
}
