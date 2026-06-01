import { Mail, Pencil, Save, UserRound, X } from "lucide-react";
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
import { getMahasiswaProfile } from "../../services/mahasiswa.service";

export default function ProfileMahasiswa() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data, loading, error, execute } = useFetch(getMahasiswaProfile, [], { fallback: null });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const startEdit = () => {
    setForm({
      nama_mahasiswa: data?.nama_mahasiswa || "",
      kelas: data?.kelas || "",
      email: data?.email || "",
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
      await api.put("/mahasiswa/profile", payload);
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
    <PageContainer role="mahasiswa" title="Profile Mahasiswa" subtitle="Ringkasan akun yang dipakai untuk login dan presensi.">
      {loading ? (
        <Loading />
      ) : (
        <Card className="mx-auto max-w-2xl">
          {error ? <Alert tone="warning" message={error.message} /> : null}
          {message ? <Alert tone={message.includes("berhasil") ? "success" : "error"} message={message} /> : null}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
                {data?.nama_mahasiswa?.charAt(0)?.toUpperCase() || "M"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{data?.nama_mahasiswa}</h2>
                <p className="text-sm text-zinc-500">{data?.nim}</p>
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
                label="Nama Mahasiswa"
                value={form.nama_mahasiswa}
                onChange={(e) => setForm({ ...form, nama_mahasiswa: e.target.value })}
                required
              />
              <Input
                label="Kelas"
                value={form.kelas}
                onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                required
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
                  <UserRound className="h-4 w-4" />
                  Kelas
                </div>
                <p className="mt-2 text-lg font-semibold">{data?.kelas || "-"}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="mt-2 text-lg font-semibold">{data?.email || "-"}</p>
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
