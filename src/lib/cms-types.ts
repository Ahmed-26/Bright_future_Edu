export const LEVELS = ["O Level", "A Level", "IGCSE"] as const;
export const BOARDS = ["Cambridge", "Pearson Edexcel", "Other"] as const;
export const ENROLLMENT_STATUSES = [
  "NEW",
  "CONTACTED",
  "FOLLOW-UP",
  "ENROLLED",
  "CLOSED",
] as const;

export type Level = (typeof LEVELS)[number];
export type Board = (typeof BOARDS)[number];
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export type SiteSettings = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  logo: string;
  favicon: string;
  footerText: string;
  mapsUrl: string;
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    whatsapp: string;
  };
};

export type HomepageContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroImage: string;
  heroCaption: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  heroBullets: string[];
  heroPublished: boolean;
  statsPublished: boolean;
  boardsPublished: boolean;
  coursesPublished: boolean;
  subjectsPublished: boolean;
  whyPublished: boolean;
  whyTitle: string;
  whyDescription: string;
  teachersPublished: boolean;
  resultsPublished: boolean;
  testimonialsPublished: boolean;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  ctaPublished: boolean;
};

export type StatRecord = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  published: boolean;
  sortOrder: number;
};

export type ExamBoardRecord = {
  id: string;
  name: string;
  note: string;
  image: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

export type SubjectRecord = {
  id: string;
  slug: string;
  name: string;
  levels: string[];
  description: string;
  image: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

export type TeacherRecord = {
  id: string;
  slug: string;
  name: string;
  designation: string;
  subjects: string[];
  qualification: string;
  experience: string;
  bio: string;
  initials: string;
  image: string;
  facebook: string;
  instagram: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

export type CourseRecord = {
  id: string;
  slug: string;
  title: string;
  subject: string;
  subjectSlug: string;
  level: Level;
  board: Board;
  code: string;
  duration: string;
  schedule: string;
  fee: string;
  teacher: string;
  teacherSlug: string;
  short: string;
  description: string;
  image: string;
  syllabus: string[];
  requirements: string[];
  benefits: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type SyllabusRecord = {
  id: string;
  board: string;
  qualification: string;
  subject: string;
  code: string;
  papers: string;
  topics: string[];
  published: boolean;
  sortOrder: number;
};

export type ResultRecord = {
  id: string;
  student: string;
  subject: string;
  grade: string;
  level: string;
  board: string;
  year: number;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type AchievementRecord = {
  id: string;
  title: string;
  category: string;
  student: string;
  subject: string;
  level: string;
  board: string;
  grade: string;
  year: number;
  description: string;
  image: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type TestimonialRecord = {
  id: string;
  name: string;
  course: string;
  level: string;
  rating: number;
  initials: string;
  text: string;
  image: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type WhyChooseRecord = {
  id: string;
  title: string;
  text: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

export type TimelineRecord = {
  id: string;
  year: string;
  text: string;
  published: boolean;
  sortOrder: number;
};

export type EnrollmentRecord = {
  id: string;
  student: string;
  guardian: string;
  email: string;
  phone: string;
  level: string;
  board: string;
  subject: string;
  course: string;
  message: string;
  status: EnrollmentStatus;
  notes: string;
  createdAt: string;
};

export type MessageRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type MediaRecord = {
  id: string;
  url: string;
  filename: string;
  mime: string;
  createdAt: string;
};

export type CollectionName =
  | "courses"
  | "subjects"
  | "teachers"
  | "examBoards"
  | "stats"
  | "syllabuses"
  | "results"
  | "achievements"
  | "testimonials"
  | "whyChooseUs"
  | "timeline"
  | "enrollments"
  | "messages"
  | "media";

export type Course = CourseRecord;
export type Subject = SubjectRecord & { courses: number };
export type Teacher = TeacherRecord;

export type PublicCatalog = {
  settings: SiteSettings;
  homepage: HomepageContent;
  stats: StatRecord[];
  examBoards: ExamBoardRecord[];
  subjects: Subject[];
  teachers: TeacherRecord[];
  courses: CourseRecord[];
  syllabuses: SyllabusRecord[];
  results: ResultRecord[];
  achievements: AchievementRecord[];
  testimonials: TestimonialRecord[];
  whyChooseUs: WhyChooseRecord[];
  timeline: TimelineRecord[];
  levels: readonly string[];
  boards: readonly string[];
};

export type AdminDashboard = {
  courses: number;
  publishedCourses: number;
  subjects: number;
  teachers: number;
  results: number;
  achievements: number;
  testimonials: number;
  enrollments: number;
  newEnrollments: number;
  messages: number;
  unreadMessages: number;
};

export type AdminState = {
  dashboard: AdminDashboard;
  settings: SiteSettings;
  homepage: HomepageContent;
  courses: CourseRecord[];
  subjects: SubjectRecord[];
  teachers: TeacherRecord[];
  examBoards: ExamBoardRecord[];
  stats: StatRecord[];
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
