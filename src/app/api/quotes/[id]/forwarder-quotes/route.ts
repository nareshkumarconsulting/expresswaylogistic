import { NextResponse } from "next/server";
import { recordForwarderQuoteSchema } from "@/features/quotes/schemas";
import { recordForwarderQuote } from "@/services/quotes-forwarder-flow";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json();
  const parsed = recordForwarderQuoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid forwarder quote",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const quote = await recordForwarderQuote({
      quoteId: id,
      ...parsed.data,
    });
    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to record forwarder quote",
      },
      { status: 400 },
    );
  }
}
