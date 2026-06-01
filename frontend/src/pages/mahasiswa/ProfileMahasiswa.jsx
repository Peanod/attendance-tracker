import { Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { getMahasiswaProfile } from "../../services/mahasiswa.service";

export default function ProfileMahasiswa() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data, loading, error } = useFetch(getMahasiswaProfile, [], { fallback: null });

  return (
    <PageContainer role="mahasiswa" title="Profile Mahasiswa" subtitle="Ringkasan akun yang dipakai untuk login dan presensi.">
      {loading ? (
        <Loading />
      ) : (
        <Card className="mx-auto max-w-2xl">
          {error ? <Alert tone="warning" message={error.message} /> : null}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
              {data?.nama_mahasiswa?.charAt(0)?.toUpperCase() || "M"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{data?.nama_mahasiswa}</h2>
              <p className="text-sm text-zinc-500">{data?.nim}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <UserRound className="h-4 w-4" />
                Kelas
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.kelas || "-"}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="mt-2 text-lg font-semibold">{data?.email || "-"}</p>
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
