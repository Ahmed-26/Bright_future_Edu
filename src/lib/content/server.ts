/**
 * Server functions — the only bridge between the browser and the repository.
 *
 * Two tiers:
 *   - public reads (`fetchPublicContent`) return published content only
 *   - admin reads/writes require a valid server session via `requireAdmin()`
 *
 * Public submissions (`submitEnrollment`, `submitMessage`) are unauthenticated
 * by design — they are the admissions and contact forms — so both are validated
 * and length-capped before anything is stored.
 *
 * Every mutation is authorised on the server. A client that calls an admin
 * function without a session gets a 401 regardless of what the UI shows.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

import { authIsHardened, isAdmin, requireAdmin, signInWithPasscode, signOutAdmin } from "./auth";
import type { ContentSnapshot } from "./repository";
import { repository } from "./repository";
import type { SiteContent } from "./schema";
import { COLLECTION_KEYS, publicCollections } from "./schema";

/* ------------------------------------------------------------------ */
/* Validators                                                         */
/* ------------------------------------------------------------------ */

const collectionKey = z.enum(COLLECTION_KEYS as unknown as [CollectionKey, ...CollectionKey[]]);
const id = z.string().min(1).max(120);

/** Row bodies are open-ended (each collection has its own shape) but bounded. */
const rowData = z.record(z.string(), z.unknown());

const shortText = z.string().trim().max(200);
const longText = z.string().trim().max(4000);

/* ------------------------------------------------------------------ */
/* Public reads                                                       */
/* ------------------------------------------------------------------ */

/**
 * Published content for the public site. Called from route loaders so the
 * markup is server-rendered with whatever the admin last saved.
 */
export const fetchPublicContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const content = await repository().readContent();
    return { ...content, collections: publicCollections(content.collections) };
  },
);

/* ------------------------------------------------------------------ */
/* Admin session                                                      */
/* ------------------------------------------------------------------ */

export type AdminSessionInfo = {
  signedIn: boolean;
  /** False while ADMIN_PASSCODE / SESSION_SECRET are unset. */
  hardened: boolean;
  /** "memory" until a database driver is configured. */
  driver: "memory" | "sql";
};

export const fetchAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSessionInfo> => ({
    signedIn: await isAdmin(),
    hardened: authIsHardened(),
    driver: repository().driver,
  }),
);

export const adminSignIn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ passcode: z.string().min(1).max(200) }))
  .handler(async ({ data }) => ({ ok: await signInWithPasscode(data.passcode) }));

export const adminSignOut = createServerFn({ method: "POST" }).handler(async () => {
  await signOutAdmin();
  return { ok: true };
});

/* ------------------------------------------------------------------ */
/* Admin reads                                                        */
/* ------------------------------------------------------------------ */

/** Full snapshot including unpublished rows and the inboxes. Admin only. */
export const fetchAdminSnapshot = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentSnapshot> => {
    await requireAdmin();
    return repository().readAll();
  },
);

/* ------------------------------------------------------------------ */
/* Collection writes                                                  */
/* ------------------------------------------------------------------ */

const now = () => new Date().toISOString();

/** Collision-resistant without needing a database sequence. */
function newId(prefix: string): Id {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const createRow = createServerFn({ method: "POST" })
  .inputValidator(z.object({ key: collectionKey, data: rowData }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const repo = repository();
    const snapshot = await repo.readAll();
    const existing = snapshot.collections[data.key] as WithMeta<object>[];
    const row = {
      ...data.data,
      id: newId(data.key),
      published: true,
      featured: false,
      order: existing.length,
      updatedAt: now(),
    } as WithMeta<object>;
    await repo.createRow(data.key, row);
    return row;
  });

export const updateRow = createServerFn({ method: "POST" })
  .inputValidator(z.object({ key: collectionKey, id, data: rowData }))
  .handler(async ({ data }) => {
    await requireAdmin();
    // id/order are structural: never let a client patch overwrite them.
    const { id: _ignoredId, order: _ignoredOrder, ...patch } = data.data;
    await repository().updateRow(data.key, data.id, { ...patch, updatedAt: now() });
    return { ok: true };
  });

export const deleteRow = createServerFn({ method: "POST" })
  .inputValidator(z.object({ key: collectionKey, id }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().deleteRow(data.key, data.id);
    return { ok: true };
  });

export const setRowFlag = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      key: collectionKey,
      id,
      flag: z.enum(["published", "featured"]),
      value: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().updateRow(data.key, data.id, {
      [data.flag]: data.value,
      updatedAt: now(),
    });
    return { ok: true };
  });

