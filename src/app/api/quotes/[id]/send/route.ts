import { NextResponse } from "next/server";
import { quoteSendSchema } from "@/features/quotes/schemas";
import { sendManagedCustomerQuote } from "@/services/quotes-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = quoteSendSchema.safeParse(body);

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

  try {
    const result = await sendManagedCustomerQuote(id, parsed.data);
    return NextResponse.json({
      success: result.emailOk,
      data: result.quote,
      error: result.error,
      message: result.emailOk
        ? "Quotation sent"
        : "Quote saved but email failed",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send quote",
      },
      { status: 400 },
    );
  }
}
