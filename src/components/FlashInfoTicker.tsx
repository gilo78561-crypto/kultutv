import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { api, queryKeys } from "@/services/api";

export function FlashInfoTicker() {
  const { data } = useQuery({ queryKey: queryKeys.flashInfo, queryFn: api.getFlashInfo });
  const items = data ?? [];
  if (!items.length) return null;

  return (
    <div className="relative flex items-center gap-3 overflow-hidden border-y border-border bg-surface-2/70 py-2">
      <span className="z-10 flex shrink-0 items-center gap-1.5 bg-live px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
        <AlertCircle className="h-3 w-3" /> Flash
      </span>
      <div className="flex min-w-full shrink-0 animate-ticker gap-10 whitespace-nowrap">
        {[...items, ...items].map((f, i) => (
          <span key={`${f.id}-${i}`} className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{f.time}</span> — {f.text}
          </span>
        ))}
      </div>
    </div>
  );
}
