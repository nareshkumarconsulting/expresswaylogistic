import { describe, expect, it } from "vitest";
import { runReceptionistTurn } from "@/features/voice-agent/receptionist";

describe("voice receptionist", () => {
  it("detects greeting and services intents", () => {
    expect(runReceptionistTurn({ message: "hello" }).intent).toBe("greeting");
    expect(
      runReceptionistTurn({ message: "what services do you offer?" }).intent,
    ).toBe("services");
    expect(
      runReceptionistTurn({ message: "I want to track my shipment" }).intent,
    ).toBe("tracking");
  });

  it("answers services with a spoken reply", () => {
    const turn = runReceptionistTurn({ message: "Tell me about your services" });
    expect(turn.intent).toBe("services");
    expect(turn.reply.toLowerCase()).toContain("air freight");
    expect(turn.action.type).toBe("navigate");
  });

  it("parses natural spoken dates like August 12", () => {
    const draft = {
      inProgress: true,
      name: "Priya",
      company: "Acme",
      email: "priya@acme.com",
      phone: "+919873693160",
      appointmentType: "freight-planning" as const,
    };
    const turn = runReceptionistTurn({
      message: "August 12",
      bookingDraft: draft,
    });
    expect(turn.bookingDraft.preferredDate).toMatch(/^20\d{2}-08-12$/);
    expect(turn.reply.toLowerCase()).toContain("time");
  });
});
