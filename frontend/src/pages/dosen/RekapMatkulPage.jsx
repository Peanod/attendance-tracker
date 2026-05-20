import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import { getDosenSessions, getSessionAttendance } from "../../services/dosen.service";

function AttendanceDetail({ sesi }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessionAttendance(sesi.id_sesi)
      .then((res) => setData(res.data?.data ?? res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [sesi.id_sesi]);

  if (loading) return <p className="py-3 text-center text-sm text-zinc-400">Memuat data...</p>;
  if (!data) return <p className="py-3 text-center text-sm text-zinc-400">Gagal memuat data.</p>;

  const { attendees = [], summary = {} } = data;

  return (
    <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-zinc-50 p-3 text-center">
        <div>
          <p className="text-xl font-bold">{summary.present ?? 0}</p>
          <p className="text-xs text-zinc-500">Hadir</p>
        </div>
        <div>
          <p className="text-xl font-bold">{summary.late ?? 0}</p>
          <p className="text-xs text-zinc-500">Terlambat</p>
        </div>
        <div>
          <p className="text-xl font-bold">{summary.absent ?? 0}</p>
          <p className="text-xs text-zinc-500">Tidak Hadir</p>
        </div>
      </div>

      {/* Student list */}
      <div className="space-y-2">
        {attendees.map((item) => (
          <div
            key={item.id_mahasiswa}
            className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{item.nama_mahasiswa}</p>
              <p className="text-xs text-zinc-400">
                {item.nim} • {item.kelas}
              </p>
            </div>
            <Badge tone={item.status_kehadiran}>{item.status_kehadiran}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function PertemuanCard({ sesi, index }) {
  const [open, setOpen] = useState(false);

  const tanggal = new Date(sesi.tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden p-0">
      <button
        className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-zinc-50 sm:p-5"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Nomor pertemuan */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
          {index}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold">Pertemuan {index}</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {tanggal} • {sesi.waktu_mulai} – {sesi.waktu_selesai}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge tone={sesi.status}>{sesi.status}</Badge>
          {open ? (
            <ChevronUp className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <AttendanceDetail sesi={sesi} />
        </div>
      )}
    </Card>
  );
}

export default function RekapMatkulPage() {
  const { idMatkul } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matkulNama, setMatkulNama] = useState("");

  useEffect(() => {
    getDosenSessions()
      .then((res) => {
        const all = res.data?.data ?? res.data ?? [];
        const filtered = all
          .filter((s) => String(s.id_matkul) === String(idMatkul))
          .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal) || a.id_sesi - b.id_sesi);
        setSessions(filtered);
        if (filtered.length > 0) setMatkulNama(filtered[0].nama_matkul);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [idMatkul]);

  return (
    <PageContainer
      role="dosen"
      title={matkulNama || "Rekap Kehadiran"}
      subtitle={`${sessions.length} pertemuan`}
    >
      {loading ? (
        <Loading />
      ) : sessions.length === 0 ? (
        <Alert tone="info" message="Belum ada sesi untuk mata kuliah ini." />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Users className="h-4 w-4" />
            <span>Klik pertemuan untuk lihat detail kehadiran</span>
          </div>
          {sessions.map((sesi, i) => (
            <PertemuanCard key={sesi.id_sesi} sesi={sesi} index={i + 1} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}