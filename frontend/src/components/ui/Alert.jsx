export default function Alert({ tone = "info", message }) {
  if (!message) {
    return null;
  }

  const toneClass = {
    info: "border-zinc-200 bg-white text-zinc-600 shadow-sm",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    warning: "border-zinc-200 bg-white text-zinc-600 shadow-sm",
  };

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass[tone] || toneClass.info}`}>{message}</div>;
}
