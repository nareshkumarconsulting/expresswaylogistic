# Deployment Guide

## Vercel (recommended)

1. Import the GitHub repository into Vercel.
2. Framework preset: Next.js.
3. Environment variables from `.env.example`.
4. Production domain: `expresswaylogistic.com`.
5. Enable HTTPS (default). Confirm security headers via middleware.

## Docker

```bash
docker build -t expressway-logistic .
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_URL=https://expresswaylogistic.com expressway-logistic
```

Or:

```bash
docker compose up --build
```

## CI/CD

GitHub Actions workflow `.github/workflows/ci.yml` runs typecheck, lint, unit tests, and production build on push/PR.

## Post-deploy checklist

- [ ] `/` returns 200 with brand hero
- [ ] `/services` shows card grid + detailed service sections
- [ ] `/quote` and `/appointment` submit successfully
- [ ] Lead delivery configured: `CONTACT_WEBHOOK_URL` and/or `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`
- [ ] `/track` resolves demo ID `EW-10847`
- [ ] Ops Login / Command Center access works as expected
- [ ] `/sitemap.xml` and `/robots.txt` present
- [ ] Security headers visible in response
