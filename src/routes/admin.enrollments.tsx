import { createFileRoute } from "@tanstack/react-router";

import { EnrollmentsScreen } from "@/components/admin/InboxScreens";

export const Route = createFileRoute("/admin/enrollments")({
  component: EnrollmentsScreen,
});
