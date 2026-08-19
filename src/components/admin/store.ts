/**
 * Admin data store — now backed by the server, not the browser.
 *
 * Phase 1 kept the draft in localStorage. This module keeps the exact same
 * exported surface (so no admin screen changed) but every read and write now
 * goes through the server functions in src/lib/content/server.ts, which
 * authorise the caller and persist through the repository.
 *
 * How state flows:
 *   1. SSR renders the seeded snapshot, so markup is stable and hydration-safe.
 *   2. On mount the client fetches the real snapshot + session and replaces it.
 *   3. Every mutation awaits the server, then refreshes the snapshot, so the UI
 *      only ever shows state the server actually accepted.
 *
 * Nothing sensitive lives here: the passcode is compared on the server and the
 * session is an httpOnly cookie the client cannot read.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  addMedia as addMediaFn,
  adminSignIn,
  adminSignOut,
  createRow,
  deleteEnrollment as deleteEnrollmentFn,
  deleteMedia as deleteMediaFn,
  deleteMessage as deleteMessageFn,
  deleteRow,
  fetchAdminSession,
  fetchAdminSnapshot,
  moveRow,
  resetContent,
  saveHomepage as saveHomepageFn,
  saveMediaUrl as saveMediaUrlFn,
  saveSections,
  saveSettings as saveSettingsFn,
  setEnrollmentStatus as setEnrollmentStatusFn,
  setMessageRead as setMessageReadFn,
  setRowFlag,
  updateRow,
} from "@/lib/content/server";
import { seedContent, seedMedia } from "@/lib/content/schema";
import type { CollectionRowMap as SchemaRowMap } from "@/lib/content/schema";

import type {
  CollectionKey,
  ContactMessage,
  CrudApi,
  Enrollment,
  HomepageContent,
  HomepageSection,
  Id,
  MediaItem,
  SiteSettings,
  WithMeta,
} from "./types";

/* ------------------------------------------------------------------ */
/* Row shapes                                                         */
/* ------------------------------------------------------------------ */

// Re-exported from the shared schema so the public site, the admin screens and
// the database all describe rows with one set of types.
export type {
  AchievementRow,
  CollectionRowMap,
  CourseRow,
  ExamBoardRow,
  ResultRow,
  StatRow,
  SubjectRow,
  TeacherRow,
  TestimonialRow,
  TimelineRow,
  WhyChooseUsRow,
} from "@/lib/content/schema";

type Collections = {
  [K in CollectionKey]: WithMeta<SchemaRowMap[K]>[];
};

export type AdminState = {
  collections: Collections;
  settings: SiteSettings;
  homepage: HomepageContent;
  sections: HomepageSection[];
  enrollments: Enrollment[];
  messages: ContactMessage[];
  media: MediaItem[];
  /** True when a valid server session cookie is present. */
  signedIn: boolean;
  /** False while ADMIN_PASSCODE / SESSION_SECRET are still unset on the server. */
  hardened: boolean;
  /** "memory" until a database driver is configured; "sql" once it is. */
  driver: "memory" | "sql";
  /** False until the first server snapshot has arrived. */
  loaded: boolean;
};

/* ------------------------------------------------------------------ */
/* Store plumbing                                                     */
/* ------------------------------------------------------------------ */

function initialState(): AdminState {
  return {
    ...seedContent(),
    enrollments: [],
    messages: [],
    media: seedMedia(),
    signedIn: false,
    hardened: true,
    driver: "memory",
    loaded: false,
  };
}

let state: AdminState = initialState();
let started = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setState(update: (current: AdminState) => AdminState) {
  state = update(state);
  emit();
}

