# ExpressWay Logistic — Business Discovery Worksheet

Use this document during your office visit to capture real business rules for the website and Command Center dashboard. Check boxes as you confirm items, fill in blanks, and note gaps.

**Visit date:** _______________  
**Attendees:** _______________  
**Interviewer:** _______________

---

## How to use this doc

1. Start with **Section 1** (30-minute opener) — everything else depends on it.
2. Walk through **Section 2** (quote-to-delivery) with a real example if possible.
3. Fill in **Section 8** (Business Rules Template) as you go — this maps directly to app code.
4. Request artifacts listed in **Section 7** before you leave.

**Current app assumptions to validate:** mock data in `src/services/logistics-data.ts`, quote/appointment forms, shipment statuses in `src/types/index.ts`, webhook-ready APIs in `src/app/api/*`.

---

## Section 1 — Opener (validate first)

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 1.1 | Who is the primary customer? (B2B shipper, importer/exporter, SME, e-commerce, enterprise) | | ☐ |
| 1.2 | What does ExpressWay do in-house vs. through partners? (trucking, warehouse, forwarding, customs) | | ☐ |
| 1.3 | #1 goal of the website? (leads, quotes, bookings, brand, self-service tracking) | | ☐ |
| 1.4 | Who uses the internal dashboard? (sales, ops, customs, warehouse, management) | | ☐ |
| 1.5 | What systems exist today? (Excel, WhatsApp, TMS, ERP, email) — where is source of truth? | | ☐ |
| 1.6 | Top 5 trade lanes (e.g. Mumbai → Dubai) | | ☐ |
| 1.7 | Core revenue services vs. add-ons | | ☐ |
| 1.8 | Real stats safe to publish? (years, countries, on-time %, shipment volume) | | ☐ |
| 1.9 | Office locations, hours, languages | | ☐ |
| 1.10 | Certifications / memberships (IATA, FIATA, GST, etc.) | | ☐ |

**Differentiators (what makes ExpressWay different from DHL / FedEx / local forwarders):**

```
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
```

---

## Section 2 — Quote-to-delivery walkthrough

> Ask: *"Walk me through your last won deal from first inquiry to delivery."*

### 2.1 Lead & quote intake

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 2.1.1 | How do clients usually first contact you? (phone, WhatsApp, email, walk-in, referral) | | ☐ |
| 2.1.2 | Who receives new quote requests? | | ☐ |
| 2.1.3 | Target response time (SLA) for new quotes | | ☐ |
| 2.1.4 | Minimum info required before you can price | | ☐ |
| 2.1.5 | Quote approval chain (single person vs. manager sign-off) | | ☐ |
| 2.1.6 | How are quotes priced? (rate cards, carrier APIs, manual) | | ☐ |
| 2.1.7 | Quote validity period (days) | | ☐ |
| 2.1.8 | What triggers quote status changes? (see Section 8.2) | | ☐ |
| 2.1.9 | Do you track lost-quote reasons? | | ☐ |
| 2.1.10 | Handoff from sales to ops when quote is won | | ☐ |

**Required cargo / quote fields (check all that apply):**

| Field | Required? | Notes |
|-------|-----------|-------|
| Origin (city / full address) | ☐ Yes ☐ No | |
| Destination (city / full address) | ☐ Yes ☐ No | |
| Weight | ☐ Yes ☐ No | |
| Dimensions / volume (CBM) | ☐ Yes ☐ No | |
| Commodity description | ☐ Yes ☐ No | |
| HS code | ☐ Yes ☐ No | |
| Incoterms (EXW, FOB, CIF, DDP, etc.) | ☐ Yes ☐ No | |
| Hazardous / refrigerated / high-value | ☐ Yes ☐ No | |
| Preferred mode (air / ocean FCL / LCL / road) | ☐ Yes ☐ No | |
| Urgency / required delivery date | ☐ Yes ☐ No | |
| Insurance needed | ☐ Yes ☐ No | |
| Other: _______________ | ☐ Yes ☐ No | |

**Service types offered (validate against app):**

| Service | Offered? | Revenue priority (H/M/L) | Notes |
|---------|----------|--------------------------|-------|
| Air freight | ☐ | | |
| Ocean FCL | ☐ | | |
| Ocean LCL | ☐ | | |
| Road transport | ☐ | | |
| Customs clearance (import) | ☐ | | |
| Customs clearance (export) | ☐ | | |
| Warehousing | ☐ | | |
| Import/export consulting | ☐ | | |
| Other: _______________ | ☐ | | |

