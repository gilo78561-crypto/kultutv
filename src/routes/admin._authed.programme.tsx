import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { ComboField } from "@/components/admin/ComboField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getEmissions } from "@/functions/emissions";
import { programmeInput, updateProgramme } from "@/functions/programme";
import { api, queryKeys } from "@/services/api";

export const Route = createFileRoute("/admin/_authed/programme")({
  component: ProgrammeAdminPage,
});

type ProgrammeValues = z.input<typeof programmeInput>;

const emptyValues: ProgrammeValues = {
  title: "",
  emission: "",
  host: "",
  startsAt: "",
  endsAt: "",
  progress: 0,
  description: "",
  cover: "",
  streamUrl: "",
  next: [],
};

function ProgrammeAdminPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.programme,
    queryFn: api.getProgrammeEnCours,
  });

  const form = useForm<ProgrammeValues>({
    resolver: zodResolver(programmeInput),
    defaultValues: emptyValues,
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "next" });
  const emissions = useQuery({ queryKey: queryKeys.emissions, queryFn: () => getEmissions() });
  const emissionTitles = (emissions.data ?? []).map((e) => e.title);

  useEffect(() => {
    if (data) form.reset({ ...data, next: data.next });
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (values: ProgrammeValues) => updateProgramme({ data: values }),
    onSuccess: () => {
      toast.success("Programme mis à jour");
      queryClient.invalidateQueries({ queryKey: queryKeys.programme });
    },
    onError: (error: Error) => toast.error(error.message || "Échec de la mise à jour."),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="display text-3xl tracking-[calc(0.025em+1px)]">Programme en cours</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Le direct en cours de diffusion et les prochains rendez-vous.
        </p>
      </div>

      <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Émission en cours</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emission">Émission</Label>
              <Controller
                control={form.control}
                name="emission"
                render={({ field }) => (
                  <ComboField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={emissionTitles}
                    placeholder="Nom de l'émission"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="host">Animateur·rice</Label>
              <Input id="host" {...form.register("host")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                {...form.register("progress", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startsAt">Heure de début</Label>
              <Input id="startsAt" type="time" {...form.register("startsAt")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endsAt">Heure de fin</Label>
              <Input id="endsAt" type="time" {...form.register("endsAt")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cover">Image de couverture</Label>
              <Controller
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FileUploadField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    accept="image/*"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="streamUrl">Vidéo</Label>
              <Controller
                control={form.control}
                name="streamUrl"
                render={({ field }) => (
                  <FileUploadField
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    accept="video/*"
                    placeholder="Lien YouTube ou envoyez un fichier vidéo"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...form.register("description")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Prochainement</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => append({ title: "", startsAt: "" })}
            >
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun programme à venir.</p>
            )}
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-end gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={`next.${index}.title`}>Titre</Label>
                  <Input id={`next.${index}.title`} {...form.register(`next.${index}.title`)} />
                </div>
                <div className="w-32 space-y-1.5">
                  <Label htmlFor={`next.${index}.startsAt`}>Heure</Label>
                  <Input
                    id={`next.${index}.startsAt`}
                    type="time"
                    {...form.register(`next.${index}.startsAt`)}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" disabled={mutation.isPending} className="gap-2">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </form>
    </div>
  );
}
