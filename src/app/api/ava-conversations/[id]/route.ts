import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AvaConversationStoreError,
  getAvaConversation,
} from "@/services/ava-conversations-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json(
      { success: false, error: "Conversation not found" },
      { status: 404 },
    );
  }

  try {
    const data = await getAvaConversation(id);
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const missing =
      error instanceof AvaConversationStoreError && error.missingTable;
    return NextResponse.json(
      {
        success: false,
        error: missing
          ? "Run the latest database migration to start saving Ava conversations."
          : "Could not load this conversation",
      },
      { status: missing ? 503 : 500 },
    );
  }
}
