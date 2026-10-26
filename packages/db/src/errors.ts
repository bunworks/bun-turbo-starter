export interface PgErrorLike {
  code?: string;
  message?: string;
  detail?: string;
  constraint?: string;
  // AggregateError: Node tries every address `localhost` resolves to.
  errors?: { message?: string }[];
}

/**
 * Drizzle wraps driver errors (`DrizzleQueryError`); the Postgres SQLSTATE
 * and constraint live on a `cause`. Works for node-postgres, Neon and PGlite.
 */
export function findPgError(error: unknown): PgErrorLike {
  let current: unknown = error;
  let innermost: unknown = error;
  for (let depth = 0; current && depth < 5; depth++) {
    const candidate = current as PgErrorLike & { cause?: unknown };
    if (candidate.code) return candidate;
    innermost = current;
    current = candidate.cause;
  }
  // No SQLSTATE anywhere (e.g. a dropped connection): the innermost cause
  // says what happened; the wrapper only says which query was running.
  return innermost instanceof Error ? { message: innermost.message } : {};
}

/**
 * True for a unique-constraint violation (SQLSTATE 23505), optionally only
 * for the named constraint, e.g. `users_email_unique`.
 */
export function isUniqueViolation(error: unknown, constraint?: string) {
  const pg = findPgError(error);
  if (pg.code !== "23505") return false;
  if (!constraint) return true;
  // PGlite and node-postgres expose `constraint`; fall back to the message.
  return (pg.constraint ?? pg.message ?? "").includes(constraint);
}
