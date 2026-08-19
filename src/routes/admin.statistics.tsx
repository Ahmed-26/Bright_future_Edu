import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { statFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/statistics")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Statistics"
      collection="stats"
      rows={state.stats as unknown as Record<string, unknown>[]}
      fields={statFields}
      columns={[
        { key: "label", label: "Label" },
        { key: "value", label: "Value" },
        { key: "suffix", label: "Suffix" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        label: "",
        value: 0,
        suffix: "+",
        published: true,
        sortOrder: state.stats.length,
      }}
    />
  );
}
