import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clapperboard, Loader2, Mic2, Newspaper, Radio, Tv, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/functions/dashboard";

export const Route = createFileRoute("/admin/_authed/")({
  component: AdminDashboard,
});

const cards = [
  { key: "streams", label: "Streams TV & Radio", icon: Tv, to: "/admin/streams" as const },
  { key: "replays", label: "Replays", icon: Clapperboard, to: "/admin/replays" as const },
  { key: "emissions", label: "Émissions", icon: Radio, to: "/admin/emissions" as const },
  { key: "articles", label: "Articles Webzine", icon: Newspaper, to: "/admin/articles" as const },
  { key: "podcasts", label: "Podcasts", icon: Mic2, to: "/admin/podcasts" as const },
  { key: "flashInfos", label: "Flash infos", icon: Zap, to: "/admin/flash-info" as const },
] as const;

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => getAdminStats(),
  });

  return (
    <div>
      <h1 className="display text-3xl tracking-[calc(0.025em+1px)]">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Vue d'ensemble du contenu publié sur KULTU TV.
      </p>

      {isLoading ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.key} to={card.to}>
              <Card className="card-hover border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="display text-4xl tracking-[calc(0.025em+1px)]">
                    {data?.[card.key as keyof typeof data] ?? 0}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
