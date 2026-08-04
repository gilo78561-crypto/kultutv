import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, RefreshCw, Trash2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { streams } from "@/db/schema";
import {
  createMuxLiveStream,
  deleteMuxLiveStream,
  getMuxLiveStatus,
  MUX_RTMP_URL,
  resetMuxStreamKey,
} from "@/functions/live";
import { listStreamsAdmin } from "@/functions/streams";
import { queryKeys } from "@/services/api";

type StreamRow = typeof streams.$inferSelect;

function CopyField({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const [revealed, setRevealed] = useState(!secret);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input readOnly value={revealed ? value : "•".repeat(24)} className="font-mono text-xs" />
        {secret && (
          <Button type="button" variant="outline" size="sm" onClick={() => setRevealed((v) => !v)}>
            {revealed ? "Masquer" : "Afficher"}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.success("Copié");
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function LiveStreamDialog({ stream, blocked }: { stream: StreamRow; blocked: boolean }) {
  const queryClient = useQueryClient();
  const isConfigured = Boolean(stream.muxLiveStreamId);

  const status = useQuery({
    queryKey: ["mux", "status", stream.muxLiveStreamId],
    queryFn: () => getMuxLiveStatus({ data: { muxLiveStreamId: stream.muxLiveStreamId! } }),
    enabled: isConfigured,
    refetchInterval: 10_000,
  });

  const invalidateStreams = () =>
    queryClient.invalidateQueries({ queryKey: [...queryKeys.tvStreams, "admin"] });

  const create = useMutation({
    mutationFn: () => createMuxLiveStream({ data: { streamId: stream.id } }),
    onSuccess: () => {
      toast.success("Direct créé — configure OBS avec les informations ci-dessous.");
      invalidateStreams();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reset = useMutation({
    mutationFn: () =>
      resetMuxStreamKey({
        data: { streamId: stream.id, muxLiveStreamId: stream.muxLiveStreamId! },
      }),
    onSuccess: () => {
      toast.success("Clé régénérée — mets à jour OBS avec la nouvelle clé.");
      invalidateStreams();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () =>
      deleteMuxLiveStream({
        data: { streamId: stream.id, muxLiveStreamId: stream.muxLiveStreamId! },
      }),
    onSuccess: () => {
      toast.success("Direct supprimé");
      invalidateStreams();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Direct OBS — {stream.name}</DialogTitle>
      </DialogHeader>

      {!isConfigured ? (
        <div className="space-y-4">
          {blocked ? (
            <p className="text-sm text-muted-foreground">
              Un direct est déjà actif sur un autre stream. Supprime-le d'abord pour en créer un
              nouveau ici — un seul direct peut être configuré à la fois.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Aucun direct configuré pour ce stream. Crée un direct pour obtenir une URL et une
                clé à saisir dans OBS Studio (ou tout logiciel compatible RTMP).
              </p>
              <Button onClick={() => create.mutate()} disabled={create.isPending} className="gap-2">
                {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Créer le direct
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut :</span>
            {status.isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Badge
                className={
                  status.data?.status === "active"
                    ? "bg-live text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }
              >
                {status.data?.status === "active" ? "En direct" : "Hors ligne"}
              </Badge>
            )}
          </div>

          <CopyField label="URL du serveur RTMP" value={MUX_RTMP_URL} />
          <CopyField label="Clé de stream" value={stream.muxStreamKey ?? ""} secret />

          <p className="text-xs text-muted-foreground">
            Dans OBS : Paramètres → Flux → Service personnalisé, colle l'URL serveur et la clé
            ci-dessus, puis lance la diffusion. Le site affichera le direct automatiquement.
          </p>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => reset.mutate()}
              disabled={reset.isPending}
            >
              <RefreshCw className="h-4 w-4" /> Régénérer la clé
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={() => remove.mutate()}
              disabled={remove.isPending}
            >
              <Trash2 className="h-4 w-4" /> Supprimer le direct
            </Button>
          </div>
        </div>
      )}

      <DialogFooter />
    </DialogContent>
  );
}

export function LiveStreamCard() {
  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.tvStreams, "admin"],
    queryFn: () => listStreamsAdmin(),
  });

  const tvStreams = (data ?? []).filter((s) => s.kind === "tv");
  const hasActiveLive = tvStreams.some((s) => Boolean(s.muxLiveStreamId));

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Video className="h-4 w-4 text-primary" /> Direct via OBS
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Diffuse en direct depuis ton PC avec OBS Studio et un flux TV existant.
        </p>
      </div>
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </div>
        ) : tvStreams.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Crée d'abord un stream de type TV ci-dessus.
          </p>
        ) : (
          tvStreams.map((stream) => (
            <div key={stream.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{stream.name}</p>
                <p className="text-xs text-muted-foreground">
                  {stream.muxLiveStreamId ? "Direct configuré" : "Pas encore de direct"}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </DialogTrigger>
                <LiveStreamDialog
                  stream={stream}
                  blocked={hasActiveLive && !stream.muxLiveStreamId}
                />
              </Dialog>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