export const moveRow = createServerFn({ method: "POST" })
  .inputValidator(z.object({ key: collectionKey, id, direction: z.union([z.literal(-1), z.literal(1)]) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const repo = repository();
    const snapshot = await repo.readAll();
    const rows = [...(snapshot.collections[data.key] as WithMeta<object>[])].sort(
      (a, b) => a.order - b.order,
    );
    const index = rows.findIndex((row) => row.id === data.id);
    const target = index + data.direction;
    if (index === -1 || target < 0 || target >= rows.length) return { ok: false };

    const moving = rows[index];
    const displaced = rows[target];
    if (!moving || !displaced) return { ok: false };
    rows[index] = displaced;
    rows[target] = moving;

    // Rewrite every order value so positions stay dense after any move.
    const reordered = rows.map((row, position) => ({ ...row, order: position }));
    await repo.replaceRows(data.key, reordered);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Settings / homepage / sections                                     */
/* ------------------------------------------------------------------ */

const settingsSchema = z.object({
  name: shortText,
  tagline: shortText,
  phone: shortText,
  email: shortText,
  address: longText,
  hours: shortText,
  logoUrl: longText,
  facebook: longText,
  instagram: longText,
  youtube: longText,
  whatsapp: longText,
  footerNote: longText,
}) satisfies z.ZodType<SiteSettings>;

export const saveSettings = createServerFn({ method: "POST" })
  .inputValidator(settingsSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().saveSettings(data);
    return { ok: true };
  });

const homepageSchema = z.object({
  heroEyebrow: shortText,
  heroHeading: longText,
  heroDescription: longText,
  heroImageUrl: longText,
  heroBullets: z.array(shortText).max(12),
  primaryCtaLabel: shortText,
  primaryCtaHref: shortText,
  secondaryCtaLabel: shortText,
  secondaryCtaHref: shortText,
  ctaHeading: longText,
  ctaDescription: longText,
  ctaButtonLabel: shortText,
  ctaButtonHref: shortText,
}) satisfies z.ZodType<HomepageContent>;

export const saveHomepage = createServerFn({ method: "POST" })
  .inputValidator(homepageSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().saveHomepage(data);
    return { ok: true };
  });

export const saveSections = createServerFn({ method: "POST" })
  .inputValidator(
    z.array(
      z.object({
        id: z.string().min(1).max(60),
        label: shortText,
        source: z.string().min(1).max(60),
        visible: z.boolean(),
        order: z.number().int().min(0).max(999),
      }),
    ),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().saveSections(data as HomepageSection[]);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Public form submissions                                            */
/* ------------------------------------------------------------------ */

/**
 * Admissions form. Unauthenticated on purpose; validated and capped so a
 * hostile client cannot store unbounded data. Rate limiting still needs to be
 * added at the edge (Cloudflare WAF) before launch.
 */
export const submitEnrollment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(160),
      phone: z.string().trim().min(1).max(40),
      course: shortText,
      level: shortText,
      note: longText.optional(),
    }),
  )
  .handler(async ({ data }) => {
    const row: Enrollment = {
      id: newId("enr"),
      name: data.name,
      email: data.email,
      phone: data.phone,
      course: data.course,
      level: data.level,
      status: "new",
      submittedAt: now(),
      note: data.note ?? "",
    };
    await repository().addEnrollment(row);
    return { ok: true };
  });

/** Contact form. Same trust model as the admissions form above. */
export const submitMessage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(160),
      subject: shortText,
      message: z.string().trim().min(1).max(4000),
    }),
  )
  .handler(async ({ data }) => {
    const row: ContactMessage = {
      id: newId("msg"),
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      read: false,
      submittedAt: now(),
    };
    await repository().addMessage(row);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Inbox management                                                   */
/* ------------------------------------------------------------------ */

export const setEnrollmentStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ id, status: z.enum(["new", "contacted", "enrolled", "declined"]) }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().updateEnrollment(data.id, { status: data.status });
    return { ok: true };
  });

export const deleteEnrollment = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().deleteEnrollment(data.id);
    return { ok: true };
  });

export const setMessageRead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id, read: z.boolean() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().updateMessage(data.id, { read: data.read });
    return { ok: true };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().deleteMessage(data.id);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Media                                                              */
/* ------------------------------------------------------------------ */

export const addMedia = createServerFn({ method: "POST" })
  .inputValidator(z.object({ label: shortText, url: longText, usage: shortText }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const row: MediaItem = {
      id: newId("media"),
      label: data.label,
      url: data.url,
      usage: data.usage,
      updatedAt: now(),
    };
    await repository().addMedia(row);
    return row;
  });

export const saveMediaUrl = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id, url: longText }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().updateMedia(data.id, { url: data.url, updatedAt: now() });
    return { ok: true };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await repository().deleteMedia(data.id);
    return { ok: true };
  });

/** Destructive: discards all edits and restores the checked-in seed content. */
export const resetContent = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  await repository().reset();
  return { ok: true };
});
