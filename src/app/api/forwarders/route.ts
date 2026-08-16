import { NextResponse } from "next/server";
import { forwarderUpsertSchema } from "@/features/quotes/schemas";
import {
  createForwarder,
  listForwarders,
} from "@/services/forwarders-repository";

export async function GET() {
  try {
    const data = await listForwarders();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to load forwarders",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = forwarderUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid forwarder",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = await createForwarder(parsed.data);
  return NextResponse.json({ success: true, data });
}
