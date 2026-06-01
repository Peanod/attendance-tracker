import { BookOpen, GraduationCap, Mail, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { getAdminDashboard } from "../../services/admin.service";

export default function ProfilAdmin() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { data, loading, error } = useFetch(getAdminDashboard, [], { fallback: null });

  return (
    <PageContainer role="admin" title="Profil Admin" subtitle="Ringkasan akun administrator sistem.">
      {loading ? (
        <Loading />
      ) : (
        <Card className="mx-auto max-w-2xl">
          {error ? <Alert tone="warning" message={error.message} /> : null}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
              {user?.nama?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.nama}</h2>
              <p className="text-sm text-zinc-500">Administrator</p>
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
                <Users className="h-4 w-4" />
                Total Mahasiswa
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.mahasiswa ?? 0} orang</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <GraduationCap className="h-4 w-4" />
                Total Dosen
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.dosen ?? 0} orang</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <BookOpen className="h-4 w-4" />
                Total Mata Kuliah
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.mataKuliah ?? 0} matkul</p>
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