import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import {
  createMatkul,
  deleteMatkul,
  getDosen,
  getMatkul,
  updateMatkul,
} from "../../services/admin.service";

const initialForm = { id_dosen: "", nama_matkul: "", kode_matkul: "", deskripsi: "" };

export default function DataMatkulPage() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [courseResponse, lecturerResponse] = await Promise.all([getMatkul(), getDosen()]);
      setCourses(courseResponse.data);
      setLecturers(lecturerResponse.data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await updateMatkul(editingId, form);
        setMessage("Mata kuliah berhasil diperbarui.");
      } else {
        await createMatkul(form);
        setMessage("Mata kuliah berhasil ditambahkan.");
      }
      setEditingId(null);
      setForm(initialForm);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <PageContainer role="admin" title="Data Mata Kuliah" subtitle="Tetapkan dosen pengampu untuk setiap mata kuliah.">
      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <h2 className="text-lg font-semibold">{editingId ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}</h2>
          </div>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-600">Dosen Pengampu</span>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-400"
                value={form.id_dosen}
                onChange={(event) => setForm({ ...form, id_dosen: event.target.value })}
                required
              >
                <option value="">Pilih dosen</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.id_dosen} value={lecturer.id_dosen}>
                    {lecturer.nama_dosen}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Nama Mata Kuliah" value={form.nama_matkul} onChange={(e) => setForm({ ...form, nama_matkul: e.target.value })} required />
            <Input label="Kode Mata Kuliah" value={form.kode_matkul} onChange={(e) => setForm({ ...form, kode_matkul: e.target.value })} />
            <Input
              label="Deskripsi"
              as="textarea"
              rows={4}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            />
            <Alert tone={message.includes("berhasil") ? "success" : "error"} message={message} />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
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
          {loading ? (
            <Loading />
          ) : courses.length ? (
            courses.map((item) => (
              <Card key={item.id_matkul} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.nama_matkul}</h3>
                  <p className="text-sm text-zinc-500">
                    {item.kode_matkul || "Tanpa kode"} • {item.nama_dosen}
                  </p>
                  {item.deskripsi ? <p className="mt-1 text-sm text-zinc-500">{item.deskripsi}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => {
                      setEditingId(item.id_matkul);
                      setForm({
                        id_dosen: String(item.id_dosen),
                        nama_matkul: item.nama_matkul,
                        kode_matkul: item.kode_matkul || "",
                        deskripsi: item.deskripsi || "",
                      });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="gap-2"
                    onClick={async () => {
                      if (!window.confirm(`Hapus mata kuliah ${item.nama_matkul}?`)) {
                        return;
                      }
                      await deleteMatkul(item.id_matkul);
                      await loadData();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Alert tone="info" message="Belum ada data mata kuliah." />
          )}
        </div>
      </section>
    </PageContainer>
  );
}
