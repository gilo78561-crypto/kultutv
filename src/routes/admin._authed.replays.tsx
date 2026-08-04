import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import {
  EntityManager,
  type ColumnConfig,
  type FieldConfig,
} from "@/components/admin/EntityManager";
import type { replays } from "@/db/schema";
import { getEmissions } from "@/functions/emissions";
import {
  createReplay,
  deleteReplay,
  getReplays,
  replayInput,
  updateReplay,
} from "@/functions/replays";
import { slugify } from "@/lib/slugify";
import { queryKeys } from "@/services/api";

export const Route = createFileRoute("/admin/_authed/replays")({
  component: ReplaysAdminPage,
});

type ReplayRow = typeof replays.$inferSelect;

// The slug is auto-generated from the title and isn't shown in the form, so
// the form-level schema must not require it.
const replayFormSchema = replayInput.extend({ slug: z.string().optional() });
type ReplayValues = z.infer<typeof replayFormSchema>;

const columns: ColumnConfig<ReplayRow>[] = [
  { key: "title", label: "Titre" },
  { key: "emission", label: "Émission" },
  { key: "duration", label: "Durée" },
  { key: "date", label: "Date" },
];

function ReplaysAdminPage() {
  const emissions = useQuery({ queryKey: queryKeys.emissions, queryFn: () => getEmissions() });
  const emissionTitles = (emissions.data ?? []).map((e) => e.title);

  const fields: FieldConfig[] = [
    { name: "title", label: "Titre", placeholder: "Récap — 10 octobre 2026" },
    {
      name: "emission",
      label: "Émission",
      type: "combo",
      comboOptions: emissionTitles,
      placeholder: "Nom de l'émission",
    },
    { name: "duration", label: "Durée", placeholder: "30 min" },
    { name: "date", label: "Date de diffusion", type: "date", required: false },
    { name: "cover", label: "Image de couverture", type: "file", accept: "image/*" },
    {
      name: "streamUrl",
      label: "Vidéo",
      type: "file",
      accept: "video/*",
      placeholder: "Lien YouTube ou envoyez un fichier vidéo",
    },
    { name: "description", label: "Description", type: "textarea", rows: 4 },
  ];

  return (
    <EntityManager<ReplayRow, ReplayValues>
      title="Replays"
      description="Gérez les vidéos de rediffusion des émissions."
      queryKey={queryKeys.replays}
      listFn={() => getReplays()}
      createFn={(values) =>
        createReplay({ data: { ...values, slug: values.slug || slugify(values.title) } })
      }
      updateFn={(values) =>
        updateReplay({ data: { ...values, slug: values.slug || slugify(values.title) } })
      }
      deleteFn={(values) => deleteReplay({ data: values })}
      schema={replayFormSchema}
      defaultValues={{
        slug: "",
        title: "",
        emission: "",
        duration: "",
        date: "",
        cover: "",
        description: "",
        streamUrl: "",
      }}
      fields={fields}
      columns={columns}
      getId={(row) => row.id}
      rowToValues={(row) => ({
        slug: row.slug,
        title: row.title,
        emission: row.emission,
        duration: row.duration,
        date: row.date ?? "",
        cover: row.cover,
        description: row.description,
        streamUrl: row.streamUrl,
      })}
    />
  );
}
