import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Controller,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import { toast } from "sonner";
import type { ZodType } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ComboField } from "@/components/admin/ComboField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { ScheduleField } from "@/components/admin/ScheduleField";

type DynamicFieldProps = { value: unknown; onChange: (value: unknown) => void };

export type FieldConfig = {
  name: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "url"
    | "number"
    | "select"
    | "lines"
    | "file"
    | "combo"
    | "schedule"
    | "date"
    | "time";
  rows?: number;
  options?: { value: string; label: string }[];
  comboOptions?: string[];
  placeholder?: string;
  accept?: string;
  // Fields are required by default (shown with a "*"); set to false to mark
  // a field as optional, e.g. replays' "date".
  required?: boolean;
};

export type ColumnConfig<TRow> = {
  key: string;
  label: string;
  render?: (row: TRow) => ReactNode;
};

type EntityManagerProps<TRow, TValues extends FieldValues> = {
  title: string;
  description?: string;
  queryKey: readonly unknown[];
  listFn: () => Promise<TRow[]>;
  createFn: (values: TValues) => Promise<unknown>;
  updateFn: (values: TValues & { id: string }) => Promise<unknown>;
  deleteFn: (values: { id: string }) => Promise<unknown>;
  schema: ZodType<TValues>;
  defaultValues: TValues;
  fields: FieldConfig[];
  columns: ColumnConfig<TRow>[];
  getId: (row: TRow) => string;
  rowToValues: (row: TRow) => TValues;
  emptyLabel?: string;
};

export function EntityManager<TRow, TValues extends FieldValues>({
  title,
  description,
  queryKey,
  listFn,
  createFn,
  updateFn,
  deleteFn,
  schema,
  defaultValues,
  fields,
  columns,
  getId,
  rowToValues,
  emptyLabel = "Aucun élément pour le moment.",
}: EntityManagerProps<TRow, TValues>) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey, queryFn: listFn });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TRow | null>(null);

  const form = useForm<TValues>({
    resolver: zodResolver(schema as never) as unknown as Resolver<TValues>,
    defaultValues: defaultValues as unknown as DefaultValues<TValues>,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      toast.success("Créé avec succès");
      invalidate();
      setDialogOpen(false);
    },
    onError: (error: Error) => toast.error(error.message || "Échec de la création."),
  });

  const updateMutation = useMutation({
    mutationFn: updateFn,
    onSuccess: () => {
      toast.success("Mis à jour");
      invalidate();
      setDialogOpen(false);
    },
    onError: (error: Error) => toast.error(error.message || "Échec de la mise à jour."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      toast.success("Supprimé");
      invalidate();
      setDeleteTarget(null);
    },
    onError: (error: Error) => toast.error(error.message || "Échec de la suppression."),
  });

  const openCreate = () => {
    setEditing(null);
    form.reset(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (row: TRow) => {
    setEditing(row);
    form.reset(rowToValues(row));
    setDialogOpen(true);
  };

  const onSubmit = (values: TValues) => {
    if (editing) {
      updateMutation.mutate({ ...values, id: getId(editing) });
    } else {
      createMutation.mutate(values);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const rows = data ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl tracking-[calc(0.025em+1px)]">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </div>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={getId(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="max-w-xs truncate">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier" : "Ajouter"} — {title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required !== false && <span className="text-destructive"> *</span>}
                </Label>
                {field.type === "textarea" || field.type === "lines" ? (
                  <Controller
                    control={form.control}
                    name={field.name as never}
                    render={({ field: rhf }: { field: DynamicFieldProps }) => (
                      <Textarea
                        id={field.name}
                        rows={field.rows ?? 4}
                        placeholder={field.placeholder}
                        value={
                          field.type === "lines"
                            ? Array.isArray(rhf.value)
                              ? (rhf.value as string[]).join("\n")
                              : ""
                            : String(rhf.value ?? "")
                        }
                        onChange={(e) =>
                          rhf.onChange(
                            field.type === "lines" ? e.target.value.split("\n") : e.target.value,
                          )
                        }
                      />
                    )}
                  />
                ) : field.type === "combo" ? (
                  <Controller
                    control={form.control}
                    name={field.name as never}
                    render={({ field: rhf }: { field: DynamicFieldProps }) => (
                      <ComboField
                        value={String(rhf.value ?? "")}
                        onChange={rhf.onChange}
                        options={field.comboOptions ?? []}
                        placeholder={field.placeholder}
                      />
                    )}
                  />
                ) : field.type === "schedule" ? (
                  <Controller
                    control={form.control}
                    name={field.name as never}
                    render={({ field: rhf }: { field: DynamicFieldProps }) => (
                      <ScheduleField value={String(rhf.value ?? "")} onChange={rhf.onChange} />
                    )}
                  />
                ) : field.type === "file" ? (
                  <Controller
                    control={form.control}
                    name={field.name as never}
                    render={({ field: rhf }: { field: DynamicFieldProps }) => (
                      <FileUploadField
                        value={String(rhf.value ?? "")}
                        onChange={rhf.onChange}
                        accept={field.accept}
                        placeholder={field.placeholder}
                      />
                    )}
                  />
                ) : field.type === "select" ? (
                  <Controller
                    control={form.control}
                    name={field.name as never}
                    render={({ field: rhf }: { field: DynamicFieldProps }) => (
                      <select
                        id={field.name}
                        value={String(rhf.value ?? "")}
                        onChange={(e) => rhf.onChange(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={
                      field.type === "number"
                        ? "number"
                        : field.type === "date"
                          ? "date"
                          : field.type === "time"
                            ? "time"
                            : "text"
                    }
                    placeholder={field.placeholder}
                    {...form.register(
                      field.name as never,
                      field.type === "number" ? { valueAsNumber: true } : {},
                    )}
                  />
                )}
                {form.formState.errors[field.name] && (
                  <p className="text-xs text-destructive">
                    {String(form.formState.errors[field.name]?.message ?? "Champ invalide")}
                  </p>
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive et supprimera l'élément de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate({ id: getId(deleteTarget) })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
