import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteRecordFn, updateRecordFn } from "@/server/fns";
import { ENROLLMENT_STATUSES } from "@/lib/cms-types";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/admissions")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  const router = useRouter();
  const update = useServerFn(updateRecordFn);
  const remove = useServerFn(deleteRecordFn);
  if (!state) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admissions / Enrollments</h1>
      <p className="mt-1 text-sm text-muted-foreground">{state.enrollments.length} submissions</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              {["Student", "Contact", "Course", "Status", "Notes", ""].map((h) => (
                <th key={h} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.enrollments.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={6}>
                  No enrollment enquiries yet
                </td>
              </tr>
            ) : (
              state.enrollments.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.student}</div>
                    <div className="text-xs text-muted-foreground">{row.guardian}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{row.email}</div>
                    <div className="text-xs text-muted-foreground">{row.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    {row.level} · {row.subject}
                    <div className="text-xs text-muted-foreground">{row.course}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-md border px-2 py-1 text-xs"
                      value={row.status}
                      onChange={async (e) => {
                        await update({
                          data: {
                            collection: "enrollments",
                            id: row.id,
                            item: { status: e.target.value },
                          },
                        });
                        await router.invalidate();
                      }}
                    >
                      {ENROLLMENT_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-40 rounded-md border px-2 py-1 text-xs"
                      defaultValue={row.notes}
                      onBlur={async (e) => {
                        await update({
                          data: {
                            collection: "enrollments",
                            id: row.id,
                            item: { notes: e.target.value },
                          },
                        });
                        toast.success("Notes saved");
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (!confirm("Delete this enquiry?")) return;
                        await remove({ data: { collection: "enrollments", id: row.id } });
                        await router.invalidate();
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
