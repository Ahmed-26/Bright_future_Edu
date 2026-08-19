import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { teacherFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/teachers")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Teachers"
      collection="teachers"
      rows={state.teachers as unknown as Record<string, unknown>[]}
      fields={teacherFields(state.subjects.map((s) => s.name))}
      columns={[
        { key: "name", label: "Name" },
        { key: "designation", label: "Role" },
        { key: "featured", label: "Featured" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        name: "",
        slug: "",
        designation: "",
        subjects: [],
        qualification: "",
        experience: "",
        bio: "",
        initials: "",
        image: "",
        facebook: "",
        instagram: "",
        featured: false,
        published: true,
        sortOrder: state.teachers.length,
      }}
    />
  );
}
