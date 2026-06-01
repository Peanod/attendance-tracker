import { BookOpen, Mail, Pencil, Save, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";
import { getDosenDashboard } from "../../services/dosen.service";

export default function ProfilDosen() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { data, loading, error, execute } = useFetch(getDosenDashboard, [], { fallback: { stats: {} } });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const startEdit = () => {
    setForm({
      nama_dosen: user?.nama || "",
      nip: user?.nip || "",
      email: user?.email || "",
      password: "",
    });
    setMessage("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await api.put("/dosen/profile", payload);
      await execute();
      setMessage("Profil berhasil diperbarui.");
      setEditing(false);
    } catch (err) {
      setMessage(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer role="dosen" title="Profil Dosen" subtitle="Ringkasan akun yang dipakai untuk login dan mengelola sesi.">
      {loading ? (
        <Loading />
      ) : (
        <Card className="mx-auto max-w-2xl">
          {error ? <Alert tone="warning" message={error.message} /> : null}
          {message ? <Alert tone={message.includes("berhasil") ? "success" : "error"} message={message} /> : null}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                {user?.nama?.charAt(0)?.toUpperCase() || "D"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.nama}</h2>
                <p className="text-sm text-zinc-500">{user?.nip || "NIP tidak tersedia"}</p>
              </div>
            </div>
            {!editing && (
              <Button variant="secondary" className="gap-2" onClick={startEdit}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <div className="mt-6 space-y-4">
              <Input
                label="Nama Dosen"
                value={form.nama_dosen}
                onChange={(e) => setForm({ ...form, nama_dosen: e.target.value })}
                required
              />
              <Input
                label="NIP"
                value={form.nip}
                onChange={(e) => setForm({ ...form, nip: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Password Baru (opsional)"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <div className="flex gap-3">
                <Button className="flex-1 gap-2" loading={saving} onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Simpan
                </Button>
                <Button variant="secondary" className="gap-2" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="mt-2 text-lg font-semibold">{user?.email || "-"}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <BookOpen className="h-4 w-4" />
                  Mata Kuliah Diampu
                </div>
                <p className="mt-2 text-lg font-semibold">{data?.stats?.classes ?? 0} matkul</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <UserRound className="h-4 w-4" />
                  Total Sesi
                </div>
                <p className="mt-2 text-lg font-semibold">{data?.stats?.sessions ?? 0} sesi</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <UserRound className="h-4 w-4" />
                  Rata-rata Kehadiran
                </div>
                <p className="mt-2 text-lg font-semibold">{data?.stats?.averageRate ?? 0}%</p>
              </div>
            </div>
          )}

          {!editing && (
            <Button
              className="mt-6 w-full"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          )}
        </Card>
      )}
    </PageContainer>
  );
}
