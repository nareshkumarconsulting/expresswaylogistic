/**
 * Bootstrap or link a Command Center staff user.
 * Usage:
 *   node scripts/bootstrap-staff.mjs
 *   node scripts/bootstrap-staff.mjs sales@expresswaylogistics.com
 *   node scripts/bootstrap-staff.mjs sales@expresswaylogistics.com mypassword
 */

import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const env = {};
  const path = resolve(process.cwd(), ".env.local");
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

async function adminFetch(env, path, init = {}) {
  const url = `${env.SUPABASE_URL.replace(/\/$/, "")}${path}`;
  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    ...(init.headers ?? {}),
  };
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { res, json };
}

async function findUserByEmail(env, email) {
  const list = await adminFetch(env, "/auth/v1/admin/users?page=1&per_page=1000");
  if (!list.res.ok) {
    throw new Error(`Failed to list users: ${JSON.stringify(list.json)}`);
  }
  return (list.json.users ?? []).find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );
}

const env = loadEnvLocal();
const emailArg = process.argv[2]?.trim();
const passwordArg = process.argv[3]?.trim();
const email = emailArg || env.AUTH_EMAIL || "ops@expresswaylogistic.com";
const password = passwordArg || env.AUTH_PASSWORD || "expressway123";
const linkOnly = Boolean(emailArg && !passwordArg);

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const tableCheck = await adminFetch(
  env,
  "/rest/v1/staff_profiles?select=user_id&limit=1",
);
if (!tableCheck.res.ok) {
  console.error(
    "staff_profiles table missing. Run supabase/migrations/003_staff_auth.sql first.",
  );
  console.error(tableCheck.json);
  process.exit(2);
}

let userId;

if (linkOnly) {
  const existing = await findUserByEmail(env, email);
  if (!existing) {
    console.error(`No Supabase Auth user found for ${email}.`);
    console.error("Create the user in Supabase Dashboard first, or pass a password:");
    console.error(`  node scripts/bootstrap-staff.mjs ${email} your-password`);
    process.exit(1);
  }
  userId = existing.id;
  console.log(`Found existing auth user for ${email}.`);
} else {
  const create = await adminFetch(env, "/auth/v1/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });

  if (create.res.ok) {
    userId = create.json.id ?? create.json.user?.id;
    console.log("Created auth user.");
  } else if (
    String(create.json?.msg ?? create.json?.message ?? "")
      .toLowerCase()
      .includes("already")
  ) {
    const existing = await findUserByEmail(env, email);
    if (!existing) {
      console.error("User exists but could not be found by email.");
      process.exit(1);
    }
    userId = existing.id;
    const update = await adminFetch(env, `/auth/v1/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!update.res.ok) {
      console.error("Failed to update password:", update.json);
      process.exit(1);
    }
    console.log("Updated password for existing user.");
  } else {
    console.error("Failed to create auth user:", create.json);
    process.exit(1);
  }
}

const profile = await adminFetch(env, "/rest/v1/staff_profiles", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates",
  },
  body: JSON.stringify({
    user_id: userId,
    email,
    full_name: email.split("@")[0],
    role: "admin",
  }),
});

if (!profile.res.ok) {
  console.error("Failed to create staff profile:", profile.json);
  process.exit(1);
}

console.log("Staff profile linked.");
console.log(`User ID: ${userId}`);
console.log(`Authorized email: ${email}`);
if (!linkOnly) {
  console.log(`Password: ${passwordArg ? "(from argument)" : "(AUTH_PASSWORD from .env.local)"}`);
}
