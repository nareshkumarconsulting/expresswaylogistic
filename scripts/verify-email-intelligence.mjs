#!/usr/bin/env node
/**
 * Verify email intelligence ingest pipeline (local or production).
 *
 * Usage:
 *   npm run verify:email-intelligence
 *   APP_URL=https://expresswaylogistic.com EMAIL_INGEST_SECRET=xxx npm run verify:email-intelligence
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return {};
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

const fileEnv = loadEnvLocal();
const APP_URL = (
  process.env.APP_URL ||
  fileEnv.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");
const SECRET = process.env.EMAIL_INGEST_SECRET || fileEnv.EMAIL_INGEST_SECRET;

const results = [];

function pass(label) {
  results.push({ ok: true, label });
  console.log(`✓ ${label}`);
}

function fail(label, detail) {
  results.push({ ok: false, label, detail });
  console.error(`✗ ${label}`);
  if (detail) console.error(`  → ${detail}`);
}

async function checkHealth() {
  try {
    const res = await fetch(`${APP_URL}/api/health`);
    if (res.ok) pass(`Health check (${APP_URL}/api/health)`);
    else fail(`Health check`, `HTTP ${res.status}`);
  } catch (e) {
    fail(`Health check`, e instanceof Error ? e.message : "network error");
  }
}

async function checkIngestUnauthorized() {
  try {
    const res = await fetch(`${APP_URL}/api/email-intelligence/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (res.status === 401 || res.status === 503) {
      pass(`Ingest rejects unauthenticated requests (HTTP ${res.status})`);
    } else {
      fail(`Ingest auth guard`, `Expected 401/503, got ${res.status}: ${JSON.stringify(json)}`);
    }
  } catch (e) {
    fail(`Ingest auth guard`, e instanceof Error ? e.message : "network error");
  }
}

async function checkIngestWrite() {
  if (!SECRET) {
    fail(`Ingest write test`, "EMAIL_INGEST_SECRET not set");
    return;
  }

  const testId = `verify-${Date.now()}`;
  const payload = {
    sourceAccount: "ops@expresswaylogistics.com",
    externalMessageId: testId,
    senderEmail: "verify@expresswaylogistic.com",
    subject: "Production verification email",
    receivedAt: new Date().toISOString(),
    category: "general",
    confidence: 1,
    summary: "Automated verify:email-intelligence script",
    extractedData: { summary: "Pipeline OK" },
  };

  try {
    const res = await fetch(`${APP_URL}/api/email-intelligence/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SECRET}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      pass(`Ingest write test (id: ${json.data?.id ?? "ok"})`);
    } else {
      fail(`Ingest write test`, `HTTP ${res.status}: ${JSON.stringify(json)}`);
    }
  } catch (e) {
    fail(`Ingest write test`, e instanceof Error ? e.message : "network error");
  }
}

console.log(`\nEmail Intelligence — Production Verify`);
console.log(`Target: ${APP_URL}`);
console.log(`Secret: ${SECRET ? "(set)" : "(missing)"}\n`);

await checkHealth();
await checkIngestUnauthorized();
await checkIngestWrite();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);

if (failed.length > 0) {
  console.log("\nNext steps:");
  console.log("  1. Ensure app is deployed / running (npm run dev or Vercel)");
  console.log("  2. Set EMAIL_INGEST_SECRET on Vercel + n8n (must match)");
  console.log("  3. Run supabase/migrations/004_email_intelligence.sql");
  console.log("  4. See docs/PRODUCTION_SETUP.md\n");
  process.exit(1);
}

console.log("\nDashboard: " + APP_URL + "/command-center/emails\n");
process.exit(0);
