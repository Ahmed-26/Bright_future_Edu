import { createFileRoute } from "@tanstack/react-router";

import { CollectionScreen } from "@/components/admin/CollectionScreen";

export const Route = createFileRoute("/admin/testimonials")({
  component: () => <CollectionScreen collection="testimonials" />,
});
