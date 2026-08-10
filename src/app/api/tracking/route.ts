import { NextResponse } from "next/server";
import { trackingSchema } from "@/features/contact/schemas";
import { findTracking } from "@/services/logistics-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = trackingSchema.safeParse({
    trackingId: searchParams.get("id") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid tracking ID" },
      { status: 400 },
    );
  }

  const data = findTracking(parsed.data.trackingId);
  if (!data) {
    return NextResponse.json(
      { success: false, error: "Shipment not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data });
}
