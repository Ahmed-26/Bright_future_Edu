/**
 * SERVER-ONLY content repository.
 *
 * Defines the storage contract for all site content and provides two drivers:
 *
 *   - `memory`  — process-local, seeded from src/data/institute.ts. Used until a
 *                 database is configured. Survives navigation and is shared by
 *                 every visitor of that server process, but is lost on restart
 *                 and is NOT shared between Cloudflare Worker isolates.
 *   - `sql`     — any Postgres/SQLite-compatible driver injected via
 *                 `setSqlDriver()`. Schema lives in migrations/0001_init.sql.
 *
 * The driver is chosen once at module init. Adding real credentials later is a
 * one-line change in `resolveDriver()` — no calling code changes, because every
 * server function talks to `repository` and nothing else.
 *
 * Never import this from a component: it is only reachable through the server
 * functions in src/lib/content/server.ts.
 */

import type {
  ContactMessage,
  Enrollment,
  HomepageContent,
  Id,
  MediaItem,
  SiteSettings,
  WithMeta,
} from "@/components/admin/types";
import type { HomepageSection } from "@/components/admin/types";

import type { Collections, SiteContent } from "./schema";
import { COLLECTION_KEYS, seedContent, seedMedia } from "./schema";
import type { CollectionKey } from "@/components/admin/types";

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
 * Minimal query surface every candidate database can satisfy (node-postgres,
 * Neon serverless, Cloudflare D1 via a thin adapter, bun:sqlite, ...).
 * Parameters are always bound, never interpolated.
 */
export type SqlDriver = {
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<T[]>;
  execute: (sql: string, params?: unknown[]) => Promise<void>;
};

let injectedSqlDriver: SqlDriver | undefined;

/**
 * Call once during server start-up with a configured client to switch the site
 * from in-memory content to durable storage. Until then the memory driver runs.
 */
export function setSqlDriver(driver: SqlDriver) {
  injectedSqlDriver = driver;
}

/**
 * Content documents (settings, homepage, sections) live in a single-row
 * key/value table; collections and records live in `content_rows` keyed by
 * collection. This keeps one schema for every collection so adding a collection
 * needs no migration.
 */
function createSqlRepository(db: SqlDriver): ContentRepository {
  const readDoc = async <T>(key: string, fallback: T): Promise<T> => {
    const rows = await db.query<{ value: string }>(
      "SELECT value FROM content_docs WHERE key = $1",
      [key],
    );
    const raw = rows[0]?.value;
    return raw ? (JSON.parse(raw) as T) : fallback;
  };

  const writeDoc = async (key: string, value: unknown) => {
    await db.execute(
      `INSERT INTO content_docs (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, JSON.stringify(value)],
    );
  };

  const readRows = async (collection: string): Promise<WithMeta<object>[]> => {
    const rows = await db.query<{ data: string }>(
      "SELECT data FROM content_rows WHERE collection = $1 ORDER BY sort_order ASC",
      [collection],
    );
    return rows.map((row) => JSON.parse(row.data) as WithMeta<object>);
  };

  const writeRow = async (collection: string, row: WithMeta<object>) => {
    await db.execute(
      `INSERT INTO content_rows (id, collection, sort_order, data) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET collection = $2, sort_order = $3, data = $4`,
      [row.id, collection, row.order, JSON.stringify(row)],
    );
  };

  const readCollections = async (): Promise<Collections> => {
    const seeded = seedContent().collections;
    const result = {} as Collections;
    for (const key of COLLECTION_KEYS) {
      const stored = await readRows(key);
      (result as Record<CollectionKey, unknown>)[key] =
        stored.length > 0 ? stored : (seeded[key] as WithMeta<object>[]);
    }
    return result;
  };

  const readSimple = async <T>(table: string): Promise<T[]> => {
    const rows = await db.query<{ data: string }>(
      `SELECT data FROM ${table} ORDER BY created_at DESC`,
    );
    return rows.map((row) => JSON.parse(row.data) as T);
  };

  const upsertSimple = async (table: string, id: Id, data: unknown) => {
    await db.execute(
      `INSERT INTO ${table} (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = $2`,
      [id, JSON.stringify(data)],
    );
  };

  const patchSimple = async <T extends { id: Id }>(
    table: string,
    id: Id,
    patch: Partial<T>,
  ): Promise<void> => {
    const rows = await db.query<{ data: string }>(`SELECT data FROM ${table} WHERE id = $1`, [id]);
    const raw = rows[0]?.data;
    if (!raw) return;
    const merged = { ...(JSON.parse(raw) as T), ...patch };
    await upsertSimple(table, id, merged);
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
      return {
        ...content,
        enrollments,
        messages,
        media: media.length > 0 ? media : seedMedia(),
      };
    },

    createRow: (key, row) => writeRow(key, row),
    updateRow: async (key, id, patch) => {
      const rows = await readRows(key);
      const current = rows.find((row) => row.id === id);
      if (!current) return;
      await writeRow(key, { ...current, ...patch } as WithMeta<object>);
    },
    deleteRow: async (_key, id) => {
      await db.execute("DELETE FROM content_rows WHERE id = $1", [id]);
    },
    replaceRows: async (key, rows) => {
      // Reordering rewrites every row's sort_order, so replace the collection
      // wholesale rather than diffing.
      await db.execute("DELETE FROM content_rows WHERE collection = $1", [key]);
      for (const row of rows) await writeRow(key, row);
    },

    saveSettings: (settings) => writeDoc("settings", settings),
    saveHomepage: (homepage) => writeDoc("homepage", homepage),
    saveSections: (sections) => writeDoc("sections", sections),

    addEnrollment: (row) => upsertSimple("enrollments", row.id, row),
    updateEnrollment: (id, patch) => patchSimple<Enrollment>("enrollments", id, patch),
    deleteEnrollment: async (id) => {
      await db.execute("DELETE FROM enrollments WHERE id = $1", [id]);
    },

    addMessage: (row) => upsertSimple("messages", row.id, row),
    updateMessage: (id, patch) => patchSimple<ContactMessage>("messages", id, patch),
    deleteMessage: async (id) => {
      await db.execute("DELETE FROM messages WHERE id = $1", [id]);
    },

    addMedia: (row) => upsertSimple("media", row.id, row),
    updateMedia: (id, patch) => patchSimple<MediaItem>("media", id, patch),
    deleteMedia: async (id) => {
      await db.execute("DELETE FROM media WHERE id = $1", [id]);
    },

    reset: async () => {
      await db.execute("DELETE FROM content_rows");
      await db.execute("DELETE FROM content_docs");
    },
  };
}

/* ------------------------------------------------------------------ */
/* Resolution                                                         */
/* ------------------------------------------------------------------ */

let instance: ContentRepository | undefined;

function resolveDriver(): ContentRepository {
  if (injectedSqlDriver) return createSqlRepository(injectedSqlDriver);
  return createMemoryRepository();
}

/** Lazily resolved so a driver injected during start-up is picked up. */
export function repository(): ContentRepository {
  if (!instance) instance = resolveDriver();
  return instance;
}
