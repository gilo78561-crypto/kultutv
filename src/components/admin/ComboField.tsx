import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CUSTOM_VALUE = "__custom__";

export function ComboField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [customMode, setCustomMode] = useState(Boolean(value) && !options.includes(value));

  if (customMode) {
    return (
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        {options.length > 0 && (
          <Button type="button" variant="outline" onClick={() => setCustomMode(false)}>
            Liste
          </Button>
        )}
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === CUSTOM_VALUE) {
          setCustomMode(true);
          onChange("");
        } else {
          onChange(e.target.value);
        }
      }}
      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="" disabled>
        Choisir…
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
      <option value={CUSTOM_VALUE}>+ Nouvelle catégorie…</option>
    </select>
  );
}
