# Quote Flow — Live Demo Click Script

Use this as a presenter script. Every **bold** label matches the Command Center UI exactly.

**Time:** ~45–60 minutes  
**Login:** `/login` → land on **Overview**  
**Prep:** one Active forwarder, a test customer inbox you control, and (optional) one sample RFQ email already ingested

---

## Label cheat sheet (say these words)

### Sidebar

| Click | Goes to |
|-------|---------|
| **Overview** | `/command-center` |
| **Quote Requests** | `/command-center/quotes` |
| **Forwarders** | `/command-center/forwarders` |
| **Email Intelligence** | `/command-center/emails` |

### Quotes list — status chips (short labels)

| Chip on list | Means |
|--------------|--------|
| **New** | Just arrived |
| **In review** | Being worked |
| **Sent** | RFQ outbound started |
| **Waiting** | Waiting on partners |
| **Received** | Partner rate in |
| **Emailed** | Customer quotation sent |
| **Failed** | Customer email failed — retry |
| **Accepted** / **Rejected** / **Expired** | Closed |

### Quotes list — Email AI filters

- **All sources**
- **Email AI**
- **AI drafts**
- **Needs info**

### Quote detail sheet — status badge (longer labels)

Same statuses, longer wording: **New request**, **In review**, **Quote requested**, **Waiting on quote**, **Quote received**, **Quote emailed**, **Customer email failed**, etc.

### Pricing path cards (inside quote sheet)

- **Quote the customer** — price & email requester
- **Ask partners** — RFQ forwarders first

---

## Demo 0 — Orient (3 min)

**Say:** “Everything for quotes lives under Command Center. Pipeline on Overview; daily work on Quote Requests.”

1. Open `/login` → sign in.
2. Sidebar → **Overview**.
3. Scroll to section **Quotes**.
4. Point at pipeline groups:
   - **Customer** — “Inbound requests and quotes sent back”
   - handoff pill **Ask partners**
   - **Forwarders** — “Quotes requested from partners”
   - handoff pill **Then close**
   - **Closed** — “Won, lost, or failed”
5. Click **Open quotes** (or sidebar **Quote Requests**).

**Point out page title:** **Quote Requests**  
**Subtitle:** “Repeat customers can be quoted directly. New requests go to forwarders.”

---

## Demo 1 — Website intake → New quote (8 min)

**Goal:** Show how a public form becomes a row in Command Center.

### A. Submit the public form

1. New tab → `/quote` (or site CTA **Get a Quote**).
2. Walk the wizard; click **Continue** after each step:
   - Step 1 — **Tell us about your cargo**
   - Step 2 — **Where is it moving?**
   - Step 3 — **Insurance, project cargo & packing**
   - Step 4 — **Who should receive the quote?**
3. Click **Submit quote**.
4. Note the reference ID if shown.

### B. Find it in Command Center

1. Sidebar → **Quote Requests**.
2. Optional: type company/ID in **Search ID, customer, lane…**.
3. Optional filters: **Origin**, **Destination**, **All services**, date.
4. In the **Customer** filter lane, click chip **New** (count should bump).
5. Click the table row (columns: **Request ID**, **Customer**, **Request date**, **Origin**, **Destination**, **Service**, **Shipment**, **Status**, **Quotation**, **Updated**, **Assigned**).

### C. Open the sheet — narrate

Sheet title: **QUOTE #{id}**

Point out:

- Lane line: `Origin → Destination`
- Contact: name · email
- Badge: **New request** (or list chip **New**)
- **New customer** or **Repeat customer**
- Optional badges: **Need origin pickup** / **Need destination delivery**

6. Click **View shipment details** → show **Company**, **Phone**, cargo fields → click **Hide shipment details**.

**Say:** “Website leads land as New. No email to the customer yet.”

---

## Demo 2 — Happy path A: Quote the customer directly (10 min)

**Best for:** repeat customer or known rate (skip partners).

1. Stay on the open quote sheet.
2. Under **How do you want to price this?**, click **Quote the customer**.
3. Section **Customer quote** appears — “This email goes to {email}”.
4. Fill:
   - **Amount** (placeholder example `₹26,500`)
   - **Valid for**
   - **Notes to keep internally** (optional)
5. Optional: expand **Charges, margin, status** → **Additional charges**, **Discount**, **Margin**, **Status**.
6. Footer → **Save** (keeps draft; does not email).
7. Footer → **Email customer quote**.
8. Close sheet; on list, **Status** chip should show **Emailed**.
9. Re-open: badge **Quote emailed**; note “Last emailed …” if present.
10. Optional close: expand **Charges, margin, status** → **Status** → **Accepted** → **Save**.

**If send fails:** chip **Failed**, badge **Customer email failed**, button becomes **Retry customer email**.

---

## Demo 3 — Happy path B: Ask partners first (15 min) — *main ops demo*

**Best for:** new customer / competitive pricing.

### A. Confirm a partner exists

1. Sidebar → **Forwarders**.
2. Page title **Forwarders**; subtitle “Directory used when requesting competitive quotes.”
3. If empty: **Add Forwarder** → fill **Company name**, email, set **Active** → **Add forwarder**.
4. Filter **Active** so the partner shows.

### B. Send RFQ from the quote

1. Sidebar → **Quote Requests** → open the demo quote.
2. Click **Ask partners**.
3. Section **Partner rates** — “Ask forwarders first. Then pick a rate and quote the customer.”
4. Click **Select partners**.
5. Optional: **Search partners**, **Select all**.
6. Check one Active partner → **Email selected partners**.
7. List shows partner name with **Waiting** · status (e.g. **Awaiting Response**).
8. Close sheet; list chip moves toward **Waiting** (**Awaiting Forwarder Quotes**).

