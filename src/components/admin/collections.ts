/**
 * Field configuration per collection.
 *
 * One generic CRUD screen (CollectionScreen) renders every collection from these
 * definitions, so adding a field is a one-line change here rather than a new screen.
 * Field names match the shapes in src/data/institute.ts exactly — that is what keeps
 * the phase-2 database migration mechanical.
 */

import { boards, levels } from "@/data/institute";

import type { CollectionKey, CollectionConfig, FieldDef } from "./types";
import type {
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
} from "./store";

const achievementCategories = [
  "Student Results",
  "Academic Awards",
  "Competition Results",
  "Scholarships",
  "Institute Milestones",
  "University Admissions",
] as const;

const gradeOptions = ["A*", "A", "B", "C", "D", "E"] as const;

const courseFields: FieldDef<CourseRow>[] = [
  { name: "title", label: "Course title", kind: "text", required: true, inTable: true },
  {
    name: "slug",
    label: "URL slug",
    kind: "slug",
    required: true,
    help: "Appears in the address bar, e.g. /courses/o-level-accounting. Changing it breaks old links.",
  },
  { name: "subject", label: "Subject", kind: "text", required: true, inTable: true },
  {
    name: "subjectSlug",
    label: "Subject slug",
    kind: "slug",
    required: true,
    help: "Must match the slug of an existing subject so the two pages link up.",
  },
  { name: "level", label: "Level", kind: "select", options: levels, required: true, inTable: true },
  { name: "board", label: "Exam board", kind: "select", options: boards, required: true },
  { name: "code", label: "Syllabus code", kind: "text", inTable: true, placeholder: "7707" },
  { name: "duration", label: "Duration", kind: "text", placeholder: "9 months" },
  { name: "schedule", label: "Schedule", kind: "text", placeholder: "Mon & Thu · 5:00 – 6:30 PM" },
  { name: "fee", label: "Fee", kind: "text", placeholder: "PKR 9,500 / month" },
  { name: "teacher", label: "Teacher name", kind: "text" },
  {
    name: "teacherSlug",
    label: "Teacher slug",
    kind: "slug",
    help: "Must match an existing teacher's slug.",
  },
  {
    name: "short",
    label: "Short summary",
    kind: "textarea",
    wide: true,
    help: "One or two lines shown on course cards and listings.",
  },
  {
    name: "description",
    label: "Full description",
    kind: "textarea",
    wide: true,
    help: "Shown on the individual course page.",
  },
  {
    name: "syllabus",
    label: "Syllabus topics",
    kind: "list",
    wide: true,
    help: "One topic per line. This is the syllabus shown on the course page.",
  },
  { name: "requirements", label: "Requirements", kind: "list", wide: true, help: "One per line." },
  { name: "benefits", label: "What's included", kind: "list", wide: true, help: "One per line." },
];

const subjectFields: FieldDef<SubjectRow>[] = [
  { name: "name", label: "Subject name", kind: "text", required: true, inTable: true },
  { name: "slug", label: "URL slug", kind: "slug", required: true },
  {
    name: "levels",
    label: "Levels offered",
    kind: "tags",
    inTable: true,
    help: "Comma separated, e.g. O Level, A Level, IGCSE.",
  },
  {
    name: "courses",
    label: "Course count",
    kind: "number",
    inTable: true,
    help: "Number shown on the subject card.",
  },
  { name: "description", label: "Description", kind: "textarea", wide: true },
];

const teacherFields: FieldDef<TeacherRow>[] = [
  { name: "name", label: "Full name", kind: "text", required: true, inTable: true },
  { name: "slug", label: "URL slug", kind: "slug", required: true },
  { name: "designation", label: "Designation", kind: "text", inTable: true },
  { name: "subjects", label: "Subjects taught", kind: "tags", inTable: true, help: "Comma separated." },
  { name: "qualification", label: "Qualification", kind: "text" },
  { name: "experience", label: "Experience", kind: "text", placeholder: "12 years" },
  {
    name: "initials",
    label: "Initials",
    kind: "text",
    help: "Two letters shown in the avatar when no photo is set.",
  },
  { name: "bio", label: "Biography", kind: "textarea", wide: true },
];

const examBoardFields: FieldDef<ExamBoardRow>[] = [
  { name: "name", label: "Board name", kind: "text", required: true, inTable: true },
  { name: "note", label: "Description", kind: "text", wide: true, inTable: true },
];

const statFields: FieldDef<StatRow>[] = [
  { name: "label", label: "Label", kind: "text", required: true, inTable: true },
  {
    name: "value",
    label: "Number",
    kind: "number",
    required: true,
    inTable: true,
    help: "Counts up on the homepage. Digits only.",
  },
  {
    name: "suffix",
    label: "Suffix",
    kind: "text",
    inTable: true,
    help: 'Shown after the number, e.g. "+" or "%".',
  },
];

const resultFields: FieldDef<ResultRow>[] = [
  { name: "student", label: "Student name", kind: "text", required: true, inTable: true },
  { name: "subject", label: "Subject", kind: "text", required: true, inTable: true },
  {
    name: "grade",
    label: "Grade",
    kind: "select",
    options: gradeOptions,
    required: true,
    inTable: true,
  },
  { name: "level", label: "Level", kind: "select", options: levels, required: true, inTable: true },
  { name: "board", label: "Board", kind: "select", options: boards, required: true },
  { name: "year", label: "Year", kind: "number", required: true, inTable: true },
];