### 2.2 Booking & shipment creation

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 2.2.1 | What converts a quote to a live shipment? (PO, payment, email OK) | | ☐ |
| 2.2.2 | Shipment / job ID format (e.g. `EW-10847`) | | ☐ |
| 2.2.3 | Link between quote ID, shipment ID, client account | | ☐ |
| 2.2.4 | Documents created at booking (AWB, BL, packing list, etc.) | | ☐ |
| 2.2.5 | Who creates the shipment record and in which system? | | ☐ |

### 2.3 Execution & tracking

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 2.3.1 | Full list of shipment statuses (see Section 8.3) | | ☐ |
| 2.3.2 | Who updates status and how often? | | ☐ |
| 2.3.3 | Tracking ID — yours vs. carrier AWB/BL number | | ☐ |
| 2.3.4 | Tracking data source (manual, TMS, carrier API) | | ☐ |
| 2.3.5 | Client-visible events on timeline (pickup, departed, customs, delivered) | | ☐ |
| 2.3.6 | How ETA is calculated and communicated | | ☐ |
| 2.3.7 | Delay / exception reasons (weather, customs, docs, carrier) | | ☐ |
| 2.3.8 | What should **never** be shown on public tracking? | | ☐ |

### 2.4 Delivery & billing

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 2.4.1 | Proof of delivery (POD) process | | ☐ |
| 2.4.2 | Invoice timing (before / after / on delivery) | | ☐ |
| 2.4.3 | Charge components (freight, fuel, handling, customs, storage) | | ☐ |
| 2.4.4 | Currencies used (INR, USD, multi) | | ☐ |
| 2.4.5 | Payment terms (prepaid, credit, COD) | | ☐ |

---

## Section 3 — Command Center (internal dashboard)

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 3.1 | Daily ops checklist — what does each role open first? | | ☐ |
| 3.2 | KPIs management watches (on-time %, revenue, quote conversion, etc.) | | ☐ |
| 3.3 | What makes a shipment "at risk"? | | ☐ |
| 3.4 | Calendar: appointments vs. vessel/flight ETAs — same or separate? | | ☐ |
| 3.5 | Internal notes on quotes/shipments — who can see them? | | ☐ |
| 3.6 | Need task assignment (owner + due date) or lists only? | | ☐ |
| 3.7 | If only one dashboard view in phase 1, which one? | | ☐ |
| 3.8 | What do you still do in Excel that hurts? | | ☐ |

**Internal roles & permissions:**

| Role | Can view quotes | Can edit quotes | Can view all shipments | Can update shipment status | Can see financials |
|------|-----------------|-----------------|------------------------|----------------------------|--------------------|
| Sales | ☐ | ☐ | ☐ | ☐ | ☐ |
| Operations | ☐ | ☐ | ☐ | ☐ | ☐ |
| Customs team | ☐ | ☐ | ☐ | ☐ | ☐ |
| Warehouse | ☐ | ☐ | ☐ | ☐ | ☐ |
| Management | ☐ | ☐ | ☐ | ☐ | ☐ |
| Other: _______ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## Section 4 — Appointments

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 4.1 | Who handles each meeting type? | | ☐ |
| 4.2 | Real durations + buffer between meetings | | ☐ |
| 4.3 | Available days/hours (app assumes Mon–Fri, 9–5 IST) | | ☐ |
| 4.4 | In-person location confirmed? (Knowledge Park II, Greater Noida) | | ☐ |
| 4.5 | Confirmation / cancel / reschedule process | | ☐ |
| 4.6 | Calendar sync needed? (Google, Outlook) | | ☐ |
| 4.7 | Auto-confirm vs. manual approval for bookings | | ☐ |

**Meeting types (validate against app):**

| Type | Offered? | Owner | Duration | Format |
|------|----------|-------|----------|--------|
| Freight planning | ☐ | | | |
| Customs advisory | ☐ | | | |
| Warehouse visit | ☐ | | | |
| Account onboarding | ☐ | | | |
| Other: _______________ | ☐ | | | |

---

## Section 5 — Customs & compliance

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 5.1 | Import vs. export — which is larger? | | ☐ |
| 5.2 | Document checklist by lane / commodity | | ☐ |
| 5.3 | Top customs hold causes | | ☐ |
| 5.4 | CHA / broker — in-house or third party? | | ☐ |
| 5.5 | Restricted goods you will not handle | | ☐ |
| 5.6 | Typical clearance timeline by lane | | ☐ |

