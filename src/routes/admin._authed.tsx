import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAdminAuthStatus } from "@/functions/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/_authed")({
  beforeLoad: async () => {
    const { isAuthenticated } = await getAdminAuthStatus();
    if (!isAuthenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});
