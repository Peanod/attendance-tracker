import api from "./api";

export const getAdminDashboard = () => api.get("/admin/dashboard");

export const getMahasiswa = () => api.get("/admin/mahasiswa");
export const createMahasiswa = (payload) => api.post("/admin/mahasiswa", payload);
export const updateMahasiswa = (id, payload) => api.put(`/admin/mahasiswa/${id}`, payload);
export const deleteMahasiswa = (id) => api.delete(`/admin/mahasiswa/${id}`);

export const getDosen = () => api.get("/admin/dosen");
export const createDosen = (payload) => api.post("/admin/dosen", payload);
export const updateDosen = (id, payload) => api.put(`/admin/dosen/${id}`, payload);
export const deleteDosen = (id) => api.delete(`/admin/dosen/${id}`);

export const getMatkul = () => api.get("/admin/mata-kuliah");
export const createMatkul = (payload) => api.post("/admin/mata-kuliah", payload);
export const updateMatkul = (id, payload) => api.put(`/admin/mata-kuliah/${id}`, payload);
export const deleteMatkul = (id) => api.delete(`/admin/mata-kuliah/${id}`);

export const getLaporan = () => api.get("/admin/laporan");
export const getDetailLaporan = (idMatkul) => api.get(`/admin/laporan/matkul/${idMatkul}`);