### C. Log a partner reply

1. Re-open the same quote → **Ask partners**.
2. Under **Log a partner reply**:
   - **Which partner?**
   - **Amount**
   - **Transit** / **Validity**
   - **Carrier**
3. Click **Save partner quote**.
4. Under **Pick a partner rate**, click **Use this rate** on that partner.
5. Review summary: **Partner cost**, **Margin**, **Customer amount**.
6. Click **Continue to customer quote** (switches to **Quote the customer**).
7. Confirm **Amount** → **Email customer quote**.
8. List chip → **Emailed**.

**Say:** “Partners never see the customer price. You add margin, then email the requester.”

---

## Demo 4 — Email AI intake (12 min)

**Goal:** Show email RFQs become Quotes with AI badges — humans still confirm.

### A. Inbox first

1. Sidebar → **Email Intelligence**.
2. Page title **Email Intelligence**; “X new · Y total”.
3. Top tiles: **Needs review**, **Shipments**, **Quotations**, **Alerts**.
4. Click **Quotations** (or open a known RFQ row).
5. In the email detail, point at:
   - Category badge (**Quotations**)
   - Status chips: **New** / **Read** / **Actioned** / **Archived**
   - **AI summary**
   - Quote action badge if present: **Quote draft created** or **Quote needs info**
   - **Linked quote** → link **Open {id} in Quotes**
   - **Email body** / **Extracted information**

6. Click **Open {id} in Quotes** (or sidebar **Quote Requests**).

### B. AI draft path (complete RFQ)

1. On **Quote Requests**, click filter **AI drafts**.
2. Open a row with sparkles badge **AI draft**.
3. Top card **Email AI** shows badge **Ready for review** (and % complete if shown).
4. Copy: “Created from a complete-enough enquiry. Confirm before quoting the customer or asking partners.”
5. Optional: **Open original email**.
6. Click **Confirm and take over** → status moves toward **In review** / **Under Review**.
7. Then use Demo 2 or Demo 3 as usual.

### C. Needs info path (incomplete RFQ)

1. Click filter **Needs info**.
2. Open row with badge **Needs info**.
3. Card shows **Needs info** + missing-field list + optional **Suggested chase email**.
4. Copy: “Sales should chase the client before sending to forwarders.”
5. Do **not** send to partners yet — chase first, then **Confirm and take over**.
6. **Not a quote** dismisses if it was misclassified.

**Golden line:** “AI drafts the request. Your team confirms. Nothing emails the customer or forwarders until you click.”

---

## Demo 5 — Filters & management view (3 min)

On **Quote Requests**:

1. **Customer** lane: **New** / **In review** / **Emailed**
2. **Forwarders** lane: **Sent** / **Waiting** / **Received**
3. **Closed** lane: **Failed** / **Accepted** / **Rejected** / **Expired**
4. Click **Show all** to clear status filter.
5. Email AI row: **All sources** → **Email AI** → **AI drafts** → **Needs info**.

On **Overview**:

1. Click a pipeline tile (e.g. **New request**) → jumps to filtered **Quote Requests**.

---

## Suggested run order (live)

| # | Segment | Minutes |
|---|---------|---------|
| 0 | Orient on **Overview** | 3 |
| 1 | Website → **New** quote | 8 |
| 2 | **Quote the customer** → **Email customer quote** | 10 |
| 3 | Second quote → **Ask partners** → **Use this rate** → email | 15 |
| 4 | **Email Intelligence** → **Confirm and take over** | 12 |
| 5 | Filters / pipeline tiles | 3 |
| — | Q&A | 5–10 |

If short on time: skip Demo 2 and do **Ask partners** only (Demo 3), plus a quick **AI drafts** confirm (Demo 4B).

---

## Presenter “say this” lines

1. **Intake:** “Website and email both land on **Quote Requests**.”
2. **Control:** “**Save** stores work. **Email customer quote** is what the client receives.”
3. **Partners:** “**Ask partners** → **Email selected partners** → **Save partner quote** → **Use this rate** → **Continue to customer quote**.”
4. **AI:** “**AI drafts** and **Needs info** are review queues — not auto-sends.”
5. **Done:** “Done means **Emailed** (customer got the quote), then **Accepted** / **Rejected** / **Expired**.”

---

## Pre-demo checklist

- [ ] Staff login works
- [ ] At least one **Active** forwarder (real or test mailbox)
- [ ] Resend / outbound email works to your test address
- [ ] Public `/quote` submits successfully
- [ ] (Optional) One complete RFQ email already in **Email Intelligence** → **Quotations**
- [ ] (Optional) One incomplete RFQ for **Needs info**
- [ ] Browser: Command Center + `/quote` + test inbox tabs ready

---

## Click map — one screen (print this)

```
Sidebar
  Overview  →  pipeline: Customer | Ask partners | Forwarders | Then close | Closed
  Quote Requests
      filters: New | In review | Emailed || Sent | Waiting | Received || Failed | …
      AI: All sources | Email AI | AI drafts | Needs info
      row click → QUOTE #…
          Email AI card → Confirm and take over | Not a quote
          View shipment details
          Quote the customer  |  Ask partners
              Amount / Valid for → Save | Email customer quote
              Select partners → Email selected partners
              Log a partner reply → Save partner quote
              Use this rate → Continue to customer quote
  Forwarders → Add Forwarder
  Email Intelligence → Quotations → Open {id} in Quotes
```
