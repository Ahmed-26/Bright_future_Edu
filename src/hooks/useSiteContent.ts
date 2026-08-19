/**
 * Access to the published site content loaded once by the root route.
 *
 * Every public page reads through this hook instead of importing the static
 * seed, which is what makes admin edits appear on the frontend. The root loader
 * already falls back to the seed if the content read fails; this hook adds a
 * second, per-collection fallback so a collection an admin has emptied does not
 * render as a blank section.
 */

import { useLoaderData } from "@tanstack/react-router";

import { seedContent } from "@/lib/content/schema";
import type { Collections, SiteContent } from "@/lib/content/schema";
import type { CollectionKey, WithMeta } from "@/components/admin/types";

/** Root loader data. `from: "__root__"` works from any descendant route. */
export function useSiteContent(): SiteContent {
  return useLoaderData({ from: "__root__" });
}

export function useSiteSettings() {
  return useSiteContent().settings;
}

export function useHomepage() {
  return useSiteContent().homepage;
}

export function useSections() {
  return useSiteContent().sections;
}

/**
 * Rows for one collection, already published-filtered and ordered by the server.
 * Falls back to the seed rows only when the live collection is completely empty.
 */
export function useCollection<K extends CollectionKey>(key: K): Collections[K] {
  const live = useSiteContent().collections[key];
  if (live && live.length > 0) return live;
  return seedContent().collections[key];
}

/** Convenience for cards that need the `featured` flag honoured. */
export function featuredOnly<T extends WithMeta<object>>(rows: T[]): T[] {
  const flagged = rows.filter((row) => row.featured);
  return flagged.length > 0 ? flagged : rows;
}
