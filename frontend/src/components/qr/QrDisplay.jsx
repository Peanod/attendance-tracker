import QRCode from "react-qr-code";

export default function QrDisplay({ value, className = "" }) {
  return (
    <div className={`rounded-[2rem] border-4 border-black bg-white p-5 ${className}`}>
      <div className="rounded-2xl bg-black p-4">
        <div className="rounded-xl bg-white p-4">
          <QRCode value={value} size={240} className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
