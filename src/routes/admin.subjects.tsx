import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { subjectFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/subjects")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Subjects"
      collection="subjects"
      rows={state.subjects as unknown as Record<string, unknown>[]}
      fields={subjectFields}
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "featured", label: "Featured" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        name: "",
        slug: "",
        levels: ["O Level"],
        description: "",
        image: "",
        featured: false,
        published: true,
        sortOrder: state.subjects.length,
      }}
    />
  );
}
