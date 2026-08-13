import { NextResponse } from "next/server";
import { emailStatusUpdateSchema } from "@/features/email-intelligence/schemas";
import { updateEmailIntelligenceStatus } from "@/services/email-intelligence-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  const body: unknown = await request.json();
  const parsed = emailStatusUpdateSchema.safeParse(body);

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

  const updated = await updateEmailIntelligenceStatus(id, parsed.data.status);

  if (!updated) {
    return NextResponse.json(
      { success: false, error: "Not found or database unavailable" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: updated });
}
