const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function parseSchedule(value: string): { day: string; time: string } {
  const [dayPart, timePart] = value.split("—").map((s) => s.trim());
  const day = DAYS.includes(dayPart) ? dayPart : DAYS[0];
  const match = timePart?.match(/^(\d{1,2})h(\d{2})$/);
  const time = match ? `${match[1].padStart(2, "0")}:${match[2]}` : "20:00";
  return { day, time };
}

function formatSchedule(day: string, time: string): string {
  const [hh, mm] = time.split(":");
  return `${day} — ${hh}h${mm}`;
}

export function ScheduleField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { day, time } = parseSchedule(value);

  return (
    <div className="flex gap-2">
      <select
        value={day}
        onChange={(e) => onChange(formatSchedule(e.target.value, time))}
        className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {DAYS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <input
        type="time"
        value={time}
        onChange={(e) => onChange(formatSchedule(day, e.target.value || "20:00"))}
        className="flex h-9 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}
