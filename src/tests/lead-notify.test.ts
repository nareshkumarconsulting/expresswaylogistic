import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { notifyLead } from "@/lib/lead-notify";

describe("notifyLead", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 200 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.RESEND_API_KEY;
    delete process.env.LEAD_NOTIFY_EMAIL;
    global.fetch = originalFetch;
  });

  it("posts to webhook when configured", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/lead";

    const result = await notifyLead({
      type: "quote_request",
      subject: "Test quote",
      summaryLines: ["Company: Acme"],
      payload: { company: "Acme" },
      referenceId: "QW-1",
    });

    expect(result.webhookOk).toBe(true);
    expect(result.emailOk).toBe(false);
    expect(result.delivered).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to Resend email when webhook fails", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/lead";
    process.env.RESEND_API_KEY = "re_test";
    process.env.LEAD_NOTIFY_EMAIL = "sales@expresswaylogistics.com";

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("fail", { status: 500 }))
        .mockResolvedValueOnce(new Response(null, { status: 200 })),
    );

    const result = await notifyLead({
      type: "appointment_request",
      subject: "Test appointment",
      summaryLines: ["Company: Acme"],
      payload: { company: "Acme" },
    });

    expect(result.webhookOk).toBe(false);
    expect(result.emailOk).toBe(true);
    expect(result.delivered).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
