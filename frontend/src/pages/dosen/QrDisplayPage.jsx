import { Clock3 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import QrDisplay from "../../components/qr/QrDisplay";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loading from "../../components/ui/Loading";
import { getSessionAttendance } from "../../services/dosen.service";
import { endSesi, getSesiById } from "../../services/sesi.service";

export default function QrDisplayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(Date.now());
  const autoEndedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [sessionResponse, attendanceResponse] = await Promise.all([
          getSesiById(id),
          getSessionAttendance(id),
        ]);

        if (!mounted) return;

        setSession(sessionResponse.data);
        setAttendance(attendanceResponse.data);
      } catch (error) {
        if (mounted) setMessage(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const interval = setInterval(load, 15000);
    const tick = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
      clearInterval(tick);
    };
  }, [id]);

  const { countdown, isExpired } = useMemo(() => {
    if (!session) {
      return {
        countdown: "00:00",
        isExpired: false,
      };
    }

    // Timer 15 menit sejak sesi dibuat
    const createdAt = session.created_at
      ? new Date(session.created_at)
      : new Date();

    const endTime = new Date(
      createdAt.getTime() + 15 * 60 * 1000
    );

    const diff = Math.max(endTime.getTime() - now, 0);

    const minutes = String(
      Math.floor(diff / 60000)
    ).padStart(2, "0");

    const seconds = String(
      Math.floor((diff % 60000) / 1000)
    ).padStart(2, "0");

    return {
      countdown: `${minutes}:${seconds}`,
      isExpired: diff === 0,
    };
  }, [session, now]);

  useEffect(() => {
    if (
      isExpired &&
      session &&
      session.status === "aktif" &&
      !autoEndedRef.current
    ) {
      autoEndedRef.current = true;

      endSesi(id)
        .then(() => navigate(`/dosen/sesi/${id}/kehadiran`))
        .catch(() => navigate(`/dosen/sesi/${id}/kehadiran`));
    }
  }, [isExpired, session, id, navigate]);

  return (
    <PageContainer
      role="dosen"
      title="Attendance Session"
      subtitle="Tampilkan QR ini kepada mahasiswa untuk presensi."
      actions={
        <Link to={`/dosen/sesi/${id}/kehadiran`}>
          <Button variant="secondary">
            Open Monitoring
          </Button>
        </Link>
      }
    >
      {loading ? (
        <Loading />
      ) : session ? (
        <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="text-center">
            <p className="text-lg font-bold sm:text-xl">
              {session.nama_matkul}
            </p>

            <p className="mt-1.5 text-xs text-zinc-500 sm:mt-2 sm:text-sm">
              {session.kode_matkul || "Tanpa kode"} •{" "}
              {new Date(session.tanggal).toLocaleDateString(
                "id-ID"
              )}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2 text-3xl font-bold sm:mt-6 sm:text-4xl">
              <Clock3
                className={`h-7 w-7 sm:h-8 sm:w-8 ${
                  isExpired
                    ? "text-red-400"
                    : "text-zinc-500"
                }`}
              />

              <span
                className={isExpired ? "text-red-500" : ""}
              >
                {countdown}
              </span>
            </div>

            <p className="mt-1.5 text-xs text-zinc-500 sm:mt-2 sm:text-sm">
              Time remaining • QR aktif selama 15 menit sejak sesi dibuat
            </p>

            <QrDisplay
              value={session.qr_code}
              className="mx-auto mt-8 max-w-sm"
            />

            <div className="mt-4 rounded-xl bg-zinc-100 px-4 py-3">
              <p className="mb-1 text-xs text-zinc-400">
                Token QR (untuk input manual)
              </p>

              <p className="break-all font-mono text-xs text-zinc-600 select-all">
                {session.qr_code}
              </p>
            </div>

            <p className="mt-4 text-xs text-zinc-500 sm:mt-6 sm:text-sm">
              Students scan this QR code to mark attendance.
            </p>
          </Card>

          <div className="space-y-4">
            <Card className="bg-zinc-50 p-4 sm:p-5">
              <p className="text-sm text-zinc-500">
                Students Scanned
              </p>

              <div className="mt-2 flex items-end justify-between">
                <p className="text-4xl font-bold">
                  {attendance?.attendees?.length ?? 0}/
                  {attendance?.summary?.total ?? 0}
                </p>

                <p className="text-lg font-semibold text-zinc-600">
                  {attendance?.summary?.total
                    ? Math.round(
                        ((attendance?.attendees?.length ?? 0) /
                          attendance.summary.total) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </Card>

            <Alert
              tone={message ? "error" : "info"}
              message={
                message ||
                "QR akan otomatis berakhir 15 menit setelah sesi dibuat."
              }
            />

            <Button
              className="w-full"
              onClick={async () => {
                await endSesi(id);
                navigate(`/dosen/sesi/${id}/kehadiran`);
              }}
            >
              End Session
            </Button>
          </div>
        </div>
      ) : (
        <Alert
          tone="error"
          message={message || "Sesi tidak ditemukan."}
        />
      )}
    </PageContainer>
  );
}