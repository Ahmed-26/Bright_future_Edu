import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { achievementFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/achievements")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Achievements"
      collection="achievements"
      rows={state.achievements as unknown as Record<string, unknown>[]}
      fields={achievementFields}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "year", label: "Year" },
        { key: "featured", label: "Featured" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        title: "",
        category: "Student Results",
        student: "",
        subject: "",
        level: "O Level",
        board: "Cambridge",
        grade: "",
        year: new Date().getFullYear(),
        description: "",
        image: "",
        featured: false,
        published: true,
        sortOrder: state.achievements.length,
      }}
    />
  );
}
