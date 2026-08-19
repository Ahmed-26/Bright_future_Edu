import { createFileRoute } from "@tanstack/react-router";

import { CollectionScreen } from "@/components/admin/CollectionScreen";

export const Route = createFileRoute("/admin/courses")({
  component: () => <CollectionScreen collection="courses" />,
});
