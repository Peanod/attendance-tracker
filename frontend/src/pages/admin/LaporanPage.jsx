import { ArrowLeft, BarChart3, BookOpen, ChevronRight, Users } from "lucide-react";
import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import StatCard from "../../components/ui/StatCard";
import { getDetailLaporan, getLaporan } from "../../services/admin.service";

export default function LaporanPage() {
  const [laporan, setLaporan] = useState([]);
  const [detail, setDetail] = useState(null);
  const [selectedMatkul, setSelectedMatkul] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLaporan();
  }, []);

  const loadLaporan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getLaporan();
      setLaporan(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (matkul) => {
    setSelectedMatkul(matkul);
    setLoadingDetail(true);
    setDetail(null);
    try {
      const res = await getDetailLaporan(matkul.id_matkul);
      setDetail(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBack = () => {
    setSelectedMatkul(null);
    setDetail(null);
  };

  const getPersentase = (hadir, total) => {
    if (!total) return 0;
    return Math.round((hadir / total) * 100);
  };

  const getBadgeTone = (persen) => {
    if (persen >= 75) return "success";
    if (persen >= 50) return "warning";
    return "error";
  };

  // Tampilan detail per matkul
  if (selectedMatkul) {
    return (
      <PageContainer
        role="admin"
        title="Detail Kehadiran"
        subtitle={`${selectedMatkul.nama_matkul}${selectedMatkul.kode_matkul ? ` — ${selectedMatkul.kode_matkul}` : ""}`}
        actions={
          <Button variant="secondary" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        }
      >
        {error ? <Alert tone="warning" message={error} /> : null}

        {loadingDetail ? (
          <Loading />
        ) : detail ? (
          <div className="space-y-6">
            {/* Info matkul */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Total Sesi" value={detail.sesi.length} description="Sesi yang sudah berlangsung" />
              <StatCard label="Total Mahasiswa" value={detail.mahasiswa.length} description="Mahasiswa terdaftar" />
              <StatCard
                label="Rata-rata Kehadiran"
                value={`${getPersentase(
                  detail.mahasiswa.reduce((acc, m) => acc + m.total_hadir, 0),
                  detail.mahasiswa.length * (detail.sesi.length || 1)
                )}%`}
                description="Dari seluruh sesi"
              />
            </div>

            {/* Tabel mahasiswa */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Rekap Per Mahasiswa</h2>
              </div>
              {detail.mahasiswa.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-left text-zinc-500">
                        <th className="pb-3 pr-4 font-medium">NIM</th>
                        <th className="pb-3 pr-4 font-medium">Nama</th>
                        <th className="pb-3 pr-4 font-medium">Kelas</th>
                        <th className="pb-3 pr-4 font-medium text-center">Hadir</th>
                        <th className="pb-3 font-medium text-center">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {detail.mahasiswa.map((m) => {
                        const persen = getPersentase(m.total_hadir, m.total_sesi);
                        return (
                          <tr key={m.id_mahasiswa}>
                            <td className="py-3 pr-4 font-mono text-zinc-600">{m.nim}</td>
                            <td className="py-3 pr-4 font-medium">{m.nama_mahasiswa}</td>
                            <td className="py-3 pr-4 text-zinc-500">{m.kelas}</td>
                            <td className="py-3 pr-4 text-center text-zinc-600">
                              {m.total_hadir}/{m.total_sesi}
                            </td>
                            <td className="py-3 text-center">
                              <Badge tone={getBadgeTone(persen)}>{persen}%</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Alert tone="info" message="Belum ada mahasiswa yang presensi." />
              )}
            </Card>

            {/* Daftar sesi */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Riwayat Sesi</h2>
              </div>
              {detail.sesi.length ? (
                <div className="space-y-3">
                  {detail.sesi.map((s) => (
                    <div
                      key={s.id_sesi}
                      className="flex flex-col gap-1 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">
                          {new Date(s.tanggal).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {s.waktu_mulai} – {s.waktu_selesai}
                          {s.catatan ? ` • ${s.catatan}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500">{s.jumlah_hadir} hadir</span>
                        <Badge tone={s.status === "aktif" ? "success" : "info"}>{s.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert tone="info" message="Belum ada sesi untuk mata kuliah ini." />
              )}
            </Card>
          </div>
        ) : null}
      </PageContainer>
    );
  }

  // Tampilan daftar laporan semua matkul
  return (
    <PageContainer
      role="admin"
      title="Laporan Kehadiran"
      subtitle="Pantau rekap kehadiran seluruh mata kuliah dan aktivitas dosen."
    >
      {error ? <Alert tone="warning" message={error} /> : null}

      {loading ? (
        <Loading />
      ) : laporan.length ? (
        <div className="space-y-4">
          {laporan.map((item) => (
            <Card
              key={item.id_matkul}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                  <BookOpen className="h-5 w-5 text-zinc-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.nama_matkul}</h3>
                  <p className="text-sm text-zinc-500">
                    {item.kode_matkul || "Tanpa kode"} • Dosen: {item.nama_dosen}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-600">
                    <span>{item.total_sesi} sesi</span>
                    <span>•</span>
                    <span>{item.total_presensi} total presensi</span>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                className="gap-2 self-start sm:self-center"
                onClick={() => loadDetail(item)}
              >
                Lihat Detail
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Alert tone="info" message="Belum ada data laporan. Tambah mata kuliah dan mulai sesi absensi terlebih dahulu." />
      )}
    </PageContainer>
  );
}

