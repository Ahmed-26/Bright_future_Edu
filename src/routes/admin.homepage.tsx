import type { ReactNode } from "react";
import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CrudPage } from "@/components/admin/CrudPage";
import { saveHomepageFn, uploadMediaFn } from "@/server/fns";
import type { HomepageContent } from "@/lib/cms-types";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/homepage")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  const router = useRouter();
  const save = useServerFn(saveHomepageFn);
  const upload = useServerFn(uploadMediaFn);
  const [form, setForm] = useState<HomepageContent | null>(state?.homepage ?? null);
  if (!state || !form) return null;

  const set = <K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Homepage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit live homepage copy. Featured items are controlled on Courses, Subjects, Teachers,
          Results, Achievements and Testimonials.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Hero</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <Input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
          </Field>
          <Field label="Heading">
            <Input value={form.heroHeading} onChange={(e) => set("heroHeading", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                value={form.heroDescription}
                onChange={(e) => set("heroDescription", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Primary button">
            <Input
              value={form.heroPrimaryLabel}
              onChange={(e) => set("heroPrimaryLabel", e.target.value)}
            />
          </Field>
          <Field label="Primary link">
            <Input
              value={form.heroPrimaryHref}
              onChange={(e) => set("heroPrimaryHref", e.target.value)}
            />
          </Field>
          <Field label="Secondary button">
            <Input
              value={form.heroSecondaryLabel}
              onChange={(e) => set("heroSecondaryLabel", e.target.value)}
            />
          </Field>
          <Field label="Secondary link">
            <Input
              value={form.heroSecondaryHref}
              onChange={(e) => set("heroSecondaryHref", e.target.value)}
            />
          </Field>
          <Field label="Image caption">
            <Input value={form.heroCaption} onChange={(e) => set("heroCaption", e.target.value)} />
          </Field>
          <Field label="Hero image URL">
            <Input value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} />
            <Input
              className="mt-2"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const data = await fileToData(file);
                const media = await upload({
                  data: { filename: file.name, mime: file.type, data },
                });
                set("heroImage", media.url);
              }}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Bullets (one per line)">
              <Textarea
                value={form.heroBullets.join("\n")}
                onChange={(e) =>
                  set(
                    "heroBullets",
                    e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Section visibility</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["heroPublished", "Hero"],
              ["statsPublished", "Statistics"],
              ["boardsPublished", "Exam boards"],
              ["coursesPublished", "Featured courses"],
              ["subjectsPublished", "Featured subjects"],
              ["whyPublished", "Why choose us"],
              ["teachersPublished", "Featured teachers"],
              ["resultsPublished", "Results / achievements"],
              ["testimonialsPublished", "Testimonials"],
              ["ctaPublished", "CTA"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border px-3 py-2">
              <span className="text-sm">{label}</span>
              <Switch checked={form[key]} onCheckedChange={(v) => set(key, v)} />
            </label>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Why choose us title">
            <Input value={form.whyTitle} onChange={(e) => set("whyTitle", e.target.value)} />
          </Field>
          <Field label="Why choose us description">
            <Textarea
              value={form.whyDescription}
              onChange={(e) => set("whyDescription", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">CTA</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <Input value={form.ctaEyebrow} onChange={(e) => set("ctaEyebrow", e.target.value)} />
          </Field>
          <Field label="Heading">
            <Input value={form.ctaHeading} onChange={(e) => set("ctaHeading", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                value={form.ctaDescription}
                onChange={(e) => set("ctaDescription", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Primary button">
            <Input
              value={form.ctaPrimaryLabel}
              onChange={(e) => set("ctaPrimaryLabel", e.target.value)}
            />
          </Field>
          <Field label="Primary link">
            <Input value={form.ctaPrimaryHref} onChange={(e) => set("ctaPrimaryHref", e.target.value)} />
          </Field>
          <Field label="Secondary button">
            <Input
              value={form.ctaSecondaryLabel}
              onChange={(e) => set("ctaSecondaryLabel", e.target.value)}
            />
          </Field>
          <Field label="Secondary link">
            <Input
              value={form.ctaSecondaryHref}
              onChange={(e) => set("ctaSecondaryHref", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <Button
        onClick={async () => {
          await save({ data: form });
          toast.success("Homepage saved");
          await router.invalidate();
        }}
      >
        Save homepage
      </Button>

      <CrudPage
        title="Why Choose Us"
        collection="whyChooseUs"
        rows={state.whyChooseUs as unknown as Record<string, unknown>[]}
        fields={[
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea" },
          { key: "sortOrder", label: "Display order", type: "number" },
          { key: "published", label: "Published", type: "toggle" },
        ]}
        columns={[
          { key: "title", label: "Title" },
          { key: "published", label: "Published" },
        ]}
        defaults={{
          title: "",
          text: "",
          featured: true,
          published: true,
          sortOrder: state.whyChooseUs.length,
        }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function fileToData(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}
