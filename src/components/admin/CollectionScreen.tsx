/**
 * One generic CRUD screen that serves every collection.
 *
 * Reads its columns, form fields and capabilities from collectionConfigs, so
 * Courses, Subjects, Teachers, Results and the rest all share this single
 * implementation. Writes go through the CrudApi returned by useCollection().
 */

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

import { collectionConfigs } from "./collections";
import { FieldControl, displayValue } from "./FormFields";
import { useCollection, type CollectionRowMap } from "./store";
import type { CollectionKey, WithMeta } from "./types";

type AnyRecord = Record<string, unknown>;

export function CollectionScreen<K extends CollectionKey>({ collection }: { collection: K }) {
  const config = collectionConfigs[collection];
  const api = useCollection(collection);
  const { capabilities, fields } = config;

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<WithMeta<CollectionRowMap[K]> | null>(null);
  const [draft, setDraft] = useState<AnyRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WithMeta<CollectionRowMap[K]> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const tableFields = useMemo(() => fields.filter((f) => f.inTable).slice(0, 5), [fields]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return api.rows;
    return api.rows.filter((row) =>
      Object.values(row as AnyRecord).some((value) =>
        String(Array.isArray(value) ? value.join(" ") : value)
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [api.rows, query]);

  function openCreate() {
    setEditing(null);
    setErrors([]);
    setDraft(config.empty() as AnyRecord);
  }

  function openEdit(row: WithMeta<CollectionRowMap[K]>) {
    setEditing(row);
    setErrors([]);
    setDraft({ ...(row as AnyRecord) });
  }

  function closeDialog() {
    setDraft(null);
    setEditing(null);
    setErrors([]);
  }

  async function save() {
    if (!draft) return;

    const missing = fields
      .filter((field) => field.required)
      .filter((field) => {
        const value = draft[field.name];
        if (Array.isArray(value)) return value.length === 0;
        return value === undefined || value === null || String(value).trim() === "";
      })
      .map((field) => field.label);

    if (missing.length > 0) {
      setErrors(missing);
      toast.error(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    if (editing) {
      await api.update(editing.id, draft as Partial<CollectionRowMap[K]>);
      toast.success(`${config.singular} updated`);
    } else {
      await api.create(draft as CollectionRowMap[K]);
      toast.success(`${config.singular} created`);
    }
    closeDialog();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    await api.remove(pendingDelete.id);
    toast.success(`${config.singular} deleted`);
    setPendingDelete(null);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{config.plural}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>
        {capabilities.create && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Add {config.singular}
          </Button>
        )}
      </header>

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder={`Search ${config.plural.toLowerCase()}…`}
          aria-label={`Search ${config.plural}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {tableFields.map((field) => (
                <TableHead key={String(field.name)}>{field.label}</TableHead>
              ))}
              {capabilities.publish && <TableHead className="w-28">Published</TableHead>}
              {capabilities.feature && <TableHead className="w-28">Featured</TableHead>}
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    tableFields.length +
                    1 +
                    (capabilities.publish ? 1 : 0) +
                    (capabilities.feature ? 1 : 0)
                  }
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  {query ? `No ${config.plural.toLowerCase()} match "${query}".` : "Nothing here yet."}
                </TableCell>
              </TableRow>
            )}

            {rows.map((row, index) => {
              const record = row as AnyRecord;
              return (
                <TableRow key={row.id}>
                  {tableFields.map((field, fieldIndex) => (
                    <TableCell
                      key={String(field.name)}
                      className={fieldIndex === 0 ? "font-medium" : "text-muted-foreground"}
                    >
                      <span className="line-clamp-2">{displayValue(record[field.name])}</span>
                    </TableCell>
                  ))}

                  {capabilities.publish && (
                    <TableCell>
                      <Switch
                        checked={row.published}
                        aria-label={`Publish ${displayValue(record[config.titleField])}`}
                        onCheckedChange={async (checked) => {
                          await api.setPublished(row.id, checked);
                          toast.success(checked ? "Published" : "Unpublished");
                        }}
                      />
                    </TableCell>
                  )}

                  {capabilities.feature && (
                    <TableCell>
                      <Switch
                        checked={row.featured}
                        aria-label={`Feature ${displayValue(record[config.titleField])}`}
                        onCheckedChange={async (checked) => {
                          await api.setFeatured(row.id, checked);
                          toast.success(checked ? "Added to homepage" : "Removed from homepage");
                        }}
                      />
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {capabilities.reorder && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move up"
                            disabled={index === 0}
                            onClick={() => api.move(row.id, -1)}
                          >
                            <ArrowUp className="size-4" aria-hidden="true" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move down"
                            disabled={index === rows.length - 1}
                            onClick={() => api.move(row.id, 1)}
                          >
                            <ArrowDown className="size-4" aria-hidden="true" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${displayValue(record[config.titleField])}`}
                        onClick={() => openEdit(row)}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      {capabilities.delete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${displayValue(record[config.titleField])}`}
                          onClick={() => setPendingDelete(row)}
                        >
                          <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {api.rows.length} {config.plural.toLowerCase()}.
      </p>

      {/* Create / edit form */}
      <Dialog open={draft !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${config.singular}` : `Add ${config.singular}`}
            </DialogTitle>
            <DialogDescription>
              Fields marked with an asterisk are required. Changes save when you press Save.
            </DialogDescription>
          </DialogHeader>

          {errors.length > 0 && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              Required: {errors.join(", ")}
            </p>
          )}

          {draft && (
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <FieldControl
                  key={String(field.name)}
                  field={field}
                  value={draft[field.name] as string | number | boolean | string[] | undefined}
                  invalid={errors.includes(field.label)}
                  onChange={(next) => setDraft({ ...draft, [field.name]: next })}
                />
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this {config.singular.toLowerCase()}?</DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? `"${displayValue((pendingDelete as AnyRecord)[config.titleField])}" will be removed. This cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {capabilities.feature && (
        <Badge variant="secondary" className="font-normal">
          Featured items are the ones shown on the homepage.
        </Badge>
      )}
    </div>
  );
}
