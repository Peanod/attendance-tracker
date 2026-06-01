import { CheckCircle, ChevronLeft, ChevronRight, Clock, Search, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import { deleteKehadiran, getSessionAttendance, markHadir, markTerlambat } from "../../services/dosen.service";

const PAGE_SIZE = 10;

export default function MonitoringKehadiranPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [page, setPage] = useState(1);

  const loadData = () => {
    setLoading(true);
    getSessionAttendance(id)
      .then((response) => setData(response.data))
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const withLoading = async (idMahasiswa, fn) => {
    setActionLoading((prev) => ({ ...prev, [idMahasiswa]: true }));
    try { await fn(); loadData(); }
    catch (error) { setMessage(error.message); }
    finally { setActionLoading((prev) => ({ ...prev, [idMahasiswa]: false })); }
  };

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return (data?.attendees || []).filter(
      (item) =>
        item.nama_mahasiswa.toLowerCase().includes(normalized) ||
        item.nim.toLowerCase().includes(normalized),
    );
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer
      role="dosen"
      title="Attendance Report"
      subtitle={
        data?.session
          ? `${data.session.nama_matkul} • ${data.session.kode_matkul || "Tanpa kode"}${data.session.pertemuan_ke ? ` • Pertemuan ke-${data.session.pertemuan_ke}` : ""}`
          : "Monitoring kehadiran per sesi"
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4 sm:space-y-5">
          <Input
            icon={Search}
            placeholder="Search student..."
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
          />

          {message ? <Alert tone="error" message={message} /> : null}

          <section className="grid grid-cols-2 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:gap-4 sm:rounded-3xl sm:p-4 md:grid-cols-4">
            {[
              { label: "Total", value: data?.summary?.total ?? 0 },
              { label: "Hadir", value: data?.summary?.present ?? 0 },
              { label: "Terlambat", value: data?.summary?.late ?? 0 },
              { label: "Tidak Hadir", value: data?.summary?.absent ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </section>

          {paged.length ? (
            paged.map((item) => {
              const isHadir = item.status_kehadiran === "hadir";
              const isTerlambat = item.status_kehadiran === "terlambat";
              const isTidakHadir = !item.id_kehadiran || item.status_kehadiran === "tidak hadir";
              const isLoading = actionLoading[item.id_mahasiswa];

              return (
                <Card
                  key={item.id_mahasiswa}
                  className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
                >
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">{item.nama_mahasiswa}</h3>
                    <p className="text-xs text-zinc-500 sm:text-sm">{item.nim} • {item.kelas}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.waktu_presensi ? (
                      <p className="text-sm text-zinc-500">
                        {new Date(item.waktu_presensi).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    ) : null}

                    <Badge tone={isTidakHadir ? "absen" : item.status_kehadiran}>
                      {isTidakHadir ? "Tidak Hadir" : isHadir ? "Hadir" : "Terlambat"}
                    </Badge>

                    {isTidakHadir && (
                      <>
                        <Button variant="ghost" className="gap-1.5 px-3 py-1.5 text-xs" loading={isLoading}
                          onClick={() => withLoading(item.id_mahasiswa, () => markHadir(id, item.id_mahasiswa))}>
                          <CheckCircle className="h-3.5 w-3.5" /> Hadir
                        </Button>
                        <Button variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs" loading={isLoading}
                          onClick={() => withLoading(item.id_mahasiswa, () => markTerlambat(id, item.id_mahasiswa))}>
                          <Clock className="h-3.5 w-3.5" /> Terlambat
                        </Button>
                      </>
                    )}

                    {(isHadir || isTerlambat) && (
                      <Button variant="danger" className="gap-1.5 px-3 py-1.5 text-xs" loading={isLoading}
                        onClick={() => withLoading(item.id_mahasiswa, () => deleteKehadiran(id, item.id_kehadiran))}>
                        <XCircle className="h-3.5 w-3.5" /> Batalkan
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <Alert tone="info" message="Belum ada mahasiswa yang matching dengan pencarian ini." />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 disabled:opacity-30"
                onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-zinc-600">{page} / {totalPages}</span>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 disabled:opacity-30"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}