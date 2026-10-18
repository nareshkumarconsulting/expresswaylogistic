import { NextResponse } from "next/server";
import {
  AvaConversationStoreError,
  listAvaConversations,
} from "@/services/ava-conversations-repository";

export async function GET() {
  try {
    const data = await listAvaConversations();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const missing =
      error instanceof AvaConversationStoreError && error.missingTable;
    return NextResponse.json(
      {
        success: false,
        error: missing
          ? "Run the latest database migration to start saving Ava conversations."
          : "Could not load Ava conversations",
      },
      { status: missing ? 503 : 500 },
    );
  }
}
