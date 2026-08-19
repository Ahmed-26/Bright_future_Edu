import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { syllabusFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/syllabus")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Syllabus"
      collection="syllabuses"
      rows={state.syllabuses as unknown as Record<string, unknown>[]}
      fields={syllabusFields}
      columns={[
        { key: "subject", label: "Subject" },
        { key: "qualification", label: "Level" },
        { key: "board", label: "Board" },
        { key: "code", label: "Code" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        board: "Cambridge",
        qualification: "O Level",
        subject: "",
        code: "",
        papers: "",
        topics: [],
        published: true,
        sortOrder: state.syllabuses.length,
      }}
    />
  );
}
