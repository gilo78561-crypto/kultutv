import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";

import {
  EntityManager,
  type ColumnConfig,
  type FieldConfig,
} from "@/components/admin/EntityManager";
import type { flashInfos } from "@/db/schema";
import {
  createFlashInfo,
  deleteFlashInfo,
  flashInfoInput,
  getFlashInfo,
  getFlashInfoLabels,
  updateFlashInfo,
} from "@/functions/flash-info";
import { queryKeys } from "@/services/api";

export const Route = createFileRoute("/admin/_authed/flash-info")({
  component: FlashInfoAdminPage,
});

type FlashInfoRow = typeof flashInfos.$inferSelect;
type FlashInfoValues = z.infer<typeof flashInfoInput>;

const columns: ColumnConfig<FlashInfoRow>[] = [
  { key: "time", label: "Heure" },
  { key: "label", label: "Catégorie" },
  { key: "text", label: "Texte" },
];

function FlashInfoAdminPage() {
  const labels = useQuery({
    queryKey: ["flash-info", "labels"],
    queryFn: () => getFlashInfoLabels(),
  });

  const fields: FieldConfig[] = [
    { name: "time", label: "Heure", type: "time" },
    {
      name: "label",
      label: "Catégorie",
      type: "combo",
      comboOptions: labels.data ?? [],
      placeholder: "Nouvelle catégorie",
    },
    { name: "text", label: "Texte", type: "textarea", rows: 3 },
  ];

  return (
    <EntityManager<FlashInfoRow, FlashInfoValues>
      title="Flash infos"
      description="Gérez les brèves affichées dans le bandeau défilant."
      queryKey={queryKeys.flashInfo}
      listFn={() => getFlashInfo()}
      createFn={(values) => createFlashInfo({ data: values })}
      updateFn={(values) => updateFlashInfo({ data: values })}
      deleteFn={(values) => deleteFlashInfo({ data: values })}
      schema={flashInfoInput}
      defaultValues={{ time: "", label: "", text: "" }}
      fields={fields}
      columns={columns}
      getId={(row) => row.id}
      rowToValues={(row) => ({ time: row.time, label: row.label, text: row.text })}
    />
  );
}
