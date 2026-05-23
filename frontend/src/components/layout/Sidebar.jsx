import { BarChart3, BookOpen, GraduationCap, Home, LogOut, QrCode, UserSquare2, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logoMark from "../../assets/logo-mark.svg";
import { useAuth } from "../../hooks/useAuth";

const navByRole = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: Home, end: true },
    { to: "/admin/mahasiswa", label: "Mahasiswa", icon: Users },
    { to: "/admin/dosen", label: "Dosen", icon: GraduationCap },
    { to: "/admin/matkul", label: "Mata Kuliah", icon: BookOpen },
    { to: "/admin/laporan", label: "Laporan Kehadiran", icon: BarChart3 },
    { to: "/admin/profil", label: "Profil", icon: UserSquare2 },
  ],
  dosen: [
    { to: "/dosen", label: "Dashboard", icon: Home, end: true },
    { to: "/dosen/sesi/buat", label: "Buat Sesi", icon: QrCode },
    { to: "/dosen/profil", label: "Profil", icon: UserSquare2 },
  ],
  mahasiswa: [
    { to: "/mahasiswa", label: "Dashboard", icon: Home, end: true },
    { to: "/mahasiswa/scan", label: "Scan QR", icon: QrCode },
    { to: "/mahasiswa/riwayat", label: "Riwayat", icon: BarChart3 },
    { to: "/mahasiswa/profil", label: "Profil", icon: UserSquare2 },
  ],
};

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const items = navByRole[role] || [];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 border-r border-zinc-200 bg-white px-6 py-8 md:flex md:flex-col">
      <div className="flex items-center gap-3">
        <img src={logoMark} alt="Attendance logo" className="h-12 w-12 rounded-2xl" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Attendance</p>
          <h2 className="text-lg font-bold text-zinc-950">Tracker</h2>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-black p-4 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{role}</p>
        <p className="mt-2 text-lg font-semibold">{user?.nama}</p>
        <p className="text-sm text-zinc-400">{user?.email}</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end ?? false}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-100"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}