import { createFileRoute } from "@tanstack/react-router";

import { CollectionScreen } from "@/components/admin/CollectionScreen";

export const Route = createFileRoute("/admin/subjects")({
  component: () => <CollectionScreen collection="subjects" />,
});
