import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession, getAdminState } from "@/server/fns";

export const Route = createFileRoute("/admin")({
  staleTime: 0,
  beforeLoad: async ({ location }) => {
    const session = await getAdminSession();
    const isLogin = location.pathname === "/admin/login";
    if (!session && !isLogin) {
      throw redirect({ to: "/admin/login" });
    }
    if (session && isLogin) {
      throw redirect({ to: "/admin" });
    }
    return { adminEmail: session?.email ?? null };
  },
  loader: async ({ location }) => {
    if (location.pathname === "/admin/login") {
      return { state: null };
    }
    return { state: await getAdminState() };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/admin/login") return <Outlet />;
  return <AdminShell />;
}
