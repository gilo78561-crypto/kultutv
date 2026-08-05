import { Input } from "@/components/ui/input";

export function UrlField({
  value,
  onChange,
  accept,
  placeholder,
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
}) {
  const isImage = accept?.startsWith("image/");

  return (
    <div className="space-y-2">
      <Input
        value={value}
        placeholder={placeholder ?? "https://..."}
        onChange={(e) => onChange(e.target.value)}
      />
      {isImage && value && (
        <img
          src={value}
          alt=""
          className="h-20 w-20 rounded-lg border border-border object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </div>
  );
}