---

## Section 6 — Warehousing (if applicable)

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 6.1 | Storage types (ambient, cold, bonded) | | ☐ |
| 6.2 | Inbound / outbound process | | ☐ |
| 6.3 | Client inventory visibility needed? | | ☐ |
| 6.4 | Billing model (per pallet, CBM, day) | | ☐ |
| 6.5 | Facility address(es) for tours | | ☐ |

---

## Section 7 — Artifacts to collect

Request samples (photos or copies OK):

| Artifact | Received? | Notes |
|----------|-----------|-------|
| Sample quote sent to client | ☐ | |
| Sample invoice | ☐ | |
| Bill of Lading / AWB / packing list | ☐ | |
| Customs document checklist | ☐ | |
| WhatsApp / email thread for one shipment | ☐ | |
| Excel or TMS screenshot of active shipments | ☐ | |
| Org chart (who handles what) | ☐ | |
| Top 10 trade lanes list | ☐ | |
| Brand assets (logo, colors, fonts) | ☐ | |
| Existing website / social links | ☐ | |

---

## Section 8 — Business Rules Template

Fill this in during the visit. These fields map to app types in `src/types/index.ts` and API routes in `src/app/api/*`.

### 8.1 Entities

| Entity | ID format | Owner system | Notes |
|--------|-----------|--------------|-------|
| Client / Company | | | |
| Contact person | | | |
| Quote request | | | |
| Shipment / Job | | | |
| Tracking event | | | |
| Appointment | | | |
| Invoice | | | |

### 8.2 Quote status machine

**Current app statuses:** `New` → `In Review` → `Quoted` → `Won` → `Closed`

| Status | Meaning | Who sets it | Next allowed statuses | Client notified? |
|--------|---------|-------------|----------------------|------------------|
| New | | | | ☐ |
| In Review | | | | ☐ |
| Quoted | | | | ☐ |
| Won | | | | ☐ |
| Closed | | | | ☐ |
| Other: _______ | | | | ☐ |

**Lost / closed reasons:**

```
_______________________________________________________________________________
```

### 8.3 Shipment status machine

**Current app statuses:** `Processing`, `In Transit`, `Customs Hold`, `Delivered`, `Delayed`

| Status | Meaning | Who sets it | Client-visible label | Next allowed statuses |
|--------|---------|-------------|----------------------|----------------------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |

**Draft lifecycle (confirm or replace):**

```
[ ] Draft → Booked → Picked Up → In Transit → At Customs → Cleared → Out for Delivery → Delivered
                              ↘ On Hold / Delayed / Cancelled
```

### 8.4 Tracking event schema

Each event on the public timeline:

| Field | Example | Required? |
|-------|---------|-----------|
| Timestamp | 2026-08-10 14:30 IST | ☐ |
| Location | Mumbai Airport | ☐ |
| Description | Departed on flight AI-123 | ☐ |
| Internal only flag | true/false | ☐ |

### 8.5 Exception & risk rules

| Condition | Severity | Who notified | Action |
|-----------|----------|--------------|--------|
| Customs hold > ___ hours | | | |
| ETA slip > ___ hours | | | |
| Missing documents | | | |
| Other: _______________ | | | |

### 8.6 Notification rules

| Trigger | Channel (email / SMS / WhatsApp) | Recipient | Template exists? |
|---------|----------------------------------|-----------|------------------|
| New quote submitted | | | ☐ |
| Quote sent to client | | | ☐ |
| Shipment status change | | | ☐ |
| Appointment booked | | | ☐ |
| Delay / exception | | | ☐ |

### 8.7 Appointment rules

| Rule | Value |
|------|-------|
| Timezone | IST (confirm) |
| Available days | Mon–Fri (confirm) |
| Slot times | 09:00–17:00 (confirm) |
| Min notice for booking | |
| Cancel/reschedule notice | 24 hours (confirm) |
| Max appointments per day | |
| Blackout dates | |

### 8.8 Client portal scope (future)

| Feature | Phase 1? | Phase 2? | Notes |
|---------|----------|----------|-------|
| Public tracking (no login) | ☐ | ☐ | |
| Client login | ☐ | ☐ | |
| View own shipments only | ☐ | ☐ | |
| Request quotes | ☐ | ☐ | |
| Book appointments | ☐ | ☐ | |
| Download documents | ☐ | ☐ | |
| View invoices | ☐ | ☐ | |

