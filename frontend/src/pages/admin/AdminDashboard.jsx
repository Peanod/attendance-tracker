import { BarChart3, BookOpen, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import StatCard from "../../components/ui/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { getAdminDashboard } from "../../services/admin.service";

export default function AdminDashboard() {
  const { data, loading, error } = useFetch(getAdminDashboard, []);

  return (
    <PageContainer
      role="admin"
      title="Admin Dashboard"
      subtitle="Kelola data mahasiswa, dosen, dan mata kuliah dari satu dashboard yang rapi."
      actions={
        <>
          <Link to="/admin/mahasiswa">
            <Button>Kelola Mahasiswa</Button>
          </Link>
          <Link to="/admin/matkul">
            <Button variant="secondary">Kelola Mata Kuliah</Button>
          </Link>
        </>
      }
    >
      {error ? <Alert tone="warning" message={`${error.message}. Menampilkan dashboard tanpa data realtime.`} /> : null}

      {loading ? (
        <Loading />
      ) : (
        <section className="dashboard-grid">
          <StatCard label="Mahasiswa" value={data?.mahasiswa ?? 0} description="Total mahasiswa terdaftar" />
          <StatCard label="Dosen" value={data?.dosen ?? 0} description="Total dosen aktif" />
          <StatCard label="Mata Kuliah" value={data?.mataKuliah ?? 0} description="Course yang tersedia" />
          <StatCard label="Sesi Aktif" value={data?.sesiAktif ?? 0} description="Absensi yang sedang berjalan" inverse />
        </section>
      )}

      <section className="mt-6 grid gap-4 lg:grid-cols-4">
        <Card className="bg-zinc-50">
          <Users className="h-8 w-8 text-black" />
          <h3 className="mt-4 text-lg font-semibold">Data Mahasiswa</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Tambah, ubah, dan hapus akun mahasiswa beserta NIM, kelas, dan email.
          </p>
          <Link to="/admin/mahasiswa" className="mt-4 inline-block text-sm font-semibold text-black">
            Buka halaman mahasiswa
          </Link>
        </Card>
        <Card className="bg-zinc-50">
          <GraduationCap className="h-8 w-8 text-black" />
          <h3 className="mt-4 text-lg font-semibold">Data Dosen</h3>
          <p className="mt-2 text-sm text-zinc-500">Kelola akun dosen dan identitas NIP untuk kebutuhan login.</p>
          <Link to="/admin/dosen" className="mt-4 inline-block text-sm font-semibold text-black">
            Buka halaman dosen
          </Link>
        </Card>
        <Card className="bg-zinc-50">
          <BookOpen className="h-8 w-8 text-black" />
          <h3 className="mt-4 text-lg font-semibold">Data Mata Kuliah</h3>
          <p className="mt-2 text-sm text-zinc-500">Hubungkan mata kuliah ke dosen pengampu dan kode mata kuliah.</p>
          <Link to="/admin/matkul" className="mt-4 inline-block text-sm font-semibold text-black">
            Buka halaman mata kuliah
          </Link>
        </Card>
        <Card className="bg-zinc-50">
          <BarChart3 className="h-8 w-8 text-black" />
          <h3 className="mt-4 text-lg font-semibold">Laporan Kehadiran</h3>
          <p className="mt-2 text-sm text-zinc-500">Pantau rekap kehadiran per mata kuliah dan statistik per mahasiswa.</p>
          <Link to="/admin/laporan" className="mt-4 inline-block text-sm font-semibold text-black">
            Buka laporan
          </Link>
        </Card>
      </section>
    </PageContainer>
  );
}

