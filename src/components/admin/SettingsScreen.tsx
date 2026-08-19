/**
 * Site settings: the contact details, social links and footer copy that appear
 * in the navbar, footer and contact page. One save writes the whole record.
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Field } from "./HomepageScreen";
import { saveSettings, useAdminState } from "./store";
import type { SiteSettings } from "./types";

export function SettingsScreen() {
  const { settings } = useAdminState();
  const [draft, setDraft] = useState<SiteSettings>(settings);

  useEffect(() => setDraft(settings), [settings]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  async function save() {
    if (!draft.name.trim()) {
      toast.error("The institute name cannot be empty");
      return;
    }
    if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      toast.error("Enter a valid email address");
      return;
    }
    await saveSettings(draft);
    toast.success("Site settings saved");
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Site Settings</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Used across the navbar, footer, contact page and WhatsApp button.
          </p>
        </div>
        <Button onClick={save}>Save changes</Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Institute identity</CardTitle>
            <CardDescription>Name, tagline and logo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Institute name" value={draft.name} onChange={(v) => set("name", v)} required />
            <Field label="Tagline" value={draft.tagline} onChange={(v) => set("tagline", v)} />
            <Field
              label="Logo path"
              value={draft.logoUrl}
              onChange={(v) => set("logoUrl", v)}
              help="Change the file in Media, then paste its path here."
            />
            <Field
              label="Footer note"
              value={draft.footerNote}
              onChange={(v) => set("footerNote", v)}
              multiline
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact details</CardTitle>
            <CardDescription>Shown on the contact page and in the footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Phone" value={draft.phone} onChange={(v) => set("phone", v)} type="tel" />
            <Field label="Email" value={draft.email} onChange={(v) => set("email", v)} type="email" />
            <Field label="Address" value={draft.address} onChange={(v) => set("address", v)} multiline />
            <Field
              label="Opening hours"
              value={draft.hours}
              onChange={(v) => set("hours", v)}
              help="Example: Mon – Sat, 9:00 AM – 8:00 PM."
            />

          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Social links</CardTitle>
            <CardDescription>
              Leave a field empty to hide that icon. WhatsApp also powers the floating chat button.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook URL" value={draft.facebook} onChange={(v) => set("facebook", v)} />
            <Field label="Instagram URL" value={draft.instagram} onChange={(v) => set("instagram", v)} />
            <Field label="YouTube URL" value={draft.youtube} onChange={(v) => set("youtube", v)} />
            <Field
              label="WhatsApp number"
              value={draft.whatsapp}
              onChange={(v) => set("whatsapp", v)}
              help="Digits only, including country code, e.g. 923000000000."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
