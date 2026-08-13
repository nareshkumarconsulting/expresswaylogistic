#!/usr/bin/env node
/**
 * Start n8n locally with ExpressWay env vars from .env.local
 * Usage: npm run n8n
 */
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Later lines win; skip overwriting with empty values
    if (value === "" && key in vars) continue;
    vars[key] = value;
  }
  return vars;
}

const fileEnv = loadEnvFile(envPath);

const env = {
  ...process.env,
  ...fileEnv,
  N8N_HOST: "localhost",
  N8N_PORT: "5678",
  N8N_PROTOCOL: "http",
  WEBHOOK_URL: "http://localhost:5678/",
  GENERIC_TIMEZONE: "Asia/Kolkata",
  TZ: "Asia/Kolkata",
  N8N_BLOCK_ENV_ACCESS_IN_NODE: "false",
  EXPRESSWAY_APP_URL: fileEnv.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

console.log("Starting n8n at http://localhost:5678");
console.log(`EXPRESSWAY_APP_URL=${env.EXPRESSWAY_APP_URL}`);
console.log(
  `EMAIL_INGEST_SECRET=${env.EMAIL_INGEST_SECRET ? "(set)" : "(missing — add to .env.local)"}`,
);
const aiProvider = env.GROQ_API_KEY
  ? "groq (free)"
  : env.GEMINI_API_KEY
    ? "gemini (free)"
    : env.OPENAI_API_KEY
      ? "openai"
      : "(none — add GROQ_API_KEY or GEMINI_API_KEY to .env.local)";
console.log(`AI provider: ${aiProvider}`);

const child = spawn("npx", ["--yes", "n8n"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
