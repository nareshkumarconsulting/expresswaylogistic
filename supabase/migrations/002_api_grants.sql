-- Grant API roles access to Phase 1 tables (required when tables are created via SQL Editor).
-- Without these grants, service_role inserts fail with "permission denied for table ...".

grant usage on schema public to postgres, anon, authenticated, service_role;

grant select, insert, update, delete on table public.quote_requests
  to postgres, service_role;

grant select, insert, update, delete on table public.appointments
  to postgres, service_role;

grant usage on type public.quote_request_status to postgres, anon, authenticated, service_role;
grant usage on type public.quote_request_source to postgres, anon, authenticated, service_role;
grant usage on type public.appointment_source to postgres, anon, authenticated, service_role;
grant usage on type public.appointment_status to postgres, anon, authenticated, service_role;
