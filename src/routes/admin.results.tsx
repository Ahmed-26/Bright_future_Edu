import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { resultFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/results")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Results"
      collection="results"
      rows={state.results as unknown as Record<string, unknown>[]}
      fields={resultFields(state.subjects.map((s) => s.name))}
      columns={[
        { key: "student", label: "Student" },
        { key: "subject", label: "Subject" },
        { key: "grade", label: "Grade" },
        { key: "year", label: "Year" },
        { key: "featured", label: "Featured" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        student: "Demo Student",
        subject: state.subjects[0]?.name ?? "",
        grade: "A",
        level: "O Level",
        board: "Cambridge",
        year: new Date().getFullYear(),
        featured: false,
        published: true,
        sortOrder: state.results.length,
      }}
    />
  );
}
