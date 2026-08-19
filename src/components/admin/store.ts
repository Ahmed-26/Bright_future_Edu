/**
 * PHASE 1 admin data store.
 *
 * Seeded from src/data/institute.ts so every admin screen is exercised against
 * the real content shape. State lives in a module-level snapshot exposed through
 * useSyncExternalStore, and is mirrored to localStorage so edits survive a reload
 * while the screens are being reviewed.
 *
 * IMPORTANT: this is NOT a database. Nothing here is shared between browsers and
 * nothing reaches the public site. In phase 2 every function below is replaced by
 * a TanStack Start server function hitting a real database; the exported hook
 * signatures and the CrudApi contract stay identical so the screens don't change.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  achievements as seedAchievements,
  courses as seedCourses,
  examBoards as seedExamBoards,
  results as seedResults,
  site as seedSite,
  stats as seedStats,
  subjects as seedSubjects,
  teachers as seedTeachers,
  testimonials as seedTestimonials,
  timeline as seedTimeline,
  whyChooseUs as seedWhyChooseUs,
} from "@/data/institute";

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

const STORAGE_KEY = "bfge.admin.draft.v1";

/* ------------------------------------------------------------------ */
/* Row shapes per collection                                          */
/* ------------------------------------------------------------------ */

export type CourseRow = (typeof seedCourses)[number];
export type SubjectRow = (typeof seedSubjects)[number];
export type TeacherRow = (typeof seedTeachers)[number];
export type ExamBoardRow = (typeof seedExamBoards)[number];
export type StatRow = (typeof seedStats)[number];
export type ResultRow = (typeof seedResults)[number];
export type AchievementRow = (typeof seedAchievements)[number];
export type TestimonialRow = (typeof seedTestimonials)[number];
export type WhyChooseUsRow = (typeof seedWhyChooseUs)[number];
export type TimelineRow = (typeof seedTimeline)[number];

export type CollectionRowMap = {
  courses: CourseRow;
  subjects: SubjectRow;
  teachers: TeacherRow;
  examBoards: ExamBoardRow;
  statistics: StatRow;
  results: ResultRow;
  achievements: AchievementRow;
  testimonials: TestimonialRow;
  whyChooseUs: WhyChooseUsRow;
  timeline: TimelineRow;
};

type Collections = {
  [K in CollectionKey]: WithMeta<CollectionRowMap[K]>[];
};

export type AdminState = {
  collections: Collections;
  settings: SiteSettings;
  homepage: HomepageContent;
  sections: HomepageSection[];
  enrollments: Enrollment[];
  messages: ContactMessage[];
  media: MediaItem[];
  /** Phase 1 session flag only — replaced by real server sessions in phase 2. */
  signedIn: boolean;
};

/* ------------------------------------------------------------------ */
/* Seeding                                                            */
/* ------------------------------------------------------------------ */

