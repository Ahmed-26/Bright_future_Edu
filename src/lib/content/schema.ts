/**
 * Canonical site-content schema — the single source of truth shared by the
 * public site, the admin panel and the database layer.
 *
 * This module is isomorphic: it must stay free of server-only and browser-only
 * imports so the seed can be used to initialise a database, to render SSR, and
 * to hydrate the client.
 *
 * The seed is derived from src/data/institute.ts, which remains the checked-in
 * "factory default" content. Once a database is connected the seed is written
 * once on first boot and the database becomes authoritative.
 */

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
  Enrollment,
  HomepageContent,
  HomepageSection,
  MediaItem,
  SiteSettings,
  WithMeta,
} from "@/components/admin/types";

/* ------------------------------------------------------------------ */
/* Row shapes                                                         */
/* ------------------------------------------------------------------ */

/**
 * Row types are derived from the seed rather than hand-written so the admin
 * forms, the public components and the database can never drift apart.
 */
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

export type Collections = {
  [K in CollectionKey]: WithMeta<CollectionRowMap[K]>[];
};

/**
 * Everything the public site renders. Editing any part of this in the admin
 * panel changes the public site, because both read this exact document.
 */
export type SiteContent = {
  collections: Collections;
  settings: SiteSettings;
  homepage: HomepageContent;
  sections: HomepageSection[];
};

/** Inbox + media records are queryable rows, not part of the content document. */
export type SiteRecords = {
  enrollments: Enrollment[];
  messages: ContactMessage[];
  media: MediaItem[];
};

export const COLLECTION_KEYS = [
  "courses",
  "subjects",
  "teachers",
  "examBoards",
  "statistics",
  "results",
  "achievements",
  "testimonials",
  "whyChooseUs",
  "timeline",
] as const satisfies readonly CollectionKey[];

/* ------------------------------------------------------------------ */
/* Seeding                                                            */
/* ------------------------------------------------------------------ */

/** Fixed timestamp so the seed is byte-stable between server and client. */
const SEED_TIME = "2026-01-01T00:00:00.000Z";

/**
 * Deterministic ids (`prefix-index`) keep SSR markup identical to the client
 * render and make the seed idempotent when written to a database.
 */
function withMeta<T extends object>(
  rows: readonly T[],
  prefix: string,
  featuredOf?: (row: T) => boolean,
): WithMeta<T>[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${prefix}-${index + 1}`,
    published: true,
    featured: featuredOf ? featuredOf(row) : false,
    order: index,
    updatedAt: SEED_TIME,
  }));
}

export function seedCollections(): Collections {
  return {
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
  };
}

export function seedSettings(): SiteSettings {
  return {
    name: seedSite.name,
    tagline: seedSite.tagline,
    phone: seedSite.phone,
    email: seedSite.email,
    address: seedSite.address,
    hours: seedSite.hours,
    logoUrl: "/assets/logo.png",
    facebook: seedSite.socials.facebook,
    instagram: seedSite.socials.instagram,
    youtube: seedSite.socials.youtube,
    whatsapp: seedSite.socials.whatsapp,
    footerNote: "Premium O Level, A Level and IGCSE preparation.",
  };
}

export function seedHomepage(): HomepageContent {
  return {
    heroEyebrow: "Premium O Level, A Level & IGCSE Institute",
    heroHeading: "Achieve More. Learn Better. Succeed Further.",
    heroDescription:
      "Premium O Level, A Level & IGCSE preparation with experienced teachers, focused learning and proven academic results.",
    heroImageUrl: "",
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
  };
}

export function seedSections(): HomepageSection[] {
  return [
    { id: "hero", label: "Hero", source: "hero", visible: true, order: 0 },
    { id: "stats", label: "Statistics", source: "statistics", visible: true, order: 1 },
    { id: "courses", label: "Featured Courses", source: "courses", visible: true, order: 2 },
    { id: "subjects", label: "Featured Subjects", source: "subjects", visible: true, order: 3 },
    { id: "teachers", label: "Featured Teachers", source: "teachers", visible: true, order: 4 },
    { id: "boards", label: "Exam Boards", source: "examBoards", visible: true, order: 5 },
    { id: "why", label: "Why Choose Us", source: "whyChooseUs", visible: true, order: 6 },
    { id: "results", label: "Results", source: "results", visible: true, order: 7 },
    { id: "achievements", label: "Achievements", source: "achievements", visible: true, order: 8 },
    { id: "testimonials", label: "Testimonials", source: "testimonials", visible: true, order: 9 },
    { id: "cta", label: "Call To Action", source: "cta", visible: true, order: 10 },
  ];
}

export function seedContent(): SiteContent {
  return {
    collections: seedCollections(),
    settings: seedSettings(),
    homepage: seedHomepage(),
    sections: seedSections(),
  };
}

/** Media rows point at the two images the site ships with. */
export function seedMedia(): MediaItem[] {
  return [
    {
      id: "media-1",
      label: "Site logo",
      url: "/assets/logo.png",
      usage: "Navbar, footer",
      updatedAt: SEED_TIME,
    },
    {
      id: "media-2",
      label: "Homepage hero",
      url: "",
      usage: "Homepage hero, About page",
      updatedAt: SEED_TIME,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Public projection                                                  */
/* ------------------------------------------------------------------ */

/**
 * What the public site is allowed to see: published rows only, in editor order.
 * Unpublished drafts must never reach a public component, so every public read
 * goes through this function rather than touching `collections` directly.
 */
export function publicCollections(collections: Collections): Collections {
  const result = {} as Collections;
  for (const key of COLLECTION_KEYS) {
    // The per-key generic is erased here; each array is filtered/sorted in
    // place so the mapped-type relationship still holds at the boundary.
    const rows = collections[key] as WithMeta<object>[];
    const visible = rows.filter((row) => row.published).sort((a, b) => a.order - b.order);
    (result as Record<CollectionKey, unknown>)[key] = visible;
  }
  return result;
}

export function isSectionVisible(sections: HomepageSection[], id: string): boolean {
  return sections.find((section) => section.id === id)?.visible ?? true;
}

export function orderedSections(sections: HomepageSection[]): HomepageSection[] {
  return [...sections].sort((a, b) => a.order - b.order);
}
