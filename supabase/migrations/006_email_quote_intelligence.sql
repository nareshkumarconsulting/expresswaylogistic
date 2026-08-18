-- Option A: n8n forwards classified mail; the app creates quote drafts
-- and sales follow-ups from quotation emails.

alter type quote_request_source add value if not exists 'email';

create type quote_ai_review_status as enum (
  'needs_review',
  'needs_info',
  'confirmed',
  'dismissed'
);

alter table quote_requests
  add column if not exists email_intelligence_id uuid
    references email_intelligence (id)
    on delete set null,
  add column if not exists ai_review_status quote_ai_review_status,
  add column if not exists ai_missing_fields text[] not null default '{}',
  add column if not exists ai_completeness numeric(4, 3),
  add column if not exists ai_suggested_reply text;

alter table email_intelligence
  add column if not exists body text,
  add column if not exists quote_request_id text,
  add column if not exists quote_subtype text,
  add column if not exists quote_action text;

create unique index if not exists quote_requests_email_intelligence_id_uidx
  on quote_requests (email_intelligence_id)
  where email_intelligence_id is not null;

create index if not exists quote_requests_ai_review_status_idx
  on quote_requests (ai_review_status);

create index if not exists email_intelligence_quote_request_id_idx
  on email_intelligence (quote_request_id);

grant usage on type public.quote_ai_review_status
  to postgres, anon, authenticated, service_role;
