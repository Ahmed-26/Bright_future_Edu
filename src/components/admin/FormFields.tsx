/**
 * Renders one editable control from a FieldDef.
 *
 * A native <select> is used rather than the Radix Select so the whole form works
 * inside a dialog without portal/focus interplay, and so it stays keyboard and
 * screen-reader accessible with no extra wiring.
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { FieldDef } from "./types";

type Primitive = string | number | boolean | string[] | undefined;

export function FieldControl<T>({
  field,
  value,
  onChange,
  invalid,
}: {
  field: FieldDef<T>;
  value: Primitive;
  onChange: (next: Primitive) => void;
  invalid?: boolean;
}) {
  const id = `field-${String(field.name)}`;
  const describedBy = field.help ? `${id}-help` : undefined;
  const common = {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid || undefined,
    "aria-required": field.required || undefined,
  };

  return (
    <div className={cn("space-y-2", field.wide && "sm:col-span-2")}>
      <Label htmlFor={id}>
        {field.label}
        {field.required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {field.kind === "textarea" && (
        <Textarea
          {...common}
          rows={4}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.kind === "list" && (
        <Textarea
          {...common}
          rows={5}
          value={Array.isArray(value) ? value.join("\n") : ""}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
        />
      )}

      {field.kind === "tags" && (
        <Input
          {...common}
          value={Array.isArray(value) ? value.join(", ") : ""}
          placeholder={field.placeholder ?? "O Level, A Level"}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(",")
                .map((part) => part.trim())
                .filter(Boolean),
            )
          }
        />
      )}

      {field.kind === "select" && (
        <select
          {...common}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {(field.kind === "number" || field.kind === "rating") && (
        <Input
          {...common}
          type="number"
          min={field.kind === "rating" ? 1 : 0}
          max={field.kind === "rating" ? 5 : undefined}
          step={1}
          value={value === undefined || value === "" ? "" : Number(value)}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      )}

      {(field.kind === "text" || field.kind === "slug" || field.kind === "image") && (
        <Input
          {...common}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange(field.kind === "slug" ? slugify(e.target.value) : e.target.value)
          }
        />
      )}

      {field.help && (
        <p id={describedBy} className="text-xs text-muted-foreground">
          {field.help}
        </p>
      )}
    </div>
  );
}

/** Keeps slugs URL-safe as the editor types, so links never break silently. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Compact display of any field value inside a table cell. */
export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}