let idCounter = 0;
function nextId(prefix: string): Id {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

const now = () => new Date().toISOString();

/**
 * Swaps two positions and rewrites `order` to match the new array order.
 * Written without tuple destructuring because `noUncheckedIndexedAccess`
 * types indexed reads as possibly-undefined.
 */
function reorder<T extends { order: number }>(rows: T[], index: number, target: number): T[] {
  const sorted = [...rows].sort((a, b) => a.order - b.order);
  if (index < 0 || target < 0 || index >= sorted.length || target >= sorted.length) return rows;
  const moving = sorted[index];
  const displaced = sorted[target];
  if (!moving || !displaced) return rows;
  sorted[index] = displaced;
  sorted[target] = moving;
  return sorted.map((row, position) => ({ ...row, order: position }));
}

function withMeta<T extends object>(
  rows: readonly T[],
  prefix: string,
  featuredOf?: (row: T) => boolean,
): WithMeta<T>[] {
  return rows.map((row, index) => ({
    ...row,
    id: nextId(prefix),
    published: true,
    featured: featuredOf ? featuredOf(row) : false,
    order: index,
    updatedAt: now(),
  }));
}

function seedState(): AdminState {
  return {
    collections: {
      courses: withMeta(seedCourses, "course", (c) => c.featured),
      subjects: withMeta(seedSubjects, "subject"),
      teachers: withMeta(seedTeachers, "teacher"),
      examBoards: withMeta(seedExamBoards, "board"),
      statistics: withMeta(seedStats, "stat"),
      results: withMeta(seedResults, "result", (r) => r.grade.includes("A")),
      achievements: withMeta(seedAchievements, "achievement"),
      testimonials: withMeta(seedTestimonials, "testimonial"),
      whyChooseUs: withMeta(seedWhyChooseUs, "why"),
      timeline: withMeta(seedTimeline, "milestone"),
    },
    settings: {
      name: seedSite.name,
      tagline: seedSite.tagline,
      phone: seedSite.phone,
      email: seedSite.email,
      address: seedSite.address,
      hours: seedSite.hours,
      logoUrl: "/src/assets/logo/P_logo.png",
      facebook: seedSite.socials.facebook,
      instagram: seedSite.socials.instagram,
      youtube: seedSite.socials.youtube,
      whatsapp: seedSite.socials.whatsapp,
      footerNote: "Premium O Level, A Level and IGCSE preparation.",
    },
    homepage: {
      heroEyebrow: "Premium O Level, A Level & IGCSE Institute",
      heroHeading: "Achieve More. Learn Better. Succeed Further.",
      heroDescription:
        "Premium O Level, A Level & IGCSE preparation with experienced teachers, focused learning and proven academic results.",
      heroImageUrl: "/src/assets/hero-students.jpg",
      heroBullets: [
        "Cambridge & Edexcel pathways",
        "Small groups with focused feedback",
        "Past-paper driven preparation",
      ],
      primaryCtaLabel: "Explore Courses",
      primaryCtaHref: "/courses",
      secondaryCtaLabel: "Enroll Now",
      secondaryCtaHref: "/admissions",
      ctaHeading: "Ready to start your best academic year yet?",
      ctaDescription:
        "Speak to an academic advisor about the right course, level and schedule for your goals.",
      ctaButtonLabel: "Apply for Admission",
      ctaButtonHref: "/admissions",
    },
    sections: [
      { id: "hero", label: "Hero", source: "hero", visible: true, order: 0 },
      { id: "stats", label: "Statistics", source: "statistics", visible: true, order: 1 },
      { id: "courses", label: "Featured Courses", source: "courses", visible: true, order: 2 },
      { id: "subjects", label: "Featured Subjects", source: "subjects", visible: true, order: 3 },
      { id: "teachers", label: "Featured Teachers", source: "teachers", visible: true, order: 4 },
      { id: "boards", label: "Exam Boards", source: "examBoards", visible: true, order: 5 },
      { id: "why", label: "Why Choose Us", source: "whyChooseUs", visible: true, order: 6 },
      { id: "results", label: "Results", source: "results", visible: true, order: 7 },
      {
        id: "achievements",
        label: "Achievements",
        source: "achievements",
        visible: true,
        order: 8,
      },
      {
        id: "testimonials",
        label: "Testimonials",
        source: "testimonials",
        visible: true,
        order: 9,
      },
      { id: "cta", label: "Call To Action", source: "cta", visible: true, order: 10 },
    ],
    // Sample inbox rows so the screens can be reviewed. Replaced by real
    // submissions once the database and public forms are wired in phase 2.
    enrollments: [
      {
        id: "enr-1",
        name: "Sample Applicant — Ali",
        email: "applicant.one@example.com",
        phone: "+92 300 000 0001",
        course: "IGCSE Mathematics (Extended)",
        level: "IGCSE",
        status: "new",
        submittedAt: "2026-08-14T09:20:00.000Z",
        note: "Asked about the Saturday morning batch.",
      },
      {
        id: "enr-2",
        name: "Sample Applicant — Zara",
        email: "applicant.two@example.com",
        phone: "+92 300 000 0002",
        course: "A Level Economics",
        level: "A Level",
        status: "contacted",
        submittedAt: "2026-08-12T14:05:00.000Z",
        note: "Sent fee structure, awaiting reply.",
      },
      {
        id: "enr-3",
        name: "Sample Applicant — Bilal",
        email: "applicant.three@example.com",
        phone: "+92 300 000 0003",
        course: "O Level Accounting",
        level: "O Level",
        status: "enrolled",
        submittedAt: "2026-08-05T11:40:00.000Z",
        note: "Joined the evening batch.",
      },
    ],
    messages: [
      {
        id: "msg-1",
        name: "Sample Enquiry — Ms. N.",
        email: "enquiry.one@example.com",
        subject: "Fee structure for two subjects",
        message:
          "Could you share the monthly fee if my daughter takes both Physics and Chemistry at IGCSE?",
        read: false,
        submittedAt: "2026-08-15T08:15:00.000Z",
      },
      {
        id: "msg-2",
        name: "Sample Enquiry — Mr. S.",
        email: "enquiry.two@example.com",
        subject: "Weekend batch availability",
        message: "Are there any weekend-only options for A Level Business?",
        read: true,
        submittedAt: "2026-08-11T16:30:00.000Z",
      },
    ],
    media: [
      {
        id: "media-1",
        label: "Site logo",
        url: "/src/assets/logo/P_logo.png",
        usage: "Navbar, footer",
        updatedAt: "2026-07-01T00:00:00.000Z",
      },
      {
        id: "media-2",
        label: "Homepage hero",
        url: "/src/assets/hero-students.jpg",
        usage: "Homepage hero, About page",
        updatedAt: "2026-07-01T00:00:00.000Z",
      },
    ],
    signedIn: false,
  };
}

/* ------------------------------------------------------------------ */
/* Store plumbing                                                     */
/* ------------------------------------------------------------------ */

let state: AdminState = seedState();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or blocked (private mode). Edits still work in-memory.
  }
}

