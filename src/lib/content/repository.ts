/**
 * SERVER-ONLY content repository.
 *
 * Defines the storage contract for all site content and provides two drivers:
 *
 *   - `memory`  — process-local, seeded from src/data/institute.ts. Used when no
 *                 DATABASE_URL is configured. Shared by every visitor of that
 *                 server process, but lost on restart and NOT shared between
 *                 Cloudflare Worker isolates.
 *   - `sql`     — MySQL/MariaDB or Postgres, selected automatically from
 *                 DATABASE_URL. Tables are created and seeded on first use;
 *                 migrations/ holds the equivalent standalone SQL.
 *
 * Every server function talks to `getRepository()` and nothing else, so
 * switching storage needs no changes anywhere in the app or admin panel.
 *
 * Never import this from a component: it is only reachable through the server
 * functions in src/lib/content/server.ts.
 */

import type {
  CollectionKey,
  ContactMessage,
  Enrollment,
  HomepageContent,
  HomepageSection,
  Id,
  MediaItem,
  SiteSettings,
  WithMeta,
} from "@/components/admin/types";

import { createMysqlDriver } from "./mysql";
import type { Collections, SiteContent } from "./schema";
import { COLLECTION_KEYS, seedContent, seedMedia } from "./schema";

/* ------------------------------------------------------------------ */
/* Contract                                                           */
/* ------------------------------------------------------------------ */

export type ContentSnapshot = SiteContent & {
  enrollments: Enrollment[];
  messages: ContactMessage[];
  media: MediaItem[];
};

export type ContentRepository = {
  /** Full snapshot for the admin panel (includes unpublished rows). */
  readAll: () => Promise<ContentSnapshot>;
  /** Content only, for public SSR. */
  readContent: () => Promise<SiteContent>;

  createRow: (key: CollectionKey, row: WithMeta<object>) => Promise<void>;
  updateRow: (key: CollectionKey, id: Id, patch: Record<string, unknown>) => Promise<void>;
  deleteRow: (key: CollectionKey, id: Id) => Promise<void>;
  replaceRows: (key: CollectionKey, rows: WithMeta<object>[]) => Promise<void>;

  saveSettings: (settings: SiteSettings) => Promise<void>;
  saveHomepage: (homepage: HomepageContent) => Promise<void>;
  saveSections: (sections: HomepageSection[]) => Promise<void>;

  addEnrollment: (row: Enrollment) => Promise<void>;
  updateEnrollment: (id: Id, patch: Partial<Enrollment>) => Promise<void>;
  deleteEnrollment: (id: Id) => Promise<void>;

  addMessage: (row: ContactMessage) => Promise<void>;
  updateMessage: (id: Id, patch: Partial<ContactMessage>) => Promise<void>;
  deleteMessage: (id: Id) => Promise<void>;

  addMedia: (row: MediaItem) => Promise<void>;
  updateMedia: (id: Id, patch: Partial<MediaItem>) => Promise<void>;
  deleteMedia: (id: Id) => Promise<void>;

  /** Restores the checked-in seed content. Destructive; admin-only. */
  reset: () => Promise<void>;

  /** Which driver is live, surfaced in the admin UI so state is never ambiguous. */
  readonly driver: "memory" | "sql";
};

/* ------------------------------------------------------------------ */
/* In-memory driver                                                   */
/* ------------------------------------------------------------------ */

function freshSnapshot(): ContentSnapshot {
  return {
    ...seedContent(),
    enrollments: [],
    messages: [],
    media: seedMedia(),
  };
}

function rowsOf(snapshot: ContentSnapshot, key: CollectionKey): WithMeta<object>[] {
  return snapshot.collections[key] as WithMeta<object>[];
}

function setRows(snapshot: ContentSnapshot, key: CollectionKey, rows: WithMeta<object>[]) {
  (snapshot.collections as Record<CollectionKey, unknown>)[key] = rows;
}

function patchById<T extends { id: Id }>(rows: T[], id: Id, patch: Partial<T>): T[] {
  return rows.map((row) => (row.id === id ? { ...row, ...patch } : row));
}

