/**
 * SERVER-ONLY MySQL / MariaDB driver.
 *
 * Implements the `SqlDriver` surface used by src/lib/content/repository.ts so
 * admin edits are written to a real database instead of process memory.
 *
 * Connection is configured with a single env var:
 *
 *   DATABASE_URL=mysql://user:password@host:3306/database
 *
 * The pool is created lazily on the first query, and `mysql2` is loaded through
 * a dynamic import with a non-literal specifier so the bundler leaves it
 * external. That matters because the driver opens a raw TCP socket: it works on
 * Node hosting (Hostinger VPS / Node app, or any container) but not on edge
 * runtimes such as Cloudflare Workers, which cannot open TCP connections. On an
 * edge deploy the import fails, the repository logs it and falls back to the
 * in-memory driver rather than taking the site down.
 */

import type { Pool } from "mysql2/promise";

import type { SqlDriver } from "./repository";

/** Small pool: shared hosting plans cap concurrent MySQL connections. */
const CONNECTION_LIMIT = 4;

export function createMysqlDriver(url: string): SqlDriver {
  let poolPromise: Promise<Pool> | undefined;

  const pool = () => {
    if (!poolPromise) {
      poolPromise = (async () => {
        // Non-literal specifier: keeps mysql2 out of the client/edge bundle.
        const specifier = "mysql2/promise";
        const mysql = (await import(/* @vite-ignore */ specifier)) as typeof import("mysql2/promise");
        return mysql.createPool({
          uri: url,
          connectionLimit: CONNECTION_LIMIT,
          waitForConnections: true,
          // Content is stored as JSON strings; keep them as strings.
          typeCast: true,
          charset: "utf8mb4",
        });
      })().catch((error) => {
        // Do not cache a failed connection attempt.
        poolPromise = undefined;
        throw error;
      });
    }
    return poolPromise;
  };

  return {
    dialect: "mysql",

    query: async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
      const connection = await pool();
      // `query` rather than `execute`: DDL and multi-shape statements are not
      // safe to keep in the prepared-statement cache, and params are still bound.
      const [rows] = await connection.query(sql, params);
      return (Array.isArray(rows) ? rows : []) as T[];
    },

    execute: async (sql: string, params: unknown[] = []) => {
      const connection = await pool();
      await connection.query(sql, params);
    },
  };
}
