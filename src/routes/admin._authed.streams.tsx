import { createFileRoute } from "@tanstack/react-router";
import type { z } from "zod";

import {
  EntityManager,
  type ColumnConfig,
  type FieldConfig,
} from "@/components/admin/EntityManager";
import { LiveStreamCard } from "@/components/admin/LiveStreamCard";
import type { streams } from "@/db/schema";
import {
  createStream,
  deleteStream,
  listStreamsAdmin,
  streamInput,
  updateStream,
} from "@/functions/streams";
import { queryKeys } from "@/services/api";

type StreamValues = z.input<typeof streamInput>;

export const Route = createFileRoute("/admin/_authed/streams")({
  component: StreamsAdminPage,
});

type StreamRow = typeof streams.$inferSelect;

// Radio is a fixed continuous stream (URL supplied outside the admin) and is
// no longer managed here — only the TV stream is editable from this page.
const fields: FieldConfig[] = [
  { name: "name", label: "Nom", placeholder: "KULTU TV — Direct" },
  {
    name: "url",
    label: "URL du flux",
    type: "url",
    placeholder: "https://... (ou configuré automatiquement via le direct OBS ci-dessous)",
  },
  { name: "cover", label: "Image de couverture", type: "file", accept: "image/*" },
  { name: "sortOrder", label: "Ordre d'affichage", type: "number" },
];

const columns: ColumnConfig<StreamRow>[] = [
  { key: "name", label: "Nom" },
  { key: "sortOrder", label: "Ordre" },
];

function StreamsAdminPage() {
  return (
    <div>
      <EntityManager<StreamRow, StreamValues>
        title="Stream TV"
        description="Gérez le flux TV diffusé sur le site."
        queryKey={[...queryKeys.tvStreams, "admin"]}
        listFn={async () => (await listStreamsAdmin()).filter((s) => s.kind === "tv")}
        createFn={(values) => createStream({ data: values })}
        updateFn={(values) => updateStream({ data: values })}
        deleteFn={(values) => deleteStream({ data: values })}
        schema={streamInput}
        defaultValues={{ kind: "tv", name: "", url: "", cover: "", sortOrder: 0 }}
        fields={fields}
        columns={columns}
        getId={(row) => row.id}
        rowToValues={(row) => ({
          kind: row.kind,
          name: row.name,
          url: row.url,
          cover: row.cover,
          sortOrder: row.sortOrder,
        })}
      />
      <LiveStreamCard />
    </div>
  );
}
