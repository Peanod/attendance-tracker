import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Input({
  label,
  icon: Icon,
  error,
  className = "",
  inputClassName = "",
  as = "input",
  type,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;
  const Component = as;

  return (
    <label className={`block space-y-2 ${className}`}>
      {label ? <span className="text-sm font-medium text-zinc-600">{label}</span> : null}
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        ) : null}
        <Component
          type={resolvedType}
          className={`w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white sm:rounded-2xl sm:py-3 ${Icon ? "pl-12" : ""} ${isPassword ? "pr-11" : ""} ${inputClassName}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}