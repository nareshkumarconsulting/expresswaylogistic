import { NextResponse } from "next/server";
import { createShipmentSchema } from "@/features/shipments/schemas";
import {
  createShipment,
  listShipments,
} from "@/services/shipments-repository";

export async function GET() {
  try {
    const data = await listShipments();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to load shipments",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createShipmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid shipment",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const data = await createShipment(parsed.data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create shipment",
      },
      { status: 500 },
    );
  }
}
