import { KeyRound, Mail, School, UserSquare2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logoMark from "../../assets/logo-mark.svg";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { signupRequest } from "../../services/auth.service";

export default function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [form, setForm] = useState({
    nim: "",
    nama_mahasiswa: "",
    kelas: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (isAuthenticated) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "dosen") {
      return <Navigate to="/dosen" replace />;
    }
    return <Navigate to="/mahasiswa" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await signupRequest(form);
      setSuccess("Akun berhasil dibuat. Silakan login.");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col justify-between bg-white px-6 py-10 sm:px-10 md:px-16">
        <div className="mx-auto w-full max-w-md">
          <img src={logoMark} alt="Attendance logo" className="h-16 w-16 rounded-3xl" />
          <div className="mt-8 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-black">Create Account</h1>
            <p className="mt-3 text-base text-zinc-500">Sign up as student to start attendance tracking.</p>
          </div>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="NIM"
              icon={School}
              value={form.nim}
              onChange={(event) => setForm((current) => ({ ...current, nim: event.target.value }))}
              placeholder="Masukkan NIM"
              required
            />
            <Input
              label="Nama"
              icon={UserSquare2}
              value={form.nama_mahasiswa}
              onChange={(event) => setForm((current) => ({ ...current, nama_mahasiswa: event.target.value }))}
              placeholder="Masukkan nama lengkap"
              required
            />
            <Input
              label="Kelas"
              value={form.kelas}
              onChange={(event) => setForm((current) => ({ ...current, kelas: event.target.value }))}
              placeholder="Contoh: IF-2A"
              required
            />
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Masukkan email"
              required
            />
            <Input
              label="Password"
              type="password"
              icon={KeyRound}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Masukkan password"
              required
            />

            <Alert tone="error" message={error} />
            <Alert tone="success" message={success} />

            <Button type="submit" className="w-full" loading={loading}>
              Sign Up
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-black">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden bg-hero-grid p-10 text-white md:flex md:flex-col md:justify-between">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Student Signup</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight">Akun mahasiswa dibuat lewat signup, lalu login biasa.</h2>
          <p className="mt-4 max-w-lg text-zinc-300">
            Login tidak perlu memilih role. Sistem akan membaca role otomatis dari data user di backend.
          </p>
        </div>
      </div>
    </div>
  );
}
