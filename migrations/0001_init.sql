-- Bright Future Education — initial content schema.
--
-- Written for Postgres (Supabase / Neon). For SQLite / Cloudflare D1, replace
-- `TIMESTAMPTZ DEFAULT now()` with `TEXT DEFAULT CURRENT_TIMESTAMP`; everything
-- else is portable.
--
-- Design: the admin panel edits arbitrary content shapes, so rows are stored as
-- JSON with the query-relevant fields (collection, sort order, id) lifted into
-- real columns. Adding a new collection therefore needs no migration.

-- Singleton documents: site settings, homepage copy, homepage section order.
CREATE TABLE IF NOT EXISTS content_docs (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every collection row (courses, subjects, teachers, results, ...).
CREATE TABLE IF NOT EXISTS content_rows (
  id          TEXT PRIMARY KEY,
  collection  TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  data        TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_rows_collection_order
  ON content_rows (collection, sort_order);

-- Admission applications submitted from /admissions.
CREATE TABLE IF NOT EXISTS enrollments (
  id          TEXT PRIMARY KEY,
  data        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enquiries submitted from /contact.
CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  data        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Image references used by the site (logo, hero, ...).
CREATE TABLE IF NOT EXISTS media (
  id          TEXT PRIMARY KEY,
  data        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enrollments_created_at ON enrollments (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_created_at ON messages (created_at DESC);
