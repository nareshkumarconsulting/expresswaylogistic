# WhatsApp AI Agent & Lead Generator

Use this document when discussing WhatsApp setup with the client. It covers what we need from them (especially the **WhatsApp number**), what the agent can do, timeline, and costs.

---

## Executive summary (for client call)

**Status (Aug 2026):** WhatsApp will be **automated**. Phone number is **in review with Meta**. Website `wa.me` remains until Cloud API goes live.

ExpressWay already has:

- Website quote forms → Command Center
- **Ava** voice agent (quotes, appointments, tracking)
- **Email intelligence** (AI reads inboxes, creates quote drafts)

WhatsApp will be **automated** via Meta WhatsApp Cloud API — phone number is **in review with Meta**. Until approval, the website `wa.me` link still opens chat for human reply.

**Plan:** Connect WhatsApp to the same backend so an AI agent can:

1. Capture shipping quote requests 24/7
2. Answer FAQs (services, routes, customs)
3. Book consultation calls
4. Look up shipment tracking
5. Hand off to sales when needed

All leads land in the **Command Center** alongside email and voice — one place for ops.

**Timeline:** ~1–2 weeks after Meta Business approval (verification often takes 3–7 days).

**Rough cost:** WhatsApp API is low per conversation; main cost is setup + optional BSP fee (see [Costs](#costs-rough)).

---

## What we need from the client — WhatsApp number

This is the most important section for your client conversation.

### Decision 1: Which phone number?

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Use existing sales number** (`+91 98736 93160`) | Customers already know it; one number for calls + WhatsApp | Number must move to WhatsApp Business API; personal WhatsApp on that SIM may need to be removed or migrated | Good if this is already the main sales line |
| **New dedicated WhatsApp number** | Keeps personal WhatsApp separate; clear “AI + sales” line | Extra SIM / virtual number cost; customers learn a new number | Good for clean separation |
| **Virtual number (BSP-provided)** | Fast setup; no physical SIM | Monthly fee; less “local trust” than a known mobile | Good for pilot / testing |

**Questions to ask the client:**

1. Should WhatsApp use the **same number** customers already call (`98736 93160`), or a **new dedicated line**?
2. Is that number currently on **personal WhatsApp** or **WhatsApp Business** app?
3. Who owns the SIM / number legally (company vs individual)?
4. Can the client provide **access to Meta Business Manager** (or create one under company name)?
5. Who will be the **admin** for Meta verification (director / authorized signatory)?

### Decision 2: Meta Business account

Official WhatsApp Business API requires:

- A **Meta Business Account** in the company legal name (Expressway Logistic Private Limited)
- **Business verification** (documents: GST, incorporation, address proof)
- A **WhatsApp Business Account** linked to that Meta Business

**Client action items:**

| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | Meta Business Manager account | Client | [business.facebook.com](https://business.facebook.com) |
| 2 | Business verification documents | Client | GST certificate, company registration, utility bill |
| 3 | Choose WhatsApp phone number | Client | See Decision 1 above |
| 4 | Designate Meta admin contact | Client | Person who can receive verification codes |
| 5 | Approve message templates | Client + us | First outbound messages need Meta approval (1–2 days) |

### Decision 3: Who replies when the bot hands off?

| Scenario | Who handles | How |
|----------|-------------|-----|
| AI completes quote capture | Sales team | Notification + Command Center quote |
| Customer says “talk to human” | Sales / ops | Alert + optional WhatsApp Web for manual reply |
| After hours | AI only, or queue for morning | Client preference |

**Question:** Should handoffs go to **one shared inbox** (sales@…) or **named people** on WhatsApp Web?

---

## Client discussion checklist

Print or share this section in the meeting.

### WhatsApp number & access

- [ ] Confirm phone number to use for WhatsApp Business API
- [ ] Confirm number is not blocked by personal WhatsApp conflicts
- [ ] Confirm company can complete Meta Business verification
- [ ] Identify Meta Business Manager admin (name, email, phone)
- [ ] Confirm who receives lead alerts (email / webhook / Command Center only)

### Business rules

- [ ] Languages: English only, Hindi, or both (Hinglish)?
- [ ] Business hours vs 24/7 bot
- [ ] When should bot stop and transfer to human?
- [ ] Can bot collect documents (invoice, packing list photos) on WhatsApp?
- [ ] Outbound marketing: yes/no (requires customer opt-in + templates)

### Brand & messaging

- [ ] Display name on WhatsApp (e.g. “ExpressWay Logistic”)
- [ ] Welcome message text
- [ ] Profile photo / business description
- [ ] Approved template messages for follow-ups (e.g. “We received your quote request…”)

---

## What the WhatsApp agent can do

### Phase 1 — MVP (lead generator)

| Feature | What the customer experiences | What ops sees |
|---------|--------------------------------|---------------|
| **Quote capture** | Bot asks origin, destination, cargo, service type, contact details | New row in Command Center → Quotes, reference ID (e.g. EW-Q-2026-xxxx) |
| **Intent routing** | “Quote”, “Track”, “Book call”, “Talk to human” | Tagged conversation source: `whatsapp_agent` |
| **FAQ** | Questions about services, PAN India, customs, routes | Answered from same knowledge base as Ava voice agent |
| **Tracking** | Customer sends tracking ID | Status reply (same as website/voice) |
| **Human handoff** | “Connect me to sales” | Email/webhook alert to team |

### Phase 2 — Smarter ops

| Feature | Benefit |
|---------|---------|
| **Free-text RFQ parsing** | Customer sends one long message; AI extracts fields (like email intelligence) |
| **Document upload** | Photos of invoice / packing list attached to quote |
| **Incomplete quote follow-up** | Bot asks for missing destination, weight, etc. |
| **Command Center inbox** | View WhatsApp threads next to email intelligence |

### Phase 3 — Outbound lead gen (optional)

| Feature | Requirement |
|---------|-------------|
| Click-to-WhatsApp ads | Meta ads + WhatsApp number |
| Website “Chat on WhatsApp” with tracking | Already have `wa.me` link; can enhance with UTM |
| Broadcast rate updates / announcements | Customer opt-in + approved templates only |

---

## How it fits with existing systems

```
Customer WhatsApp message
        │
        ▼
   Meta WhatsApp Cloud API  (or BSP: Gupshup / Interakt / Twilio)
        │
        ▼
   ExpressWay app webhook  (/api/whatsapp/webhook — to be built)
        │
        ├── AI intent + field collection
        │
        ▼
   Same backend as voice agent
        ├── submit_quote      → quote_requests (Supabase)
        ├── book_appointment  → appointments
        ├── track_shipment    → tracking lookup
        └── notifyLead        → email + optional n8n webhook
        │
        ▼
   Command Center  (/command-center/quotes, future WhatsApp inbox)
```

**Why this is faster for ExpressWay:** Voice agent logic (`submit_quote`, `book_appointment`, `track_shipment`, site knowledge) already exists. WhatsApp is mainly a new **channel**, not a new product.

---

## Build approach

| Approach | Best for | Integration with Command Center |
|----------|----------|----------------------------------|
| **Next.js webhook + Meta Cloud API** (recommended) | Long-term, full control | Full |
| **n8n + WhatsApp node** | Quick prototype, same pattern as email | Good |
| **SaaS (Wati, Interakt, Gallabox, AiSensy)** | Fastest go-live, less dev | Partial — may need manual export |

**Recommendation:** Next.js webhook for production; optional n8n for broadcasts or multi-number routing later.

---

## Timeline

| Phase | Duration | Depends on |
|-------|----------|------------|
| Client decides number + Meta admin | 1 meeting | Client |
| Meta Business verification | 3–7 business days | Meta |
| Message template approval | 1–2 days | Meta |
| MVP development (webhook + quote flow) | 3–5 dev days | After API access |
| Command Center WhatsApp view (optional) | 2–3 dev days | After MVP |

**Total:** ~1–2 weeks from kickoff to live MVP, assuming Meta approval is not delayed.

---

## Costs (rough)

| Item | Typical cost (India) |
|------|----------------------|
| Meta WhatsApp Cloud API | Free tier ~1,000 **service** conversations/month; then roughly ₹0.50–2 per conversation (varies by category) |
| BSP (if not connecting direct to Meta) | ₹500–3,000/month (Gupshup, Interakt, 360dialog, etc.) |
| New SIM / virtual number (if needed) | ₹100–500/month |
| AI (Groq / Gemini) | Already in stack; marginal extra usage |
| Development | One-time setup (reuse voice + email patterns) |

**Note:** Marketing/broadcast messages have separate pricing and stricter opt-in rules.

---

## Risks & constraints (mention to client)

1. **Meta approval** — Cannot go fully live on API until Business verification completes.
2. **Templates** — First message to a customer after 24h idle window requires a pre-approved template.
3. **Number migration** — Moving an existing WhatsApp number to API may require deleting the app account on that number first (plan with client).
4. **No pricing in bot** — Same policy as voice agent: bot captures RFQ, team sends rates (compliance / accuracy).
5. **Spam / misuse** — Rate limits and optional block list; not a replacement for fraud review on high-value shipments.

---

## Suggested talking points for the client call

1. **“We’re not replacing your sales team — we’re catching leads at 2 AM and on Sundays.”**
2. **“Same data as the website and Ava voice — one Command Center.”**
3. **“We need one decision today: which phone number becomes the official WhatsApp business line.”**
4. **“Meta will ask for company documents — GST and registration — plan for a  week of verification.”**
5. **“Phase 1 is quote capture + FAQs; marketing broadcasts can come in Phase 3 if you want.”**

---

## Next steps after client approval

1. Client creates / grants access to **Meta Business Manager**
2. Client confirms **WhatsApp phone number** choice
3. Complete Meta **Business verification**
4. Register number with **WhatsApp Cloud API** (or chosen BSP)
5. Dev: webhook route + Supabase conversation state + quote flow
6. Submit **message templates** for welcome + quote confirmation
7. Soft launch with internal testing, then update website `wa.me` link to API-backed number
8. (Optional) Command Center panel for WhatsApp conversations

---

## Reference — current site config

From `src/config/site.ts`:

- **WhatsApp (display / wa.me):** `919873693160`
- **Phone:** +91 98736 93160
- **Sales email:** sales@expresswaylogistics.com

The help launcher already opens WhatsApp with: *“Hello ExpressWay Logistic, I need a shipping quote.”* — the AI agent will continue that conversation automatically instead of waiting for manual reply.

---

## Related docs

- [Email Intelligence](./EMAIL_INTELLIGENCE.md) — similar ingest → Command Center pattern
- [Production Setup](./PRODUCTION_SETUP.md) — Vercel + env vars
- [Business Discovery](./BUSINESS_DISCOVERY.md) — broader discovery questions
