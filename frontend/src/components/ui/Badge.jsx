const styles = {
  hadir: "bg-black text-white",
  present: "bg-black text-white",
  terlambat: "bg-zinc-400 text-white",
  late: "bg-zinc-400 text-white",
  absen: "bg-zinc-200 text-zinc-700",
  absent: "bg-zinc-200 text-zinc-700",
  aktif: "bg-emerald-100 text-emerald-700",
  selesai: "bg-zinc-100 text-zinc-700",
};

export default function Badge({ children, tone = "present", className = "" }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[tone] || styles.present} ${className}`}>
      {children}
    </span>
  );
}
