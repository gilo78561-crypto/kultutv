import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";

import {
  EntityManager,
  type ColumnConfig,
  type FieldConfig,
} from "@/components/admin/EntityManager";
import type { podcasts } from "@/db/schema";
import {
  createPodcast,
  deletePodcast,
  getPodcasts,
  getPodcastShows,
  podcastInput,
  updatePodcast,
} from "@/functions/podcasts";
import { queryKeys } from "@/services/api";

export const Route = createFileRoute("/admin/_authed/podcasts")({
  component: PodcastsAdminPage,
});

type PodcastRow = typeof podcasts.$inferSelect;
type PodcastValues = z.infer<typeof podcastInput>;

const columns: ColumnConfig<PodcastRow>[] = [
  { key: "title", label: "Titre" },
  { key: "show", label: "Émission" },
  { key: "duration", label: "Durée" },
];

function PodcastsAdminPage() {
  const shows = useQuery({ queryKey: ["podcasts", "shows"], queryFn: () => getPodcastShows() });

  const fields: FieldConfig[] = [
    { name: "title", label: "Titre", placeholder: "Astuces du jour" },
    {
      name: "show",
      label: "Émission",
      type: "combo",
      comboOptions: shows.data ?? [],
      placeholder: "Nouvelle émission",
    },
    { name: "duration", label: "Durée", placeholder: "12 min" },
    { name: "cover", label: "Image de couverture", type: "url", accept: "image/*" },
    { name: "audioUrl", label: "Lien audio", type: "url" },
  ];

  return (
    <EntityManager<PodcastRow, PodcastValues>
      title="Podcasts"
      description="Gérez les épisodes audio disponibles sur le site."
      queryKey={queryKeys.podcasts}
      listFn={() => getPodcasts()}
      createFn={(values) => createPodcast({ data: values })}
      updateFn={(values) => updatePodcast({ data: values })}
      deleteFn={(values) => deletePodcast({ data: values })}
      schema={podcastInput}
      defaultValues={{ title: "", show: "", duration: "", cover: "", audioUrl: "" }}
      fields={fields}
      columns={columns}
      getId={(row) => row.id}
      rowToValues={(row) => ({
        title: row.title,
        show: row.show,
        duration: row.duration,
        cover: row.cover,
        audioUrl: row.audioUrl,
      })}
    />
  );
}
