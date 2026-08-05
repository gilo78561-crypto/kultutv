import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import {
  EntityManager,
  type ColumnConfig,
  type FieldConfig,
} from "@/components/admin/EntityManager";
import type { emissions } from "@/db/schema";
import {
  createEmission,
  deleteEmission,
  emissionInput,
  getEmissionCategories,
  getEmissions,
  updateEmission,
} from "@/functions/emissions";
import { slugify } from "@/lib/slugify";
import { queryKeys } from "@/services/api";

export const Route = createFileRoute("/admin/_authed/emissions")({
  component: EmissionsAdminPage,
});

type EmissionRow = typeof emissions.$inferSelect;

// The slug is auto-generated from the title (see slugify() below) and isn't
// shown in the form, so the form-level schema must not require it — only the
// server-side emissionInput schema (applied after slugify) does.
const emissionFormSchema = emissionInput.extend({ slug: z.string().optional() });
type EmissionValues = z.infer<typeof emissionFormSchema>;

const columns: ColumnConfig<EmissionRow>[] = [
  { key: "title", label: "Titre" },
  { key: "host", label: "Animateur·rice" },
  { key: "category", label: "Catégorie" },
  { key: "schedule", label: "Horaire" },
];

function EmissionsAdminPage() {
  const categories = useQuery({
    queryKey: ["emissions", "categories"],
    queryFn: () => getEmissionCategories(),
  });

  const fields: FieldConfig[] = [
    { name: "title", label: "Titre", placeholder: "Récap Kultu" },
    { name: "host", label: "Animateur·rice", placeholder: "La rédaction KULTU" },
    { name: "schedule", label: "Horaire", type: "schedule" },
    {
      name: "category",
      label: "Catégorie",
      type: "combo",
      comboOptions: categories.data ?? [],
      placeholder: "Nouvelle catégorie",
    },
    { name: "cover", label: "Image de couverture", type: "url", accept: "image/*" },
    {
      name: "streamUrl",
      label: "Vidéo",
      type: "url",
      placeholder: "Lien YouTube ou URL vidéo",
    },
    { name: "description", label: "Description", type: "textarea", rows: 4 },
  ];

  return (
    <EntityManager<EmissionRow, EmissionValues>
      title="Émissions"
      description="Gérez les émissions récurrentes de KULTU TV."
      queryKey={queryKeys.emissions}
      listFn={() => getEmissions()}
      createFn={(values) =>
        createEmission({ data: { ...values, slug: values.slug || slugify(values.title) } })
      }
      updateFn={(values) =>
        updateEmission({ data: { ...values, slug: values.slug || slugify(values.title) } })
      }
      deleteFn={(values) => deleteEmission({ data: values })}
      schema={emissionFormSchema}
      defaultValues={{
        slug: "",
        title: "",
        host: "",
        schedule: "Lundi — 20h00",
        category: "",
        description: "",
        cover: "",
        streamUrl: "",
      }}
      fields={fields}
      columns={columns}
      getId={(row) => row.id}
      rowToValues={(row) => ({
        slug: row.slug,
        title: row.title,
        host: row.host,
        schedule: row.schedule,
        category: row.category,
        description: row.description,
        cover: row.cover,
        streamUrl: row.streamUrl,
      })}
    />
  );
}
