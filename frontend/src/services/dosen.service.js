import api from "./api";

export const getDosenDashboard = () => api.get("/dosen/dashboard");
export const getDosenCourses = () => api.get("/dosen/mata-kuliah");
export const getDosenSessions = () => api.get("/dosen/sesi");
export const getSessionAttendance = (id) => api.get(`/sesi/${id}/kehadiran`);
export const markHadir = (idSesi, idMahasiswa) =>
  api.post(`/sesi/${idSesi}/kehadiran/${idMahasiswa}`, { status: "hadir" });
export const markTerlambat = (idSesi, idMahasiswa) =>
  api.post(`/sesi/${idSesi}/kehadiran/${idMahasiswa}`, { status: "terlambat" });
export const deleteKehadiran = (idSesi, idKehadiran) =>
  api.delete(`/sesi/${idSesi}/kehadiran/${idKehadiran}`);