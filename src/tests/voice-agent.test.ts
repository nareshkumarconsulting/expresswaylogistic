import { describe, expect, it } from "vitest";
import { runReceptionistTurn } from "@/features/voice-agent/receptionist";
import { buildTypedCallContext } from "@/features/voice-agent/retell-config";
import {
  parseRetellToolCall,
  runRetellTool,
} from "@/features/voice-agent/retell-tools";
import { memoryCreateShipment } from "@/services/shipments-memory";
import { chunkForTts, concatWavBuffers } from "@/features/voice-agent/tts";

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

  it("treats spoken code as a quote request", () => {
    const turn = runReceptionistTurn({ message: "can I get a code" });
    expect(turn.intent).toBe("quote");
    expect(turn.quoteDraft.inProgress).toBe(true);
  });

  it("starts a spoken quote and fills origin to destination", () => {
    const start = runReceptionistTurn({ message: "I need a quote" });
    expect(start.intent).toBe("quote");
    expect(start.quoteDraft.inProgress).toBe(true);
    expect(start.readyToQuote).toBe(false);

    const named = runReceptionistTurn({
      message: "Priya Shah",
      quoteDraft: start.quoteDraft,
    });
    expect(named.quoteDraft.name).toMatch(/Priya/i);

    const lane = runReceptionistTurn({
      message: "from Delhi to Hamburg",
      quoteDraft: {
        inProgress: true,
        name: "Priya Shah",
        company: "Acme",
        email: "priya@acme.com",
        phone: "9873693160",
      },
    });
    expect(lane.quoteDraft.origin).toMatch(/Delhi/i);
    expect(lane.quoteDraft.destination).toMatch(/Hamburg/i);
  });

  it("submits a complete voice quote draft", () => {
    const turn = runReceptionistTurn({
      message: "leather garments about 200 kg",
      quoteDraft: {
        inProgress: true,
        name: "Priya Shah",
        company: "Acme",
        email: "priya@acme.com",
        phone: "9873693160",
        origin: "Delhi",
        destination: "Hamburg",
        serviceType: "air",
      },
    });
    expect(turn.readyToQuote).toBe(true);
    expect(turn.quoteDraft.cargo).toMatch(/leather/i);
    expect(turn.quoteDraft.approxWeight).toMatch(/200/i);
  });

  it("looks up a tracking id like EW-10846", () => {
    const turn = runReceptionistTurn({
      message: "track EW-10846",
    });
    expect(turn.intent).toBe("tracking");
    expect(turn.lookupTrackingId).toBe("EW-10846");
  });

  it("keeps booking when the user speaks an email with at the rate", () => {
    const turn = runReceptionistTurn({
      message: "it's Naresh Kumar Consulting at the rate gmail.com",
      bookingDraft: {
        inProgress: true,
        locale: "hi",
        name: "Naresh Sharma",
        company: "Kumar consulting",
      },
    });
    expect(turn.intent).toBe("appointment");
    expect(turn.bookingDraft.email).toBe("nareshkumarconsulting@gmail.com");
    expect(turn.quoteDraft.inProgress).not.toBe(true);
    expect(turn.reply.toLowerCase()).toMatch(/phone|number/);
  });

  it("hears Hindi names like pura naam hai", () => {
    const turn = runReceptionistTurn({
      message: "pura naam hai Naresh Kumar Kanchan",
      bookingDraft: { inProgress: true, locale: "hi" },
    });
    expect(turn.intent).toBe("appointment");
    expect(turn.bookingDraft.name).toMatch(/Naresh Kumar Kanchan/i);
  });

  it("stays on appointment for hello yes", () => {
    const turn = runReceptionistTurn({
      message: "hello yes",
      bookingDraft: {
        inProgress: true,
        name: "Naresh Sharma",
        company: "Kumar consulting",
        email: "nareshkumarconsulting@gmail.com",
      },
    });
    expect(turn.intent).toBe("appointment");
    expect(turn.bookingDraft.name).toBe("Naresh Sharma");
    expect(turn.reply.toLowerCase()).toMatch(/phone/);
  });
});

