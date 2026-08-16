import { NextResponse } from "next/server";
import { forwarderPatchSchema } from "@/features/quotes/schemas";
import { updateForwarder } from "@/services/forwarders-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json();
  const parsed = forwarderPatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid forwarder",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = await updateForwarder(id, parsed.data);
  if (!data) {
    return NextResponse.json(
      { success: false, error: "Forwarder not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data });
}