function createMemoryRepository(): ContentRepository {
  let snapshot = freshSnapshot();
  // Structured clones on read so callers can never mutate stored state, and so
  // the object handed to the serializer has no shared references.
  const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

  return {
    driver: "memory",
    readAll: async () => clone(snapshot),
    readContent: async () =>
      clone({
        collections: snapshot.collections,
        settings: snapshot.settings,
        homepage: snapshot.homepage,
        sections: snapshot.sections,
      }),

    createRow: async (key, row) => {
      setRows(snapshot, key, [...rowsOf(snapshot, key), row]);
    },
    updateRow: async (key, id, patch) => {
      setRows(snapshot, key, patchById(rowsOf(snapshot, key), id, patch));
    },
    deleteRow: async (key, id) => {
      setRows(
        snapshot,
        key,
        rowsOf(snapshot, key).filter((row) => row.id !== id),
      );
    },
    replaceRows: async (key, rows) => {
      setRows(snapshot, key, rows);
    },

    saveSettings: async (settings) => {
      snapshot.settings = settings;
    },
    saveHomepage: async (homepage) => {
      snapshot.homepage = homepage;
    },
    saveSections: async (sections) => {
      snapshot.sections = sections;
    },

    addEnrollment: async (row) => {
      snapshot.enrollments = [row, ...snapshot.enrollments];
    },
    updateEnrollment: async (id, patch) => {
      snapshot.enrollments = patchById(snapshot.enrollments, id, patch);
    },
    deleteEnrollment: async (id) => {
      snapshot.enrollments = snapshot.enrollments.filter((row) => row.id !== id);
    },

    addMessage: async (row) => {
      snapshot.messages = [row, ...snapshot.messages];
    },
    updateMessage: async (id, patch) => {
      snapshot.messages = patchById(snapshot.messages, id, patch);
    },
    deleteMessage: async (id) => {
      snapshot.messages = snapshot.messages.filter((row) => row.id !== id);
    },

    addMedia: async (row) => {
      snapshot.media = [...snapshot.media, row];
    },
    updateMedia: async (id, patch) => {
      snapshot.media = patchById(snapshot.media, id, patch);
    },
    deleteMedia: async (id) => {
      snapshot.media = snapshot.media.filter((row) => row.id !== id);
    },

    reset: async () => {
      snapshot = freshSnapshot();
    },
  };
}

/* ------------------------------------------------------------------ */
/* SQL driver                                                         */
/* ------------------------------------------------------------------ */

/**
 * Minimal query surface every candidate database can satisfy (mysql2,
 * node-postgres, Neon serverless, ...). Parameters are always bound, never
 * interpolated.
 *
 * `dialect` only selects placeholder syntax, identifier quoting and upsert
 * wording — the storage design itself is portable.
 */
export type SqlDialect = "mysql" | "postgres";

export type SqlDriver = {
  dialect: SqlDialect;
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<T[]>;
  execute: (sql: string, params?: unknown[]) => Promise<void>;
};

let injectedSqlDriver: SqlDriver | undefined;

/**
 * Inject a driver explicitly instead of relying on DATABASE_URL. Resets the
 * memoised instance, so it also works after the repository has been resolved.
 */
export function setSqlDriver(driver: SqlDriver) {
  injectedSqlDriver = driver;
  instance = undefined;
}

/** Only these table names are ever interpolated into SQL. */
type SimpleTable = "enrollments" | "messages" | "media";

/**
 * The SQL repository needs a one-time schema check before first use, which the
 * shared contract deliberately does not expose.
 */
type SqlRepository = ContentRepository & { initialise: () => Promise<void> };

/**
 * Content documents (settings, homepage, sections) live in a key/value table;
 * every collection row lives in `content_rows` keyed by collection. One schema
 * serves all collections, so adding a collection needs no migration.
 *
 * On first use the tables are created if missing and the checked-in seed is
 * copied in, so a blank database becomes an editable site without running the
 * migration by hand.
 */
