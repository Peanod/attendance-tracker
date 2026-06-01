import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import { useFetch } from "../../hooks/useFetch";
import { createDosen, deleteDosen, getDosen, updateDosen } from "../../services/admin.service";

const initialForm = { nip: "", nama_dosen: "", email: "", password: "" };

export default function DataDosenPage() {
  const { data, loading, error, execute } = useFetch(getDosen, [], { fallback: [] });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await updateDosen(editingId, form);
        setMessage("Data dosen berhasil diperbarui.");
      } else {
        await createDosen(form);
        setMessage("Dosen baru berhasil ditambahkan.");
      }
      setEditingId(null);
      setForm(initialForm);
      await execute();
    } catch (submitError) {
      setMessage(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer role="admin" title="Data Dosen" subtitle="Kelola akun dosen yang dapat membuat sesi absensi.">
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <h2 className="text-lg font-semibold">{editingId ? "Edit Dosen" : "Tambah Dosen"}</h2>
          </div>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <Input label="NIP" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} required />
            <Input label="Nama Dosen" value={form.nama_dosen} onChange={(e) => setForm({ ...form, nama_dosen: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input
              label={editingId ? "Password Baru (opsional)" : "Password"}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editingId}
            />
            <Alert tone={message.includes("berhasil") ? "success" : "error"} message={message} />
            <div className="flex gap-3">
              <Button type="submit" loading={saving} className="flex-1">
                {editingId ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Batal
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {error ? <Alert tone="warning" message={error.message} /> : null}
          {loading ? (
            <Loading />
          ) : data?.length ? (
            data.map((item) => (
              <Card key={item.id_dosen} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.nama_dosen}</h3>
                  <p className="text-sm text-zinc-500">{item.nip}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => {
                      setEditingId(item.id_dosen);
                      setForm({ ...item, password: "" });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="gap-2"
                    onClick={async () => {
                      if (!window.confirm(`Hapus dosen ${item.nama_dosen}?`)) {
                        return;
                      }
                      await deleteDosen(item.id_dosen);
                      await execute();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Alert tone="info" message="Belum ada data dosen." />
          )}
        </div>
      </section>
    </PageContainer>
  );
}
