export default function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  loading = false,
  disabled = false,
  ...props
}) {
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800",
    secondary: "border border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-100",
    ghost: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl sm:py-3 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
