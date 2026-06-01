import { Camera, Keyboard } from "lucide-react";
import { useEffect, useId, useState } from "react";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function QrScanner({ onScan }) {
  const scannerId = useId().replace(/:/g, "");
  const [manualCode, setManualCode] = useState("");
  const [scannerError, setScannerError] = useState("");

  useEffect(() => {
    let html5QrCode;
    let mounted = true;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted) {
          return;
        }

        html5QrCode = new Html5Qrcode(scannerId);
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.75;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            onScan(decodedText);
            html5QrCode.stop().catch(() => null);
          },
          () => null,
        );
      } catch (error) {
        if (mounted) {
          setScannerError("Scanner kamera tidak tersedia. Gunakan input manual sebagai fallback.");
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(() => null);
      }
    };
  }, [scannerId, onScan]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-800 sm:rounded-[2rem]">
        <div
          id={scannerId}
          className="w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 sm:rounded-[1.5rem]"
          style={{ minHeight: "320px" }}
        />
      </div>

      <Alert tone={scannerError ? "warning" : "info"} message={scannerError || "Arahkan kamera ke QR dosen untuk presensi."} />

      <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-zinc-700 sm:mb-4 sm:text-sm">
          <Keyboard className="h-4 w-4" />
          Fallback input manual
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
          <Input
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            placeholder="Tempel token QR di sini"
            className="flex-1"
          />
          <Button
            className="gap-2"
            onClick={() => {
              if (manualCode.trim()) {
                onScan(manualCode.trim());
              }
            }}
          >
            <Camera className="h-4 w-4" />
            Simulate Scan
          </Button>
        </div>
      </div>
    </div>
  );
}