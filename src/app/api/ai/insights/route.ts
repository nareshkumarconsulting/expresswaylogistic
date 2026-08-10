import { NextResponse } from "next/server";
import { aiQuerySchema } from "@/features/contact/schemas";
import { MOCK_AI_INSIGHTS, MOCK_SHIPMENTS } from "@/services/logistics-data";
import { logger } from "@/lib/logger";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_AI_INSIGHTS,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = aiQuerySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query" },
        { status: 400 },
      );
    }

    const q = parsed.data.query.toLowerCase();
    const matches = MOCK_SHIPMENTS.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.client.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q),
    );

    const answer =
      matches.length > 0
        ? `Found ${matches.length} shipment(s) matching your query. Highest risk: ${
            [...matches].sort(
              (a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0),
            )[0]?.id
          }.`
        : "No direct shipment matches. Review AI insights for lane-level risks and consolidation opportunities.";

    logger.info("ai.query", { query: parsed.data.query, matches: matches.length });

    return NextResponse.json({
      success: true,
      data: {
        answer,
        matches,
        insights: MOCK_AI_INSIGHTS.slice(0, 2),
      },
    });
  } catch (error) {
    logger.error("ai.query.failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { success: false, error: "AI query failed" },
      { status: 500 },
    );
  }
}
