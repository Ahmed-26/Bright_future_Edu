/**
 * Media library.
 *
 * Phase 1 tracks image *paths* rather than uploading files, because there is no
 * server or storage bucket yet. A real upload control replaces the URL field in
 * phase 2 without changing this screen's layout.
 */

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { addMedia, deleteMedia, saveMediaUrl, useAdminState } from "./store";

export function MediaScreen() {
  const { media } = useAdminState();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [usage, setUsage] = useState("");

  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (!label.trim() || !url.trim()) {
      toast.error("Give the image a name and a path");
      return;
    }
    await addMedia(label.trim(), url.trim(), usage.trim() || "Not used yet");
    setLabel("");
    setUrl("");
    setUsage("");
    toast.success("Image added");
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Media</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          The images used around the site. Until file uploads are connected, each entry points at a
          path inside the project.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {media.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{item.label}</CardTitle>
              <CardDescription>{item.usage}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-hidden rounded-lg border border-border bg-muted">
                <img
                  src={item.url}
                  alt={item.label}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`media-${item.id}`}>Path</Label>
                <Input
                  id={`media-${item.id}`}
                  defaultValue={item.url}
                  onBlur={(e) => {
                    if (e.target.value !== item.url) {
                      saveMediaUrl(item.id, e.target.value);
                      toast.success("Path updated");
                    }
                  }}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={async () => {
                  await deleteMedia(item.id);
                  toast.success("Image removed");
                }}
              >
                <Trash2 className="mr-2 size-4" aria-hidden="true" />
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg">Add an image</CardTitle>
          <CardDescription>
            Uploads arrive with the backend. For now, reference a file already in the project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media-label">Name</Label>
              <Input
                id="media-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Campus photo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media-url">Path</Label>
              <Input
                id="media-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/src/assets/campus.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media-usage">Where it is used</Label>
              <Input
                id="media-usage"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="About page"
              />
            </div>
            <Button type="submit">
              <Plus className="mr-2 size-4" aria-hidden="true" />
              Add image
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
