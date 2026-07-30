import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

export function SearchBar({
  defaultValue = "",
  autoFocus = false,
  onDone,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate({ to: "/recherche", search: { q: value.trim() } });
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="relative w-full" role="search">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher une émission, un article…"
        aria-label="Recherche globale"
        className="glass-panel h-10 w-full rounded-full pl-9 pr-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
    </form>
  );
}
