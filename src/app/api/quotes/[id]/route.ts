import { NextResponse } from "next/server";
import { quoteUpdateSchema } from "@/features/quotes/schemas";
import {
  getManagedQuote,
  updateManagedQuote,
} from "@/services/quotes-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const quote = await getManagedQuote(id);
  if (!quote) {
    return NextResponse.json(
      { success: false, error: "Quote not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true, data: quote });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json();
  const parsed = quoteUpdateSchema.safeParse(body);

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

  const updated = await updateManagedQuote(id, parsed.data);
  if (!updated) {
    return NextResponse.json(
      { success: false, error: "Quote not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: updated });
}
