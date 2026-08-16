import { NextResponse } from "next/server";
import { forwarderPatchSchema } from "@/features/quotes/schemas";
import {
  deleteForwarder,
  ForwarderInUseError,
  updateForwarder,
} from "@/services/forwarders-repository";

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

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const result = await deleteForwarder(id);
    if (result === "not_found") {
      return NextResponse.json(
        { success: false, error: "Forwarder not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ForwarderInUseError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete forwarder",
      },
      { status: 500 },
    );
  }
}
