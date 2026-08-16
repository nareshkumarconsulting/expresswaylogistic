import { afterEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "@/lib/send-email";

describe("sendEmail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
    delete process.env.QUOTE_EMAIL_FROM;
  });

  it("fails when API key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendEmail({
      to: "a@b.com",
      subject: "Hi",
      html: "<p>Hi</p>",
      text: "Hi",
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok when Resend succeeds", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.QUOTE_EMAIL_FROM = "ExpressWay <quotes@example.com>";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ id: "msg_1" }), { status: 200 }),
      ),
    );

    const result = await sendEmail({
      to: "customer@example.com",
      subject: "Quote",
      html: "<p>Quote</p>",
      text: "Quote",
    });

    expect(result.ok).toBe(true);
    expect(result.id).toBe("msg_1");
  });
});
