import { CalendarDays, Clock3 } from "lucide-react";
import Badge from "./Badge";
import Card from "./Card";

// Label tampilan yang bersih
const labelMap = {
  hadir: "Hadir",
  terlambat: "Terlambat",
  absen: "Tidak Hadir",
  // legacy aliases
  present: "Hadir",
  late: "Terlambat",
  absent: "Tidak Hadir",
};

// Badge tone mapping ke style yang ada di Badge.jsx
const toneMap = {
  hadir: "hadir",
  terlambat: "terlambat",
  absen: "absen",
  present: "hadir",
  late: "terlambat",
  absent: "absen",
};

export default function AttendanceItem({ title, date, time, status, compact = false, subtitle }) {
  const tone = toneMap[status] ?? "absen";
  const label = labelMap[status] ?? status;

  return (
    <Card className={compact ? "rounded-xl p-3 sm:rounded-2xl sm:p-4" : "p-3 sm:p-4"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950 sm:text-base">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{subtitle}</p> : null}
          <div className="mt-2 flex flex-wrap gap-2.5 text-[11px] text-zinc-500 sm:gap-3 sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {time}
            </span>
          </div>
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>
    </Card>
  );
}