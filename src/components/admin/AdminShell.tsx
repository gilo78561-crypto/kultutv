import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  CalendarClock,
  Clapperboard,
  LayoutDashboard,
  LogOut,
  Mic2,
  Newspaper,
  Radio,
  Tv,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import type { ReactNode } from "react";

import { logoutAdmin } from "@/functions/admin-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/streams", label: "Stream TV", icon: Tv, exact: false },
  { to: "/admin/programme", label: "Programme en cours", icon: CalendarClock, exact: false },
  { to: "/admin/replays", label: "Replays", icon: Clapperboard, exact: false },
  { to: "/admin/emissions", label: "Émissions", icon: Radio, exact: false },
  { to: "/admin/articles", label: "Kultu Webzine", icon: Newspaper, exact: false },
  { to: "/admin/podcasts", label: "Podcasts", icon: Mic2, exact: false },
  { to: "/admin/flash-info", label: "Flash infos", icon: Zap, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const logout = useMutation({
    mutationFn: () => logoutAdmin(),
    onSuccess: () => {
      toast.success("Déconnecté");
      navigate({ to: "/admin/login" });
    },
    onError: () => toast.error("La déconnexion a échoué."),
  });

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-border">
        <SidebarHeader className="px-3 py-4">
          <Link to="/admin" className="flex items-center gap-2 px-1">
            <span className="gradient-ember flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">
              K
            </span>
            <span className="display text-lg tracking-[calc(0.025em+1px)] group-data-[collapsible=icon]:hidden">
              KULTU <span className="text-gradient-ember">Admin</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Contenu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link to={item.to}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-2 px-3 pb-4">
          <Link
            to="/"
            className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden"
          >
            ← Retour au site
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
          >
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="glass-panel sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <p className="text-sm font-medium text-muted-foreground">Espace administrateur</p>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