---

## Section 9 — Integrations & go-live

| # | Question | Answer / Notes | ✓ |
|---|----------|----------------|---|
| 9.1 | TMS / WMS / ERP name(s) | | ☐ |
| 9.2 | Carrier tracking feed availability | | ☐ |
| 9.3 | CRM for leads (HubSpot, Zoho, etc.) | | ☐ |
| 9.4 | Where should form submissions go? (email, Slack, webhook URL) | | ☐ |
| 9.5 | Email sender domain for notifications | | ☐ |
| 9.6 | Phase 1 launch scope (website only vs. dashboard vs. both) | | ☐ |
| 9.7 | Must-have vs. nice-to-have for launch | | ☐ |

**Integration map:**

```
Website forms ──→ _______________ ──→ _______________
Dashboard data ──→ _______________ (replace mock data)
Tracking ──→ _______________
Notifications ──→ _______________
```

---

## Section 10 — Website content validation

| Content area | Current source | Accurate? | Changes needed |
|--------------|----------------|-----------|----------------|
| Company name & tagline | `src/config/site.ts` | ☐ | |
| Address & phone | `src/config/site.ts` | ☐ | |
| Services list | `src/constants/services.ts` | ☐ | |
| Industries served | `src/constants/content.ts` | ☐ | |
| Process steps (quote → delivery) | `src/constants/content.ts` | ☐ | |
| Stats / trust badges | `src/constants/content.ts` | ☐ | |
| FAQs | `src/constants/content.ts` | ☐ | |
| Social links | `src/config/site.ts` | ☐ | |

---

## Section 11 — Suggested visit agenda

| Time | Topic | Section |
|------|-------|---------|
| 0:00–0:15 | Company story, services, differentiators | 1 |
| 0:15–0:45 | Quote-to-cash walkthrough (live example) | 2 |
| 0:45–1:15 | Shipment tracking — statuses, IDs, client comms | 2.3, 8.3 |
| 1:15–1:35 | Command Center — roles, daily workflow, KPIs | 3 |
| 1:35–1:50 | Appointments, leads, notifications | 4, 8.6 |
| 1:50–2:00 | Integrations, artifacts, go-live priorities | 7, 9 |

---

## Section 12 — Power questions

Use these if conversation stalls:

- [ ] "Can we walk through your **last won deal** from first inquiry to delivery?"
- [ ] "What's the **most expensive mistake** in ops — wrong docs, wrong mode, wrong ETA?"
- [ ] "What do clients ask on the phone that the website should answer?"
- [ ] "If we only build **one dashboard view** in phase 1, which one?"
- [ ] "What should **never** be shown to clients on tracking?"
- [ ] "Show me the last 3 real quote requests — what did the client send vs. what you needed?"

---

## Section 13 — Post-visit action items

| # | Action | Owner | Due | Done |
|---|--------|-------|-----|------|
| 1 | Update `src/types/index.ts` with confirmed statuses & fields | | | ☐ |
| 2 | Update quote / appointment schemas with required fields | | | ☐ |
| 3 | Replace mock data with real sample structure | | | ☐ |
| 4 | Update website content constants | | | ☐ |
| 5 | Define phase 1 scope document | | | ☐ |
| 6 | Wire webhook / CRM integration | | | ☐ |
| 7 | | | | ☐ |
| 8 | | | | ☐ |

---

## Appendix — App ↔ business mapping

| Business concept | Code location |
|------------------|---------------|
| Quote form fields | `src/features/contact/schemas.ts` |
| Appointment form fields | `src/features/appointment/schemas.ts` |
| Quote / shipment / appointment types | `src/types/index.ts` |
| Mock operational data | `src/services/logistics-data.ts` |
| Public quote API | `POST /api/contact` |
| Public appointment API | `POST /api/appointment` |
| Public tracking API | `GET /api/tracking?id=` |
| Dashboard shipments | `GET /api/shipments` |
| Dashboard quotes | `GET /api/quotes` |
| Dashboard calendar | `GET /api/calendar` |
| AI insights | `GET/POST /api/ai/insights` |
| Site config (contact, nav) | `src/config/site.ts` |
| Marketing content | `src/constants/content.ts` |
| Services list | `src/constants/services.ts` |
| Voice agent knowledge | `src/features/voice-agent/knowledge.ts` |

---

*Generated for ExpressWay Logistic discovery. Update this file after the visit and link decisions in ARCHITECTURE.md when rules are finalized.*
