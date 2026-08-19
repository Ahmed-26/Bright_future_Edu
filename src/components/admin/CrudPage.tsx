import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createRecordFn,
  deleteRecordFn,
  updateRecordFn,
  uploadMediaFn,
} from "@/server/fns";
import type { CollectionName } from "@/lib/cms-types";

export type Field = {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "toggle"
    | "list"
    | "image"
    | "multiselect";
  options?: string[];
};

function splitList(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  return String(value ?? "")
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const upload = useServerFn(uploadMediaFn);

  if (field.type === "textarea" || field.type === "list") {
    return (
      <Textarea
        value={Array.isArray(value) ? value.join("\n") : String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        rows={field.type === "list" ? 5 : 4}
      />
    );
  }
  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={String(value ?? "")}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }
  if (field.type === "toggle") {
    return (
      <Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} />
    );
  }
  if (field.type === "select") {
    return (
      <select
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {(field.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value.map(String) : splitList(value);
    return (
      <div className="flex flex-wrap gap-2">
        {(field.options ?? []).map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() =>
                onChange(on ? selected.filter((x) => x !== o) : [...selected, o])
              }
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                on ? "border-transparent bg-primary text-primary-foreground" : "border-border"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    );
  }
  if (field.type === "image") {
    return (
      <div className="space-y-2">
        <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/..." />
        <Input
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
            try {
              const media = await upload({
                data: { filename: file.name, mime: file.type, data },
              });
              onChange(media.url);
              toast.success("Image uploaded");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
        {typeof value === "string" && value ? (
          <img src={value} alt="" className="h-20 rounded-md object-cover" />
        ) : null}
      </div>
    );
  }
  return <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
}

export function CrudPage({
  title,
  collection,
  rows,
  fields,
  columns,
  defaults,
}: {
  title: string;
  collection: CollectionName;
  rows: Record<string, unknown>[];
  fields: Field[];
  columns: { key: string; label: string }[];
  defaults: Record<string, unknown>;
}) {
  const router = useRouter();
  const createFn = useServerFn(createRecordFn);
  const updateFn = useServerFn(updateRecordFn);
  const removeFn = useServerFn(deleteRecordFn);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaults });
    setOpen(true);
  };
  const openEdit = (row: Record<string, unknown>) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const payload = () => {
    const item = { ...form };
    for (const field of fields) {
      if (field.type === "list") item[field.key] = splitList(item[field.key]);
    }
    delete item["id"];
    return item;
  };

  const save = async () => {
    try {
      if (editing && typeof editing["id"] === "string") {
        await updateFn({
          data: { collection, id: editing["id"], item: payload() },
        });
        toast.success("Saved");
      } else {
        await createFn({ data: { collection, item: payload() } });
        toast.success("Created");
      }
      setOpen(false);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const toggle = async (row: Record<string, unknown>, key: string) => {
    if (typeof row["id"] !== "string") return;
    await updateFn({
      data: { collection, id: row["id"], item: { [key]: !row[key] } },
    });
    await router.invalidate();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} records in the database</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Add
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={columns.length + 1}>
                  No records yet
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={String(row["id"])} className="border-b last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-middle">
                      {c.key === "published" || c.key === "featured" ? (
                        <Switch
                          checked={Boolean(row[c.key])}
                          onCheckedChange={() => toggle(row, c.key)}
                        />
                      ) : Array.isArray(row[c.key]) ? (
                        (row[c.key] as unknown[]).join(", ")
                      ) : (
                        String(row[c.key] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          if (typeof row["id"] !== "string") return;
                          if (!confirm("Delete this record?")) return;
                          await removeFn({ data: { collection, id: row["id"] } });
                          toast.success("Deleted");
                          await router.invalidate();
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Create"} {title.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {fields.map((field) => (
              <div key={field.key} className="grid gap-2">
                <Label>{field.label}</Label>
                <FieldInput
                  field={field}
                  value={form[field.key]}
                  onChange={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                />
              </div>
            ))}
            <Button onClick={save}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
