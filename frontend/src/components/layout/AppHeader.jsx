import { LogOut, User, Menu } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AppHeader({ title, subtitle, actions, compact = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = useMemo(() => user?.nama?.charAt(0)?.toUpperCase() || "U", [user]);

  const roleLabel = useMemo(() => {
    if (!user?.role) return "";
    const map = { mahasiswa: "Mahasiswa", dosen: "Dosen", admin: "Admin" };
    return map[user.role] || user.role;
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const handleProfileNav = () => {
    setDropdownOpen(false);
    if (user?.role === "mahasiswa") navigate("/mahasiswa/profil");
    else if (user?.role === "dosen") navigate("/dosen/profil");
    else if (user?.role === "admin") navigate("/admin/profil");
  };

  return (
    <header className={`bg-hero-grid px-4 text-white sm:px-5 md:px-8 ${compact ? "pt-5 pb-5 sm:pt-6 sm:pb-6" : "pt-10 pb-6 sm:pt-12 sm:pb-7 md:pt-14 md:pb-8"}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-bold text-black sm:h-12 sm:w-12 sm:text-lg">
              {initials}
            </div>
            <div>
              <p className="text-base font-bold leading-tight sm:text-xl">{user?.nama || "Student Attendance Tracker"}</p>
              <p className="text-xs text-zinc-400 sm:text-sm">{user?.email || "Attendance Management"}</p>
            </div>
          </div>

          <div className="relative md:hidden" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:ring-2 hover:ring-white/60 transition sm:h-11 sm:w-11"
              aria-label="Menu profil"
            >
              <Menu className="h-5 w-5" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-zinc-800 shadow-xl ring-1 ring-black/5 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-100">
                  <p className="text-sm font-semibold truncate">{user?.nama}</p>
                  <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                  {roleLabel && (
                    <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {roleLabel}
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={handleProfileNav}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 transition"
                  >
                    <User className="h-4 w-4 text-zinc-400" />
                    Profil Saya
                  </button>
                </div>

                <div className="border-t border-zinc-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">{title}</h1>
          {subtitle ? <p className="max-w-2xl text-xs text-zinc-300 sm:text-sm md:text-base">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}