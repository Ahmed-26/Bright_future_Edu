import { createFileRoute } from "@tanstack/react-router";

import { HomepageScreen } from "@/components/admin/HomepageScreen";

export const Route = createFileRoute("/admin/homepage")({
  component: HomepageScreen,
});
