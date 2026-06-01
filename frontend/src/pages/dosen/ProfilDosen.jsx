import { BookOpen, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { getDosenDashboard } from "../../services/dosen.service";

export default function ProfilDosen() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { data, loading, error } = useFetch(getDosenDashboard, [], { fallback: { stats: {} } });

  return (
    <PageContainer role="dosen" title="Profil Dosen" subtitle="Ringkasan akun yang dipakai untuk login dan mengelola sesi.">
      {loading ? (
        <Loading />
      ) : (
        <Card className="mx-auto max-w-2xl">
          {error ? <Alert tone="warning" message={error.message} /> : null}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
              {user?.nama?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.nama}</h2>
              <p className="text-sm text-zinc-500">{user?.nip || "NIP tidak tersedia"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="mt-2 text-lg font-semibold">{user?.email || "-"}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <BookOpen className="h-4 w-4" />
                Mata Kuliah Diampu
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.stats?.classes ?? 0} matkul</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <UserRound className="h-4 w-4" />
                Total Sesi
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.stats?.sessions ?? 0} sesi</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <UserRound className="h-4 w-4" />
                Rata-rata Kehadiran
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.stats?.averageRate ?? 0}%</p>
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Card>
      )}
    </PageContainer>
  );
}