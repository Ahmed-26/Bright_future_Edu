import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/catalog")({
  server: {
    handlers: {
      GET: async () => {
        const { getDb, toPublicCatalog } = await import("@/server/db");
        return Response.json(toPublicCatalog(getDb()));
      },
    },
  },
});
