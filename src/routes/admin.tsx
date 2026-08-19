/**
 * Admin layout route. Every /admin/* screen renders inside AdminLayout's shell.
 *
 * The route is deliberately excluded from search engines via `noindex` and is
 * gated by a client-side passcode only — see the security note in AdminLayout.
 */

import { createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Panel" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});