/** Pulls session info, and the full snapshot when the session is valid. */
async function refresh() {
  try {
    const session = await fetchAdminSession();
    if (!session.signedIn) {
      setState((current) => ({
        ...current,
        signedIn: false,
        hardened: session.hardened,
        driver: session.driver,
        loaded: true,
      }));
      return;
    }
    const snapshot = await fetchAdminSnapshot();
    setState((current) => ({
      ...current,
      ...snapshot,
      signedIn: true,
      hardened: session.hardened,
      driver: session.driver,
      loaded: true,
    }));
  } catch {
    // Network or auth failure: keep the last known state and mark it loaded so
    // the panel renders the sign-in screen instead of an indefinite spinner.
    setState((current) => ({ ...current, signedIn: false, loaded: true }));
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started && typeof window !== "undefined") {
    started = true;
    void refresh();
  }
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
/** SSR always renders the seeded snapshot so client hydration matches. */
const getServerSnapshot = () => state;

export function useAdminState(): AdminState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Re-reads server state; exported for screens that need an explicit refresh. */
export async function refreshAdminState() {
  await refresh();
}

/* ------------------------------------------------------------------ */
/* Collection CRUD                                                    */
/* ------------------------------------------------------------------ */

/**
 * Returns the CrudApi for a collection. Each mutation awaits the server and then
 * refreshes, so a rejected write (expired session, validation failure) never
 * leaves stale data on screen.
 */
export function useCollection<K extends CollectionKey>(
  key: K,
): CrudApi<SchemaRowMap[K]> & { rows: WithMeta<SchemaRowMap[K]>[] } {
  const snapshot = useAdminState();
  const rows = useMemo(
    () => [...snapshot.collections[key]].sort((a, b) => a.order - b.order),
    [snapshot.collections, key],
  );

  const list = useCallback(() => rows, [rows]);

  const create = useCallback(
    async (input: SchemaRowMap[K]) => {
      const row = await createRow({
        data: { key, data: input as Record<string, unknown> },
      });
      await refresh();
      return row as WithMeta<SchemaRowMap[K]>;
    },
    [key],
  );

  const update = useCallback(
    async (id: Id, input: Partial<SchemaRowMap[K]>) => {
      await updateRow({ data: { key, id, data: input as Record<string, unknown> } });
      await refresh();
    },
    [key],
  );

  const remove = useCallback(
    async (id: Id) => {
      await deleteRow({ data: { key, id } });
      await refresh();
    },
    [key],
  );

  const setPublished = useCallback(
    async (id: Id, published: boolean) => {
      await setRowFlag({ data: { key, id, flag: "published", value: published } });
      await refresh();
    },
    [key],
  );

  const setFeatured = useCallback(
    async (id: Id, featured: boolean) => {
      await setRowFlag({ data: { key, id, flag: "featured", value: featured } });
      await refresh();
    },
    [key],
  );

  const move = useCallback(
    async (id: Id, direction: -1 | 1) => {
      await moveRow({ data: { key, id, direction } });
      await refresh();
    },
    [key],
  );

  return { rows, list, create, update, remove, setPublished, setFeatured, move };
}

/* ------------------------------------------------------------------ */
/* Settings / homepage / sections                                     */
/* ------------------------------------------------------------------ */

export async function saveSettings(input: SiteSettings) {
  await saveSettingsFn({ data: input });
  await refresh();
}

export async function saveHomepage(input: HomepageContent) {
  await saveHomepageFn({ data: input });
  await refresh();
}

export async function toggleSection(id: string, visible: boolean) {
  const next = state.sections.map((section) =>
    section.id === id ? { ...section, visible } : section,
  );
  await saveSections({ data: next });
  await refresh();
}

export async function moveSection(id: string, direction: -1 | 1) {
  const sorted = [...state.sections].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((section) => section.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= sorted.length) return;

  const moving = sorted[index];
  const displaced = sorted[target];
  if (!moving || !displaced) return;
  sorted[index] = displaced;
  sorted[target] = moving;

  await saveSections({
    data: sorted.map((section, position) => ({ ...section, order: position })),
  });
  await refresh();
}

/* ------------------------------------------------------------------ */
/* Inbox + media                                                      */
/* ------------------------------------------------------------------ */

export async function setEnrollmentStatus(id: Id, status: Enrollment["status"]) {
  await setEnrollmentStatusFn({ data: { id, status } });
  await refresh();
}

export async function deleteEnrollment(id: Id) {
  await deleteEnrollmentFn({ data: { id } });
  await refresh();
}

export async function setMessageRead(id: Id, read: boolean) {
  await setMessageReadFn({ data: { id, read } });
  await refresh();
}

export async function deleteMessage(id: Id) {
  await deleteMessageFn({ data: { id } });
  await refresh();
}

export async function saveMediaUrl(id: Id, url: string) {
  await saveMediaUrlFn({ data: { id, url } });
  await refresh();
}

export async function addMedia(label: string, url: string, usage: string) {
  await addMediaFn({ data: { label, url, usage } });
  await refresh();
}

export async function deleteMedia(id: Id) {
  await deleteMediaFn({ data: { id } });
  await refresh();
}

/* ------------------------------------------------------------------ */
/* Session                                                            */
/* ------------------------------------------------------------------ */

/**
 * Signs in against the server. The passcode is sent once, compared server-side
 * against ADMIN_PASSCODE, and never stored in the browser.
 */
export async function signIn(passcode: string): Promise<boolean> {
  const { ok } = await adminSignIn({ data: { passcode } });
  if (ok) await refresh();
  return ok;
}

export async function signOut() {
  await adminSignOut();
  await refresh();
}

/** Destructive: discards every edit on the server and restores seed content. */
export async function resetDraft() {
  await resetContent();
  await refresh();
}
