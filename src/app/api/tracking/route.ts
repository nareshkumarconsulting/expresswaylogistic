import { NextResponse } from "next/server";
import { trackingSchema } from "@/features/contact/schemas";
import { findTrackingById } from "@/services/tracking-repository";

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

  const data = await findTrackingById(parsed.data.trackingId);
  if (!data) {
    return NextResponse.json(
      { success: false, error: "Shipment not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data });
}
