import { createServerFn } from "@tanstack/react-start";
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { randomBytes } from "node:crypto";

import {
  addEnrollment,
  addMedia,
  addMessage,
  createRecord,
  deleteRecord,
  getDb,
  saveHomepage,
  saveSettings,
  toAdminState,
  toPublicCatalog,
  updateRecord,
} from "./db";
import { loginAdmin, logoutAdmin, readSession, requireAdmin } from "./auth";
import { slugify } from "@/lib/slug";

const ALLOWED: CollectionName[] = [
  "courses",
  "subjects",
  "teachers",
  "examBoards",
  "stats",
  "syllabuses",
  "results",
  "achievements",
  "testimonials",
  "whyChooseUs",
  "timeline",
  "enrollments",
  "messages",
  "media",
];

function asCollection(name: string): CollectionName {
  if ((ALLOWED as string[]).includes(name)) return name as CollectionName;
  throw new Error("Unknown collection");
}

export const getPublicCatalog = createServerFn({ method: "GET" }).handler(async () => {
  return toPublicCatalog(getDb());
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  return readSession();
});

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const ok = loginAdmin(data.email, data.password);
    if (!ok) return { ok: false as const, error: "Invalid email or password" };
    return { ok: true as const };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  logoutAdmin();
  return { ok: true };
});

export const getAdminState = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  return toAdminState(getDb());
});

export const saveSettingsFn = createServerFn({ method: "POST" })
  .validator((data: Partial<SiteSettings>) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    return saveSettings(data);
  });

export const saveHomepageFn = createServerFn({ method: "POST" })
  .validator((data: Partial<HomepageContent>) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    return saveHomepage(data);
  });

export const createRecordFn = createServerFn({ method: "POST" })
  .validator((data: { collection: string; item: Record<string, unknown> }) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    const item = { ...data.item };
    if (!item["slug"] && typeof item["title"] === "string") item["slug"] = slugify(item["title"]);
    if (!item["slug"] && typeof item["name"] === "string") item["slug"] = slugify(item["name"]);
    if (!item["subjectSlug"] && typeof item["subject"] === "string") {
      item["subjectSlug"] = slugify(item["subject"]);
    }
    if (!item["teacherSlug"] && typeof item["teacher"] === "string") {
      item["teacherSlug"] = slugify(item["teacher"]);
    }
    return createRecord(asCollection(data.collection), item);
  });

export const updateRecordFn = createServerFn({ method: "POST" })
  .validator((data: { collection: string; id: string; item: Record<string, unknown> }) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    return updateRecord(asCollection(data.collection), data.id, data.item);
  });

export const deleteRecordFn = createServerFn({ method: "POST" })
  .validator((data: { collection: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.collection === "media") {
      const db = getDb();
      const row = db.media.find((m) => m.id === data.id);
      if (row?.url.startsWith("/uploads/")) {
        const file = join(process.cwd(), "public", row.url.replace(/^\//, ""));
        if (existsSync(file)) {
          try {
            unlinkSync(file);
          } catch {
            // ignore
          }
        }
      }
    }
    return deleteRecord(asCollection(data.collection), data.id);
  });

export const submitEnrollmentFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      student: string;
      guardian: string;
      email: string;
      phone: string;
      level: string;
      board: string;
      subject: string;
      course?: string;
      message?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    await addEnrollment({
      student: data.student,
      guardian: data.guardian,
      email: data.email,
      phone: data.phone,
      level: data.level,
      board: data.board,
      subject: data.subject,
      course: data.course ?? "",
      message: data.message ?? "",
    });
    return { ok: true };
  });

export const submitContactFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    await addMessage({
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      subject: data.subject,
      message: data.message,
    });
    return { ok: true };
  });

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export const uploadMediaFn = createServerFn({ method: "POST" })
  .validator((data: { filename: string; mime: string; data: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin();
    const ext = IMAGE_TYPES[data.mime] ?? extname(data.filename).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
      throw new Error("Only JPG, PNG, WEBP and GIF images are allowed");
    }
    const raw = data.data.includes(",") ? (data.data.split(",")[1] ?? "") : data.data;
    if (!raw) throw new Error("Empty file");
    const buf = Buffer.from(raw, "base64");
    if (buf.length > 4 * 1024 * 1024) throw new Error("File must be under 4MB");
    const name = `${Date.now()}-${randomBytes(4).toString("hex")}${ext === ".jpeg" ? ".jpg" : ext}`;
    const dir = join(process.cwd(), "public", "uploads");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, name), buf);
    const url = `/uploads/${name}`;
    return addMedia({ url, filename: data.filename, mime: data.mime });
  });
