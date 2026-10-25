/**
 * Preloaded by `bun test` (see bunfig.toml) before any test module, so the
 * env-reading modules (`@acme/config`, `@acme/db`, `adminProcedure`) see
 * deterministic values instead of whatever a local `.env` contains.
 *
 * Nothing connects to POSTGRES_URL: tests run procedures against PGlite.
 */
process.env.POSTGRES_URL = "postgres://test:test@localhost:5432/test";
process.env.ADMIN_EMAILS = "admin@test.local";
process.env.LOG_LEVEL = "warn";
