import { NextResponse } from "next/server";
import { updateShipmentSchema } from "@/features/shipments/schemas";
import {
  getShipmentById,
  updateShipment,
} from "@/services/shipments-repository";

type RouteContext = { params: Promise<{ id: string[] }> };

function shipmentIdFromParams(id: string[]): string {
  return id.map((segment) => decodeURIComponent(segment)).join("/");
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const shipmentId = shipmentIdFromParams(id);
  try {
    const shipment = await getShipmentById(shipmentId);
    if (!shipment) {
      return NextResponse.json(
        { success: false, error: "Shipment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: shipment });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to load shipment",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const shipmentId = shipmentIdFromParams(id);
  const body: unknown = await request.json();
  const parsed = updateShipmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const updated = await updateShipment(shipmentId, parsed.data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Shipment not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update shipment",
      },
      { status: 500 },
    );
  }
}
