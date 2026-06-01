import { useCallback, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import QrScanner from "../../components/qr/QrScanner";
import Alert from "../../components/ui/Alert";
import Card from "../../components/ui/Card";
import { scanQr } from "../../services/kehadiran.service";

export default function ScanQrPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = useCallback(async (qrCode) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await scanQr({ qr_code: qrCode });
      setResult(response.data);
    } catch (scanError) {
      setError(scanError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PageContainer
      role="mahasiswa"
      title="Scan QR Code"
      subtitle="Posisikan QR dosen di dalam frame atau gunakan input manual."
      contentClassName="max-w-3xl"
    >
      <div className="rounded-2xl bg-black p-3 text-white sm:rounded-[2rem] sm:p-5 md:p-8">
        <QrScanner onScan={handleScan} />
      </div>

      <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
        {loading ? <Alert tone="info" message="Memvalidasi QR code ke backend..." /> : null}
        {error ? <Alert tone="error" message={error} /> : null}
        {result ? (
          <Card>
            <h3 className="text-lg font-semibold">Presensi berhasil</h3>
            <p className="mt-2 text-sm text-zinc-500">
              {result.sesi.nama_matkul} • {new Date(result.sesi.tanggal).toLocaleDateString("id-ID")} •{" "}
              {result.sesi.waktu_mulai?.slice(0, 5)}
            </p>
            <p className="mt-4 text-sm font-medium text-zinc-700">Status: {result.status_kehadiran}</p>
          </Card>
        ) : null}
      </div>
    </PageContainer>
  );
}
