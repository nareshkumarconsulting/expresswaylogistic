# Deployment Guide

## Production (full stack)

**Step-by-step:** [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)

Covers Vercel app, Supabase migrations, n8n VPS, email workflow, and go-live checklist.

Quick verify after deploy:

```bash
APP_URL=https://expresswaylogistic.com EMAIL_INGEST_SECRET=xxx npm run verify:email-intelligence
```

---

## Vercel (recommended)

1. Import the GitHub repository into Vercel.
2. Framework preset: Next.js.
3. Environment variables from `.env.example` **plus** production values in [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) Phase 3.
4. Production domain: `expresswaylogistic.com`.
5. Enable HTTPS (default). Confirm security headers via middleware.

### Required production env vars (email intelligence)

| Variable | Required |
|----------|----------|
| `SUPABASE_URL` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (staff login) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (staff login) |
| `NEXT_PUBLIC_APP_URL` | Yes |
| `EMAIL_INGEST_SECRET` | Yes (n8n ingest webhook) |

---

## n8n (email pipeline — separate server)

n8n does **not** run on Vercel. Deploy on a VPS or n8n Cloud:

```bash
# On VPS — see docker-compose.n8n.prod.yml + .env.n8n.production.example
docker compose -f docker-compose.n8n.prod.yml up -d
```

Local development: [N8N_SETUP.md](./N8N_SETUP.md)

---

## Docker (Next.js app only)

```bash
docker build -t expressway-logistic .
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_URL=https://expresswaylogistic.com expressway-logistic
```

Or:

```bash
docker compose up --build    # web + local n8n (dev)
```

---

## CI/CD

GitHub Actions workflow `.github/workflows/ci.yml` runs typecheck, lint, unit tests, and production build on push/PR.

---

## Post-deploy checklist

### Website
- [ ] `/` returns 200 with brand hero
- [ ] `/services` shows card grid + detailed service sections
- [ ] `/quote` and `/appointment` submit successfully
- [ ] Lead delivery configured: `CONTACT_WEBHOOK_URL` and/or `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`
- [ ] `/track` resolves demo ID `EW-10847`
- [ ] Ops Login / Command Center access works as expected
- [ ] `/sitemap.xml` and `/robots.txt` present
- [ ] Security headers visible in response

### Email intelligence
- [ ] Supabase migration `004_email_intelligence.sql` applied
- [ ] `EMAIL_INGEST_SECRET` set on Vercel Production
- [ ] `npm run verify:email-intelligence` passes against production URL
- [ ] n8n workflow active on VPS / n8n Cloud
- [ ] `/command-center/emails` shows classified emails
- [ ] Live test email processed end-to-end
