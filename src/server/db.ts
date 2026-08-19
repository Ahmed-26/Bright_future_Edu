import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";

import {
  achievements as seedAchievements,
  courses as seedCourses,
  examBoards as seedBoards,
  results as seedResults,
  site as seedSite,
  stats as seedStats,
  subjects as seedSubjects,
  teachers as seedTeachers,
  testimonials as seedTestimonials,
  timeline as seedTimeline,
  whyChooseUs as seedWhy,
} from "@/data/institute";
import type {
  AchievementRecord,
  AdminState,
  CollectionName,
  CourseRecord,
  EnrollmentRecord,
  ExamBoardRecord,
  HomepageContent,
  MediaRecord,
  MessageRecord,
  PublicCatalog,
  ResultRecord,
  SiteSettings,
  StatRecord,
  SubjectRecord,
  SyllabusRecord,
  TeacherRecord,
  TestimonialRecord,
  TimelineRecord,
  WhyChooseRecord,
} from "@/lib/cms-types";
import { BOARDS, LEVELS } from "@/lib/cms-types";

export const DEFAULT_ADMIN_EMAIL = "admin@brightfuture.edu";
export const DEFAULT_ADMIN_PASSWORD = "Admin@12345";

type AdminAccount = {
  email: string;
  salt: string;
  hash: string;
};

export type CmsDatabase = {
  sessionSecret: string;
  admin: AdminAccount;
  settings: SiteSettings;
  homepage: HomepageContent;
  stats: StatRecord[];
  examBoards: ExamBoardRecord[];
  subjects: SubjectRecord[];
  teachers: TeacherRecord[];
  courses: CourseRecord[];
  syllabuses: SyllabusRecord[];
  results: ResultRecord[];
  achievements: AchievementRecord[];
  testimonials: TestimonialRecord[];
  whyChooseUs: WhyChooseRecord[];
  timeline: TimelineRecord[];
  enrollments: EnrollmentRecord[];
  messages: MessageRecord[];
  media: MediaRecord[];
};

const FILE_PATH = join(process.cwd(), "data", "cms.json");

type GlobalCms = typeof globalThis & {
  __bfCms?: CmsDatabase;
  __bfCmsLock?: Promise<void>;
};

function g(): GlobalCms {
  return globalThis as GlobalCms;
}

