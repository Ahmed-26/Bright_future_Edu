import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSettingsFn, uploadMediaFn } from "@/server/fns";
import type { SiteSettings } from "@/lib/cms-types";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/settings")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  const router = useRouter();
  const save = useServerFn(saveSettingsFn);
  const upload = useServerFn(uploadMediaFn);
  const [form, setForm] = useState<SiteSettings | null>(state?.settings ?? null);
  if (!state || !form) return null;

  const set = (key: keyof SiteSettings, value: string) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        These values drive the navbar, footer and contact details.
      </p>
      <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-6">
        {(
          [
            ["name", "Institute name"],
            ["tagline", "Tagline"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["address", "Address"],
            ["hours", "Opening hours"],
            ["mapsUrl", "Google Maps URL"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="grid gap-2">
            <Label>{label}</Label>
            <Input value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </label>
        ))}
        <label className="grid gap-2">
          <Label>Footer text</Label>
          <Textarea value={form.footerText} onChange={(e) => set("footerText", e.target.value)} />
        </label>
        <label className="grid gap-2">
          <Label>Logo</Label>
          <Input value={form.logo} onChange={(e) => set("logo", e.target.value)} />
          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result));
                reader.onerror = () => reject(new Error("read failed"));
                reader.readAsDataURL(file);
              });
              const media = await upload({
                data: { filename: file.name, mime: file.type, data },
              });
              set("logo", media.url);
            }}
          />
        </label>
        {(["facebook", "instagram", "youtube", "whatsapp"] as const).map((key) => (
          <label key={key} className="grid gap-2">
            <Label className="capitalize">{key}</Label>
            <Input
              value={form.socials[key]}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? { ...prev, socials: { ...prev.socials, [key]: e.target.value } }
                    : prev,
                )
              }
            />
          </label>
        ))}
        <Button
          onClick={async () => {
            await save({ data: form });
            toast.success("Settings saved");
            await router.invalidate();
          }}
        >
          Save settings
        </Button>
      </div>
    </div>
  );
}
