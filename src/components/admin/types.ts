// Admin panel type definitions.
//
// PHASE 1 (current): the admin panel reads/writes an in-browser store that is
// SEEDED from src/data/institute.ts, so every screen can be reviewed against the
// real content shape. No database exists in this project yet.
//
// PHASE 2 (next pass): the CrudApi contract below is deliberately async so the
// store implementation can be swapped for TanStack Start server functions backed
// by a real database WITHOUT touching any admin screen.

export type Id = string;

/** Fields the admin layer adds on top of the shapes in src/data/institute.ts. */
export type AdminMeta = {
  id: Id;
  published: boolean;
  featured: boolean;
  /** Manual sort position, lowest first. */
  order: number;
  updatedAt: string;
};

export type WithMeta<T> = T & AdminMeta;

/** Which control the generic form renders for a field. */
export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "slug"
  | "select"
  | "tags"
  | "list"
  | "image"
  | "rating";

export type FieldDef<T> = {
  name: keyof T & string;
  label: string;
  kind: FieldKind;
  /** Shown under the input as guidance for non-technical editors. */
  help?: string;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  /** Render this field in the table listing. */
  inTable?: boolean;
  /** Full row width inside the dialog grid. */
  wide?: boolean;
};

export type CollectionKey =
  | "courses"
  | "subjects"
  | "teachers"
  | "examBoards"
  | "statistics"
  | "results"
  | "achievements"
  | "testimonials"
  | "whyChooseUs"
  | "timeline";

/**
 * Capability flags let one generic screen serve every collection.
 * `syllabus` is intentionally NOT a collection — it is edited on courses,
 * which is where the syllabus data actually lives.
 */
export type CollectionCapabilities = {
  publish: boolean;
  feature: boolean;
  reorder: boolean;
  create: boolean;
  delete: boolean;
};

export type CollectionConfig<T> = {
  key: CollectionKey;
  /** Singular noun used in buttons and dialogs, e.g. "Course". */
  singular: string;
  plural: string;
  description: string;
  /** Field used as the row headline. */
  titleField: keyof T & string;
  fields: FieldDef<T>[];
  capabilities: CollectionCapabilities;
  /** Blank record used when creating. */
  empty: () => T;
};

/**
 * The single data contract every admin screen talks to.
 * Phase 1: implemented by the seeded browser store.
 * Phase 2: implemented by server functions -> database.
 */
export type CrudApi<T> = {
  list: () => WithMeta<T>[];
  create: (input: T) => Promise<WithMeta<T>>;
  update: (id: Id, input: Partial<T>) => Promise<void>;
  remove: (id: Id) => Promise<void>;
  setPublished: (id: Id, published: boolean) => Promise<void>;
  setFeatured: (id: Id, featured: boolean) => Promise<void>;
  move: (id: Id, direction: -1 | 1) => Promise<void>;
};

/** Global site/contact content that drives the navbar, footer and contact page. */
export type SiteSettings = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  logoUrl: string;
  facebook: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
  footerNote: string;
};

/** Editable homepage hero + CTA copy. Section visibility/order lives alongside. */
export type HomepageContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroImageUrl: string;
  heroBullets: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
};

export type HomepageSection = {
  id: string;
  label: string;
  /** Which collection the section pulls from, for the "Edit content" shortcut. */
  source: CollectionKey | "hero" | "cta";
  visible: boolean;
  order: number;
};

/** Read-only inbox records. Submitted by the public site, managed here. */
export type Enrollment = {
  id: Id;
  name: string;
  email: string;
  phone: string;
  course: string;
  level: string;
  status: "new" | "contacted" | "enrolled" | "declined";
  submittedAt: string;
  note: string;
};

export type ContactMessage = {
  id: Id;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  submittedAt: string;
};

export type MediaItem = {
  id: Id;
  label: string;
  url: string;
  usage: string;
  updatedAt: string;
};
