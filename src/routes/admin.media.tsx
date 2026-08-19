import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteRecordFn, uploadMediaFn } from "@/server/fns";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/media")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  const router = useRouter();
  const upload = useServerFn(uploadMediaFn);
  const remove = useServerFn(deleteRecordFn);
  if (!state) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Media</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload images for logo, hero, courses, teachers and more.
          </p>
        </div>
        <Input
          className="max-w-xs"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const data = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(new Error("read failed"));
              reader.readAsDataURL(file);
            });
            await upload({ data: { filename: file.name, mime: file.type, data } });
            toast.success("Uploaded");
            await router.invalidate();
          }}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {state.media.map((m) => (
          <figure key={m.id} className="overflow-hidden rounded-2xl border bg-card">
            <img src={m.url} alt={m.filename} className="h-36 w-full object-cover" />
            <figcaption className="space-y-2 p-3 text-xs">
              <p className="truncate font-medium">{m.filename}</p>
              <p className="truncate text-muted-foreground">{m.url}</p>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  await remove({ data: { collection: "media", id: m.id } });
                  await router.invalidate();
                }}
              >
                Delete
              </Button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
