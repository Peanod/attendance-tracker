import { BarChart3, BookOpen, GraduationCap, Home, QrCode, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const navByRole = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: Home, end: true },
    { to: "/admin/mahasiswa", label: "Mahasiswa", icon: Users },
    { to: "/admin/dosen", label: "Dosen", icon: GraduationCap },
    { to: "/admin/matkul", label: "Mata Kuliah", icon: BookOpen },
    { to: "/admin/laporan", label: "Laporan", icon: BarChart3 },
  ],
  dosen: [
    { to: "/dosen", label: "Dashboard", icon: Home, end: true },
    { to: "/dosen/sesi/buat", label: "Buat Sesi", icon: QrCode },
  ],
  mahasiswa: [
    { to: "/mahasiswa", label: "Dashboard", icon: Home, end: true },
    { to: "/mahasiswa/scan", label: "Scan QR", icon: QrCode },
    { to: "/mahasiswa/riwayat", label: "Riwayat", icon: BarChart3 },
  ],
};

const gridClass = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function BottomNav({ role }) {
  const items = navByRole[role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className={`mx-auto grid max-w-lg gap-1.5 ${gridClass[items.length] ?? "grid-cols-4"}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${role}-${item.to}-${item.label}`}
              to={item.to}
              end={item.end ?? false}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-[10px] font-medium transition sm:rounded-2xl sm:px-2 sm:py-2 sm:text-[11px] ${
                  isActive ? "bg-black text-white" : "text-zinc-500"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}