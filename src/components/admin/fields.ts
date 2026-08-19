import { BOARDS, LEVELS } from "@/lib/cms-types";
import type { Field } from "@/components/admin/CrudPage";

const levels = [...LEVELS];
const boards = [...BOARDS];

export const courseFields = (subjects: string[], teachers: string[]): Field[] => [
  { key: "title", label: "Title", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "subject", label: "Subject name", type: "select", options: subjects },
  { key: "subjectSlug", label: "Subject slug", type: "text" },
  { key: "level", label: "Level", type: "select", options: levels },
  { key: "board", label: "Exam board", type: "select", options: boards },
  { key: "code", label: "Course / syllabus code", type: "text" },
  { key: "duration", label: "Duration", type: "text" },
  { key: "schedule", label: "Schedule", type: "text" },
  { key: "fee", label: "Fee", type: "text" },
  { key: "teacher", label: "Teacher", type: "select", options: teachers },
  { key: "teacherSlug", label: "Teacher slug", type: "text" },
  { key: "short", label: "Short description", type: "textarea" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "image", label: "Image", type: "image" },
  { key: "syllabus", label: "Syllabus topics (one per line)", type: "list" },
  { key: "requirements", label: "Requirements (one per line)", type: "list" },
  { key: "benefits", label: "Benefits (one per line)", type: "list" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "featured", label: "Featured", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

export const subjectFields: Field[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "levels", label: "Levels", type: "multiselect", options: levels },
  { key: "description", label: "Description", type: "textarea" },
  { key: "image", label: "Image", type: "image" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "featured", label: "Featured on homepage", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

export const teacherFields = (subjects: string[]): Field[] => [
  { key: "name", label: "Name", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "designation", label: "Designation", type: "text" },
  { key: "subjects", label: "Subjects", type: "multiselect", options: subjects },
  { key: "qualification", label: "Qualification", type: "text" },
  { key: "experience", label: "Experience", type: "text" },
  { key: "bio", label: "Biography", type: "textarea" },
  { key: "initials", label: "Initials", type: "text" },
  { key: "image", label: "Photo", type: "image" },
  { key: "facebook", label: "Facebook", type: "text" },
  { key: "instagram", label: "Instagram", type: "text" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "featured", label: "Featured on homepage", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

export const boardFields: Field[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "note", label: "Note", type: "text" },
  { key: "image", label: "Image", type: "image" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "featured", label: "Featured", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

export const syllabusFields: Field[] = [
  { key: "board", label: "Exam board", type: "select", options: boards },
  { key: "qualification", label: "Qualification / level", type: "select", options: levels },
  { key: "subject", label: "Subject", type: "text" },
  { key: "code", label: "Syllabus code", type: "text" },
  { key: "papers", label: "Paper information", type: "textarea" },
  { key: "topics", label: "Topics covered (one per line)", type: "list" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "published", label: "Published", type: "toggle" },
];

export const statFields: Field[] = [
  { key: "label", label: "Label", type: "text" },
  { key: "value", label: "Value", type: "number" },
  { key: "suffix", label: "Suffix", type: "text" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "published", label: "Published", type: "toggle" },
];

export const resultFields = (subjects: string[]): Field[] => [
  { key: "student", label: "Student (demo name)", type: "text" },
  { key: "subject", label: "Subject", type: "select", options: subjects },
  { key: "grade", label: "Grade", type: "text" },
  { key: "level", label: "Level", type: "select", options: levels },
  { key: "board", label: "Exam board", type: "select", options: boards },
  { key: "year", label: "Year", type: "number" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "featured", label: "Featured on homepage", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

export const achievementFields: Field[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "student", label: "Student", type: "text" },
  { key: "subject", label: "Subject", type: "text" },
  { key: "level", label: "Level", type: "select", options: levels },
  { key: "board", label: "Exam board", type: "select", options: boards },
  { key: "grade", label: "Grade", type: "text" },
  { key: "year", label: "Year", type: "number" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "image", label: "Image", type: "image" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "featured", label: "Featured on homepage", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];

export const testimonialFields: Field[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "course", label: "Course", type: "text" },
  { key: "level", label: "Level", type: "select", options: levels },
  { key: "rating", label: "Rating (1-5)", type: "number" },
  { key: "initials", label: "Initials", type: "text" },
  { key: "text", label: "Testimonial", type: "textarea" },
  { key: "image", label: "Photo", type: "image" },
  { key: "sortOrder", label: "Display order", type: "number" },
  { key: "featured", label: "Featured on homepage", type: "toggle" },
  { key: "published", label: "Published", type: "toggle" },
];
