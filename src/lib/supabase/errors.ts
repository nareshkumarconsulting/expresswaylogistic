export function isForeignKeyError(error: {
  code?: string;
  message?: string;
} | null): boolean {
  if (!error) return false;
  return (
    error.code === "23503" ||
    /foreign key/i.test(error.message ?? "")
  );
}

/** PostgREST / Postgres errors when a migration has not been applied yet. */
export function isMissingRelationError(error: {
  code?: string;
  message?: string;
} | null): boolean {
  if (!error) return false;
  const message = error.message ?? "";
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /schema cache/i.test(message) ||
    /does not exist/i.test(message) ||
    /could not find the table/i.test(message)
  );
}
