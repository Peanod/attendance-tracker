import Card from "./Card";

export default function StatCard({ label, value, description, inverse = false }) {
  return (
    <Card className={inverse ? "border-black bg-black text-white" : "bg-zinc-50"}>
      <p className={`text-xs sm:text-sm ${inverse ? "text-zinc-300" : "text-zinc-500"}`}>{label}</p>
      <p className="mt-1.5 text-2xl font-bold sm:mt-2 sm:text-3xl">{value}</p>
      {description ? <p className={`mt-1 text-[11px] sm:text-xs ${inverse ? "text-zinc-400" : "text-zinc-500"}`}>{description}</p> : null}
    </Card>
  );
}
