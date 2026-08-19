import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { deleteRecordFn, updateRecordFn } from "@/server/fns";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/messages")({
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
      <h1 className="text-2xl font-semibold">Contact Messages</h1>
      <div className="mt-6 space-y-4">
        {state.messages.length === 0 ? (
          <p className="rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground">
            No messages yet
          </p>
        ) : (
          state.messages.map((m) => (
            <article
              key={m.id}
              className={`rounded-2xl border bg-card p-5 ${m.read ? "opacity-80" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{m.subject}</h2>
                  <p className="text-sm text-muted-foreground">
                    {m.name} · {m.email} · {m.phone}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.createdAt}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await update({
                        data: { collection: "messages", id: m.id, item: { read: !m.read } },
                      });
                      await router.invalidate();
                    }}
                  >
                    {m.read ? "Mark unread" : "Mark read"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await remove({ data: { collection: "messages", id: m.id } });
                      await router.invalidate();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{m.message}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
