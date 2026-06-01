import { ArrowRight, BarChart3, QrCode } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function CourseCard({
  title,
  subtitle,
  stats,
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel = "Generate QR",
  secondaryLabel = "View Report",
}) {
  return (
    <Card className="space-y-3 bg-zinc-50 sm:space-y-4">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{subtitle}</p>
        </div>
        {stats ? (
          <div className="text-right">
            <p className="text-xl font-bold">{stats.value}</p>
            <p className="text-xs text-zinc-500">{stats.label}</p>
          </div>
        ) : null}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button onClick={onPrimaryClick} className="gap-2">
          <QrCode className="h-4 w-4" />
          {primaryLabel}
        </Button>
        <Button variant="secondary" onClick={onSecondaryClick} className="gap-2">
          {secondaryLabel === "View Report" ? <BarChart3 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          {secondaryLabel}
        </Button>
      </div>
    </Card>
  );
}
