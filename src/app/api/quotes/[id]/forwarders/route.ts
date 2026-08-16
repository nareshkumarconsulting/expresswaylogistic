import { NextResponse } from "next/server";
import { sendToForwardersSchema } from "@/features/quotes/schemas";
import { sendQuoteToForwarders } from "@/services/quotes-forwarder-flow";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json();
  const parsed = sendToForwardersSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Select at least one forwarder",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const quote = await sendQuoteToForwarders({
      quoteId: id,
      forwarderIds: parsed.data.forwarderIds,
      responseDeadline: parsed.data.responseDeadline,
      actor: parsed.data.actor,
    });
    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send to forwarders",
      },
      { status: 400 },
    );
  }
}
