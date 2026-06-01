import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Keep-alive ping agar backend Vercel tidak cold start
  useEffect(() => {
    const ping = () => {
      if (navigator.onLine && API_URL) {
        fetch(`${API_URL}/health`).catch(() => null);
      }
    };
    ping(); // langsung ping saat app pertama dibuka
    const interval = setInterval(ping, 4 * 60 * 1000); // ping setiap 4 menit
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      {!isOnline ? (
        <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="mx-auto flex max-w-6xl items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>
              Anda sedang offline. Halaman tetap bisa dibuka, tetapi presensi QR tetap membutuhkan koneksi internet.
            </span>
          </div>
        </div>
      ) : null}
      <AppRoutes />
    </div>
  );
}
