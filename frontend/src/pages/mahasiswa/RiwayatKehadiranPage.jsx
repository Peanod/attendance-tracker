import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import AttendanceItem from "../../components/ui/AttendanceItem";
import Loading from "../../components/ui/Loading";
import { useFetch } from "../../hooks/useFetch";
import { getRiwayatKehadiran } from "../../services/kehadiran.service";

const PAGE_SIZE = 5;

export default function RiwayatKehadiranPage() {
  const { data, loading, error } = useFetch(getRiwayatKehadiran, [], {
    fallback: { summary: { present: 0, late: 0, absent: 0 }, items: [] },
  });
  const [page, setPage] = useState(1);

  const items = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer role="mahasiswa" title="Attendance History" subtitle="Riwayat presensi lengkap per mata kuliah.">
      {/* Summary */}
      <section className="grid grid-cols-3 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-center sm:rounded-3xl sm:gap-4 sm:p-4">
        <div>
          <p className="text-2xl font-bold text-black">{data?.summary?.present ?? 0}</p>
          <p className="text-xs text-zinc-500">Hadir</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-400">{data?.summary?.late ?? 0}</p>
          <p className="text-xs text-zinc-500">Terlambat</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-300">{data?.summary?.absent ?? 0}</p>
          <p className="text-xs text-zinc-500">Tidak Hadir</p>
        </div>
      </section>

      {loading ? <Loading /> : null}
      {error ? <Alert tone="warning" message={error.message} /> : null}

      <section className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        {paged.length ? (
          paged.map((item) => (
            <AttendanceItem
              key={item.id_kehadiran}
              title={item.nama_matkul}
              date={new Date(item.tanggal).toLocaleDateString("id-ID")}
              time={item.waktu_mulai?.slice(0, 5)}
              status={item.status_kehadiran}
              subtitle={item.kode_matkul || "Tanpa kode"}
            />
          ))
        ) : (
          !loading && <Alert tone="info" message="Belum ada riwayat kehadiran." />
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 disabled:opacity-30"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-zinc-600">
            {page} / {totalPages}
          </span>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 disabled:opacity-30"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </PageContainer>
  );
}