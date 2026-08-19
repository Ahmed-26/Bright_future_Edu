-- Bright Future Education — MySQL / MariaDB schema (Hostinger, cPanel, RDS, ...).
--
-- Optional: the app creates these tables itself on first connect and copies the
-- seed content in. Run this by hand only if the database user is not allowed to
-- issue CREATE TABLE at runtime — grant it SELECT/INSERT/UPDATE/DELETE and apply
-- this file through phpMyAdmin instead.
--
-- 0001_init.sql is the Postgres equivalent; the design is identical. Rows are
-- stored as JSON with the query-relevant fields (collection, sort order, id)
-- lifted into real columns, so adding a new collection needs no migration.
--
-- VARCHAR(191) rather than TEXT for keys: InnoDB caps an index key at 767 bytes
-- on older MySQL, which is 191 utf8mb4 characters.

CREATE TABLE IF NOT EXISTS content_docs (
  `key`      VARCHAR(191) NOT NULL PRIMARY KEY,
  `value`    LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS content_rows (
  id         VARCHAR(191) NOT NULL PRIMARY KEY,
  collection VARCHAR(64) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  data       LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX content_rows_collection_order (collection, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admission applications submitted from /admissions.
CREATE TABLE IF NOT EXISTS enrollments (
  id         VARCHAR(191) NOT NULL PRIMARY KEY,
  data       LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX enrollments_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Enquiries submitted from /contact.
CREATE TABLE IF NOT EXISTS messages (
  id         VARCHAR(191) NOT NULL PRIMARY KEY,
  data       LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX messages_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Image references used by the site (logo, hero, ...).
CREATE TABLE IF NOT EXISTS media (
  id         VARCHAR(191) NOT NULL PRIMARY KEY,
  data       LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX media_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
