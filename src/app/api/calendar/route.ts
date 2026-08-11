import { NextResponse } from "next/server";
import { listAppointments } from "@/services/leads-repository";

export async function GET() {
  const persisted = await listAppointments();
  const events = (persisted ?? []).sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  });

  return NextResponse.json({
    success: true,
    data: events,
  });
}