describe("Retell web tools", () => {
  it("parses wrapped and args-only tool bodies", () => {
    expect(
      parseRetellToolCall({
        name: "track_shipment",
        args: { trackingId: "EW-10846" },
      }),
    ).toEqual({
      name: "track_shipment",
      args: { trackingId: "EW-10846" },
    });
    expect(
      parseRetellToolCall({ trackingId: "EW-10846" }, "track_shipment"),
    ).toEqual({
      name: "track_shipment",
      args: { trackingId: "EW-10846" },
    });
    expect(
      parseRetellToolCall({
        name: "book_appointment",
        args: JSON.stringify({
          name: "Naresh Kumar",
          preferredTime: "10 AM",
        }),
      }),
    ).toEqual({
      name: "book_appointment",
      args: { name: "Naresh Kumar", preferredTime: "10 AM" },
    });
  });

  it("normalizes spoken booking fields", async () => {
    const { normalizeVoiceBookingArgs } = await import(
      "@/features/voice-agent/booking-normalize"
    );
    const normalized = normalizeVoiceBookingArgs({
      appointment_type: "Freight Planning",
      preferred_date: "August 17 2026",
      preferred_time: "3 pm",
      meeting_mode: "in person",
      phone: "(98736) 93160",
      email: "Naresh@Example.com",
    });
    expect(normalized.appointmentType).toBe("freight-planning");
    expect(normalized.preferredDate).toBe("2026-08-17");
    expect(normalized.preferredTime).toBe("15:00");
    expect(normalized.meetingMode).toBe("in-person");
    expect(normalized.phone).toBe("98736 93160");
    expect(normalized.email).toBe("naresh@example.com");
  });

  it("marks typed messages as the accurate user wording", () => {
    expect(buildTypedCallContext("naresh@gmail.com")).toMatch(
      /prefer it over any misheard speech: naresh@gmail.com/,
    );
  });

  it("looks up tracking without inventing a status", async () => {
    const row = memoryCreateShipment({
      clientCompany: "Acme Corp",
      contactName: "Test User",
      contactEmail: "test@example.com",
      bookingBasis: "email_ok",
      origin: "Mumbai",
      destination: "Dubai",
      freightMode: "Air Freight",
      cargoReadyDate: "2026-08-22",
      productType: "other",
      approxWeight: "100 kg",
    });

    const found = await runRetellTool("track_shipment", {
      trackingId: row.id,
    });
    expect(found.ok).toBe(true);
    expect(String(found.spoken)).toMatch(new RegExp(row.id, "i"));

    const missing = await runRetellTool("track_shipment", {
      trackingId: "EW-00000",
    });
    expect(missing.ok).toBe(false);
  });
});

describe("voice TTS helpers", () => {
  it("splits long speech into Groq-sized chunks", () => {
    const long = "Air freight is fast. ".repeat(20);
    const chunks = chunkForTts(long, 200);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 200)).toBe(true);
    expect(chunks.join(" ")).toContain("Air freight is fast.");
  });

  it("concatenates matching wav clips", () => {
    const a = tinyWav(new Uint8Array([1, 2, 3, 4]));
    const b = tinyWav(new Uint8Array([5, 6, 7, 8]));
    const merged = concatWavBuffers([a, b]);
    expect(merged.byteLength).toBeGreaterThan(44);
    expect(new Uint8Array(merged).slice(-8)).toEqual(
      new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
    );
  });

  it("rewrites Groq streaming wav so browsers can play it", () => {
    const pcm = new Uint8Array([9, 8, 7, 6]);
    const streaming = groqStreamingWav(pcm);
    const view = new DataView(streaming);
    expect(view.getUint32(4, true)).toBe(0xffffffff);
    expect(view.getUint32(40, true)).toBe(0xffffffff);

    const fixed = concatWavBuffers([streaming]);
    const fixedView = new DataView(fixed);
    expect(fixedView.getUint32(4, true)).toBe(36 + pcm.byteLength);
    expect(fixedView.getUint32(40, true)).toBe(pcm.byteLength);
    expect(new Uint8Array(fixed).slice(-4)).toEqual(pcm);
  });
});

function tinyWav(pcm: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + pcm.byteLength);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 16000, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  write(36, "data");
  view.setUint32(40, pcm.byteLength, true);
  bytes.set(pcm, 44);
  return buffer;
}

function groqStreamingWav(pcm: Uint8Array): ArrayBuffer {
  const buffer = tinyWav(pcm);
  const view = new DataView(buffer);
  view.setUint32(4, 0xffffffff, true);
  view.setUint32(40, 0xffffffff, true);
  return buffer;
}
