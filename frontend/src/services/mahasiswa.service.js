import api from "./api";

export const getMahasiswaDashboard = () => api.get("/mahasiswa/dashboard");
export const getMahasiswaProfile = () => api.get("/mahasiswa/profile");
