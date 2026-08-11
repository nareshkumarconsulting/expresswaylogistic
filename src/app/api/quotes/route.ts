import { NextResponse } from "next/server";
import { listQuoteRequests } from "@/services/leads-repository";
import { MOCK_QUOTE_REQUESTS } from "@/services/logistics-data";

export async function GET() {
  const persisted = await listQuoteRequests();
  const data =
    persisted ??
    [...MOCK_QUOTE_REQUESTS].sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );

  return NextResponse.json({
    success: true,
    data,
  });
}