function createSqlRepository(db: SqlDriver): SqlRepository {
  const mysql = db.dialect === "mysql";
  /** Placeholder syntax differs per dialect; values are always bound. */
  const ph = (index: number) => (mysql ? "?" : `$${index}`);
  /** `key`/`value` are reserved words, so those identifiers are always quoted. */
  const q = (identifier: string) => (mysql ? `\`${identifier}\`` : `"${identifier}"`);

  const readDoc = async <T>(key: string, fallback: T): Promise<T> => {
    const rows = await db.query<{ value: string }>(
      `SELECT ${q("value")} AS ${q("value")} FROM content_docs WHERE ${q("key")} = ${ph(1)}`,
      [key],
    );
    const raw = rows[0]?.value;
    return raw ? (JSON.parse(raw) as T) : fallback;
  };

  const writeDoc = async (key: string, value: unknown) => {
    const sql = mysql
      ? `INSERT INTO content_docs (${q("key")}, ${q("value")}) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE ${q("value")} = VALUES(${q("value")})`
      : `INSERT INTO content_docs ("key", "value") VALUES ($1, $2)
         ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value"`;
    await db.execute(sql, [key, JSON.stringify(value)]);
  };

  const readRows = async (collection: string): Promise<WithMeta<object>[]> => {
    const rows = await db.query<{ data: string }>(
      `SELECT data FROM content_rows WHERE collection = ${ph(1)} ORDER BY sort_order ASC`,
      [collection],
    );
    return rows.map((row) => JSON.parse(row.data) as WithMeta<object>);
  };

  const writeRow = async (collection: string, row: WithMeta<object>) => {
    const sql = mysql
      ? `INSERT INTO content_rows (id, collection, sort_order, data) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE collection = VALUES(collection),
           sort_order = VALUES(sort_order), data = VALUES(data)`
      : `INSERT INTO content_rows (id, collection, sort_order, data) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET collection = EXCLUDED.collection,
           sort_order = EXCLUDED.sort_order, data = EXCLUDED.data`;
    await db.execute(sql, [row.id, collection, row.order, JSON.stringify(row)]);
  };

  const readCollections = async (): Promise<Collections> => {
    const result = {} as Collections;
    for (const key of COLLECTION_KEYS) {
      (result as Record<CollectionKey, unknown>)[key] = await readRows(key);
    }
    return result;
  };

  const readSimple = async <T>(table: SimpleTable): Promise<T[]> => {
    const rows = await db.query<{ data: string }>(
      `SELECT data FROM ${table} ORDER BY created_at DESC`,
    );
    return rows.map((row) => JSON.parse(row.data) as T);
  };

  const upsertSimple = async (table: SimpleTable, id: Id, data: unknown) => {
    const sql = mysql
      ? `INSERT INTO ${table} (id, data) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE data = VALUES(data)`
      : `INSERT INTO ${table} (id, data) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
    await db.execute(sql, [id, JSON.stringify(data)]);
  };

  const patchSimple = async <T extends { id: Id }>(
    table: SimpleTable,
    id: Id,
    patch: Partial<T>,
  ): Promise<void> => {
    const rows = await db.query<{ data: string }>(
      `SELECT data FROM ${table} WHERE id = ${ph(1)}`,
      [id],
    );
    const raw = rows[0]?.data;
    if (!raw) return;
    await upsertSimple(table, id, { ...(JSON.parse(raw) as T), ...patch });
  };

  /* ---------------------------------------------------------------- */
  /* Schema + first-run seed                                          */
  /* ---------------------------------------------------------------- */

  const schemaStatements = (): string[] => {
    if (mysql) {
      // VARCHAR(191) keeps keys inside InnoDB's index limit on utf8mb4.
      const simple = (table: SimpleTable) => `
        CREATE TABLE IF NOT EXISTS ${table} (
          id          VARCHAR(191) NOT NULL PRIMARY KEY,
          data        LONGTEXT NOT NULL,
          created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX ${table}_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
      return [
        `CREATE TABLE IF NOT EXISTS content_docs (
           ${q("key")}   VARCHAR(191) NOT NULL PRIMARY KEY,
           ${q("value")} LONGTEXT NOT NULL,
           updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        `CREATE TABLE IF NOT EXISTS content_rows (
           id          VARCHAR(191) NOT NULL PRIMARY KEY,
           collection  VARCHAR(64) NOT NULL,
           sort_order  INT NOT NULL DEFAULT 0,
           data        LONGTEXT NOT NULL,
           updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                       ON UPDATE CURRENT_TIMESTAMP,
           INDEX content_rows_collection_order (collection, sort_order)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        simple("enrollments"),
        simple("messages"),
        simple("media"),
      ];
    }

    const simple = (table: SimpleTable) => `
      CREATE TABLE IF NOT EXISTS ${table} (
        id          TEXT PRIMARY KEY,
        data        TEXT NOT NULL,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    return [
      `CREATE TABLE IF NOT EXISTS content_docs (
         "key"       TEXT PRIMARY KEY,
         "value"     TEXT NOT NULL,
         updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
       )`,
      `CREATE TABLE IF NOT EXISTS content_rows (
         id          TEXT PRIMARY KEY,
         collection  TEXT NOT NULL,
         sort_order  INTEGER NOT NULL DEFAULT 0,
         data        TEXT NOT NULL,
         updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
       )`,
      `CREATE INDEX IF NOT EXISTS content_rows_collection_order
         ON content_rows (collection, sort_order)`,
      simple("enrollments"),
      simple("messages"),
      simple("media"),
    ];
  };

  const countRows = async (table: "content_rows" | SimpleTable): Promise<number> => {
    // Postgres returns COUNT(*) as a string, MySQL as a number.
    const rows = await db.query<{ total: string | number }>(
      `SELECT COUNT(*) AS total FROM ${table}`,
    );
    return Number(rows[0]?.total ?? 0);
  };

  /**
   * Copies the checked-in seed into an empty database so the admin panel edits
   * real rows from the first save. Without this, editing a row that only exists
   * in the seed would write nothing.
   */
  const seedIfEmpty = async () => {
    if ((await countRows("content_rows")) === 0) {
      const seeded = seedContent();
      for (const key of COLLECTION_KEYS) {
        for (const row of seeded.collections[key] as WithMeta<object>[]) {
          await writeRow(key, row);
        }
      }
      await writeDoc("settings", seeded.settings);
      await writeDoc("homepage", seeded.homepage);
      await writeDoc("sections", seeded.sections);
    }
    if ((await countRows("media")) === 0) {
      for (const item of seedMedia()) await upsertSimple("media", item.id, item);
    }
  };

  const readContent = async (): Promise<SiteContent> => {
    const defaults = seedContent();
    const [collections, settings, homepage, sections] = await Promise.all([
      readCollections(),
      readDoc("settings", defaults.settings),
      readDoc("homepage", defaults.homepage),
      readDoc("sections", defaults.sections),
    ]);
    return { collections, settings, homepage, sections };
  };

  return {
    driver: "sql",
    readContent,
    readAll: async () => {
      const [content, enrollments, messages, media] = await Promise.all([
        readContent(),
        readSimple<Enrollment>("enrollments"),
        readSimple<ContactMessage>("messages"),
        readSimple<MediaItem>("media"),
      ]);
      return { ...content, enrollments, messages, media };
    },

    createRow: (key, row) => writeRow(key, row),
    updateRow: async (key, id, patch) => {
      const rows = await readRows(key);
      const current = rows.find((row) => row.id === id);
      if (!current) return;
      await writeRow(key, { ...current, ...patch } as WithMeta<object>);
    },
    deleteRow: async (_key, id) => {
      await db.execute(`DELETE FROM content_rows WHERE id = ${ph(1)}`, [id]);
    },
    replaceRows: async (key, rows) => {
      // Reordering rewrites every row's sort_order, so replace the collection
      // wholesale rather than diffing.
      await db.execute(`DELETE FROM content_rows WHERE collection = ${ph(1)}`, [key]);
      for (const row of rows) await writeRow(key, row);
    },

    saveSettings: (settings) => writeDoc("settings", settings),
    saveHomepage: (homepage) => writeDoc("homepage", homepage),
    saveSections: (sections) => writeDoc("sections", sections),

    addEnrollment: (row) => upsertSimple("enrollments", row.id, row),
    updateEnrollment: (id, patch) => patchSimple<Enrollment>("enrollments", id, patch),
    deleteEnrollment: async (id) => {
      await db.execute(`DELETE FROM enrollments WHERE id = ${ph(1)}`, [id]);
    },

    addMessage: (row) => upsertSimple("messages", row.id, row),
    updateMessage: (id, patch) => patchSimple<ContactMessage>("messages", id, patch),
    deleteMessage: async (id) => {
      await db.execute(`DELETE FROM messages WHERE id = ${ph(1)}`, [id]);
    },

    addMedia: (row) => upsertSimple("media", row.id, row),
    updateMedia: (id, patch) => patchSimple<MediaItem>("media", id, patch),
    deleteMedia: async (id) => {
      await db.execute(`DELETE FROM media WHERE id = ${ph(1)}`, [id]);
    },

    reset: async () => {
      await db.execute("DELETE FROM content_rows");
      await db.execute("DELETE FROM content_docs");
      await db.execute("DELETE FROM media");
      await seedIfEmpty();
    },

    initialise: async () => {
      for (const statement of schemaStatements()) await db.execute(statement);
      await seedIfEmpty();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Resolution                                                         */
/* ------------------------------------------------------------------ */

function env(name: string): string | undefined {
  const value = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return value && value.length > 0 ? value : undefined;
}

function dialectFromUrl(url: string): SqlDialect | undefined {
  if (/^mysql(2)?:\/\//i.test(url) || /^mariadb:\/\//i.test(url)) return "mysql";
  if (/^postgres(ql)?:\/\//i.test(url)) return "postgres";
  return undefined;
}

let instance: ContentRepository | undefined;
/** Resolves once per process; awaited by every server function. */
let pending: Promise<ContentRepository> | undefined;
let memoryFallback: ContentRepository | undefined;

/**
 * One memory repository per process. Must be shared: a fresh instance per call
 * would silently discard every admin edit.
 */
function memoryRepository(): ContentRepository {
  if (!memoryFallback) memoryFallback = createMemoryRepository();
  return memoryFallback;
}

async function buildRepository(): Promise<ContentRepository> {
  const driver = injectedSqlDriver ?? sqlDriverFromEnv();
  if (!driver) return memoryRepository();

  const repo = createSqlRepository(driver);
  try {
    // Creates missing tables and seeds an empty database. If the database is
    // unreachable (wrong credentials, remote access not whitelisted, or an edge
    // runtime that cannot open TCP sockets) fall back to memory so the site
    // still renders instead of erroring on every request.
    await repo.initialise();
    return repo;
  } catch (error) {
    console.error("[content] database unavailable, using in-memory content:", error);
    return memoryRepository();
  }
}

function sqlDriverFromEnv(): SqlDriver | undefined {
  const url = env("DATABASE_URL");
  if (!url) return undefined;

  const dialect = dialectFromUrl(url);
  if (dialect === "mysql") return createMysqlDriver(url);
  if (dialect === "postgres") {
    console.error("[content] DATABASE_URL is Postgres but no Postgres driver is configured.");
    return undefined;
  }
  console.error("[content] DATABASE_URL scheme not recognised; expected mysql:// or postgres://");
  return undefined;
}

/**
 * Async because the SQL driver has to verify its schema before first use.
 * Resolution is memoised, so this is one round trip per process.
 */
export async function getRepository(): Promise<ContentRepository> {
  if (instance) return instance;
  if (!pending) {
    pending = buildRepository().then((repo) => {
      instance = repo;
      pending = undefined;
      return repo;
    });
  }
  return pending;
}

/** Warms the connection during server start-up so the first request is fast. */
export function initContentStorage(): void {
  void getRepository().catch(() => undefined);
}
