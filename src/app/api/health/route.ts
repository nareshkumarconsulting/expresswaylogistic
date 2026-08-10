import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      status: "ok",
      service: "expressway-logistic",
      timestamp: new Date().toISOString(),
    },
  });
}
