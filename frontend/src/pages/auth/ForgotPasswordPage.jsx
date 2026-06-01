import { KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logoMark from "../../assets/logo-mark.svg";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { forgotPassword } from "../../services/auth.service";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("request"); // "request" | "reset"
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({ token: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await forgotPassword({ email });
      setSuccess("Token reset password telah dikirim ke email kamu.");
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await forgotPassword({ email, token: form.token, new_password: form.password });
      setSuccess("Password berhasil direset. Silakan login.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col justify-between bg-white px-4 py-6 sm:px-8 sm:py-8 md:px-16 md:py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 md:border-none md:p-0 md:shadow-none">
          <img src={logoMark} alt="Attendance logo" className="h-12 w-12 rounded-2xl sm:h-16 sm:w-16 sm:rounded-3xl" />
          <div className="mt-5 text-left sm:mt-7">
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {step === "request" ? "Forgot Password" : "Reset Password"}
            </h1>
            <p className="mt-2 text-sm text-zinc-500 sm:mt-3 sm:text-base">
              {step === "request"
                ? "Masukkan email kamu untuk mendapatkan token reset password."
                : "Masukkan token yang dikirim ke email beserta password baru kamu."}
            </p>
          </div>

          {step === "request" ? (
            <form className="mt-6 space-y-4 sm:mt-8 sm:space-y-5" onSubmit={handleRequest}>
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email kamu"
                required
              />
              <Alert tone="error" message={error} />
              <Alert tone="success" message={success} />
              <Button type="submit" className="w-full" loading={loading}>
                Kirim Token Reset
              </Button>
              <p className="text-center text-sm text-zinc-500">
                Ingat password?{" "}
                <Link to="/login" className="font-semibold text-black">
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            <form className="mt-6 space-y-4 sm:mt-8 sm:space-y-5" onSubmit={handleReset}>
              <Input
                label="Token"
                icon={Mail}
                value={form.token}
                onChange={(e) => setForm((c) => ({ ...c, token: e.target.value }))}
                placeholder="Masukkan token dari email"
                required
              />
              <Input
                label="Password Baru"
                type="password"
                icon={KeyRound}
                value={form.password}
                onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                placeholder="Masukkan password baru"
                required
              />
              <Input
                label="Konfirmasi Password"
                type="password"
                icon={KeyRound}
                value={form.confirm}
                onChange={(e) => setForm((c) => ({ ...c, confirm: e.target.value }))}
                placeholder="Ulangi password baru"
                required
              />
              <Alert tone="error" message={error} />
              <Alert tone="success" message={success} />
              <Button type="submit" className="w-full" loading={loading} disabled={!!success}>
                Reset Password
              </Button>
              {success && (
                <p className="text-center text-sm">
                  <Link to="/login" className="font-semibold text-black">
                    Ke halaman Login →
                  </Link>
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <div className="hidden bg-hero-grid p-10 text-white md:flex md:flex-col md:justify-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Password Reset</p>
          <h2 className="mt-4 text-4xl font-bold leading-tight">
            Reset password dengan token yang dikirim ke email.
          </h2>
          <p className="mt-4 max-w-lg text-zinc-300">
            Token berlaku 15 menit. Jika tidak menerima email, cek folder spam.
          </p>
        </div>
      </div>
    </div>
  );
}