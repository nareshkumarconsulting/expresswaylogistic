import { NextResponse } from "next/server";
import { MOCK_CALENDAR_EVENTS } from "@/services/logistics-data";

export async function GET() {
  const events = [...MOCK_CALENDAR_EVENTS].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  });

  return NextResponse.json({
    success: true,
    data: events,
  });
}
