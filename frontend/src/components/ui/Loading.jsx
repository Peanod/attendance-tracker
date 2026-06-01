export default function Loading({ label = "Memuat data..." }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black" />
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
    </div>
  );
}
