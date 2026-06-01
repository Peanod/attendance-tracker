export default function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 ${className}`}>{children}</div>;
}
