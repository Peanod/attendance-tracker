import { useCallback, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import QrScanner from "../../components/qr/QrScanner";
import { scanQr } from "../../services/kehadiran.service";

export default function ScanQrPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);

  const handleScan = useCallback(async (qrCode) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await scanQr({ qr_code: qrCode });
      setResult(response.data);
    } catch (scanError) {
      setError(scanError.message || "Gagal melakukan presensi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetScanner = () => {
    setResult(null);
    setError("");
    setScannerKey((prev) => prev + 1);
  };

  return (
    <PageContainer
      role="mahasiswa"
      title="Scan QR Code"
      subtitle="Posisikan QR dosen di dalam frame atau gunakan input manual."
      contentClassName="max-w-3xl"
    >
      {!result && !error ? (
        <div className="rounded-2xl bg-black p-3 text-white sm:rounded-[2rem] sm:p-5 md:p-8">
          <QrScanner key={scannerKey} onScan={handleScan} />
        </div>
      ) : null}

      {/* Loading Overlay */}
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="rounded-3xl bg-white px-8 py-6 shadow-2xl text-center border border-zinc-100 max-w-xs w-full animate-scale-up">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-950 border-r-transparent align-[-0.125em]" />
            <p className="mt-4 text-sm font-semibold text-zinc-700">Memvalidasi QR code...</p>
          </div>
        </div>
      ) : null}

      {/* Success Modal */}
      {result ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-center align-middle shadow-2xl transition-all animate-scale-up border border-zinc-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <h3 className="text-xl font-extrabold text-zinc-900">Presensi Berhasil!</h3>
            
            <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-left border border-zinc-100/80">
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Mata Kuliah</p>
              <p className="text-base font-extrabold text-zinc-800 mt-0.5">{result.sesi.nama_matkul}</p>
              
              <div className="mt-3.5 grid grid-cols-2 gap-4 text-sm text-zinc-600">
                <div>
                  <p className="text-xs text-zinc-400 font-semibold">Tanggal</p>
                  <p className="font-bold text-zinc-700 mt-0.5">
                    {new Date(result.sesi.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-semibold">Waktu</p>
                  <p className="font-bold text-zinc-700 mt-0.5">{result.sesi.waktu_mulai?.slice(0, 5)} WIB</p>
                </div>
              </div>

              <div className="mt-4 border-t border-zinc-200/60 pt-3 flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Status Kehadiran</span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-700 uppercase">
                  {result.status_kehadiran}
                </span>
              </div>
            </div>

            <button
              onClick={resetScanner}
              className="mt-6 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white shadow-lg hover:bg-zinc-950 active:scale-[0.98] transition-all"
            >
              OK, Scan Lagi
            </button>
          </div>
        </div>
      ) : null}

      {/* Error Modal */}
      {error ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-center align-middle shadow-2xl transition-all animate-scale-up border border-zinc-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
              <XCircle className="h-10 w-10" />
            </div>
            
            <h3 className="text-xl font-extrabold text-zinc-900">Presensi Gagal</h3>
            <p className="mt-2.5 text-sm font-medium text-zinc-500 px-2 leading-relaxed">{error}</p>
            
            <button
              onClick={resetScanner}
              className="mt-6 w-full rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-rose-700 active:scale-[0.98] transition-all"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
