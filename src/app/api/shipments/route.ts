import { NextResponse } from "next/server";
import { MOCK_SHIPMENTS } from "@/services/logistics-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_SHIPMENTS,
  });
}
