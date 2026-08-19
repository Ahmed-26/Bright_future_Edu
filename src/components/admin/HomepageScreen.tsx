/**
 * Homepage CMS: hero copy, CTA copy, and section visibility/order.
 *
 * The section list mirrors the blocks currently rendered by src/routes/index.tsx.
 * Toggling here records intent in the admin store; the public homepage will read
 * these flags once the database is connected in phase 2.
 */

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { moveSection, saveHomepage, toggleSection, useAdminState } from "./store";
import type { HomepageContent } from "./types";

export function HomepageScreen() {
  const { homepage, sections } = useAdminState();
  const [draft, setDraft] = useState<HomepageContent>(homepage);

  // Keeps the form in step with a draft reset from the banner.
  useEffect(() => setDraft(homepage), [homepage]);

  const set = <K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const ordered = [...sections].sort((a, b) => a.order - b.order);

  async function save() {
    if (!draft.heroHeading.trim()) {
      toast.error("The hero heading cannot be empty");
      return;
    }
    await saveHomepage(draft);
    toast.success("Homepage content saved");
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Homepage</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Edit the hero and call-to-action copy, and choose which sections appear and in what
            order.
          </p>
        </div>
        <Button onClick={save}>Save changes</Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hero section</CardTitle>
            <CardDescription>The first thing visitors read.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Eyebrow" value={draft.heroEyebrow} onChange={(v) => set("heroEyebrow", v)} />
            <Field
              label="Heading"
              value={draft.heroHeading}
              onChange={(v) => set("heroHeading", v)}
              required
            />
            <Field
              label="Description"
              value={draft.heroDescription}
              onChange={(v) => set("heroDescription", v)}
              multiline
            />
            <Field
              label="Hero image path"
              value={draft.heroImageUrl}
              onChange={(v) => set("heroImageUrl", v)}
              help="Set the image file in Media, then paste the path here."
            />
            <div className="space-y-2">
              <Label htmlFor="hero-bullets">Highlight points</Label>
              <Textarea
                id="hero-bullets"
                rows={3}
                aria-describedby="hero-bullets-help"
                value={draft.heroBullets.join("\n")}
                onChange={(e) =>
                  set(
                    "heroBullets",
                    e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  )
                }
              />
              <p id="hero-bullets-help" className="text-xs text-muted-foreground">
                One per line. Three works best on the current layout.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Primary button label"
                value={draft.primaryCtaLabel}
                onChange={(v) => set("primaryCtaLabel", v)}
              />
              <Field
                label="Primary button link"
                value={draft.primaryCtaHref}
                onChange={(v) => set("primaryCtaHref", v)}
              />
              <Field
                label="Secondary button label"
                value={draft.secondaryCtaLabel}
                onChange={(v) => set("secondaryCtaLabel", v)}
              />
              <Field
                label="Secondary button link"
                value={draft.secondaryCtaHref}
                onChange={(v) => set("secondaryCtaHref", v)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Closing call to action</CardTitle>
              <CardDescription>The band shown near the bottom of the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Heading" value={draft.ctaHeading} onChange={(v) => set("ctaHeading", v)} />
              <Field
                label="Description"
                value={draft.ctaDescription}
                onChange={(v) => set("ctaDescription", v)}
                multiline
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Button label"
                  value={draft.ctaButtonLabel}
                  onChange={(v) => set("ctaButtonLabel", v)}
                />
                <Field
                  label="Button link"
                  value={draft.ctaButtonHref}
                  onChange={(v) => set("ctaButtonHref", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
              <CardDescription>
                Hide a section or move it up and down. Content itself is edited in its own screen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {ordered.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5"
                >
                  {section.visible ? (
                    <Eye className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <EyeOff className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {section.label}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${section.label} up`}
                    disabled={index === 0}
                    onClick={() => moveSection(section.id, -1)}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${section.label} down`}
                    disabled={index === ordered.length - 1}
                    onClick={() => moveSection(section.id, 1)}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Button>
                  <Switch
                    checked={section.visible}
                    aria-label={`Show ${section.label}`}
                    onCheckedChange={(checked) => toggleSection(section.id, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** Small labelled input used by the page-content screens. */
export function Field({
  label,
  value,
  onChange,
  multiline,
  required,
  help,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  multiline?: boolean;
  required?: boolean;
  help?: string;
  type?: string;
}) {
  const id = `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          rows={3}
          value={value}
          aria-describedby={help ? `${id}-help` : undefined}
          aria-required={required || undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          aria-describedby={help ? `${id}-help` : undefined}
          aria-required={required || undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {help && (
        <p id={`${id}-help`} className="text-xs text-muted-foreground">
          {help}
        </p>
      )}
    </div>
  );
}
