import { createFileRoute } from "@tanstack/react-router";

import { CollectionScreen } from "@/components/admin/CollectionScreen";

export const Route = createFileRoute("/admin/statistics")({
  component: () => <CollectionScreen collection="statistics" />,
});