const achievementFields: FieldDef<AchievementRow>[] = [
  { name: "title", label: "Title", kind: "text", required: true, inTable: true },
  {
    name: "category",
    label: "Category",
    kind: "select",
    options: achievementCategories,
    required: true,
    inTable: true,
  },
  { name: "student", label: "Student (optional)", kind: "text", inTable: true },
  { name: "year", label: "Year", kind: "number", required: true, inTable: true },
  { name: "description", label: "Description", kind: "textarea", wide: true },
];

const testimonialFields: FieldDef<TestimonialRow>[] = [
  { name: "name", label: "Name", kind: "text", required: true, inTable: true },
  { name: "course", label: "Course", kind: "text", inTable: true },
  { name: "level", label: "Level", kind: "select", options: levels, inTable: true },
  {
    name: "rating",
    label: "Rating",
    kind: "rating",
    inTable: true,
    help: "Whole number from 1 to 5.",
  },
  { name: "initials", label: "Initials", kind: "text" },
  { name: "text", label: "Testimonial", kind: "textarea", wide: true, required: true },
];

const whyChooseUsFields: FieldDef<WhyChooseUsRow>[] = [
  { name: "title", label: "Heading", kind: "text", required: true, inTable: true },
  { name: "text", label: "Description", kind: "textarea", wide: true, inTable: true },
];

const timelineFields: FieldDef<TimelineRow>[] = [
  { name: "year", label: "Year", kind: "text", required: true, inTable: true },
  { name: "text", label: "Milestone", kind: "textarea", wide: true, inTable: true },
];

/** Everything editable; delete disabled where records are referenced elsewhere. */
const full = { publish: true, feature: true, reorder: true, create: true, delete: true };
const noFeature = { ...full, feature: false };

export const collectionConfigs: { [K in CollectionKey]: CollectionConfig<CollectionRowMap[K]> } = {
  courses: {
    key: "courses",
    singular: "Course",
    plural: "Courses",
    description:
      "Drives the Courses page and each course detail page. Featured courses appear on the homepage.",
    titleField: "title",
    fields: courseFields,
    capabilities: full,
    empty: () => ({
      slug: "",
      title: "",
      subject: "",
      subjectSlug: "",
      level: "O Level",
      board: "Cambridge",
      code: "",
      duration: "",
      schedule: "",
      fee: "",
      teacher: "",
      teacherSlug: "",
      short: "",
      description: "",
      featured: false,
      syllabus: [],
      requirements: [],
      benefits: [],
    }),
  },
  subjects: {
    key: "subjects",
    singular: "Subject",
    plural: "Subjects",
    description: "Drives the Subjects page and the subject filters on Courses and Results.",
    titleField: "name",
    fields: subjectFields,
    capabilities: full,
    empty: () => ({ slug: "", name: "", levels: [], description: "", courses: 0 }),
  },
  teachers: {
    key: "teachers",
    singular: "Teacher",
    plural: "Teachers",
    description: "Drives the Teachers page. Featured teachers appear on the homepage.",
    titleField: "name",
    fields: teacherFields,
    capabilities: full,
    empty: () => ({
      slug: "",
      name: "",
      designation: "",
      subjects: [],
      qualification: "",
      experience: "",
      bio: "",
      initials: "",
    }),
  },
  examBoards: {
    key: "examBoards",
    singular: "Exam Board",
    plural: "Exam Boards",
    description: "Shown in the homepage exam board strip and used as a course filter.",
    titleField: "name",
    fields: examBoardFields,
    capabilities: noFeature,
    empty: () => ({ name: "", note: "" }),
  },
  statistics: {
    key: "statistics",
    singular: "Statistic",
    plural: "Statistics",
    description: "The animated counters on the homepage and About page.",
    titleField: "label",
    fields: statFields,
    capabilities: noFeature,
    empty: () => ({ value: 0, suffix: "+", label: "" }),
  },
  results: {
    key: "results",
    singular: "Result",
    plural: "Results",
    description: "Drives the Results page. Featured results appear on the homepage.",
    titleField: "student",
    fields: resultFields,
    capabilities: full,
    empty: () => ({
      student: "",
      subject: "",
      grade: "A*",
      level: "O Level",
      board: "Cambridge",
      year: new Date().getFullYear(),
    }),
  },
  achievements: {
    key: "achievements",
    singular: "Achievement",
    plural: "Achievements",
    description: "Drives the Achievements page. Featured entries appear on the homepage.",
    titleField: "title",
    fields: achievementFields,
    capabilities: full,
    empty: () => ({
      title: "",
      category: "Student Results",
      student: "",
      year: new Date().getFullYear(),
      description: "",
    }),
  },
  testimonials: {
    key: "testimonials",
    singular: "Testimonial",
    plural: "Testimonials",
    description: "Only published testimonials appear on the homepage.",
    titleField: "name",
    fields: testimonialFields,
    capabilities: full,
    empty: () => ({ name: "", course: "", level: "O Level", rating: 5, initials: "", text: "" }),
  },
  whyChooseUs: {
    key: "whyChooseUs",
    singular: "Reason",
    plural: "Why Choose Us",
    description: "The feature grid on the homepage and About page.",
    titleField: "title",
    fields: whyChooseUsFields,
    capabilities: noFeature,
    empty: () => ({ title: "", text: "" }),
  },
  timeline: {
    key: "timeline",
    singular: "Milestone",
    plural: "Timeline",
    description: "The institute history timeline on the About page.",
    titleField: "year",
    fields: timelineFields,
    capabilities: noFeature,
    empty: () => ({ year: "", text: "" }),
  },
};
