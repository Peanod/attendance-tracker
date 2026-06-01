import { CalendarDays, Clock3, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import { useFetch } from "../../hooks/useFetch";
import { getDosenCourses, getDosenSessions } from "../../services/dosen.service";
import { createSesi } from "../../services/sesi.service";

// Generate pilihan jam 07:00 - 21:00 per 30 menit
const TIME_OPTIONS = [];
for (let h = 7; h <= 21; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 21) TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:30`);
}

const selectClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:bg-white sm:rounded-2xl sm:py-3";

export default function BuatSesiPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedMatkul = searchParams.get("matkul");
  const { data: courses, loading } = useFetch(getDosenCourses, [], { fallback: [] });
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getDosenSessions()
      .then((res) => setSessions(res.data?.data ?? res.data ?? []))
      .catch(() => setSessions([]));
  }, []);
  const [form, setForm] = useState({
    id_matkul: selectedMatkul || "",
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    catatan: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedMatkul) {
      setForm((current) => ({ ...current, id_matkul: selectedMatkul }));
    }
  }, [selectedMatkul]);

  // Hitung pertemuan ke berapa jika sesi ini dibuat
  const pertemuanKe = useMemo(() => {
    if (!form.id_matkul) return null;
    const total = (sessions ?? []).filter(
      (s) => String(s.id_matkul) === String(form.id_matkul),
    ).length;
    return total + 1;
  }, [form.id_matkul, sessions]);

  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.id_matkul) === String(form.id_matkul)),
    [form.id_matkul, courses],
  );

  const handleSubmit = async () => {
    if (!form.id_matkul || !form.tanggal || !form.waktu_mulai || !form.waktu_selesai) {
      setMessage("Semua field wajib diisi.");
      return;
    }
    if (form.waktu_mulai >= form.waktu_selesai) {
      setMessage("Waktu selesai harus lebih besar dari waktu mulai.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const response = await createSesi(form);
      navigate(`/dosen/sesi/${response.data.id_sesi}/qr`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const endOptions = form.waktu_mulai
    ? TIME_OPTIONS.filter((t) => t > form.waktu_mulai)
    : TIME_OPTIONS;

  return (
    <PageContainer
      role="dosen"
      title="Buat Sesi Absensi"
      subtitle="Tentukan jadwal sesi dan hasilkan QR code unik."
    >
      <Card className="mx-auto max-w-3xl">
        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-5">
            {/* Mata Kuliah */}
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-600">Mata Kuliah</span>
              <select
                className={selectClass}
                value={form.id_matkul}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    id_matkul: e.target.value,
                    tanggal: "",
                    waktu_mulai: "",
                    waktu_selesai: "",
                  }))
                }
                required
              >
                <option value="">Pilih mata kuliah</option>
                {courses.map((course) => (
                  <option key={course.id_matkul} value={course.id_matkul}>
                    {course.nama_matkul}
                  </option>
                ))}
              </select>
            </label>

            {/* Info pertemuan ke */}
            {selectedCourse && pertemuanKe && (
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                  {pertemuanKe}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Pertemuan ke-{pertemuanKe}
                  </p>
                  <p className="text-xs text-zinc-500">{selectedCourse.nama_matkul}</p>
                </div>
              </div>
            )}

            {/* Tanggal */}
            <Input
              label="Tanggal"
              type="date"
              icon={CalendarDays}
              value={form.tanggal}
              onChange={(e) => setForm((c) => ({ ...c, tanggal: e.target.value }))}
              required
            />

            {/* Waktu */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-600">Waktu Mulai</span>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <select
                    className={`${selectClass} pl-12`}
                    value={form.waktu_mulai}
                    onChange={(e) =>
                      setForm((c) => ({ ...c, waktu_mulai: e.target.value, waktu_selesai: "" }))
                    }
                    required
                  >
                    <option value="">Pilih jam mulai</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-600">Waktu Selesai</span>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <select
                    className={`${selectClass} pl-12`}
                    value={form.waktu_selesai}
                    onChange={(e) => setForm((c) => ({ ...c, waktu_selesai: e.target.value }))}
                    required
                    disabled={!form.waktu_mulai}
                  >
                    <option value="">Pilih jam selesai</option>
                    {endOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            {/* Catatan */}
            <Input
              label="Catatan"
              as="textarea"
              rows={4}
              value={form.catatan}
              onChange={(e) => setForm((c) => ({ ...c, catatan: e.target.value }))}
              placeholder="Catatan tambahan untuk sesi ini"
            />

            <Alert
              tone={message ? "error" : "info"}
              message={
                message ||
                "Sesi akan dibuat dalam status aktif dan langsung menghasilkan QR code."
              }
            />

            <Button className="w-full gap-2" loading={saving} onClick={handleSubmit}>
              <QrCode className="h-4 w-4" />
              Generate QR Session
            </Button>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}