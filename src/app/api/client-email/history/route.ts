import { NextResponse } from "next/server";
import { listClientEmailHistory } from "@/services/client-email-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quoteRequestId = searchParams.get("quoteRequestId") ?? undefined;
  const clientEmail = searchParams.get("clientEmail") ?? undefined;

  try {
    const data = await listClientEmailHistory({
      quoteRequestId,
      clientEmail,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to load history",
      },
      { status: 500 },
    );
  }
}