/** Restores the previous draft once, on the client only, to keep SSR output stable. */
function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<AdminState>;
    if (!parsed || typeof parsed !== "object" || !parsed.collections) return;
    state = {
      ...state,
      ...parsed,
      collections: { ...state.collections, ...parsed.collections },
      settings: { ...state.settings, ...parsed.settings },
      homepage: { ...state.homepage, ...parsed.homepage },
    };
    emit();
  } catch {
    // Corrupt draft: fall back to the seeded state rather than crashing the panel.
  }
}

function setState(update: (current: AdminState) => AdminState) {
  state = update(state);
  persist();
  emit();
}

function subscribe(listener: () => void) {
  hydrateOnce();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
/** SSR must not read localStorage, so it always renders the seeded snapshot. */
const getServerSnapshot = () => state;

export function useAdminState(): AdminState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ------------------------------------------------------------------ */
/* Collection CRUD                                                    */
/* ------------------------------------------------------------------ */

function mutateCollection<K extends CollectionKey>(
  key: K,
  update: (rows: WithMeta<CollectionRowMap[K]>[]) => WithMeta<CollectionRowMap[K]>[],
) {
  setState((current) => ({
    ...current,
    collections: { ...current.collections, [key]: update(current.collections[key]) },
  }));
}

/**
 * Returns the CrudApi for a collection. The async signatures mirror what real
 * server-function calls will look like, so screens already await their writes.
 */
export function useCollection<K extends CollectionKey>(
  key: K,
): CrudApi<CollectionRowMap[K]> & { rows: WithMeta<CollectionRowMap[K]>[] } {
  const snapshot = useAdminState();
  const rows = useMemo(
    () => [...snapshot.collections[key]].sort((a, b) => a.order - b.order),
    [snapshot.collections, key],
  );

  const list = useCallback(() => rows, [rows]);

  const create = useCallback(
    async (input: CollectionRowMap[K]) => {
      const row = {
        ...input,
        id: nextId(key),
        published: true,
        featured: false,
        order: state.collections[key].length,
        updatedAt: now(),
      } as WithMeta<CollectionRowMap[K]>;
      mutateCollection(key, (existing) => [...existing, row]);
      return row;
    },
    [key],
  );

  const update = useCallback(
    async (id: Id, input: Partial<CollectionRowMap[K]>) => {
      mutateCollection(key, (existing) =>
        existing.map((row) => (row.id === id ? { ...row, ...input, updatedAt: now() } : row)),
      );
    },
    [key],
  );

  const remove = useCallback(
    async (id: Id) => {
      mutateCollection(key, (existing) => existing.filter((row) => row.id !== id));
    },
    [key],
  );

  const setPublished = useCallback(
    async (id: Id, published: boolean) => {
      mutateCollection(key, (existing) =>
        existing.map((row) => (row.id === id ? { ...row, published, updatedAt: now() } : row)),
      );
    },
    [key],
  );

  const setFeatured = useCallback(
    async (id: Id, featured: boolean) => {
      mutateCollection(key, (existing) =>
        existing.map((row) => (row.id === id ? { ...row, featured, updatedAt: now() } : row)),
      );
    },
    [key],
  );

  const move = useCallback(
    async (id: Id, direction: -1 | 1) => {
      mutateCollection(key, (existing) => {
        const sorted = [...existing].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex((row) => row.id === id);
        if (index === -1) return existing;
        return reorder(sorted, index, index + direction);
      });
    },
    [key],
  );

  return { rows, list, create, update, remove, setPublished, setFeatured, move };
}

/* ------------------------------------------------------------------ */
/* Settings / homepage / sections                                     */
/* ------------------------------------------------------------------ */

export async function saveSettings(input: SiteSettings) {
  setState((current) => ({ ...current, settings: input }));
}

export async function saveHomepage(input: HomepageContent) {
  setState((current) => ({ ...current, homepage: input }));
}

export async function toggleSection(id: string, visible: boolean) {
  setState((current) => ({
    ...current,
    sections: current.sections.map((s) => (s.id === id ? { ...s, visible } : s)),
  }));
}

export async function moveSection(id: string, direction: -1 | 1) {
  setState((current) => {
    const sorted = [...current.sections].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((s) => s.id === id);
    if (index === -1) return current;
    return { ...current, sections: reorder(sorted, index, index + direction) };
  });
}

/* ------------------------------------------------------------------ */
/* Inbox + media                                                      */
/* ------------------------------------------------------------------ */

export async function setEnrollmentStatus(id: Id, status: Enrollment["status"]) {
  setState((current) => ({
    ...current,
    enrollments: current.enrollments.map((e) => (e.id === id ? { ...e, status } : e)),
  }));
}

export async function deleteEnrollment(id: Id) {
  setState((current) => ({
    ...current,
    enrollments: current.enrollments.filter((e) => e.id !== id),
  }));
}

export async function setMessageRead(id: Id, read: boolean) {
  setState((current) => ({
    ...current,
    messages: current.messages.map((m) => (m.id === id ? { ...m, read } : m)),
  }));
}

export async function deleteMessage(id: Id) {
  setState((current) => ({
    ...current,
    messages: current.messages.filter((m) => m.id !== id),
  }));
}

export async function saveMediaUrl(id: Id, url: string) {
  setState((current) => ({
    ...current,
    media: current.media.map((m) => (m.id === id ? { ...m, url, updatedAt: now() } : m)),
  }));
}

export async function addMedia(label: string, url: string, usage: string) {
  setState((current) => ({
    ...current,
    media: [...current.media, { id: nextId("media"), label, url, usage, updatedAt: now() }],
  }));
}

export async function deleteMedia(id: Id) {
  setState((current) => ({ ...current, media: current.media.filter((m) => m.id !== id) }));
}

/* ------------------------------------------------------------------ */
/* Phase 1 session gate                                               */
/* ------------------------------------------------------------------ */

/**
 * Local-only gate so the panel isn't wide open during review.
 * This is NOT security: it runs entirely in the browser and protects nothing.
 * Phase 2 replaces it with a server session + hashed credentials, at which point
 * /admin and every mutation is enforced on the server.
 */
export const REVIEW_PASSCODE = "bfge-admin";

export async function signIn(passcode: string): Promise<boolean> {
  if (passcode !== REVIEW_PASSCODE) return false;
  setState((current) => ({ ...current, signedIn: true }));
  return true;
}

export async function signOut() {
  setState((current) => ({ ...current, signedIn: false }));
}

export function resetDraft() {
  state = seedState();
  persist();
  emit();
}
