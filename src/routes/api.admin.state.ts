import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/state")({
  server: {
    handlers: {
      GET: async () => {
        const { readSession } = await import("@/server/auth");
        const { getDb, toAdminState } = await import("@/server/db");
        if (!readSession()) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        return Response.json(toAdminState(getDb()));
      },
    },
  },
});
