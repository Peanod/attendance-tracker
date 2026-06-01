import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DataDosenPage from "../pages/admin/DataDosenPage";
import DataMahasiswaPage from "../pages/admin/DataMahasiswaPage";
import DataMatkulPage from "../pages/admin/DataMatkulPage";
import LaporanPage from "../pages/admin/LaporanPage";
import ProfilAdmin from "../pages/admin/ProfilAdmin";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import BuatSesiPage from "../pages/dosen/BuatSesiPage";
import DosenDashboard from "../pages/dosen/DosenDashboard";
import MonitoringKehadiranPage from "../pages/dosen/MonitoringKehadiranPage";
import ProfilDosen from "../pages/dosen/ProfilDosen";
import QrDisplayPage from "../pages/dosen/QrDisplayPage";
import RekapMatkulPage from "../pages/dosen/RekapMatkulPage";
import MahasiswaDashboard from "../pages/mahasiswa/MahasiswaDashboard";
import ProfileMahasiswa from "../pages/mahasiswa/ProfileMahasiswa";
import RiwayatKehadiranPage from "../pages/mahasiswa/RiwayatKehadiranPage";
import ScanQrPage from "../pages/mahasiswa/ScanQrPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function HomeRedirect() {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "dosen") {
    return <Navigate to="/dosen" replace />;
  }

  return <Navigate to="/mahasiswa" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/mahasiswa" element={<DataMahasiswaPage />} />
          <Route path="/admin/dosen" element={<DataDosenPage />} />
          <Route path="/admin/matkul" element={<DataMatkulPage />} />
          <Route path="/admin/laporan" element={<LaporanPage />} />
          <Route path="/admin/profil" element={<ProfilAdmin />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["dosen"]} />}>
          <Route path="/dosen" element={<DosenDashboard />} />
          <Route path="/dosen/sesi/buat" element={<BuatSesiPage />} />
          <Route path="/dosen/sesi/:id/qr" element={<QrDisplayPage />} />
          <Route path="/dosen/sesi/:id/kehadiran" element={<MonitoringKehadiranPage />} />
          <Route path="/dosen/matkul/:idMatkul/rekap" element={<RekapMatkulPage />} />
          <Route path="/dosen/profil" element={<ProfilDosen />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["mahasiswa"]} />}>
          <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
          <Route path="/mahasiswa/scan" element={<ScanQrPage />} />
          <Route path="/mahasiswa/riwayat" element={<RiwayatKehadiranPage />} />
          <Route path="/mahasiswa/profil" element={<ProfileMahasiswa />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}