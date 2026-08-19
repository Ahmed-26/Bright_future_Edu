import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { boardFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/exam-boards")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Exam Boards"
      collection="examBoards"
      rows={state.examBoards as unknown as Record<string, unknown>[]}
      fields={boardFields}
      columns={[
        { key: "name", label: "Name" },
        { key: "note", label: "Note" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        name: "",
        note: "",
        image: "",
        featured: true,
        published: true,
        sortOrder: state.examBoards.length,
      }}
    />
  );
}
