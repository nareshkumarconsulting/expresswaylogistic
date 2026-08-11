#!/usr/bin/env bash
# Bootstrap Command Center staff user via Supabase Admin API.
# Requires: migration 003_staff_auth.sql already applied.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env.local"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

URL="${SUPABASE_URL%/}"
KEY="${SUPABASE_SERVICE_ROLE_KEY}"
EMAIL="${AUTH_EMAIL:-ops@expresswaylogistic.com}"
PASSWORD="${AUTH_PASSWORD:-expressway123}"

if [[ -z "$URL" || -z "$KEY" ]]; then
  echo "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

echo "Checking staff_profiles table..."
TABLE_CHECK=$(curl -s -o /tmp/staff-check.json -w "%{http_code}" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  "$URL/rest/v1/staff_profiles?select=user_id&limit=1")

if [[ "$TABLE_CHECK" == "404" ]] || grep -q "does not exist" /tmp/staff-check.json 2>/dev/null; then
  echo "staff_profiles table missing. Run supabase/migrations/003_staff_auth.sql first."
  cat /tmp/staff-check.json 2>/dev/null || true
  exit 2
fi

echo "Creating auth user (or updating if exists)..."
CREATE_RESP=$(curl -s -w "\n%{http_code}" \
  -X POST "$URL/auth/v1/admin/users" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"email_confirm\":true}")

HTTP_CODE=$(echo "$CREATE_RESP" | tail -n1)
BODY=$(echo "$CREATE_RESP" | sed '$d')

USER_ID=""

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "201" ]]; then
  USER_ID=$(echo "$BODY" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).id||JSON.parse(d).user?.id||''))")
  echo "Created auth user."
elif echo "$BODY" | grep -qi "already"; then
  echo "User already exists — syncing password and staff profile..."
  LIST=$(curl -s \
    -H "apikey: $KEY" \
    -H "Authorization: Bearer $KEY" \
    "$URL/auth/v1/admin/users?page=1&per_page=1000")
  USER_ID=$(node -e "
    const users = JSON.parse(process.argv[1]).users || [];
    const u = users.find(x => (x.email || '').toLowerCase() === process.argv[2].toLowerCase());
    if (!u) process.exit(1);
    console.log(u.id);
  " "$LIST" "$EMAIL")
  curl -s -o /dev/null \
    -X PUT "$URL/auth/v1/admin/users/$USER_ID" \
    -H "apikey: $KEY" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d "{\"password\":\"$PASSWORD\"}"
else
  echo "Failed to create user (HTTP $HTTP_CODE):"
  echo "$BODY"
  exit 1
fi

if [[ -z "$USER_ID" ]]; then
  echo "Could not resolve user id"
  exit 1
fi

echo "Linking staff profile..."
PROFILE_CODE=$(curl -s -o /tmp/staff-upsert.json -w "%{http_code}" \
  -X POST "$URL/rest/v1/staff_profiles" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d "{\"user_id\":\"$USER_ID\",\"email\":\"$EMAIL\",\"full_name\":\"Ops Team\",\"role\":\"admin\"}")

if [[ "$PROFILE_CODE" != "200" && "$PROFILE_CODE" != "201" ]]; then
  echo "Failed to create staff profile (HTTP $PROFILE_CODE):"
  cat /tmp/staff-upsert.json
  exit 1
fi

echo "Done."
echo "Sign in at /login with:"
echo "  Email: $EMAIL"
echo "  Password: (AUTH_PASSWORD from .env.local)"
