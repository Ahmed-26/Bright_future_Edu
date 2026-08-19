import { createFileRoute } from "@tanstack/react-router";

import { SettingsScreen } from "@/components/admin/SettingsScreen";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsScreen,
});
