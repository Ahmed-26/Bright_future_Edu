import { createFileRoute } from "@tanstack/react-router";

import { MediaScreen } from "@/components/admin/MediaScreen";

export const Route = createFileRoute("/admin/media")({
  component: MediaScreen,
});
