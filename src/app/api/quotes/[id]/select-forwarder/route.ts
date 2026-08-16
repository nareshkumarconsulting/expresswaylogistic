import { NextResponse } from "next/server";
import { selectForwarderQuoteSchema } from "@/features/quotes/schemas";
import { selectForwarderQuote } from "@/services/quotes-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json();
  const parsed = selectForwarderQuoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid selection",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const quote = await selectForwarderQuote({
      quoteId: id,
      ...parsed.data,
    });
    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to select quote",
      },
      { status: 400 },
    );
  }
}
