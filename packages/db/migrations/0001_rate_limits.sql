-- IF NOT EXISTS: databases created with `db:push` before migrations were
-- introduced may already have this table. Hand-edited; keep it idempotent.
CREATE TABLE IF NOT EXISTS "rate_limits" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" integer NOT NULL,
	"last_request" bigint NOT NULL,
	CONSTRAINT "rate_limits_key_unique" UNIQUE("key")
);
