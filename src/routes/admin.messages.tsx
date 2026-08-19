import { createFileRoute } from "@tanstack/react-router";

import { MessagesScreen } from "@/components/admin/InboxScreens";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesScreen,
});
