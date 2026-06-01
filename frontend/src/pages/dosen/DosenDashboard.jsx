import { QrCode } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import CourseCard from "../../components/ui/CourseCard";
import Loading from "../../components/ui/Loading";
import StatCard from "../../components/ui/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { getDosenCourses, getDosenDashboard, getDosenSessions } from "../../services/dosen.service";

export default function DosenDashboard() {
  const navigate = useNavigate();
  const dashboard = useFetch(getDosenDashboard, [], { fallback: { stats: {} } });
  const courses = useFetch(getDosenCourses, [], { fallback: [] });
  const sessions = useFetch(getDosenSessions, [], { fallback: [] });

  const latestSessionByCourse = useMemo(() => {
    const map = new Map();
    sessions.data?.forEach((item) => {
      if (!map.has(item.id_matkul)) {
        map.set(item.id_matkul, item);
      }
    });
    return map;
  }, [sessions.data]);

  const activeSessions = useMemo(() => {
    return sessions.data?.filter((s) => s.status === "aktif") ?? [];
  }, [sessions.data]);

  return (
    <PageContainer
      role="dosen"
      title="Dosen Dashboard"
      subtitle="Kelola sesi absensi, tampilkan QR code, dan monitor mahasiswa secara realtime."
    >
      <section className="dashboard-grid">
        <StatCard label="Classes" value={dashboard.data?.stats?.classes ?? 0} description="Mata kuliah yang diampu" />
        <StatCard label="Sessions" value={dashboard.data?.stats?.sessions ?? 0} description="Total sesi yang dibuat" />
        <StatCard label="Active" value={dashboard.data?.stats?.active ?? 0} description="Sesi yang sedang aktif" />
        <StatCard label="Avg Rate" value={`${dashboard.data?.stats?.averageRate ?? 0}%`} description="Rata-rata kehadiran" inverse />
      </section>

      {activeSessions.length > 0 && (
        <section className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          <h2 className="text-lg font-bold sm:text-xl">Sesi Aktif</h2>
          {activeSessions.map((s) => (
            <Card key={s.id_sesi} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{s.nama_matkul}</h3>
                  <Badge tone="success">aktif</Badge>
                </div>
                <p className="text-sm text-zinc-500">
                  {s.kode_matkul || "Tanpa kode"} • {new Date(s.tanggal).toLocaleDateString("id-ID")} • {s.waktu_mulai} – {s.waktu_selesai}
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="gap-2" onClick={() => navigate(`/dosen/sesi/${s.id_sesi}/qr`)}>
                  <QrCode className="h-4 w-4" />
                  Buka QR
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/dosen/sesi/${s.id_sesi}/kehadiran`)}>
                  Monitoring
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}

      {courses.error ? <Alert tone="warning" message={courses.error.message} /> : null}

      <section className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold sm:text-xl">My Courses</h2>
        </div>
        {courses.loading ? (
          <Loading />
        ) : courses.data?.length ? (
          courses.data.map((course) => {
            const latestSession = latestSessionByCourse.get(course.id_matkul);
            return (
              <CourseCard
                key={course.id_matkul}
                title={course.nama_matkul}
                subtitle={course.kode_matkul || "Tanpa kode mata kuliah"}
                stats={{ value: course.total_mahasiswa, label: "students" }}
                onPrimaryClick={() => navigate(`/dosen/sesi/buat?matkul=${course.id_matkul}`)}
                onSecondaryClick={() =>
                  latestSession
                    ? navigate(`/dosen/matkul/${course.id_matkul}/rekap`)
                    : navigate(`/dosen/sesi/buat?matkul=${course.id_matkul}`)
                }
                secondaryLabel={latestSession ? "View Report" : "Create Session"}
              />
            );
          })
        ) : (
          <Alert tone="info" message="Belum ada mata kuliah yang terhubung ke akun dosen ini." />
        )}
      </section>
    </PageContainer>
  );
}