import { createFileRoute } from "@tanstack/react-router";

import { CollectionScreen } from "@/components/admin/CollectionScreen";

export const Route = createFileRoute("/admin/exam-boards")({
  component: () => <CollectionScreen collection="examBoards" />,
});