function nid(): string {
  return randomBytes(8).toString("hex");
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

export function signValue(value: string, secret: string) {
  const body = Buffer.from(value).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function unsignValue(token: string, secret: string) {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function createSeed(): CmsDatabase {
  const password = process.env["ADMIN_PASSWORD"] ?? DEFAULT_ADMIN_PASSWORD;
  const email = (process.env["ADMIN_EMAIL"] ?? DEFAULT_ADMIN_EMAIL).toLowerCase();
  const { salt, hash } = hashPassword(password);

  const settings: SiteSettings = {
    name: seedSite.name,
    tagline: seedSite.tagline,
    phone: seedSite.phone,
    email: seedSite.email,
    address: seedSite.address,
    hours: seedSite.hours,
    logo: "",
    favicon: "",
    footerText:
      "Premium Cambridge O Level, A Level and IGCSE preparation built around experienced faculty, small groups and relentless past-paper practice.",
    mapsUrl: "",
    socials: { ...seedSite.socials },
  };

  const homepage: HomepageContent = {
    heroEyebrow: "Premium O Level, A Level & IGCSE Institute",
    heroHeading: "Achieve More. Learn Better. Succeed Further.",
    heroDescription:
      "Premium O Level, A Level & IGCSE preparation with experienced teachers, focused learning and proven academic results.",
    heroImage: "",
    heroCaption: "Board-ready learning for every student",
    heroPrimaryLabel: "Explore Courses",
    heroPrimaryHref: "/courses",
    heroSecondaryLabel: "Enroll Now",
    heroSecondaryHref: "/admissions",
    heroBullets: [
      "Cambridge & Edexcel pathways",
      "Small groups with focused feedback",
      "Past-paper driven preparation",
    ],
    heroPublished: true,
    statsPublished: true,
    boardsPublished: true,
    coursesPublished: true,
    subjectsPublished: true,
    whyPublished: true,
    whyTitle: "Why families trust Bright Future Group of Education",
    whyDescription:
      "Experienced faculty, board-focused teaching and parent-friendly communication built around measurable improvement.",
    teachersPublished: true,
    resultsPublished: true,
    testimonialsPublished: true,
    ctaEyebrow: "Final enrollment",
    ctaHeading: "Ready to Achieve Your Academic Goals?",
    ctaDescription: "Join our expert-led O Level, A Level & IGCSE preparation programs.",
    ctaPrimaryLabel: "Explore Courses",
    ctaPrimaryHref: "/courses",
    ctaSecondaryLabel: "Enroll Now",
    ctaSecondaryHref: "/admissions",
    ctaPublished: true,
  };

  const subjects: SubjectRecord[] = seedSubjects.map((s, i) => ({
    id: nid(),
    slug: s.slug,
    name: s.name,
    levels: s.levels,
    description: s.description,
    image: "",
    published: true,
    featured: i < 8,
    sortOrder: i,
  }));

  const teachers: TeacherRecord[] = seedTeachers.map((t, i) => ({
    id: nid(),
    slug: t.slug,
    name: t.name,
    designation: t.designation,
    subjects: t.subjects,
    qualification: t.qualification,
    experience: t.experience,
    bio: t.bio,
    initials: t.initials,
    image: "",
    facebook: "",
    instagram: "",
    published: true,
    featured: i < 4,
    sortOrder: i,
  }));

  const courses: CourseRecord[] = seedCourses.map((c, i) => ({
    id: nid(),
    slug: c.slug,
    title: c.title,
    subject: c.subject,
    subjectSlug: c.subjectSlug,
    level: c.level,
    board: c.board,
    code: c.code,
    duration: c.duration,
    schedule: c.schedule,
    fee: c.fee,
    teacher: c.teacher,
    teacherSlug: c.teacherSlug,
    short: c.short,
    description: c.description,
    image: "",
    syllabus: c.syllabus,
    requirements: c.requirements,
    benefits: c.benefits,
    featured: c.featured,
    published: true,
    sortOrder: i,
  }));

  const syllabuses: SyllabusRecord[] = seedCourses.map((c, i) => ({
    id: nid(),
    board: c.board,
    qualification: c.level,
    subject: c.subject,
    code: c.code,
    papers: "",
    topics: c.syllabus,
    published: true,
    sortOrder: i,
  }));

  return {
    sessionSecret: randomBytes(32).toString("hex"),
    admin: { email, salt, hash },
    settings,
    homepage,
    stats: seedStats.map((s, i) => ({
      id: nid(),
      value: s.value,
      suffix: s.suffix,
      label: s.label,
      published: true,
      sortOrder: i,
    })),
    examBoards: seedBoards.map((b, i) => ({
      id: nid(),
      name: b.name,
      note: b.note,
      image: "",
      published: true,
      featured: true,
      sortOrder: i,
    })),
    subjects,
    teachers,
    courses,
    syllabuses,
    results: seedResults.map((r, i) => ({
      id: nid(),
      ...r,
      featured: r.grade.includes("A"),
      published: true,
      sortOrder: i,
    })),
    achievements: seedAchievements.map((a, i) => ({
      id: nid(),
      title: a.title,
      category: a.category,
      student: a.student ?? "",
      subject: "",
      level: "",
      board: "",
      grade: "",
      year: a.year,
      description: a.description,
      image: "",
      featured: i < 4,
      published: true,
      sortOrder: i,
    })),
    testimonials: seedTestimonials.map((t, i) => ({
      id: nid(),
      ...t,
      image: "",
      featured: true,
      published: true,
      sortOrder: i,
    })),
    whyChooseUs: seedWhy.map((w, i) => ({
      id: nid(),
      title: w.title,
      text: w.text,
      published: true,
      featured: true,
      sortOrder: i,
    })),
    timeline: seedTimeline.map((t, i) => ({
      id: nid(),
      year: t.year,
      text: t.text,
      published: true,
      sortOrder: i,
    })),
    enrollments: [],
    messages: [],
    media: [],
  };
}

function persist(db: CmsDatabase) {
  try {
    mkdirSync(dirname(FILE_PATH), { recursive: true });
    writeFileSync(FILE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Cloudflare / read-only hosts keep the in-memory copy only.
  }
  g().__bfCms = db;
}

function load(): CmsDatabase {
  const cached = g().__bfCms;
  if (cached) return cached;
  if (existsSync(FILE_PATH)) {
    try {
      const parsed = JSON.parse(readFileSync(FILE_PATH, "utf8")) as CmsDatabase;
      g().__bfCms = parsed;
      return parsed;
    } catch {
      // fall through to seed
    }
  }
  const seeded = createSeed();
  persist(seeded);
  return seeded;
}

async function mutate<T>(fn: (db: CmsDatabase) => T): Promise<T> {
  const holder = g();
  const prev = holder.__bfCmsLock ?? Promise.resolve();
  let release: () => void = () => undefined;
  holder.__bfCmsLock = new Promise<void>((resolve) => {
    release = resolve;
  });
  await prev;
  try {
    const db = load();
    const result = fn(db);
    persist(db);
    return result;
  } finally {
    release();
  }
}

export function getDb(): CmsDatabase {
  return load();
}

export function published<T extends { published: boolean; sortOrder: number }>(rows: T[]) {
  return [...rows].filter((r) => r.published).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function toPublicCatalog(db: CmsDatabase): PublicCatalog {
  const courses = published(db.courses);
  const counts = new Map<string, number>();
  for (const c of courses) {
    counts.set(c.subjectSlug, (counts.get(c.subjectSlug) ?? 0) + 1);
  }
  const subjects = published(db.subjects).map((s) => ({
    ...s,
    courses: counts.get(s.slug) ?? 0,
  }));

  return {
    settings: db.settings,
    homepage: db.homepage,
    stats: published(db.stats),
    examBoards: published(db.examBoards),
    subjects,
    teachers: published(db.teachers),
    courses,
    syllabuses: published(db.syllabuses),
    results: published(db.results),
    achievements: published(db.achievements),
    testimonials: published(db.testimonials),
    whyChooseUs: published(db.whyChooseUs),
    timeline: published(db.timeline),
    levels: LEVELS,
    boards: BOARDS,
  };
}

export function toAdminState(db: CmsDatabase): AdminState {
  const sort = <T extends { sortOrder?: number; createdAt?: string }>(rows: T[]) =>
    [...rows].sort((a, b) => {
      if (typeof a.sortOrder === "number" && typeof b.sortOrder === "number") {
        return a.sortOrder - b.sortOrder;
      }
      return String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
    });

  return {
    dashboard: {
      courses: db.courses.length,
      publishedCourses: db.courses.filter((c) => c.published).length,
      subjects: db.subjects.length,
      teachers: db.teachers.length,
      results: db.results.length,
      achievements: db.achievements.length,
      testimonials: db.testimonials.length,
      enrollments: db.enrollments.length,
      newEnrollments: db.enrollments.filter((e) => e.status === "NEW").length,
      messages: db.messages.length,
      unreadMessages: db.messages.filter((m) => !m.read).length,
    },
    settings: db.settings,
    homepage: db.homepage,
    courses: sort(db.courses),
    subjects: sort(db.subjects),
    teachers: sort(db.teachers),
    examBoards: sort(db.examBoards),
    stats: sort(db.stats),
    syllabuses: sort(db.syllabuses),
    results: sort(db.results),
    achievements: sort(db.achievements),
    testimonials: sort(db.testimonials),
    whyChooseUs: sort(db.whyChooseUs),
    timeline: sort(db.timeline),
    enrollments: sort(db.enrollments),
    messages: sort(db.messages),
    media: sort(db.media),
  };
}

function collectionOf(db: CmsDatabase, name: CollectionName): { id: string }[] {
  return db[name] as { id: string }[];
}

export function createRecord(name: CollectionName, item: Record<string, unknown>) {
  return mutate((db) => {
    const rows = collectionOf(db, name);
    const record = {
      published: true,
      featured: false,
      sortOrder: rows.length,
      createdAt: new Date().toISOString(),
      ...item,
      id: typeof item["id"] === "string" && item["id"] ? String(item["id"]) : nid(),
    };
    rows.push(record as never);
    return record;
  });
}

export function updateRecord(name: CollectionName, id: string, patch: Record<string, unknown>) {
  return mutate((db) => {
    const rows = collectionOf(db, name);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Record not found");
    const current = rows[idx];
    if (!current) throw new Error("Record not found");
    const next = { ...current, ...patch, id: current.id };
    rows[idx] = next as never;
    return next;
  });
}

export function deleteRecord(name: CollectionName, id: string) {
  return mutate((db) => {
    const rows = collectionOf(db, name);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Record not found");
    rows.splice(idx, 1);
    return { ok: true };
  });
}

export function saveSettings(patch: Partial<SiteSettings>) {
  return mutate((db) => {
    db.settings = {
      ...db.settings,
      ...patch,
      socials: { ...db.settings.socials, ...(patch.socials ?? {}) },
    };
    return db.settings;
  });
}

export function saveHomepage(patch: Partial<HomepageContent>) {
  return mutate((db) => {
    db.homepage = { ...db.homepage, ...patch };
    return db.homepage;
  });
}

export function addEnrollment(input: Omit<EnrollmentRecord, "id" | "status" | "notes" | "createdAt">) {
  return mutate((db) => {
    const row: EnrollmentRecord = {
      ...input,
      id: nid(),
      status: "NEW",
      notes: "",
      createdAt: new Date().toISOString(),
    };
    db.enrollments.unshift(row);
    return { ok: true };
  });
}

export function addMessage(input: Omit<MessageRecord, "id" | "read" | "createdAt">) {
  return mutate((db) => {
    const row: MessageRecord = {
      ...input,
      id: nid(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    db.messages.unshift(row);
    return { ok: true };
  });
}

export function addMedia(row: Omit<MediaRecord, "id" | "createdAt">) {
  return mutate((db) => {
    const media: MediaRecord = { ...row, id: nid(), createdAt: new Date().toISOString() };
    db.media.unshift(media);
    return media;
  });
}

export { hashPassword, nid };
