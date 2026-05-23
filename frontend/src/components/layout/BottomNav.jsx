import { BarChart3, BookOpen, Home, QrCode, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const navByRole = {
  admin: [
    { to: "/admin", label: "Home", icon: Home, end: true },
    { to: "/admin/mahasiswa", label: "Student", icon: UserRound },
    { to: "/admin/dosen", label: "Lecturer", icon: BookOpen },
    { to: "/admin/laporan", label: "Laporan", icon: BarChart3 },
  ],
  dosen: [
    { to: "/dosen", label: "Home", icon: Home, end: true },
    { to: "/dosen/sesi/buat", label: "Buat Sesi", icon: QrCode },
    { to: "/dosen/profil", label: "Profil", icon: UserRound },
  ],
  mahasiswa: [
    { to: "/mahasiswa", label: "Home", icon: Home, end: true },
    { to: "/mahasiswa/scan", label: "Scan", icon: QrCode },
    { to: "/mahasiswa/riwayat", label: "History", icon: BarChart3 },
    { to: "/mahasiswa/profil", label: "Profile", icon: UserRound },
  ],
};

export default function BottomNav({ role }) {
  const items = navByRole[role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className={`mx-auto grid max-w-lg gap-1.5 grid-cols-${items.length}`}>
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