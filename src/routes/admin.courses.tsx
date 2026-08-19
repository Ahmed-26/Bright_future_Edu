import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { courseFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/admin/courses")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  const subjects = state.subjects.map((s) => s.name);
  const teachers = state.teachers.map((t) => t.name);
  return (
    <CrudPage
      title="Courses"
      collection="courses"
      rows={state.courses as unknown as Record<string, unknown>[]}
      fields={courseFields(subjects, teachers)}
      columns={[
        { key: "title", label: "Title" },
        { key: "level", label: "Level" },
        { key: "board", label: "Board" },
        { key: "code", label: "Code" },
        { key: "featured", label: "Featured" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        title: "",
        slug: "",
        subject: subjects[0] ?? "",
        subjectSlug: slugify(subjects[0] ?? ""),
        level: "O Level",
        board: "Cambridge",
        code: "",
        duration: "",
        schedule: "",
        fee: "",
        teacher: teachers[0] ?? "",
        teacherSlug: "",
        short: "",
        description: "",
        image: "",
        syllabus: [],
        requirements: [],
        benefits: [],
        featured: false,
        published: true,
        sortOrder: state.courses.length,
      }}
    />
  );
}
