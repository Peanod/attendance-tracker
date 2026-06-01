import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logoMark from "../../assets/logo-mark.svg";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "dosen") return <Navigate to="/dosen" replace />;
    return <Navigate to="/mahasiswa" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(form);
      const from = location.state?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else if (result.role === "admin") navigate("/admin", { replace: true });
      else if (result.role === "dosen") navigate("/dosen", { replace: true });
      else navigate("/mahasiswa", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col justify-between bg-white px-4 py-6 sm:px-8 sm:py-8 md:px-16 md:py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 md:border-none md:p-0 md:shadow-none">
          <img src={logoMark} alt="Attendance logo" className="h-12 w-12 rounded-2xl sm:h-16 sm:w-16 sm:rounded-3xl" />
          <div className="mt-5 text-left sm:mt-7 md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Welcome Back</h1>
            <p className="mt-2 text-sm text-zinc-500 sm:mt-3 sm:text-base">
              Sign in to continue to Student Attendance Tracker.
            </p>
          </div>

          <form className="mt-6 space-y-4 sm:mt-8 sm:space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Enter your email"
              required
            />
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                icon={KeyRound}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                required
              />
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-zinc-500 hover:text-black">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Alert tone="error" message={error} />

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold text-black">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
        <div className="mx-auto mt-5 flex w-full max-w-md items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 sm:mt-8 sm:gap-3 sm:rounded-3xl sm:p-4 sm:text-sm">
          <ShieldCheck className="h-5 w-5 text-zinc-950" />
          Authentication menggunakan JWT + bcrypt dengan validasi role dari backend.
        </div>
      </div>

      <div className="hidden bg-hero-grid p-10 text-white md:flex md:flex-col md:justify-between">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Mobile-first Design</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight">
            QR attendance flow yang nyaman di browser mobile dan tetap rapi di desktop.
          </h2>
          <p className="mt-4 max-w-lg text-zinc-300">
            Desain diimplementasikan ulang dari Figma export menjadi komponen React + Tailwind yang clean, reusable,
            dan production-ready.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] bg-white/8 p-6">
            <p className="text-sm text-zinc-400">Student</p>
            <p className="mt-3 text-3xl font-bold">Scan QR</p>
            <p className="mt-2 text-sm text-zinc-300">Presensi cepat, riwayat rapi, dan profil pribadi.</p>
          </div>
          <div className="rounded-[2rem] bg-white/8 p-6">
            <p className="text-sm text-zinc-400">Lecturer</p>
            <p className="mt-3 text-3xl font-bold">Live Session</p>
            <p className="mt-2 text-sm text-zinc-300">Buat sesi, tampilkan QR, dan monitor kehadiran realtime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}